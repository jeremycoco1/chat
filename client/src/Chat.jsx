import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("https://my-chat-app-nvia.onrender.com/"); // This will automatically connect to the current domain

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("chat message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit("chat message", input);
      setInput("");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <h2>Chat Room</h2>
      <div
        style={{
          height: 300,
          overflowY: "auto",
          marginBottom: 8,
          background: "#fafafa",
          padding: 8,
          borderRadius: 4,
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "4px 0" }}>
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
