import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import Timetable from './pages/Timetable';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [auraPoints, setAuraPoints] = useState(parseInt(localStorage.getItem('auraPoints')) || 0);
  const [totalTasks, setTotalTasks] = useState(parseInt(localStorage.getItem('totalTasks')) || 0);
  const [completedTasks, setCompletedTasks] = useState(parseInt(localStorage.getItem('completedTasks')) || 0);

  useEffect(() => {
    // Store user data in localStorage to persist on refresh
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    localStorage.setItem('auraPoints', auraPoints);
    localStorage.setItem('totalTasks', totalTasks);
    localStorage.setItem('completedTasks', completedTasks);
  }, [token, username, email, auraPoints, totalTasks, completedTasks]);

  const handleLogout = () => {
    // Clear local storage and reset state
    localStorage.clear();
    setToken('');
    setUsername('');
    setEmail('');
    setAuraPoints(0);
    setTotalTasks(0);
    setCompletedTasks(0);
  };

  return (
    <AuthProvider>
    <BrowserRouter>
    <Routes>
        <Route path="/home" element={<Home token={token} username={username} auraPoints={auraPoints} handleLogout={handleLogout} />} />
        <Route path="/dashboard" element={<Dashboard token={token} username={username} auraPoints={auraPoints} setAuraPoints={setAuraPoints} handleLogout={handleLogout} />} />
        <Route path="/tasks" element={<Tasks token={token} username={username} setAuraPoints={setAuraPoints} />} />
        <Route exact path="/login" element={<Login setToken={setToken} setUsername={setUsername} setAuraPoints={setAuraPoints} />} />
        <Route path="/" element={<Home token={token} username={username} />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route path="/profile" element={
          <Profile
            token={token}
            username={username}
            email={email}
            auraPoints={auraPoints}
            totalTasks={totalTasks}
            completedTasks={completedTasks}
            handleLogout={handleLogout}
          />
        } />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
      
  );
}
