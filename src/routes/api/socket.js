import { Server } from "socket.io";

export async function GET({ request, httpServer }) {
  if (httpServer.io) {
    console.log("Socket is already running " + request.url, request);
  } else {
    console.log("Initializing Socket");

    const io = new Server(httpServer, {
      path: "/api/socket",
    });

    httpServer.io = io;

    const users = {};

    io.on("connection", (socket) => {
      socket.on("new-user", (name) => {
        users[socket.id] = name;
        socket.broadcast.emit("user-connected", name);
      });
      socket.on("send-chat-message", (message) => {
        socket.broadcast.emit("chat-message", {
          message: message,
          name: users[socket.id],
        });
      });
      socket.on("disconnect", () => {
        socket.broadcast.emit("user-disconnected", users[socket.id]);
        delete users[socket.id];
      });
    });

    return new Response();
  }
}
