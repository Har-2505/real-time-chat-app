import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await API.get("/rooms");
      setRooms(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createRoom = async () => {
    if (!roomName.trim()) return;

    try {
      await API.post("/rooms", {
        name: roomName,
      });

      setRoomName("");

      fetchRooms();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Chat Rooms</h1>

      <input
        placeholder="Create Room"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />

      <button onClick={createRoom}>
        Create
      </button>

      <hr />

      {rooms.map((room) => (
        <div
          key={room._id}
          style={{
            cursor: "pointer",
            margin: "10px 0",
            padding: "10px",
            border: "1px solid #ddd",
          }}
          onClick={() =>
            navigate(`/chat/${room.name}`)
          }
        >
          {room.name}
        </div>
      ))}
    </div>
  );
}

export default Rooms;