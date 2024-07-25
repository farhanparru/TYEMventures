import React, { useState } from "react";
import { Button, Input } from "antd";
import { CloseOutlined } from '@ant-design/icons';
import { UilChat } from "@iconscout/react-unicons";
import "../navbar/ChatBot .css"; // We'll create this CSS file for styling

const ChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello, How are you doing today!" },
    { sender: "bot", text: "How can I help you?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages([...messages, { sender: "user", text: newMessage }]);
    setNewMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="chat-bot">
      <div className="chat-bot-header">
        <UilChat size="25" />
        <span>PosBytz</span>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          className="chat-bot-close-btn"
        />
      </div>
      <div className="chat-bot-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "bot" ? "bot" : "user"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-bot-footer">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onPressEnter={handleSendMessage}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default ChatBot;
