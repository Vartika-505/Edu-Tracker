import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import logo11 from '../logo11.png';
import picture from '../picture.jpeg';

const Home = ({ token, username, handleLogout }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center p-6">
            <Navbar token={token} handleLogout={handleLogout} />

            <div className="flex flex-row items-center justify-between w-full max-w-6xl mt-10">
                {/* Left Section */}
                <div className="w-1/2 text-left p-10 -mt-10">
                    <h1 className="text-8xl font-bold text-[#5a189a]  mb-4">EduTracker</h1>
                    <p className="text-3xl text-[#5a4b81] mb-8">Your education adventure starts here.</p>
                    <p className="text-xl text-[#5a4b81] mb-8">An all-in-one app to help you do something...</p>
                    
                    <div className="flex gap-6">
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

                {/* Right Section */}
                <div className="w-1/2 flex justify-center items-center p-10">
                    <img src={picture} alt="EduTracker" className="max-w-lg rounded-lg" />
                </div>
            </div>

            <footer className="mt-10 mb-4 text-blue-600">
                <p>© 2024 EduTracker. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
