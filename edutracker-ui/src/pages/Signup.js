// Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', {
                username,
                password,
            });
            // Display success message and clear inputs
            setMessage('User registered successfully!');
            setUsername('');
            setPassword('');
        } catch (error) {
            console.error("Signup error:", error);
            if (error.response) {
                setMessage(`Signup failed! ${error.response.data.message || error.message}`);
            } else {
                setMessage('Signup failed! Please try again later.');
            }
        }
    };

    const handleGoHome = () => {
        navigate('/home'); // Navigate to home
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
            <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md transition-transform transform hover:scale-105">
                <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">Sign Up</h2>
                {message && (
                    <p className="mt-4 text-green-500 text-center">{message}</p>
                )}
                {!message.includes('User registered successfully!') ? (
                    <form onSubmit={handleSubmit}>
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
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 w-full mb-4">
                            Signup
                        </button>
                    </form>
                ) : (
                    <button onClick={handleGoHome} className="bg-blue-500 text-white px-4 mt-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200 w-full">
                        Go to Home
                    </button>
                )}
            </div>
        </div>
    );
};

export default Signup;
