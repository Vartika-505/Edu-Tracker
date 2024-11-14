import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [selectedSubject, setSelectedSubject] = useState(localStorage.getItem('selectedSubject') || '');

    // Define fetchNotes as a function here
    const fetchNotes = async () => {
        if (userId) {
            try {
                let url = `http://localhost:5000/api/notes?userId=${userId}`;
                if (selectedSubject) {
                    url += `&subject=${selectedSubject}`;
                }
                const response = await axios.get(url);
                setNotes(response.data);
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        }
    };

    // Fetch notes whenever userId or selectedSubject changes
    useEffect(() => {
        fetchNotes(); // Call fetchNotes here
    }, [userId, selectedSubject]);

    const createNote = async (noteData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/notes', noteData);
            setNotes((prevNotes) => [...prevNotes, response.data]);
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('selectedSubject');
        setSelectedSubject('');
        setUserId(null);
        localStorage.removeItem('userId');
    };

    return (
        <NotesContext.Provider value={{ notes, createNote, fetchNotes, selectedSubject, setSelectedSubject, setUserId, handleLogout }}>
            {children}
        </NotesContext.Provider>
    );
};

// Custom hook to use the NotesContext
export const useNotes = () => {
    return useContext(NotesContext);
};
