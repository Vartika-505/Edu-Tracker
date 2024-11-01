import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true }, // New email field
    password: { type: String, required: true },
});

export default mongoose.model('User', userSchema);
