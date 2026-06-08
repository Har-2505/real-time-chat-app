const Message = require("../models/Message");

const users = {};

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // Join Room
    socket.on("joinRoom", ({ username, room }) => {
      socket.join(room);

      users[socket.id] = {
        username,
        room,
      };

      const roomUsers = Object.values(users)
        .filter((user) => user.room === room)
        .map((user) => user.username);

      io.to(room).emit("onlineUsers", roomUsers);

      console.log(`${username} joined ${room}`);
    });

    // Send Message
    socket.on("chatMessage", async ({ username, room, message }) => {
      try {
        await Message.create({
          content: message,
        });

        io.to(room).emit("chatMessage", {
          username,
          message,
          createdAt: new Date(),
        });
      } catch (error) {
        console.log(error);
      }
    });

    // Typing
    socket.on("typing", ({ username, room }) => {
      socket.to(room).emit("typing", `${username} is typing...`);
    });

    // Disconnect
    socket.on("disconnect", () => {
      const user = users[socket.id];

      if (user) {
        delete users[socket.id];

        const roomUsers = Object.values(users)
          .filter((u) => u.room === user.room)
          .map((u) => u.username);

        io.to(user.room).emit("onlineUsers", roomUsers);
      }

      console.log("User Disconnected");
    });
  });
};

module.exports = chatSocket;