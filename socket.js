const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

let userActives = [];
io.on("connection", function (socket) {
  socket.on("user active", (userInfo) => {
    userActives.push({ socketId: socket.id, ...userInfo });
    // console.log("userActives: ", userActives);
  });

  socket.on("disconnect", () => {
    userActives = userActives.filter((active) => active.socketId !== socket.id);
    // console.log("after diss: ", userActives);
  });

  socket.on("new peer", ({ userId, peerId }) => {
    for (let user of userActives) {
      if (user._id === userId) {
        user.peerId = peerId;
        break;
      }
    }
    console.log(userActives)
  });

  socket.on("new stream", (streamInfo) => {
    const { hostId, peerId, followers } = streamInfo;
    for(let follower of followers) {
      for(let user of userActives) {
        if (follower === user._id) {
          io.to(user.socketId).emit("new stream", { peerId, hostId })
          break;
        }
      }
    }
  });

  socket.on("watch stream", (watcherInfo) => {
    console.log(userActives)
    console.log("watch stream: ", watcherInfo)
    const { hostId, watcherId } = watcherInfo
    for(let user of userActives) {
      if (hostId === user._id) {
        io.to(user.socketId).emit("request host call", watcherId)
      }
    }
  })
});

module.exports = server;
