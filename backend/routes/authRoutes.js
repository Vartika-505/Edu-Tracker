// routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import passport from '../config/passport.js'; 
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Ensure you have the correct path to your User model
const router = express.Router();

// Existing routes
router.post('/signup', registerUser);
router.post('/login', loginUser);

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Route for handling the Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    async (req, res) => {
        const user = req.user; // Extract user info from the request
        const token = generateToken(user); // Generate the JWT token
        
        // Redirect to frontend with the token and user details
        res.redirect(`http://localhost:3000/dashboard?token=${token}&userId=${user._id}`);
    }
);

// Token generation function
const generateToken = (user) => {
    const payload = { userId: user._id, username: user.username }; // Example payload
    const secret = process.env.JWT_SECRET; // Ensure your secret is in .env
    const options = { expiresIn: '1h' }; // Optional: Set expiration for the token

    return jwt.sign(payload, secret, options);
};

router.post('/googleSign', async (req, res) => {
    const { googleId, username, email } = req.body; // Expecting data from frontend

    try {
        // Check if the user already exists by their Google ID
        let user = await User.findOne({ googleId });

        if (user) {
            // If the user exists, return their details
            return res.status(200).json({
                token: generateToken(user),
                userId: user._id,
                auraPoints: user.auraPoints,
                username: user.username,
                email: user.email,
            });
        }

        // If the user doesn't exist, create a new user
        const newUser = new User({
            googleId, // Storing Google ID to link to the user's Google account
            username,
            email,
            password: 'google-auth', // No password needed for Google login
        });

        await newUser.save();

        res.status(201).json({
            token: generateToken(newUser),
            userId: newUser._id,
            auraPoints: newUser.auraPoints || 0,
            username: newUser.username,
            email: newUser.email,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
