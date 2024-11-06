import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Login = ({ setToken, setUsername, handleLogout, setAuraPoints }) => {
    const [usernameInput, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const localUsername = localStorage.getItem('username');
        const storedAuraPoints = localStorage.getItem('auraPoints');

        if (token) {
            setIsLoggedIn(true);
            setUsername(localUsername);
            setAuraPoints(Number(storedAuraPoints));
        }
    }, [navigate, setUsername, setAuraPoints]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username: usernameInput,
                password,
            });

            const { token, auraPoints, userId } = response.data;

            localStorage.setItem('userId', userId);
            localStorage.setItem('token', token);
            localStorage.setItem('auraPoints', auraPoints);

            setToken(token);
            setUsername(usernameInput);
            setAuraPoints(auraPoints);

            setMessage(`Login successful!`);
            setUsernameInput('');
            setPassword('');
            setIsLoggedIn(true);
            navigate('/home');
        } catch (error) {
            console.error("Login error:", error);
            if (error.response) {
                setMessage(`Login failed! ${error.response.data.message || error.message}`);
            } else {
                setMessage('Login failed! Please try again later.');
            }
        }
    };

    const handleGoogleSignIn = () => {
        console.log("Google Sign-In clicked");
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar at the top */}
            <Navbar token={null} handleLogout={handleLogout} />

            {/* Gradient Background Container */}
            <div className="flex flex-grow bg-gradient-to-br from-purple-600 via-purple-500 to-purple-300">
                {/* Left Section */}
                <div className="w-1/2 flex flex-col items-center justify-center p-10 text-white">
                    <h2 className="text-6xl font-bold mb-4">Welcome Back!</h2>
                    <p className="text-2xl">We're glad to see you again.</p>
                </div>

                {/* Right Section */}
                <div className="w-1/2 flex flex-col items-center justify-center p-10">
                    <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md">
                        {isLoggedIn ? (
                            <div className="text-center">
                                <h2 className="text-3xl font-semibold mb-4 text-purple-600">Welcome Back!</h2>
                                <p className="text-lg mb-4">You are now logged in.</p>
                                <button onClick={handleLogout} className="bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 mb-4">
                                    Logout
                                </button>
                                <br />
                                <button onClick={() => navigate('/home')} className="bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 mb-4">
                                    Go to Home
                                </button>
                                {message && <p className="mt-4 text-green-500">{message}</p>}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="text-center">
                                <h2 className="text-3xl font-semibold mb-6 text-purple-600">Login</h2>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={usernameInput}
                                    onChange={(e) => setUsernameInput(e.target.value)}
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
                                <button type="submit" className="bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200 w-full mb-4">
                                    Login
                                </button>
                                <button onClick={handleGoogleSignIn} type="button" className="bg-white text-purple-600 border border-purple-400 px-4 py-2 rounded-lg w-full hover:bg-purple-100 transition duration-200">
                                    Sign in with Google
                                </button>
                                {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
