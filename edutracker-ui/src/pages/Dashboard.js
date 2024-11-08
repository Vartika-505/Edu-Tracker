// src/components/Dashboard.js
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext
import Navbar from './Navbar';
import Tasks from './Tasks';

const Dashboard = () => {
    const navigate = useNavigate();
    const { token, username, auraPoints, setAuraPoints, handleLogout } = useContext(AuthContext); // Use context for token, username, auraPoints

    // Redirect if token is not present
    useEffect(() => {
        if (!token) {
            navigate('/home'); // Redirect to home if no token
        }
    }, [token, navigate]);

    // Calculate level based on aura points
    function calculateLevel(auraPoints) {
        if (auraPoints < 500) return 1; // Level 1 starts at 500 points
        return 1 + Math.ceil((auraPoints - 500) / 600); // Each level after requires 600 additional points
    }

    const level = calculateLevel(auraPoints);

    return (
        token && (
            <div className="min-h-screen bg-white flex flex-col items-center p-6">
                {/* Navbar */}
                <Navbar handleLogout={handleLogout} /> {/* Use handleLogout from context */}

                {/* Aura Points Section (Positioned Top Right) */}
                <div className="absolute top-20 right-10 bg-[#5a189a] shadow-lg rounded-lg p-4 w-48 text-center">
                    <h2 className="text-xl font-semibold text-white">Aura Points</h2>
                    <p className="text-2xl text-white font-bold">{auraPoints}</p> {/* Directly use auraPoints from context */}
                    <p className="text-lg text-white mt-2">Level: {level}</p>
                </div>

                {/* Header Section */}
                <header className="flex items-center mb-10 mt-20 text-center">
                    <div className="text-left">
                        <h1 className="text-4xl font-bold text-[#5a189a]"> Welcome, {username}!</h1>
                        <p className="text-lg text-[#6a4c93] mt-2">Here you can track your progress and manage your learning.</p>
                    </div>
                </header>

                {/* Task Manager Section */}
                <section className="w-full max-w-2xl p-6 mt-8 bg-[#f3e5f5] rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-[#6a4c93] mb-4">Manage Your Tasks</h3>
                    <Tasks username={username} setAuraPoints={setAuraPoints} /> {/* Use setAuraPoints directly */}
                </section>
            </div>
        )
    );
};

export default Dashboard;
