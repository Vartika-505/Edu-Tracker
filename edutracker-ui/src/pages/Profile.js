import React, { useState, useEffect, useContext } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const Profile = () => {
    const { token, username, email, auraPoints } = useContext(AuthContext); // Access values from context
    const [profilePic, setProfilePic] = useState(null);
    const [totalTasks, setTotalTasks] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const navigate = useNavigate();

    // Redirect if not authenticated
    useEffect(() => {
        if (!token) {
            navigate('/home'); // Redirect to home if no token
        } else {
            fetchTaskSummary();
        }
    }, [token, navigate]);

    // Fetch total and completed tasks from the API
    const fetchTaskSummary = async () => {
        try {
            const userId = localStorage.getItem('userId');
            console.log('User ID:', userId); // Log the userId to check if it's set correctly
            
            if (!userId) {
                navigate('/login'); // Redirect if no userId
                return;
            }
            
            const response = await fetch(`http://localhost:5000/api/tasks/summary/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch task summary');
            }
            
            const data = await response.json();
            console.log('Task Summary:', data); // Log the API response to see the data structure

            setTotalTasks(data.totalTasks);
            setCompletedTasks(data.completedTasks);
        } catch (error) {
            console.error('Error fetching task summary:', error);
        }
    };

    // Handle profile picture upload
    const handleProfilePicUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result); // Set image preview
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle logout action
    const handleLogout = () => {
        localStorage.clear();
        navigate('/home');
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-300 to-green-300 flex flex-col items-center p-6">
            <Navbar token={token} handleLogout={handleLogout} />
            
            <header className="flex items-center mb-10 mt-20">
                <div className="text-left">
                    <h1 className="text-5xl text-[#2e2e2e]">Hello, {username}!</h1>
                    <p className="text-lg text-blue-500 mt-2">This is your profile dashboard.</p>
                </div>
            </header>

            <main className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
                <h2 className="text-3xl font-semibold text-purple-600 mb-6">Profile Information</h2>
                
                {/* Profile Picture Section */}
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

                {/* User Information */}
                <p className="text-xl font-semibold mb-4">{username}</p>
                <p className="text-lg text-gray-600 mb-4">{email}</p>
                <p className="text-lg text-gray-600 mb-4">Aura Points: {auraPoints}</p>

                {/* Task Summary */}
                <div className="text-left mt-6">
                    <p className="text-lg font-semibold text-purple-600 mb-2">Tasks Summary:</p>
                    <p className="text-gray-700">Total Tasks: {totalTasks}</p>
                    <p className="text-green-500">Completed Tasks: {completedTasks}</p>
                    <p className="text-red-500">Tasks to Complete: {totalTasks - completedTasks}</p>
                </div>
            </main>
        </div>
    );
};

export default Profile;
