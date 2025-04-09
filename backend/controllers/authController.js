import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username already exists" });

        // Check if the email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: "Email already exists" });

        // Hash the password and create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, auraPoints: 0,totalTasks:0,completedTasks:0 });
        await newUser.save();
        console.log(newUser);
        // Generate a token for the newly registered user
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token and user info in the response
        res.status(201).json({
            message: 'User registered successfully!',
            token, // Send the token
            auraPoints: newUser.auraPoints, // Send auraPoints if needed
            userId: newUser._id, // Send userId if needed
            email:newUser.email,
            profilePicture:newUser.profilePicture || null,
            totalTasks:newUser.totalTasks,
            completedTasks:newUser.completedTasks,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error registering user', error });
    }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ 
            token,
            auraPoints: user.auraPoints,
            userId: user._id ,
            email:user.email,
            totalTasks:user.totalTasks,
            completedTasks:user.completedTasks,
            profilePicture: user.profilePicture || null, });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};



