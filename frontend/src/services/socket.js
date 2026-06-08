import { io } from "socket.io-client";

const socket = io("https://real-time-chat-app-bvyi.onrender.com", {
  transports: ["websocket", "polling"],
  reconnection: true,
});

export default socket;