import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import Navbar from './Navbar';

import picture from '../images/picture.jpeg';
import collaborate from '../images/collaborate.jpeg';
import music from '../images/music.jpeg';
import levelup from '../images/levelup.jpeg';

const Home = () => {
    const navigate = useNavigate();
    const { token, username, setToken, setUsername } = useContext(AuthContext); 

    useEffect(() => {
        if (token) {
            navigate('/dashboard'); 
        }
    }, [token, navigate]);

    const handleLogout = () => {
        setToken('');
        setUsername('');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center p-4 sm:p-6">
            <Navbar token={token} handleLogout={handleLogout} />

            {/* Hero Section */}
            <div className="flex flex-col-reverse md:flex-row-reverse items-center justify-between w-full max-w-6xl mt-10">
                {/* Image */}
                <div className="w-full md:w-1/2 flex justify-center items-center p-4">
                    <img src={picture} alt="EduTracker" className="max-w-full md:max-w-lg rounded-lg" />
                </div>

                {/* Text */}
                <div className="w-full md:w-1/2 text-left p-4 md:p-10">
                    <h1 className="text-5xl sm:text-7xl md:text-[110px] font-bold text-[#5a189a] mb-6">EduTracker</h1>
                    <p className="text-xl sm:text-2xl md:text-3xl text-[#5a4b81] mb-8">Your education adventure starts here!</p>
                    <p className="text-base sm:text-lg md:text-xl text-[#5a4b81] mb-8">
                        Transform studying from routine to adventure! Track, achieve, and earn rewards as you master your goals one level at a time.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 mt-6 sm:mt-14">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-[#9e4edd] font-semibold rounded-md border-2 border-[#9e4edd] hover:bg-[#9e4edd] hover:text-white"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-6 py-3 sm:px-8 sm:py-4 bg-[#9d4edd] text-white font-semibold rounded-md border-2 border-[#9e4edd] hover:bg-white hover:text-[#9e4edd]"
                        >
                            Signup
                        </button>
                    </div>
                </div>
            </div>

            <div className="h-9 bg-[#9d4edd] mt-5 w-full"></div>

            {/* Section 2 */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mt-20">
                <div className="w-full md:w-1/2 flex justify-center items-center p-4">
                    <img src={levelup} alt="Level Up" className="max-w-full md:max-w-md rounded-lg" />
                </div>
                <div className="w-full md:w-1/2 text-left p-4 md:p-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#5a189a] mb-6">Collaborate</h1>
                    <p className="text-base sm:text-lg md:text-xl text-[#5a4b81] mb-8">
                        Team up with your friends to collaborate on group projects and make learning fun.
                    </p>
                </div>
            </div>

            {/* Section 3 */}
            <div className="flex flex-col-reverse md:flex-row-reverse items-center justify-between w-full max-w-6xl mt-20">
                <div className="w-full md:w-1/2 flex justify-center items-center p-4">
                    <img src={music} alt="Music" className="max-w-full md:max-w-md rounded-lg" />
                </div>
                <div className="w-full md:w-1/2 text-left p-4 md:p-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#5a189a] mb-6">EduTracker</h1>
                    <p className="text-base sm:text-lg md:text-xl text-[#5a4b81] mb-8">
                        Transform studying from routine to adventure! Track, achieve, and earn rewards as you master your goals one level at a time.
                    </p>
                </div>
            </div>

            {/* Section 4 */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mt-20">
                <div className="w-full md:w-1/2 flex justify-center items-center p-4">
                    <img src={collaborate} alt="Collaborate" className="max-w-full md:max-w-md rounded-lg" />
                </div>
                <div className="w-full md:w-1/2 text-left p-4 md:p-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#5a189a] mb-6">Collaborate</h1>
                    <p className="text-base sm:text-lg md:text-xl text-[#5a4b81] mb-8">
                        Team up with your friends to collaborate on group projects and make learning fun.
                    </p>
                </div>
            </div>

            <footer className="mt-10 mb-4 text-blue-600 text-center text-sm sm:text-base">
                <p>© 2024 EduTracker. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
