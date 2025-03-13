import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, unique: true, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: String,
            timestamp: { type: Date, default: Date.now }
        }
    ]
});

export default mongoose.model('Room', RoomSchema);
