import React, { useState, useEffect, useContext } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
    const { token, username, email, auraPoints } = useContext(AuthContext);
    const [profilePic, setProfilePic] = useState(null);
    const [totalTasks, setTotalTasks] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/home');
        } else {
            fetchTaskSummary();
        }
    }, [token, navigate]);

    const fetchTaskSummary = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                navigate('/login');
                return;
            }
            const response = await fetch(`http://localhost:5000/api/tasks/summary/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch task summary');
            const data = await response.json();
            setTotalTasks(data.totalTasks);
            setCompletedTasks(data.completedTasks);
        } catch (error) {
            console.error('Error fetching task summary:', error);
        }
    };

    const handleProfilePicUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfilePic(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/home');
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 via-purple-300 to-purple-200 p-6 pt-20 flex flex-col items-center">
            <Navbar token={token} handleLogout={handleLogout} />

            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center mt-10">
                <header className="flex flex-col items-center mb-10">
                    <h1 className="text-4xl font-bold text-purple-800">Hello, {username}!</h1>
                    <p className="text-lg text-gray-500 mt-2">Welcome to your profile dashboard.</p>
                </header>

                <div className="flex flex-col items-center mb-6">
                    {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
                    ) : (
                        <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mb-4 text-gray-500">
                            No Image
                        </div>
                    )}
                    <label className="bg-purple-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-purple-700 transition">
                        Upload Picture
                        <input type="file" onChange={handleProfilePicUpload} className="hidden" />
                    </label>
                </div>

                <div className="bg-purple-100 p-4 rounded-lg text-left w-full mt-4">
                    <h2 className="text-2xl font-semibold text-purple-600 mb-4">Achievements</h2>
                    <p className="text-lg text-gray-600">Aura Points: {auraPoints}</p>
                </div>

                <div className="bg-purple-100 p-4 rounded-lg text-left w-full mt-6">
                    <h2 className="text-2xl font-semibold text-purple-600 mb-4">Tasks Summary</h2>
                    <p className="text-gray-700 mb-2">Total Tasks Assigned: {totalTasks}</p>
                    <p className="text-green-500 mb-2">Completed Tasks: {completedTasks}</p>
                    <p className="text-red-500">Tasks to Complete: {totalTasks - completedTasks}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
