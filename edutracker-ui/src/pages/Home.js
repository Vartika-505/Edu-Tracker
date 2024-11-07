// src/components/Home.js
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext
import Navbar from './Navbar';

import picture from '../picture.jpeg';
import collaborate from '../collaborate.jpeg';
import music from '../music.jpeg';
import levelup from '../levelup.jpeg';

const Home = () => {
    const navigate = useNavigate();
    const { token, username, setToken, setUsername } = useContext(AuthContext); // Get token, username, setToken, setUsername from context

    useEffect(() => {
        if (token) {
            navigate('/dashboard'); // Redirect to dashboard if user is logged in
        }
    }, [token, navigate]);

    const handleLogout = () => {
        // Clear context and localStorage
        setToken('');
        setUsername('');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center p-6">
            <Navbar token={token} handleLogout={handleLogout} /> {/* Navbar uses context for token and logout */}

            {/* Original Section: Image on the Left, Text on the Right */}
            <div className="flex flex-row-reverse items-center justify-between w-full max-w-6xl mt-10">
                {/* Left Section (Image) */}
                <div className="w-full flex justify-center items-center p-10">
                    <img src={picture} width="560px" alt="EduTracker" className="max-w-lg rounded-lg" />
                </div>

                {/* Right Section (Text) */}
                <div className="w-1/2 text-left p-10">
                    <h1 className="text-[110px] font-bold text-[#5a189a] mb-6">EduTracker</h1>
                    <p className="text-3xl text-[#5a4b81] mb-8">Your education adventure starts here!</p>
                    <p className="text-xl text-[#5a4b81] mb-8">Transform studying from routine to adventure! Track, achieve, and earn rewards as you master your goals one level at a time.</p>

                    <div className="flex gap-10 mt-14">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 bg-white text-[#9e4edd] font-semibold rounded-md border-2 border-[#9e4edd] hover:bg-[#9e4edd] hover:text-white"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-8 py-4 bg-[#9d4edd] text-white font-semibold rounded-md border-2 border-[#9e4edd] hover:bg-white hover:text-[#9e4edd]"
                        >
                            Signup
                        </button>
                    </div>
                </div>
            </div>
            <div className="h-9 bg-[#9d4edd] mt-5 w-[98.8vw]"></div>

            {/* New Section: Image on the Right, Text on the Left */}
            <div className="flex flex-row items-center justify-between w-full max-w-6xl mt-20">
                <div className="w-1/2 flex justify-center items-center p-10">
                    <img src={levelup} alt="EduTracker" width="400px" className="max-w-lg rounded-lg" />
                </div>
                <div className="w-1/2 text-left p-10">
                    <h1 className="text-[50px] font-bold text-[#5a189a] mb-6">Collaborate</h1>
                    <p className="text-xl text-[#5a4b81] mb-8">Team up with your friends to collaborate on group projects and make learning fun.</p>
                </div>
            </div>

            {/* Another Section */}
            <div className="flex flex-row-reverse items-center justify-between w-full max-w-6xl mt-10">
                <div className="w-1/2 flex justify-center items-center p-10">
                    <img src={music} alt="EduTracker" className="max-w-lg rounded-lg" />
                </div>
                <div className="w-1/2 text-left p-10">
                    <h1 className="text-[50px] font-bold text-[#5a189a] mb-6">EduTracker</h1>
                    <p className="text-xl text-[#5a4b81] mb-8">Transform studying from routine to adventure! Track, achieve, and earn rewards as you master your goals one level at a time.</p>
                </div>
            </div>

            <div className="flex flex-row items-center justify-between w-full max-w-6xl mt-20">
                <div className="w-1/2 flex justify-center items-center p-10">
                    <img src={collaborate} alt="EduTracker" className="max-w-lg rounded-lg" />
                </div>
                <div className="w-1/2 text-left p-10">
                    <h1 className="text-[50px] font-bold text-[#5a189a] mb-6">Collaborate</h1>
                    <p className="text-xl text-[#5a4b81] mb-8">Team up with your friends to collaborate on group projects and make learning fun.</p>
                </div>
            </div>

            <footer className="mt-10 mb-4 text-blue-600">
                <p>© 2024 EduTracker. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
