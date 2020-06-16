const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const kurento = require("kurento-client");
const redisClient = require("./common/redis");
const { stream } = require("./common/redis");
const wsKurentoServer = "ws://localhost:8888/kurento";
let kurentoClient = null;

/**
 * @example
 * {
 *  hostId: {
 *    id: socketId,
 *    streamId,
 *    pipeline,
 *    webRtcEndpoint,
 *    notifyTo: followers,
 *    candidate,
 *    viewers: [viewerId, ...]
 *    room: "hostId"
 *  }
 * }
 */
let livestreams = {};

/**
 * @example
 * {
 *  userId: {
 *    id,
 *    username,
 *    webRtcEndpoint: null,
 *    candidates: [],
 *  }
 * }
 */
let totalViewers = {};

/**
 * @example
 * {
 *  userId: {
 *    socketId,
 *    username,
 *    candidates: [],
 *    webRtcEndpoint: null
 *  }
 * }
 */
let userActives = {};

io.on("connection", function (socket) {
  socket.on("livestream", async ({ host, offerSdp }) => {
    startLivestream(socket, host, offerSdp, function (error, answer) {
      if (error) {
        socket.emit("stream_response", { result: "rejected", error });
      } else {
        const roomLivestream = `${host.id}-${host.username}`;
        socket.join(roomLivestream);
        livestreams[host.id].room = roomLivestream;

        const { notifyTo, streamId } = livestreams[host.id];
        socket.emit("stream_response", {
          result: "accepted",
          answer,
          streamInfo: livestreams[host.id],
        });
        const notify = { ...livestreams[host.id], hostId: host.id };
        for (let follower of notifyTo) {
          if (userActives[follower]) {
            io.to(userActives[follower].socketId).emit("new_livestream", notify);
          }
        }
      }
    });
  });
  socket.on("icecandidate_streamer", ({ id, candidate }) => {
    if (livestreams[id]) {
      livestreams[id].candidates.push(candidate);
    }
  });

  socket.on("icecandidate_viewer", ({ id, candidate }) => {
    if (totalViewers[id]) {
      totalViewers[id].candidates.push(candidate);
    }
  });

  socket.on("end_livestream", ({ host, isStore }) => {
    if (livestreams[host._id]) {
      const { viewers, pipeline, streamId } = livestreams[host._id];
      if (isStore) {
        redisClient.lrange(streamId, 0, -1, (error, comments) => {
          if (!error) {
            socket.emit("livestream_comments", comments)
          }
        })
      }
      pipeline.release();
      viewers.forEach((viewer) => {
        const { username } = viewer;
        const notifyEndLivestream = {
          host,
          streamId,
        };
        if (userActives[username]) {
          io.to(userActives[username]).emit(
            "end_livestream",
            notifyEndLivestream
          );
        }
        viewer.webRtcEndpoint.release();
      });
      redisClient.del(streamId);
      delete livestreams[host._id];
    }
  });

  socket.on("watch_livestream", (viewerInfo) => {
    watchLivestream(socket, viewerInfo, async function (error, answer) {
      if (error) {
        socket.emit("watch_stream_response", { result: "rejected", error });
      } else {
        const { viewer, hostId } = viewerInfo;
        const { room, id, streamId } = livestreams[hostId];
        socket.join(room);
        io.to(id).emit("user_join_stream", viewer.username);
        totalViewers[viewer.id].commentIndex = 0;
        getMoreComments(streamId, viewer.id, socket);
        socket.emit("watch_stream_response", { result: "accepted", answer });
      }
    });
  });

  socket.on("watch_record_livestream", async (viewerInfo) => {
    watchRecordLivestream(socket, viewerInfo, function (error, answer) {
      if (error) {
        socket.emit("watch_record_stream_response", { result: "rejected", error });
      } else {
        socket.emit("watch_record_stream_response", { result: "accepted", answer });
      }
    });
  });

  socket.on("icecandidate_viewer_record", ({ id, candidate }) => {
    if (userActives[id]) {
      userActives[id].candidates.push(candidate)
    }
  })

  socket.on("list_livestreams", (userId) => {
    let listLivestreams = [];
    for (livestream in livestreams) {
      if (livestream !== userId) {
        listLivestreams.push({
          ...livestreams[livestream],
          hostId: livestream,
        });
      }
    }
    socket.emit("list_livestreams", listLivestreams);
  });

  socket.on("send_comment_to_livestream", ({ host, info }) => {
    const { user, created_at, content } = info;
    const { streamId, room } = livestreams[host._id];
    socket.to(room).emit("receive_comment_from_user", info);
    redisClient.lpush(streamId, JSON.stringify(info));
  });

  socket.on("user_active", (userInfo) => {
    userActives[userInfo._id] = {
      socketId: socket.id,
      username: userInfo.username,
      candidates: [],
      webRtcEndpoint: null
    };
    // userActives.push({ socketId: socket.id, ...userInfo });
  });

  socket.on("disconnect", () => {
    for (let user in userActives) {
      if (userActives[user].socketId == socket.id) {
        delete userActives[user];
        break;
      }
    }
    for (let host in livestreams) {
      if (livestreams[host].id == socket.id) {
        delete livestreams[host];
        break;
      }
    }
  });
});

async function getKurentoClient() {
  try {
    if (!kurentoClient) {
      kurentoClient = await kurento(wsKurentoServer);
    }
  } catch (error) {
    return `Could not finde media server at address: ${wsKurentoServer}`;
  } finally {
    return kurentoClient;
  }
}

async function startLivestream(socket, host, sdpOffer, callback) {
  const newLiveStream = {
    ...host,
    id: socket.id,
    streamId: `${new Date().getTime()}_${host.id}`,
    pipeline: null,
    webRtcEndpoint: null,
    notifyTo: host.followers,
    candidates: [],
    viewers: [],
  };
  livestreams[host.id] = newLiveStream;
  const kurentoClient = await getKurentoClient();
  kurentoClient.create("MediaPipeline", (error, pipeline) => {
    if (error) return callback(error);
    livestreams[host.id].pipeline = pipeline;
    console.log(pipeline)
    pipeline.create(
      [
        {
          type: "RecorderEndpoint",
          params: { uri: `file:///stream/${newLiveStream.streamId}.webm` },
        },
        {
          type: "WebRtcEndpoint",
          params: {},
        },
      ],
      function (error, elements) {
        if (error) return callback(error);
        const recorder = elements[0];
        const webRtcEndpoint = elements[1];

        livestreams[host.id].webRtcEndpoint = webRtcEndpoint;

        while (livestreams[host.id].candidates.length) {
          const candidate = livestreams[host.id].candidates.shift();
          console.log(candidate)
          webRtcEndpoint.addIceCandidate(candidate);
        }

        webRtcEndpoint.on("OnIceCandidate", (e) => {
          const candidate = kurento.getComplexType("IceCandidate")(e.candidate);
          socket.emit("ice_candidate_streamer", candidate);
        });

        webRtcEndpoint.processOffer(sdpOffer, (e, answer) => {
          if (e) return callback(e);

          callback(null, answer);
        });

        webRtcEndpoint.gatherCandidates((e) => {
          if (e) return callback(e);
        });

        webRtcEndpoint.connect(recorder, function (err) {
          if (err) return callback(err);
          recorder.record((e) => {
            if (e) callback(e);
          });
        });
      }
    );
  });
}

function watchLivestream(socket, viewerInfo, callback) {
  const { viewer, hostId, offerSdp } = viewerInfo;
  const { viewers, pipeline } = livestreams[hostId];
  const rtcViewer = {
    ...viewer,
    webRtcEndpoint: null,
    candidates: [],
  };
  viewers.push(rtcViewer);
  totalViewers[viewer.id] = rtcViewer;

  pipeline.create("WebRtcEndpoint", (err, webRtcEndpoint) => {
    if (err) return callback(error);
    rtcViewer.webRtcEndpoint = webRtcEndpoint;

    while (rtcViewer.candidates.length) {
      const candidate = rtcViewer.candidates.shift();
      webRtcEndpoint.addIceCandidate(candidate);
    }

    webRtcEndpoint.on("OnIceCandidate", (e) => {
      const candidate = kurento.getComplexType("IceCandidate")(e.candidate);
      socket.emit("ice_candidate_viewer", candidate);
    });

    webRtcEndpoint.processOffer(offerSdp, (error, answer) => {
      if (error) return callback(error);

      livestreams[hostId].webRtcEndpoint.connect(webRtcEndpoint, (e) => {
        if (e) return callback(e);
        callback(null, answer);
        webRtcEndpoint.gatherCandidates((er) => {
          if (er) return callback(er);
        });
      });
    });
  });
}

async function watchRecordLivestream(socket, viewerInfo, callback) {
  const { viewer, streamPath, offerSdp } = viewerInfo
  const kurentoClient = await getKurentoClient();
  kurentoClient.create("MediaPipeline", (error, pipeline) => {
    if (error) return callback(error)
    pipeline.create([
      {
        type: "WebRtcEndpoint",
        params: {},
      },
      {
        type: "PlayerEndpoint",
        params: { uri: `file:///stream/${streamPath}.webm` },
      },
    ], (err, elements) => {
      if (err) return callback(err)
      
      const webRtcEndpoint = elements[0]
      const playerEndpoint = elements[1]
      userActives[viewer.id].webRtcEndpoint = webRtcEndpoint

      while (userActives[viewer.id].candidates.length) {
        const candidate = userActives[viewer.id].candidates.shift();
        webRtcEndpoint.addIceCandidate(candidate);
      }
  
      webRtcEndpoint.on("OnIceCandidate", (e) => {
        const candidate = kurento.getComplexType("IceCandidate")(e.candidate);
        socket.emit("ice_candidate_viewer_record", candidate);
      });
  
      webRtcEndpoint.processOffer(offerSdp, (error, answer) => {
        if (error) return callback(error);
        
        playerEndpoint.connect(webRtcEndpoint, e => {
          if (e) return callback(e)

          playerEndpoint.on("EndOfStream", event => {
            pipeline.release()
          })

          playerEndpoint.play(e => {
            if (e) return callback(e)
            // playerEndpoint.getPosition(e => {
            //   console.log(e)
            // })
            callback(null, answer)
          })
          webRtcEndpoint.gatherCandidates((er) => {
            if (er) return callback(er);
            console.log("connected")
          });
        })
      });
    })
  })
}

function getMoreComments(streamId, viewerId, socket) {
  const { commentIndex } = totalViewers[viewerId];
  redisClient.llen(streamId, (err, len) => {
    if (err) return;
    if (commentIndex < len) {
      redisClient.lrange(streamId, commentIndex, 20, (err, comments) => {
        if (err) {
          return;
        }
        totalViewers[viewerId].commentIndex = commentIndex + 20;
        socket.emit("more_comments", comments);
      });
    } else {
      socket.emit("more_comments", []);
    }
  });
}

module.exports = server;
