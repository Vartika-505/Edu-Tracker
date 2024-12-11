import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import passport from '../config/passport.js'; 
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 
import { upload } from '../config/cloudinary.js';
import cloudinary from 'cloudinary'; 

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
    const payload = { userId: user._id, username: user.username };
    const secret = process.env.JWT_SECRET; 
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
                profilePicture: user.profilePicture || null,
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
            profilePicture: newUser.profilePicture || null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Upload Profile Picture to Cloudinary and Save URL
router.post('/uploadProfilePicture/:userId', upload.single('profilePicture'), async (req, res) => {
    try {
      const { userId } = req.params;

      // Check if the file is uploaded
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

      // Upload image to Cloudinary
      cloudinary.v2.uploader.upload_stream({
        folder: 'profile_pictures',
      }, async (error, result) => {
        if (error) return res.status(500).json({ message: 'Cloudinary upload failed', error });

        // Save the Cloudinary image URL to the user's profile
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture: result.secure_url }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return response with the updated user and profile picture URL
        res.status(200).json({ message: 'Profile picture updated', profilePicture: result.secure_url });
      }).end(req.file.buffer);
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE route to remove profile picture
router.delete('/removeProfilePicture/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.profilePicture) {
            // If there is a profile picture, delete it from Cloudinary
            const publicId = user.profilePicture.split('/').pop().split('.')[0]; // Extract the public ID from the URL

            await cloudinary.v2.uploader.destroy(publicId); // Remove image from Cloudinary

            console.log(`Image with public ID ${publicId} deleted from Cloudinary.`);
        }

        // Remove profile picture reference from the user's record
        user.profilePicture = null;
        await user.save();

        res.json({ message: 'Profile picture removed successfully' });
    } catch (error) {
        console.error('Error removing profile picture:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
