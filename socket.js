const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

let userActives = [];
io.on("connection", function (socket) {
  //   console.log(socket.id);
  socket.on("test", (peerId) => {
      io.emit("peerId", peerId)
      console.log('ghghh', peerId)
  });
  socket.on("user active", (userId) => {
    let map = {
      userId: userId,
      socketId: socket.id,
    };
    userActives.push(map);
    console.log("userActives: ", userActives);
  });

  socket.on("disconnect", () => {
    userActives = userActives.filter((active) => active.socketId !== socket.id);
    console.log("after diss: ", userActives);
  });

  socket.on("new stream", (stream) => {
    console.log(stream);
    userActives.forEach((active) => {
      if (active.userId !== stream.idHostStream) {
        io.to(active.socketId).emit("friend livestream", stream.idLiveStream);
      }
    });
  });
});

module.exports = server;
