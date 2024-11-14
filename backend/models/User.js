import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true },
    password: { type: String, required: false }, // Optional for Google login
    googleId: { type: String, unique: true, sparse: true }, // Google ID for OAuth users
    auraPoints: { type: Number, default: 0 },
    // Optionally, store profile picture URL from Google
    profilePicture: { type: String },
    // Other Google-related fields like name, given_name, etc. if needed
});

export default mongoose.model('User', userSchema);
