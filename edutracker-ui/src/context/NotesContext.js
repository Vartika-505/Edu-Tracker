import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const NotesContext = createContext();

// Provider component
export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [userId, setUserId] = useState(localStorage.getItem('userId'));  // Ensure userId is stored in localStorage

    useEffect(() => {
        const fetchNotes = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/notes?userId=${userId}`);
                    setNotes(response.data);  // Update notes from API
                } catch (error) {
                    console.error('Error fetching notes:', error);
                }
            }
        };

        if (userId) {
            fetchNotes();
        }
    }, [userId]);  // Re-fetch notes whenever userId changes or on page load

    // Function to add a new note
    const createNote = async (noteData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/notes', noteData);
            setNotes((prevNotes) => [...prevNotes, response.data]);  // Update notes state with newly created note
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };

    return (
        <NotesContext.Provider value={{ notes, createNote }}>
            {children}
        </NotesContext.Provider>
    );
};

// Custom hook to use notes context
export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotes must be used within a NotesProvider');
    }
    return context;
};
