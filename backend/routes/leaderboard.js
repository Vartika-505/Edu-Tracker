import express from 'express';
import User from '../models/User.js';
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ auraPoints: -1 }); 
        res.json(users); 
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
});

export default router; 
