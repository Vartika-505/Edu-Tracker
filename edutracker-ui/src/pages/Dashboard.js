import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ token, username, auraPoints, setAuraPoints, handleLogout }) => {
    const navigate = useNavigate();
    const [authToken] = useState(token || localStorage.getItem('token'));
    const [user] = useState(username || localStorage.getItem('username'));
    const [points, setPoints] = useState(auraPoints || parseInt(localStorage.getItem('auraPoints')) || 0);

    useEffect(() => {
        if (!authToken) {
            navigate('/home'); // Redirect to home if no token
        }
    }, [authToken, navigate]);

    // Function to update aura points in local state and parent component
    // const handleSetAuraPoints = (newPoints) => {
    //     setPoints(newPoints);
    //     localStorage.setItem('auraPoints', newPoints);
    //     setAuraPoints(newPoints);
    // };
    function calculateLevel(auraPoints) {
        if (auraPoints < 500) return 1; // If points are less than 500, level is 0

        // Calculate level based on the initial 500 points for level 1 and 600 points per level after that
        return 1 + Math.ceil((auraPoints - 500) / 500);
    }



    const level = calculateLevel(auraPoints);


    return (
        authToken && (
            <div className="min-h-screen bg-white flex flex-col items-center p-6">
                <Navbar token={authToken} handleLogout={handleLogout} />

                {/* Aura Points Section (Positioned Top Right) */}
                <div className="absolute top-20 right-10 bg-[#5a189a] shadow-lg rounded-lg p-4 w-48 text-center">
                    <h2 className="text-xl font-semibold text-white">Aura Points</h2>
                    <p className="text-2xl text-white font-bold">{points}</p>
                </div>

                {/* Header Section */}
                <header className="flex items-center mb-10 mt-20 text-center">
                    <div className="text-left">
                        <h1 className="text-4xl font-bold text-[#5a189a]"> Welcome, {user}!</h1>
                        <p className="text-lg text-[#6a4c93] mt-2">Here you can track your progress and manage your learning.</p>
                    </div>
                </header>
            <div>Level:{level}</div>
                {/* Learning Progress Section
                <main className="bg-[#9d4edd] shadow-lg rounded-lg p-8 w-full max-w-lg text-center">
                    <h2 className="text-3xl font-semibold text-white mb-6">Your Learning Progress</h2>
                    <p className="text-xl text-white">Aura Points: <span className="font-bold">{points}</span></p>
                </main> */}

                {/* Task Manager Section
                <section className="w-full max-w-2xl p-6 mt-8 bg-[#f3e5f5] rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-[#6a4c93] mb-4">Manage Your Tasks</h3>
>>>>>>> 8fcb8aa9b38a46bb98a793177a4bd4238808ec71
                    <TaskManager username={user} setAuraPoints={handleSetAuraPoints} />
                </section> */}
            </div>
        )
    );
};

export default Dashboard;
