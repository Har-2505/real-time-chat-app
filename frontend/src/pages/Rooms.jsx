import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/rooms.css";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await API.get("/rooms");
    setRooms(res.data);
  };

  const createRoom = async () => {
    if (!roomName.trim()) return;

    await API.post("/rooms", {
      name: roomName,
    });

    setRoomName("");
    fetchRooms();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="rooms-container">

      <div className="rooms-header">
        <h1 className="rooms-title">
          ChatSphere
        </h1>

        <button
          className="room-btn"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div className="room-form">
        <input
          className="room-input"
          placeholder="Create New Room"
          value={roomName}
          onChange={(e) =>
            setRoomName(e.target.value)
          }
        />

        <button
          className="room-btn"
          onClick={createRoom}
        >
          Create
        </button>
      </div>

      <div className="rooms-grid">

        {rooms.map((room) => (
          <div
            key={room._id}
            className="room-card"
            onClick={() =>
              navigate(`/chat/${room.name}`)
            }
          >
            <div className="room-name">
              💬 {room.name}
            </div>
          </div>
        ))}

      </div>

      <div className="user-box">
        Logged in as:
        <strong>
          {" "}
          {user?.username}
        </strong>
      </div>

    </div>
  );
}

export default Rooms;