import express from 'express'; // Import express
import User from '../models/User.js'; // Import the User model with .js extension

const router = express.Router();

// Get leaderboard data (sorted by auraPoints in descending order)
router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ auraPoints: -1 }); // Sort users by auraPoints (highest first)
        res.json(users); // Send the sorted user list as a JSON response
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
});

export default router; 
