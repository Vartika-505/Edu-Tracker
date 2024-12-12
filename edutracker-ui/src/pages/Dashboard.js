import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar';
import MotivationQuote from './MotivationQuote';

const Dashboard = () => {
    const navigate = useNavigate();
    const { token, setToken, username, setUsername, auraPoints, setAuraPoints, setUserId, handleLogout } = useContext(AuthContext);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const location = useLocation();
    
    useEffect(() => {
        console.log('Current URL:', location.href);
        const queryParams = new URLSearchParams(location.search);
        const receivedToken = queryParams.get('token');
        console.log('Received token:', receivedToken);

        if (receivedToken) {
            const googleProfile = localStorage.getItem("googleProfile");
            const profile = googleProfile ? JSON.parse(googleProfile) : null;
            if (profile) {
                console.log(profile);  // Log the profile to verify
              } else {
                console.error('No Google profile found in localStorage');
              }
            const userId = profile?.googleId || '';
            const username = profile?.name || '';
            const email = profile?.email || '';
            const auraPoints = 0;

            // Set data in localStorage directly
            localStorage.setItem('token', receivedToken);
            localStorage.setItem('userId', userId);
            localStorage.setItem('username', username);
            localStorage.setItem('email', email);
            localStorage.setItem('auraPoints', auraPoints.toString());

            // Update AuthContext values
            setToken(receivedToken);
            setUserId(userId);
            setUsername(username);
            setAuraPoints(auraPoints);

            navigate('/dashboard');
        } else if (!token) {
            navigate('/home');
        }
    }, [location, token, setToken, setUserId, setUsername, setAuraPoints, navigate]);

    function calculateLevel(auraPoints) {
        if (auraPoints < 500) return 1;
        return 1 + Math.ceil((auraPoints - 500) / 600);
    }

    const level = calculateLevel(auraPoints);

    const handleClick = () => {
        navigate('/timer', { state: { hours, minutes } });
    };

    const handleHourChange = (event) => {
        let value = parseInt(event.target.value) || 0;
        if (value > 24) value = 24;
        setHours(value);
    };

    const handleMinuteChange = (event) => {
        let value = parseInt(event.target.value) || 0;
        if (value > 59) value = 59;
        setMinutes(value);
    };

    return (
        token && (
            <div className="min-h-screen bg-white flex flex-col items-center p-6 relative overflow-hidden">
                <Navbar handleLogout={handleLogout} />
                <div className="fixed top-20 right-10 bg-[#5a189a] shadow-lg rounded-lg p-4 w-48 text-center">
                    <h2 className="text-xl font-semibold text-white">Aura Points</h2>
                    <p className="text-2xl text-white font-bold">{auraPoints}</p>
                    <p className="text-lg font-semibold text-white mt-2">Level: {level}</p>
                </div>
                <header className="flex items-center mb-10 mt-20 text-center">
                    <div className="text-left">
                        <h1 className="text-4xl font-bold text-[#5a189a]"> Welcome, {username}!</h1>
                        <p className="text-lg text-[#6a4c93] mt-2">Here you can track your progress and manage your learning.</p>
                    </div>
                </header>
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
                                onClick={handleClick}
                                className="bg-[#9d4edd] text-white py-2 px-4 rounded-lg"
                            >
                                Start Timer
                            </button>
                        </div>
                    </div>
                </div>
                <MotivationQuote />
            </div>
        )
    );
};

export default Dashboard;
