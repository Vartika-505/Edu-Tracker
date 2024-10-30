// Signup.js
import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/api/auth/signup', {
          username,
          password,
          });
            setMessage(response.data.message); // Display success message
            setUsername('');
            setPassword('');
        } catch (error) {
            console.error("Signup error:", error);
            if (error.response) {
                // Capture and display server response message
                setMessage(`Signup failed! ${error.response.data.message || error.message}`);
            } else {
                setMessage('Signup failed! Please try again later.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Signup</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default Signup;
