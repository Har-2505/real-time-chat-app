const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const chatSocket = require("./sockets/chatSocket");
const messageRoutes = require("./routes/messageRoutes");
dotenv.config();

const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
chatSocket(io);
connectDB().catch((error) => {
  console.error("Database startup error:", error.message);
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);
app.get("/", (req, res) => {
  res.send("Chat API Running...");
});

const PORT = Number(process.env.PORT) || 5000;

const startServer = (port) => {
  const onError = (error) => {
    if (error.code === "EADDRINUSE") {
      const fallbackPort = port + 1;
      console.warn(`Port ${port} is already in use. Trying ${fallbackPort} instead.`);
      server.removeListener("error", onError);
      server.close(() => startServer(fallbackPort));
      return;
    }

    console.error("Server startup error:", error);
    process.exit(1);
  };

  server.once("error", onError);
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer(PORT);
