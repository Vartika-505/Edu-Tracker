// App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  // State to store the token and username
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    localStorage.removeItem('username'); // Remove the username
    setToken(''); // Clear token in state
    setUsername(''); // Clear username in state
    // Redirect to home after logout
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home token={token} username={username} handleLogout={handleLogout} />} />
        <Route path="/dashboard" element={<Dashboard token={token} username={username} handleLogout={handleLogout} />} />
        <Route exact path="/login" element={<Login setToken={setToken} setUsername={setUsername} handleLogout={handleLogout} />} />
        <Route path="/" element={<Home token={token} username={username} />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}