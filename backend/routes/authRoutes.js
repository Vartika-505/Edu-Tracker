import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import passport from '../config/passport.js'; 
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 
import { upload } from '../config/cloudinary.js';
import cloudinary from 'cloudinary'; 

const router = express.Router();
router.post('/signup', registerUser);
router.post('/login', loginUser);

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Route for handling the Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    async (req, res) => {
        const user = req.user; 
        const token = generateToken(user);
        
        res.redirect(`http://localhost:3000/dashboard?token=${token}&userId=${user._id}`);
    }
);

// Token generation function
const generateToken = (user) => {
    const payload = { userId: user._id, username: user.username };
    const secret = process.env.JWT_SECRET; 
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secret, options);
};

router.post('/googleSign', async (req, res) => {
    const { googleId, username, email } = req.body; 

    try {
        let user = await User.findOne({ googleId });

        if (user) {
            return res.status(200).json({
                token: generateToken(user),
                userId: user._id,
                auraPoints: user.auraPoints,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture || null,
            });
        }

        const newUser = new User({
            googleId, 
            username,
            email,
            password: 'google-auth', 
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


router.post('/uploadProfilePicture/:userId', upload.single('profilePicture'), async (req, res) => {
    try {
      const { userId } = req.params;
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      cloudinary.v2.uploader.upload_stream({
        folder: 'profile_pictures',
      }, async (error, result) => {
        if (error) return res.status(500).json({ message: 'Cloudinary upload failed', error });
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture: result.secure_url }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile picture updated', profilePicture: result.secure_url });
      }).end(req.file.buffer);
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/removeProfilePicture/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.profilePicture) {
            const publicId = user.profilePicture.split('/').pop().split('.')[0];

            await cloudinary.v2.uploader.destroy(publicId);

            console.log(`Image with public ID ${publicId} deleted from Cloudinary.`);
        }
        user.profilePicture = null;
        await user.save();

        res.json({ message: 'Profile picture removed successfully' });
    } catch (error) {
        console.error('Error removing profile picture:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
