// Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    // Check if the user is already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password,
            });

            const token = response.data.token; 
            localStorage.setItem('token', token); // Save token
            setMessage(`Login successful!`); // Show success message
            setUsername('');
            setPassword('');
            setIsLoggedIn(true);
            navigate('/home'); // Redirect to home after successful login
        } catch (error) {
            console.error("Login error:", error);
            if (error.response) {
                setMessage(`Login failed! ${error.response.data.message || error.message}`);
            } else {
                setMessage('Login failed! Please try again later.');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token
        setIsLoggedIn(false);
        setMessage('You have successfully logged out.');
    };

    const handleGoHome = () => {
        navigate('/home'); // Navigate to home
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
            <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md transition-transform transform hover:scale-105">
                {isLoggedIn ? (
                    <div className="text-center">
                        <h2 className="text-3xl font-semibold mb-4 text-blue-600">Welcome Back!</h2>
                        <p className="text-lg mb-4">You are now logged in.</p>
                        <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 mb-4">
                            Logout
                        </button>
                        {/* Move the Go to Home button to a new line */}
                        <button onClick={handleGoHome} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 w-full">
                            Go to Home
                        </button>
                        {message && <p className="mt-4 text-green-500">{message}</p>}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">Login</h2>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="border border-gray-300 p-3 mb-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border border-gray-300 p-3 mb-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out"
                        />
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 w-full">
                            Login
                        </button>
                        {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
