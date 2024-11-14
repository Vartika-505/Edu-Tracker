import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    content: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    tags: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

// Middleware to automatically update `updatedAt` field
noteSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Note = mongoose.model('Note', noteSchema);

export default Note;
