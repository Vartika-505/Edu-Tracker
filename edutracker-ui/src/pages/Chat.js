import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import dayjs from "dayjs";
import Navbar from "./Navbar";

const socket = io("http://localhost:5000");

const Chat = ({ username }) => {
  const [room, setRoom] = useState("general");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.emit("join_room", room);

    socket.on("load_messages", (loadedMessages) => {
      setMessages(loadedMessages);
    });

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("delete_message", (msgId) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
    });

    return () => {
      socket.off("load_messages");
      socket.off("receive_message");
      socket.off("delete_message");
    };
  }, [room]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() && !file) return;

    const msgData = {
      room,
      username,
      text: message,
      timestamp: new Date(),
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        msgData.file = {
          name: file.name,
          type: file.type,
          content: reader.result,
        };
        socket.emit("send_message", msgData);
      };
      reader.readAsDataURL(file);
    } else {
      socket.emit("send_message", msgData);
    }

    setMessage("");
    setFile(null);
  };
  const handleDelete = async (msgId) => {
    try {
      await fetch(`http://localhost:5000/api/messages/${msgId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-[80px] h-screen bg-gradient-to-br from-gray-100 to-purple-50">
        <div className="max-w-3xl mx-auto h-full flex flex-col px-4 py-6">
          {/* Room Selector */}
          <div className="mb-4 flex justify-between items-center">
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className={`px-3 py-2 rounded text-white font-semibold ${
                room === "general"
                  ? "bg-purple-500"
                  : room === "doubts"
                  ? "bg-blue-500"
                  : "bg-pink-500"
              }`}
            >
              <option value="general">🌐 General</option>
              <option value="doubts">❓ Doubts</option>
              <option value="fun">🎉 Fun</option>
            </select>
            <span className="text-sm text-gray-600">Room: {room}</span>
          </div>

          {/* Messages */}
          <div className="px-4 py-2 flex-1 overflow-y-auto border-b mb-4 pb-2 pr-2 bg-white rounded shadow-inner">
            {messages.map((msg, index) => {
              const isMe = msg.username === username;
              return (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-purple-400 text-white flex items-center justify-center mr-2 text-sm">
                      {msg.username[0].toUpperCase()}
                    </div>
                  )}
                  <div
                    className={`max-w-xs p-3 rounded-lg shadow text-sm ${
                      isMe
                        ? "bg-purple-600 text-white rounded-br-none"
                        : "bg-gray-200 text-black rounded-bl-none"
                    }`}
                  >
                    <div className="font-bold mb-1">
                      {msg.username}{" "}
                      <span className="text-[10px] ml-1 text-gray-400">
                        {dayjs(msg.timestamp).format("HH:mm:ss")}
                      </span>
                    </div>
                    <div>{msg.text}</div>
                    {msg.file && (
                      <div className="mt-2">
                        {msg.file.type.startsWith("image/") ? (
                          <img
                            src={msg.file.content}
                            alt="uploaded"
                            className="w-40 rounded shadow"
                          />
                        ) : (
                          <a
                            href={msg.file.content}
                            download={msg.file.name}
                            className="text-blue-500 underline"
                          >
                            Download {msg.file.name}
                          </a>
                        )}
                      </div>
                    )}

                    {isMe && (
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="text-xs mt-2 text-red-500"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  {isMe && (
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center ml-2 text-sm">
                      {username[0].toUpperCase()}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex flex-col gap-2 mt-4 sm:flex-row sm:items-center">
            <input
              type="text"
              className="flex-grow border rounded px-3 py-2"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
