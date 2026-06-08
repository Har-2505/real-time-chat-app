import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../services/socket";
import API from "../services/api";
import "./chat.css";

function ChatRoom() {
  const { roomName } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("joinRoom", {
      username: user.username,
      room: roomName,
    });

    loadHistory();

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("typing", (data) => {
      setTyping(data);

      setTimeout(() => {
        setTyping("");
      }, 1500);
    });

    return () => {
      socket.off();
    };
  }, []);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const res = await API.get("/messages");
      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("chatMessage", {
      username: user.username,
      room: roomName,
      message,
    });

    setMessage("");
  };

  const handleTyping = () => {
    socket.emit("typing", {
      username: user.username,
      room: roomName,
    });
  };

  return (
    <div className="chat-container">
      <div className="users-panel">
        <h3>Online Users</h3>

        {onlineUsers.map((u, index) => (
          <p key={index}>🟢 {u}</p>
        ))}
      </div>

      <div className="chat-panel">
        <div className="chat-header">{roomName}</div>

        <div className="messages">
          {messages.map((msg, index) => (
           <div
  className={
    msg.username === user.username
      ? "message my-message"
      : "message other-message"
  }
  key={index}
>
              <strong>{msg.username}</strong>

             <p>
  {msg.message || msg.content}
</p>

<div className="message-time">
  {msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : ""}
</div>
            </div>
          ))}

          {/* Auto Scroll Target */}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="typing">{typing}</div>

        <div className="input-box">
          <input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
          />

          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;