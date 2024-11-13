import express from 'express';
import Note from '../models/Note.js';

const router = express.Router();

// GET all notes for a user (using query param userId)
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;  // Retrieve userId from query parameter
        if (!userId) {
            return res.status(400).json({ error: 'UserId is required' });
        }

        // Fetch notes based on userId
        const notes = await Note.find({ userId });

        if (notes.length === 0) {
            return res.status(404).json({ error: 'No notes found' });
        }

        res.status(200).json(notes);  // Return notes for the user
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notes' });
    }
});

// POST a new note
router.post('/', async (req, res) => {
    try {
        const { title, content, tags, userId } = req.body;
        if (!title || !content || !userId) {
            return res.status(400).json({ error: 'Title, content, and userId are required' });
        }

        const newNote = new Note({ title, content, tags, userId });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);  // Return saved note
    } catch (error) {
        res.status(500).json({ error: 'Error creating note' });
    }
});

// PUT (update) a note by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedNote = await Note.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedNote);  // Return updated note
    } catch (error) {
        res.status(500).json({ error: 'Error updating note' });
    }
});

// DELETE a note by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Note.findByIdAndDelete(id);
        res.json({ message: 'Note deleted successfully' });  // Return success message
    } catch (error) {
        res.status(500).json({ error: 'Error deleting note' });
    }
});

export default router;
