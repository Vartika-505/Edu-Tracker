// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [email, setEmail] = useState(localStorage.getItem('email') || '');
    const [auraPoints, setAuraPoints] = useState(parseInt(localStorage.getItem('auraPoints')) || 0);
    const [totalTasks, setTotalTasks] = useState(parseInt(localStorage.getItem('totalTasks')) || 0);
    const [completedTasks, setCompletedTasks] = useState(parseInt(localStorage.getItem('completedTasks')) || 0);

    useEffect(() => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('auraPoints', auraPoints);
        localStorage.setItem('totalTasks', totalTasks);
        localStorage.setItem('completedTasks', completedTasks);
    }, [token, username, email, auraPoints, totalTasks, completedTasks]);

    const handleLogout = () => {
        localStorage.clear();
        setToken('');
        setUsername('');
        setEmail('');
        setAuraPoints(0);
        setTotalTasks(0);
        setCompletedTasks(0);
    };

    return (
        <AuthContext.Provider value={{
            token, setToken, 
            username, setUsername, 
            email, setEmail, 
            auraPoints, setAuraPoints, 
            totalTasks, setTotalTasks, 
            completedTasks, setCompletedTasks, 
            handleLogout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
