import express from 'express';
import Room from '../models/Room.js';
import { io } from '../index.js'; // Import Socket.IO instance
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all rooms for a user
router.get('/:userId', async (req, res) => {
    try {
        const rooms = await Room.find({ participants: req.params.userId });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rooms', error });
    }
});

// Create a new room
router.post('/create', async (req, res) => {
    const { userId, name } = req.body;
    try {
        const code = uuidv4().substring(0, 6); // Generate a 6-character unique code
        const room = new Room({ name, code, participants: [userId] });
        await room.save();
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: 'Error creating room', error });
    }
});

// Join a room by code
router.post('/join', async (req, res) => {
    const { userId, code } = req.body;
    try {
        const room = await Room.findOne({ code });
        if (!room) return res.status(404).json({ message: 'Room not found' });

        if (!room.participants.includes(userId)) {
            room.participants.push(userId);
            await room.save();
        }

        res.json(room);
    } catch (error) {
        res.status(500).json({ message: 'Error joining room', error });
    }
});

// Get room details
router.get('/room/:roomId', async (req, res) => {
    try {
        const room = await Room.findById(req.params.roomId).populate('participants', 'name');
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching room', error });
    }
});

// Leave a room
router.post('/leave', async (req, res) => {
    const { userId, roomId } = req.body;
    try {
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        room.participants = room.participants.filter(id => id.toString() !== userId);
        await room.save();

        res.json({ message: 'Left room successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error leaving room', error });
    }
});

export default router;
