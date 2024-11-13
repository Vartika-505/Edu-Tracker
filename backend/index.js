// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';       // Import database connection
import authRoutes from './routes/authRoutes.js'; // Import auth routes
import taskRoutes from './routes/tasks.js';
import leaderboardRoutes from './routes/leaderboard.js';
import passport from './config/passport.js';
import session from 'express-session';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB().then(() => {
    // Start the server after the database connection is successful
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
app.use('/api/leaderboard', leaderboardRoutes);
// Routes

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/api/auth', authRoutes); // Use the auth routes for signup/login
app.use('/api/tasks', taskRoutes);



// Test route (optional)
app.get('/', (req, res) => {
    res.send("Welcome to the Aura Tracker API!");
});

// Add additional routes here in the future
// e.g., app.use('/api/goals', goalsRoutes);
