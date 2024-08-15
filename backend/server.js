const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

const dbConnect = require("./config/dataBaseConnect");
dbConnect();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("notify-waiting-room", (visit) => {
    console.log(visit);

    io.emit("update-waiting-room", visit);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
const PORT = 3000;

server.listen(process.env.PORT || PORT, () => {
  console.log(`the server is listening on port ${process.env.PORT}`);
});
