import { useCallback, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../services/socket";
import API from "../services/api";
import "./chat.css";

function ChatRoom() {
  const { roomName } = useParams();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState("");

  const messagesEndRef = useRef(null);

  const loadHistory = useCallback(async () => {
    try {
      const res = await API.get("/messages");
      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
  socket.emit("joinRoom", {
    username: user.username,
    room: roomName,
  });

  loadHistory();

  const handleMessage = (msg) => {
    console.log("Received Message:", msg);
    setMessages((prev) => [...prev, msg]);
  };

  const handleUsers = (users) => {
    setOnlineUsers(users);
  };

  const handleTyping = (data) => {
    setTyping(data);

    setTimeout(() => {
      setTyping("");
    }, 1500);
  };

  socket.on("chatMessage", handleMessage);
  socket.on("onlineUsers", handleUsers);
  socket.on("typing", handleTyping);

  return () => {
    socket.off("chatMessage", handleMessage);
    socket.off("onlineUsers", handleUsers);
    socket.off("typing", handleTyping);
  };
}, [loadHistory, roomName, user.username]);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

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

        <div className="chat-header">
          {roomName}
        </div>

        <div className="messages">

          {messages.map((msg, index) => {

            // System Messages
            if (msg.system) {
              return (
                <div
                  key={index}
                  className="system-message"
                >
                  {msg.message}
                </div>
              );
            }

            return (
              <div
                className={
                  msg.username === user.username
                    ? "message my-message"
                    : "message other-message"
                }
                key={index}
              >
             <div className="user-info">
  <div className="avatar">
    {msg.username?.charAt(0).toUpperCase()}
  </div>

  <strong>{msg.username}</strong>
</div>
                <p>
                  {msg.message || msg.content}
                </p>

                <div className="message-time">
                  {msg.createdAt
                    ? new Date(
                        msg.createdAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef}></div>

        </div>

        <div className="typing">
          {typing}
        </div>

        <div className="input-box">

          <input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default ChatRoom;