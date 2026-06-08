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
      socket.to(room).emit("chatMessage", {
  system: true,
  message: `${username} joined the room`,
  createdAt: new Date(),
});
    });

    // Send Message
  socket.on("chatMessage", async ({ username, room, message }) => {
  try {
    const savedMessage = await Message.create({
      username,
      room,
      content: message,
    });

    io.to(room).emit("chatMessage", savedMessage);

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
io.to(user.room).emit("chatMessage", {
  system: true,
  message: `${user.username} left the room`,
  createdAt: new Date(),
});

        delete users[socket.id];

        const roomUsers = Object.values(users)
          .filter((u) => u.room === user.room)
          .map((u) => u.username);
        console.log(`${user.username} left room`);
        io.to(user.room).emit("onlineUsers", roomUsers);
      }

      console.log("User Disconnected");
    });
  });
};

module.exports = chatSocket;