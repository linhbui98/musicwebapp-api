const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const kurento = require("kurento-client");

const wsKurentoServer = "ws://localhost:8888/kurento";
let kurentoClient = null;

/**
 * @example
 * {
 *  hostId: {
 *    id: socketId,
 *    pipeline,
 *    webRtcEndpoint,
 *    notifyTo: followers,
 *    candidate,
 *    viewers: [viewerId, ...]
 *  }
 * }
 */
let livestreams = {};

let totalViewers = {};

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

/**
 * @example [{ socketId, _id, username }]
 */
let userActives = {};

/**
 * @example [{ peerId, host: { id, username, followers: [{ username }] }}]
 */
let streamings = [];

function removeLivestream(socketId) {
  delete livestreams[socketId];
}

async function startLivestream(socket, host, sdpOffer, callback) {
  const newLiveStream = {
    id: socket.id,
    streamId: `${new Date().getTime()}-${socket.id}`,
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
    pipeline.create("WebRtcEndpoint", (err, webRtcEndpoint) => {
      if (err) return callback(err);

      livestreams[host.id].webRtcEndpoint = webRtcEndpoint;

      while (livestreams[host.id].candidates.length) {
        const candidate = livestreams[host.id].candidates.shift();
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
    });
  });
}

async function watchLivestream(socket, viewerInfo, callback) {
  const { viewer, hostId, offerSdp } = viewerInfo;
  const { viewers, pipeline } = livestreams[hostId];
  const rtcViewer = {
    // ...viewer,
    webRtcEndpoint: null,
    candidates: [],
  };
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

io.on("connection", function (socket) {
  socket.on("livestream", async ({ host, offerSdp }) => {
    startLivestream(socket, host, offerSdp, function (err, answer) {
      if (err) {
        socket.emit("stream_response", { result: "rejected", error });
      } else {
        socket.emit("stream_response", { result: "accepted", answer });
        const { notifyTo, streamId } = livestreams[host.id];
        const notify = { host, streamId };
        for (let follower of notifyTo) {
          if (userActives[follower]) {
            io.to(userActives[follower]).emit("new_livestream", notify);
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
      // console.log('push: ', totalViewers[id].candidates.length)
    }
  });

  socket.on("view_livestream", async (viewerInfo) => {
    watchLivestream(socket, viewerInfo, function (err, answer) {
      if (err) {
        socket.emit("watch_stream_response", { result: "rejected", error });
      } else {
        socket.emit("watch_stream_response", { result: "accepted", answer });
      }
    });
  });

  socket.on("user active", (userInfo) => {
    userActives[userInfo.username] = socket.id;
    // userActives.push({ socketId: socket.id, ...userInfo });
  });

  socket.on("disconnect", () => {
    for (let user in userActives) {
      if (userActives[user] == socket.id) {
        delete userActives[user];
      }
    }
    // userActives = userActives.filter((active) => active.socketId !== socket.id);
    // streamings = streamings.filter(stream => )
  });

  // socket.on("new peer", ({ userId, peerId }) => {
  //   for (let user of userActives) {
  //     if (user._id === userId) {
  //       user.peerId = peerId;
  //       break;
  //     }
  //   }
  //   console.log(userActives);
  // });

  // socket.on("new stream", (streamInfo) => {
  //   console.log("new stream");
  //   streamings.push(streamInfo);
  //   const { peerId, host } = streamInfo;
  //   for (let follower of host.followers) {
  //     for (let user of userActives) {
  //       if (follower === user.username) {
  //         io.to(user.socketId).emit("new stream", { peerId, hostId: host.id });
  //         break;
  //       }
  //     }
  //   }
  // });

  // socket.on("end stream", (streamInfo) => {
  //   const { peerId, host } = streamInfo;
  //   streamings = streamings.filter((stream) => stream.host.id !== host.id);
  //   for (let follower of host.followers) {
  //     for (let user of userActives) {
  //       if (follower === user.username) {
  //         io.to(user.socketId).emit("end stream", { peerId, hostId: host.id });
  //         break;
  //       }
  //     }
  //   }
  // });

  // socket.on("list livestream", followings => {
  //   for(let following of followings) {
  //     for(let stream of streamings) {
  //       if (following === stream.host.username) {
  //         io
  //       }
  //     }
  //   }
  //   io.to(user.socketId).emit("list livestream", streamings);

  // })

  socket.on("watch stream", (watcherInfo) => {
    console.log("watch stream");
    const { hostId, watcherId } = watcherInfo;
    for (let user of userActives) {
      if (hostId === user._id) {
        io.to(user.socketId).emit("request host call", watcherId);
        break;
      }
    }
  });
});

module.exports = server;
