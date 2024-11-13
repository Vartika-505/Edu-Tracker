// components/NoteList.js
import React from 'react';
import { useNotes } from '../context/NotesContext'
import NoteItem from './NoteItem';

const NoteList = () => {
    const { notes } = useNotes();

    return (
        <div>
            <h2>My Notes</h2>
            <div>
                {notes.length === 0 ? (
                    <p>No notes found.</p>
                ) : (
                    notes.map((note) => <NoteItem key={note._id} note={note} />)
                )}
            </div>
        </div>
    );
};

export default NoteList;
