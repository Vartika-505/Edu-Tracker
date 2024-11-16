import Note from '../models/Note.js';

// Create a new note
export const createNote = async (req, res) => {
    try {
        const { title, content, tags, userId } = req.body;

        // Create new note
        const newNote = new Note({
            title,
            content,
            tags,
            userId,
        });

        // Save the note to the database
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);  // Return saved note
    } catch (err) {
        res.status(500).json({ message: 'Error creating note', error: err.message });
    }
};

// Get all notes for a specific user
export const getNotes = async (req, res) => {
    try {
        const userId = req.query.userId;  // Assuming the userId is sent as a query parameter
        const notes = await Note.find({ userId });

        if (notes.length === 0) {
            return res.status(404).json({ message: 'No notes found' });
        }

        res.status(200).json(notes);  // Return notes for the user
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notes', error: err.message });
    }
};

// Update a note by ID
export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags } = req.body;

        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, content, tags },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json(updatedNote);  // Return updated note
    } catch (err) {
        res.status(500).json({ message: 'Error updating note', error: err.message });
    }
};
router.get('/unique-subjects', getUserUniqueSubjects);
// Delete a note by ID
export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedNote = await Note.findByIdAndDelete(id);

        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });  // Return success message
    } catch (err) {
        res.status(500).json({ message: 'Error deleting note', error: err.message });
    }
};
