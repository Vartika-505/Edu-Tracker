import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/tasks.js';
import leaderboardRoutes from './routes/leaderboard.js';
import notesRoutes from './routes/notes.js';  // Import the notes routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB().then(() => {
    // Start the server after the database connection is successful
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/notes', notesRoutes);  // Make sure this line is correct

// Test route (optional)
app.get('/', (req, res) => {
    res.send("Welcome to the Aura Tracker API!");
});
