// components/NoteItem.js
import React from 'react';
import { useNotes } from '../context/NotesContext';

const NoteItem = ({ note }) => {
    const { deleteNote } = useNotes();

    const handleDelete = () => {
        deleteNote(note._id);
    };

    return (
        <div>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};

export default NoteItem;
