import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import logo11 from '../logo11.png';
import TaskManager from '../components/TaskManager';

const Dashboard = ({ token, username, auraPoints, setAuraPoints }) => {
    const navigate = useNavigate();

    // Local states for holding token, username, and auraPoints
    const [authToken, setAuthToken] = useState(token || localStorage.getItem('token'));
    const [user, setUser] = useState(username || localStorage.getItem('username'));
    const [points, setPoints] = useState(auraPoints || parseInt(localStorage.getItem('auraPoints')) || 0);

    useEffect(() => {
        if (!authToken) {
            navigate('/home'); // Redirect to home if no token
        } else {
            localStorage.setItem('token', authToken);
            localStorage.setItem('username', user);
            localStorage.setItem('auraPoints', points);
        }
    }, [authToken, user, points, navigate]);

    // Update aura points in both state and localStorage whenever they change
    const handleSetAuraPoints = (newPoints) => {
        setPoints(newPoints);
        localStorage.setItem('auraPoints', newPoints); // Persist in localStorage
        setAuraPoints(newPoints); // Update parent component if necessary
    };

    // Logout function
    const handleLogout = () => {
        // Clear local storage and reset state
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('auraPoints');
        
        setAuthToken(null);
        setUser(null);
        setPoints(0);

        navigate('/home'); // Redirect to home page
    };

    return (
        authToken && (
            <div className="min-h-screen bg-white flex flex-col items-center p-6">
                <Navbar token={authToken} handleLogout={handleLogout} />
                <header className="flex items-center mb-10 mt-20">
                    <img src={logo11} className="align-center" width="150" alt="Logo" />
                    <div className="text-left">
                        <h1 className="text-5xl text-[#2e2e2e]">Welcome to Your Dashboard, {user}!</h1>
                        <p className="text-lg text-blue-500 mt-2">Here you can track your progress and manage your learning.</p>
                    </div>
                </header>

                {/* Dashboard content */}
                <main className="bg-gradient-to-r from-blue-300 to-green-300 shadow-lg rounded-lg p-8 w-full max-w-md text-center">
                    <h2 className="text-3xl font-semibold text-white mb-6">Your Learning Progress</h2>
                    <p className="text-xl text-white">Aura Points: <span className="font-bold">{points}</span></p>
                    <p>Dashboard features will be displayed here.</p>
                </main>

                <section className="w-full max-w-2xl p-6 bg-gray-100 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Manage Your Tasks</h3>
                    <TaskManager username={user} setAuraPoints={handleSetAuraPoints} />
                </section>
            </div>
        )
    );
};

export default Dashboard;
