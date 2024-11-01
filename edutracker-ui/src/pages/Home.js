import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import logo11 from '../logo11.png';
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
            <br/>
            
            <header className="flex items-center mb-20 mt-20">
            <img src={logo11} className='align-center' width="150"/>
            <div className="text-left">
                    <h1 className="text-5xl text-[#2e2e2e]">Welcome to EduTracker!</h1>
                    <p className="text-lg text-blue-400 mt-2">Keep track of your learning journey with ease.</p>
                </div>
            </header>

            <main className="bg-gradient-to-r from-blue-300 to-green-300 shadow-lg rounded-lg p-8 w-full max-w-md text-center">
                {token ? (
                    <h2 className="text-3xl font-semibold text-blue-700 mb-6">Redirecting to your dashboard...</h2>
                ) : (
                    <p className="text-black">Please log in to access your personalized Dashboard.</p>
                )}
            </main>

            <footer className="mt-10 mb-4 text-blue-600">
                <p>© 2024 EduTracker. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
