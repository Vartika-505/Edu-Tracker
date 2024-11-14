import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [selectedSubject, setSelectedSubject] = useState(localStorage.getItem('selectedSubject') || ''); // Persist the subject in localStorage

    // Fetch notes whenever userId or selectedSubject changes
    useEffect(() => {
        const fetchNotes = async () => {
            if (userId) {  // Fetch notes if userId is available
                try {
                    let url = `http://localhost:5000/api/notes?userId=${userId}`;
                    if (selectedSubject) {
                        url += `&subject=${selectedSubject}`;
                    }
                    const response = await axios.get(url);
                    setNotes(response.data);  // Set the fetched notes
                } catch (error) {
                    console.error('Error fetching notes:', error);
                }
            }
        };

        fetchNotes(); // Call the fetchNotes function inside useEffect
    }, [userId, selectedSubject]);  // Dependencies to re-trigger the effect

    // Create a new note
    const createNote = async (noteData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/notes', noteData);
            setNotes((prevNotes) => [...prevNotes, response.data]);  // Update notes with the newly created one
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };

    // Clear the selected subject on logout
    const handleLogout = () => {
        localStorage.removeItem('selectedSubject');  // Remove the subject from localStorage
        setSelectedSubject('');  // Reset the subject in state
        setUserId(null);  // Clear userId or reset as necessary
        localStorage.removeItem('userId');  // Optionally clear userId from localStorage
    };

    return (
        <NotesContext.Provider value={{ notes, createNote, selectedSubject, setSelectedSubject, setUserId, handleLogout }}>
            {children}
        </NotesContext.Provider>
    );
};

// Custom hook to use the NotesContext
export const useNotes = () => {
    return useContext(NotesContext);
};
