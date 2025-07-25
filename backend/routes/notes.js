import express from 'express';
import Note from '../models/Note.js';

const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const { userId, subject } = req.query;
        if (!userId) {
            return res.status(400).json({ error: 'UserId is required' });
        }

        const filter = { userId };
        if (subject) {
            filter.subject = subject;
        }

        const notes = await Note.find(filter);
        if (notes.length === 0) {
            return res.status(404).json({ message: 'No notes found' });
        }

        // Format response to include filename as title + ".txt"
        const formattedNotes = notes.map(note => ({
            ...note.toObject(),
            filename: `${note.title}.txt`
        }));

        res.status(200).json(formattedNotes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes', error: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const { title, content, tags, userId, subject } = req.body;
        if (!title || !content || !userId || !subject) {
            return res.status(400).json({ error: 'Title, content, userId, and subject are required' });
        }

        const newNote = new Note({ title, content, tags, userId, subject });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);  
    } catch (error) {
        res.status(500).json({ message: 'Error creating note', error: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json(note.content);  
    } catch (error) {
        res.status(500).json({ message: 'Error fetching note content', error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags, subject } = req.body;

        if (!subject) {
            return res.status(400).json({ error: 'Subject is required' });
        }

        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, content, tags, subject },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json(updatedNote); 
    } catch (error) {
        res.status(500).json({ message: 'Error updating note', error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNote = await Note.findByIdAndDelete(id);

        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note', error: error.message });
    }
});
export const getUserUniqueSubjects = async (req, res) => {
    const userId = req.user._id; 

    if (!userId) {
        return res.status(400).json({ error: 'User is not authenticated' });
    }

    try {
        const subjects = await Note.find({ userId }).distinct('subject');
        res.status(200).json(subjects);
    } catch (error) {
        console.error('Error fetching unique subjects:', error);
        res.status(500).json({ error: 'Error fetching unique subjects' });
    }
};
export default router;
