const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

io.on("connection", function (client) {
  console.log(client.id);
  io.on("new_stream", (idClient) => {
    console.log(idClient);
  });
});

module.exports = server;
