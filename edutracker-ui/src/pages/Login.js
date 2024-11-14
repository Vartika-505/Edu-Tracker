import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Retrieve context functions and variables
    const { token, setToken, setUsername, setUserId, setAuraPoints, handleLogout } = useContext(AuthContext);
    
    useEffect(() => {
        const checkTokenValidity = async () => {
            const token = localStorage.getItem('token');
            const localUsername = localStorage.getItem('username');
            const storedAuraPoints = localStorage.getItem('auraPoints');
            const storedUserId = localStorage.getItem('userId');

            if (token) {
                try {
                    // Validate token
                    await axios.get('http://localhost:5000/api/auth/validate-token', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setIsLoggedIn(true);
                    setUsername(localUsername);
                    setAuraPoints(Number(storedAuraPoints));
                    setUserId(storedUserId);  // Set userId from localStorage to context
                } catch (error) {
                    console.log("Token validation failed, logging out.");
                    handleLogout(); // Call handleLogout from context to clear session
                    setIsLoggedIn(false);
                }
            }
        };
        checkTokenValidity();
    }, [setUsername, setAuraPoints, setUserId, handleLogout]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username: usernameInput,
                password,
            });

            const { token, auraPoints, userId } = response.data;

            // Store token and user details in local storage
            localStorage.setItem('userId', userId);   // Store userId in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('auraPoints', auraPoints);

            // Update context with token, username, auraPoints, and userId
            setToken(token);            // Update context with token
            setUsername(usernameInput);  // Update context with username
            setUserId(userId);           // Update context with userId
            setAuraPoints(auraPoints);   // Update context with aura points

            setMessage('Login successful!');
            setUsernameInput('');
            setPassword('');
            setIsLoggedIn(true);
            navigate('/home');
        } catch (error) {
            console.error("Login error:", error);
            setMessage(
                `Login failed! ${error.response?.data?.message || error.message || 'Please try again later.'}`
            );
        }
    };

     const handleGoogleSignIn = async (response) => {
        const { credential } = response;
        if (!credential) {
            console.error("Token ID or Profile object is missing.");
            return;
        }
    
        const decoded = JSON.parse(atob(credential.split('.')[1])); // Decoding the token to extract user info
        const emailPrefix = decoded.email.split('@')[0];
        const googleId = decoded.sub; 
        try {
            const googleSignInResponse = await axios.post('http://localhost:5000/api/auth/googleSign', {
                googleId, // Sending Google ID to backend
                username: emailPrefix, // Use email prefix as username
                email: decoded.email, 
            });

            const existingUser = googleSignInResponse.data;
            if (existingUser) {
                console.log("User exists:", existingUser);  // Log user data
                localStorage.setItem('token', existingUser.token);
                localStorage.setItem('username', emailPrefix);
                localStorage.setItem('userId', existingUser.userId);
                localStorage.setItem('email', existingUser.email);
                localStorage.setItem('auraPoints', existingUser.auraPoints);
    
                setToken(existingUser.token);
                setUsername(emailPrefix);
                setUserId(existingUser.userId);
                setAuraPoints(existingUser.auraPoints);
                setEmail(existingUser.email);
    
                navigate('/dashboard');
            } else {
                console.log("User does not exist, creating new user.");
                // If user does not exist, create a new user
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
                setUsername(emailPrefix);
                setUserId(newUser.userId);
                setEmail(newUser.email);
                setAuraPoints(0);
    
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error during Google sign-in:', error);
        }
    };
    
    
    
    
    
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar at the top */}
            <Navbar token={token} handleLogout={handleLogout} /> {/* Navbar uses context for logout */}

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
                                <p className="text-lg mb-4">You are already logged in.</p>
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
                                <GoogleLogin
        onSuccess={handleGoogleSignIn}
        onError={() => console.log('Google Sign-In Error')}
      />
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
