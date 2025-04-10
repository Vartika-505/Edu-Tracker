import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  room: { type: String, required: true },
  username: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Message', messageSchema);
