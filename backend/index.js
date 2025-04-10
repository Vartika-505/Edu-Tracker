import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/tasks.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import notesRoutes from "./routes/notes.js";
import passport from "./config/passport.js";
import session from "express-session";
import Message from "./models/Message.js";

import http from "http";
import { Server as SocketIOServer } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/notes", notesRoutes);

//Socket.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", async (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);

    const roomMessages = await Message.find({ room })
      .sort({ timestamp: -1 })
      .limit(100);

    socket.emit("load_messages", roomMessages.reverse());
  });

  socket.on("send_message", async (data) => {
    const { room, username, text } = data;

    const message = new Message({
      room,
      username,
      text,
      timestamp: new Date(),
    });

    await message.save();

    // Keeping only the latest 100 messages per room
    await Message.aggregate([
      { $match: { room } },
      { $sort: { timestamp: -1 } },
      { $skip: 100 },
      { $project: { _id: 1 } },
    ]).then(async (oldMessages) => {
      const idsToDelete = oldMessages.map((msg) => msg._id);
      if (idsToDelete.length > 0) {
        await Message.deleteMany({ _id: { $in: idsToDelete } });
      }
    });

    io.to(room).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
app.delete("/api/messages/:id", async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Message not found" });
    io.to(deleted.room).emit("delete_message", deleted._id);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});
app.get("/", (req, res) => {
  res.send("Welcome to the Aura Tracker API!");
});
