const Room = require("../models/Room");

// Create Room
const createRoom = async (req, res) => {
  try {
    const { name } = req.body;

    const roomExists = await Room.findOne({ name });

    if (roomExists) {
      return res.status(400).json({
        message: "Room already exists",
      });
    }

    const room = await Room.create({
      name,
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();

    res.json(rooms);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createRoom,
  getRooms,
};