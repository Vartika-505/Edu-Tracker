import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/signup', { username, email, password });
            setMessage('User registered successfully!');
            setUsername('');
            setEmail('');
            setPassword('');
            navigate('/login'); // Redirect to login after successful signup
        } catch (error) {
            setMessage('Signup failed! ' + (error.response?.data.message || 'Please try again.'));
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar at the top */}
            <Navbar token={null} handleLogout={() => {}} />

            {/* Gradient Background Container */}
            <div className="flex flex-grow bg-gradient-to-br from-purple-600 via-purple-500 to-purple-300">
                {/* Left Section */}
                <div className="w-1/2 flex flex-col items-center justify-center p-10 text-white">
                    <h2 className="text-6xl font-bold mb-4">Join Us!</h2>
                    <p className="text-2xl">Create your account to get started.</p>
                </div>

                {/* Right Section */}
                <div className="w-1/2 flex flex-col items-center justify-center p-10">
                    <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md">
                        <h2 className="text-3xl font-semibold mb-6 text-center text-purple-600">Sign Up</h2>
                        {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
                        <form onSubmit={handleSubmit} className="text-center">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="border border-gray-300 p-3 mb-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200 ease-in-out"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="border border-gray-300 p-3 mb-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200 ease-in-out"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="border border-gray-300 p-3 mb-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200 ease-in-out"
                            />
                            <button type="submit" className="bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-purple-700 w-full mb-4 transition duration-200">
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
