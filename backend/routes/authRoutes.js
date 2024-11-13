// routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import passport from '../config/passport.js'; 
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Route for handling the Google OAuth callback
// Route for handling the Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        // Assuming req.user contains user info after successful Google login
        const user = req.user;

        // Generate a token for the authenticated user (make sure to adjust the payload)
        const token = generateToken(user); // This function should generate the JWT token
        console.log("Token in AuthRoutes:",token);
        // Redirect to the frontend with the token in the query parameters
        res.redirect(`http://localhost:3000/dashboard?token=${token}`);
    }
);

// Token generation function (example)
const generateToken = (user) => {
    const payload = { userId: user._id, username: user.username }; // Example payload
    const secret = process.env.JWT_SECRET; // Ensure your secret is in .env
    const options = { expiresIn: '1h' }; // Optional: Set expiration for the token

    // Use JWT library to generate the token
    return jwt.sign(payload, secret, options);
};



export default router;
