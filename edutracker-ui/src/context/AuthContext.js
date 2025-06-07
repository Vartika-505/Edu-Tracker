import React, { createContext, useState, useEffect } from 'react';
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token') || '');
    const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
    const [email, setEmail] = useState(() => localStorage.getItem('email') || '');
    const [auraPoints, setAuraPoints] = useState(() => parseInt(localStorage.getItem('auraPoints')) || 0);
    const [totalTasks, setTotalTasks] = useState(() => parseInt(localStorage.getItem('totalTasks')) || 0);
    const [completedTasks, setCompletedTasks] = useState(() => parseInt(localStorage.getItem('completedTasks')) || 0);
    const [userId, setUserId] = useState(() => localStorage.getItem('userId') || ''); 
    const [profilePic, setProfilePic] = useState(() => localStorage.getItem('profilePicture') || '');
    const setTokenWithStorage = (newToken) => {
        setToken(newToken);
        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
        }
    };

    const setUsernameWithStorage = (newUsername) => {
        setUsername(newUsername);
        if (newUsername) {
            localStorage.setItem('username', newUsername);
        } else {
            localStorage.removeItem('username');
        }
    };

    const setEmailWithStorage = (newEmail) => {
        setEmail(newEmail);
        if (newEmail) {
            localStorage.setItem('email', newEmail);
        } else {
            localStorage.removeItem('email');
        }
    };

    const setAuraPointsWithStorage = (newAuraPoints) => {
        setAuraPoints(newAuraPoints);
        localStorage.setItem('auraPoints', newAuraPoints.toString());
    };

    const setTotalTasksWithStorage = (newTotalTasks) => {
        setTotalTasks(newTotalTasks);
        localStorage.setItem('totalTasks', newTotalTasks.toString());
    };

    const setCompletedTasksWithStorage = (newCompletedTasks) => {
        setCompletedTasks(newCompletedTasks);
        localStorage.setItem('completedTasks', newCompletedTasks.toString());
    };

    const setUserIdWithStorage = (newUserId) => {
        setUserId(newUserId);
        if (newUserId) {
            localStorage.setItem('userId', newUserId);
        } else {
            localStorage.removeItem('userId');
        }
    };

    const setProfilePicWithStorage = (newProfilePic) => {
        setProfilePic(newProfilePic);
        if (newProfilePic) {
            localStorage.setItem('profilePicture', newProfilePic);
        } else {
            localStorage.removeItem('profilePicture');
        }
    };
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
            token, setToken: setTokenWithStorage, 
            username, setUsername: setUsernameWithStorage, 
            email, setEmail: setEmailWithStorage, 
            auraPoints, setAuraPoints: setAuraPointsWithStorage, 
            totalTasks, setTotalTasks: setTotalTasksWithStorage, 
            completedTasks, setCompletedTasks: setCompletedTasksWithStorage, 
            userId, setUserId: setUserIdWithStorage,
            profilePic, setProfilePic: setProfilePicWithStorage,
            handleLogout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};