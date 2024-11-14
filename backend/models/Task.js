import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    name: { type: String, required: true },
    category: { type: String, enum: ['Lecture Attendance', 'Assignment Completion', 'Academic Goals'], required: true },
    deadline: { type: Date, required: true },
    difficultyLevel: { type: Number, enum: [50, 75, 100], required: true },
    completed: { type: Boolean, default: false },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
