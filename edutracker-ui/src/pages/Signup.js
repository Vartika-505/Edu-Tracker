import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Retrieve setToken and other necessary functions from AuthContext
    const { setToken, setUsername: setGlobalUsername, setUserId, setAuraPoints, setEmail: setGlobalEmail } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', {
                username,
                email,
                password,
            });

            if (response.data && response.data.token && response.data.userId) {
                const { token, userId } = response.data;

                // Store token, username, and userId in localStorage for persistence
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                localStorage.setItem('userId', userId);

                // Update context with token, username, and userId
                setToken(token);
                setGlobalUsername(username);
                setUserId(userId);
                setAuraPoints(0); // Initialize aura points as 0
                setGlobalEmail(email); // Set email globally in context

                // Redirect to dashboard after successful signup
                navigate('/dashboard');
            } else {
                setMessage('Signup was successful, but token or userId is missing. Please log in manually.');
            }
        } catch (error) {
            setMessage('Signup failed! ' + (error.response?.data.message || 'Please try again.'));
        }
    };

    const handleGoogleSignIn = async (response) => {
        const { credential } = response;
        if (!credential) {
            console.error("Token ID or Profile object is missing.");
            return;
        }

        const decoded = JSON.parse(atob(credential.split('.')[1])); // Decoding the token to extract user info
        const emailPrefix = decoded.email.split('@')[0]; // Username derived from the email prefix
        const googleId = decoded.sub; // The Google ID (unique identifier for the user)

        try {
            const googleSignInResponse = await axios.post('http://localhost:5000/api/auth/googleSign', {
                googleId, // Sending Google ID to backend
                username: emailPrefix, // Use email prefix as username
                email: decoded.email, // Send email to backend as well
            });

            const existingUser = googleSignInResponse.data;
            if (existingUser) {
                console.log("User exists:", existingUser);
                localStorage.setItem('token', existingUser.token);
                localStorage.setItem('username', emailPrefix);
                localStorage.setItem('userId', existingUser.userId);
                localStorage.setItem('email', existingUser.email);
                localStorage.setItem('auraPoints', existingUser.auraPoints);

                setToken(existingUser.token);
                setGlobalUsername(emailPrefix);
                setUserId(existingUser.userId);
                setGlobalEmail(existingUser.email);  // Set email from Google sign-in
                setAuraPoints(existingUser.auraPoints);

                navigate('/dashboard');
            } else {
                console.log("User does not exist, creating new user.");
                // If the user does not exist, create a new user
                const newUserResponse = await axios.post('http://localhost:5000/api/auth/signup', {
                    email: decoded.email,
                    username: emailPrefix,
                    password: 'google-auth', // No password for Google sign-in
                });

                const newUser = newUserResponse.data;

                localStorage.setItem('token', newUser.token);
                localStorage.setItem('username', emailPrefix);
                localStorage.setItem('userId', newUser.userId);
                localStorage.setItem('email', newUser.email);
                localStorage.setItem('auraPoints', 0);

                setToken(newUser.token);
                setGlobalUsername(emailPrefix);
                setUserId(newUser.userId);
                setGlobalEmail(newUser.email);  // Set email from new user
                setAuraPoints(0);

                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error during Google sign-in:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar token={null} handleLogout={() => {}} />

            <div className="flex flex-grow bg-gradient-to-br from-purple-600 via-purple-500 to-purple-300">
                <div className="w-1/2 flex flex-col items-center justify-center p-10 text-white">
                    <h2 className="text-6xl font-bold mb-4">Join Us!</h2>
                    <p className="text-2xl">Create your account to get started.</p>
                </div>

                <div className="w-1/2 flex flex-col items-center justify-center p-10">
                    <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md">
                        <h2 className="text-3xl font-semibold mb-6 text-center text-purple-600">Sign Up</h2>
                        {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
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
                        <div className="text-center mt-4">
                            <GoogleLogin
                                onSuccess={handleGoogleSignIn}
                                onError={() => console.log('Google Sign-In Error')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
