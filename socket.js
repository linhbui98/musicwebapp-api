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

let totalViewers = {};

/**
 * @example [{ socketId, _id, username }]
 */
let userActives = {};

io.on("connection", function (socket) {
  socket.on("livestream", async ({ host, offerSdp }) => {
    startLivestream(socket, host, offerSdp, function (error, answer) {
      if (error) {
        socket.emit("stream_response", { result: "rejected", error });
      } else {
        const roomLivestream = `${host.id}-${host.username}`
        socket.join(roomLivestream)
        livestreams[host.id].room = roomLivestream
        socket.emit("stream_response", { result: "accepted", answer });
        const { notifyTo, streamId } = livestreams[host.id];
        const notify = { ...livestreams[host.id], hostId: host.id };
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
    }
  });

  socket.on("end_livestream", (host) => {
    if (livestreams[host._id]) {
      const { viewers, pipeline, streamId } = livestreams[host._id];
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
      delete livestreams[host._id];
    }
  });

  socket.on("watch_livestream", async (viewerInfo) => {
    watchLivestream(socket, viewerInfo, function (error, answer) {
      if (error) {
        socket.emit("watch_stream_response", { result: "rejected", error });
      } else {
        const roomLivestream = livestreams[viewerInfo.hostId].room
        socket.join(roomLivestream)
        socket.emit("watch_stream_response", { result: "accepted", answer });
      }
    });
  });

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
    const room = livestreams[host._id].room
    io.to(room).emit("receive_comment_from_user", info)
  })

  socket.on("user_active", (userInfo) => {
    userActives[userInfo.username] = socket.id;
    // userActives.push({ socketId: socket.id, ...userInfo });
  });

  socket.on("disconnect", () => {
    for (let user in userActives) {
      if (userActives[user] == socket.id) {
        delete userActives[user];
        break
      }
    }
    for(let host in livestreams) {
      if (livestreams[host].id == socket.id) {
        delete livestreams[host]
        break
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
    streamId: `${new Date().getTime()}-${socket.id}`,
    pipeline: null,
    webRtcEndpoint: null,
    notifyTo: host.followers,
    candidates: [],
    viewers: []
  };
  livestreams[host.id] = newLiveStream;
  const kurentoClient = await getKurentoClient();
  kurentoClient.create("MediaPipeline", (error, pipeline) => {
    if (error) return callback(error);
    livestreams[host.id].pipeline = pipeline;
    pipeline.create("WebRtcEndpoint", { useDataChannels: true }, (err, webRtcEndpoint) => {
      if (err) return callback(err);

      livestreams[host.id].webRtcEndpoint = webRtcEndpoint;

      while (livestreams[host.id].candidates.length) {
        const candidate = livestreams[host.id].candidates.shift();
        webRtcEndpoint.addIceCandidate(candidate);
      }

      // pipeline.create("RecorderEndpoint", (err, recorder) => {
      //   if (err) return callback(err)
      //   webRtcEndpoint.connect()
      // })

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
module.exports = server;
