import { io } from "socket.io-client";
import { cSocket } from "~/types/socket";

export const socket: cSocket = io({ path: "/api/ws" });