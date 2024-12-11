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
    const [userId, setUserId] = useState(localStorage.getItem('userId') || ''); 
    const [profilePic, setProfilePic] = useState('');
    // Sync the states with localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('auraPoints', auraPoints);
        localStorage.setItem('totalTasks', totalTasks);
        localStorage.setItem('completedTasks', completedTasks);
        localStorage.setItem('userId', userId); 
        localStorage.setItem('profilePicture', profilePic); 
    }, [token, username, email, auraPoints, totalTasks, completedTasks, userId,profilePic]);

    // Logout handler to clear all data
    const handleLogout = () => {
        localStorage.clear();
        setToken('');
        setUsername('');
        setEmail('');
        setAuraPoints(0);
        setTotalTasks(0);
        setCompletedTasks(0);
        setUserId('');
        setProfilePic('');
    };

    return (
        <AuthContext.Provider value={{
            token, setToken, 
            username, setUsername, 
            email, setEmail, 
            auraPoints, setAuraPoints, 
            totalTasks, setTotalTasks, 
            completedTasks, setCompletedTasks, 
            userId, setUserId,
            profilePic,
                setProfilePic,
            handleLogout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
