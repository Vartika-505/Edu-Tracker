import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/tasks.js';
import leaderboardRoutes from './routes/leaderboard.js';
import notesRoutes from './routes/notes.js';  // Import the notes routes
import passport from './config/passport.js';
import session from 'express-session';
import http from 'http';
import Room from './models/Room.js';
import roomRoutes from './routes/rooms.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Replace with your front-end URL
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});

// Connect to MongoDB
connectDB().then(() => {
    // Start the server after the database connection is successful
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
// Routes

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

io.on('connection', (socket) => {
    console.log(`User connected with ID: ${socket.id}`);

    socket.on('joinRoom', async ({ roomId, userId, username }) => {
        socket.join(roomId);

        const room = await Room.findById(roomId);
        if (!room) {
            console.log("Room not found");
            return;
        }

        // Add user to the room if not already present
        const existingMember = room.members.find(member => member.userId === userId);
        if (!existingMember) {
            room.members.push({ userId, username });
            await room.save();
        }

        io.to(roomId).emit('updateMembers', room.members);
    });

    socket.on('sendMessage', async ({ roomId, sender, text }) => {
        const message = { sender, text, timestamp: new Date() };
    
        // Save the message to the database
        const room = await Room.findById(roomId);
        if (room) {
            // Add the message to the room's messages array
            room.messages.push(message); 
    
            // Log the room before saving to verify the messages array
            console.log("Room before saving:", room);
    
            // Save the room with the new message
            await room.save(); 
            
            // Emit the message to everyone in the room
            io.to(roomId).emit('messageReceived', message);
        } else {
            console.log(`Room with ID ${roomId} not found.`);
        }
    });
    
    
    socket.on('leaveRoom', async ({ roomId, userId }) => {
        socket.leave(roomId);

        const room = await Room.findById(roomId);
        if (!room) return;

        room.members = room.members.filter(member => member.userId !== userId);
        await room.save();

        io.to(roomId).emit('updateMembers', room.members);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});



app.use(passport.initialize());
app.use(passport.session());
app.use('/api/rooms', roomRoutes);
app.use('/api/auth', authRoutes); // Use the auth routes for signup/login
app.use('/api/tasks', taskRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/notes', notesRoutes);  // Make sure this line is correct



// Test route (optional)
app.get('/', (req, res) => {
    res.send("Welcome to the Aura Tracker API!");
});
