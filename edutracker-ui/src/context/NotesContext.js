import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [selectedSubject, setSelectedSubject] = useState(localStorage.getItem('selectedSubject') || '');

    // Fetch notes based on userId and selectedSubject
    const fetchNotes = async () => {
        if (userId) {
            try {
                let url = `${process.env.REACT_APP_API_URL}/api/notes?userId=${userId}`;
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

    // Fetch notes when userId or selectedSubject changes
    useEffect(() => {
        fetchNotes();
    }, [userId, selectedSubject]);

    // Create a new note
    const createNote = async (noteData) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/notes`, noteData);
            setNotes((prevNotes) => [...prevNotes, response.data]);
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };

    // Update an existing note
    const updateNote = async (updatedNote) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/notes/${updatedNote._id}`, updatedNote);
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note._id === updatedNote._id ? response.data : note
                )
            );
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('selectedSubject');
        setSelectedSubject('');
        setUserId(null);
        localStorage.removeItem('userId');
    };

    return (
        <NotesContext.Provider value={{ notes, createNote, updateNote, fetchNotes, selectedSubject, setSelectedSubject, setUserId, handleLogout }}>
            {children}
        </NotesContext.Provider>
    );
};

// Custom hook to use the NotesContext
export const useNotes = () => {
    return useContext(NotesContext);
};
