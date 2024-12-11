import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true },
    password: { type: String, required: false }, 
    googleId: { type: String, unique: true, sparse: true }, 
    auraPoints: { type: Number, default: 0 },
    profilePicture: { type: String },
});

export default mongoose.model('User', userSchema);
