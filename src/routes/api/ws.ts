import { APIEvent } from "@solidjs/start/server/types";
import { Server } from "socket.io";
import { SocketWithIO, sServer } from "~/types/socket";

export async function GET({ request, nativeEvent }: APIEvent) {
  const socket = nativeEvent.node.res.socket as SocketWithIO | null;
  if (!socket) return;
  if (socket.server.io) {
    console.log("Socket is already running " + request.url, request);
  } else {
    console.log("Initializing Socket");

    const io: sServer = new Server(socket.server, {
      path: "/api/ws",
    });

    socket.server.io = io;

    const users: Record<string, string> = {};

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
