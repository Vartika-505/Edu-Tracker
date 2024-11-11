import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext
import Navbar from './Navbar';
import MotivationQuote from './MotivationQuote';

const Dashboard = () => {
    const navigate = useNavigate();
    const { token, username, auraPoints,  handleLogout } = useContext(AuthContext); // Use context for token, username, auraPoints
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

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

    // Handle the click to show input fields for time
    const handleClick = () => {
        navigate('/timer', { state: { hours, minutes } }); // Redirect to Timer.js with state carrying hours and minutes
    };

    // Handle input changes and validate hours and minutes
    const handleHourChange = (event) => {
        let value = parseInt(event.target.value) || 0;
        if (value > 24) value = 24; // Maximum of 24 hours
        setHours(value);
    };

    const handleMinuteChange = (event) => {
        let value = parseInt(event.target.value) || 0;
        if (value > 59) value = 59; // Maximum of 59 minutes
        setMinutes(value);
    };

    return (
        token && (
            <div className="min-h-screen bg-white flex flex-col items-center p-6 relative overflow-hidden">
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

                {/* Timer Section */}
                <div className="mt-6">
                    <div className="flex flex-col items-center">
                        <div className="mb-4 flex flex-col items-center">
                            <div className="mb-6">
                                <input
                                    type="number"
                                    id="hours"
                                    value={hours}
                                    onChange={handleHourChange}
                                    className="w-20 p-2 border border-gray-300 rounded-lg text-center"
                                    placeholder="Hours"
                                    min="0"
                                    max="24"
                                />
                            </div>
                            <div className="mb-6">
                                <input
                                    type="number"
                                    id="minutes"
                                    value={minutes}
                                    onChange={handleMinuteChange}
                                    className="w-20 p-2 border border-gray-300 rounded-lg text-center"
                                    placeholder="Minutes"
                                    min="0"
                                    max="59"
                                />
                            </div>
                            <button
                                onClick={handleClick} // Trigger the navigation to Timer page with input time
                                className="bg-[#9d4edd] text-white py-2 px-4 rounded-lg"
                            >
                                Start Timer
                            </button>
                        </div>
              
                    </div>
                </div>

                {/* Motivation Quote Section */}
                <MotivationQuote />
            </div>
        )
    );
};

export default Dashboard;
