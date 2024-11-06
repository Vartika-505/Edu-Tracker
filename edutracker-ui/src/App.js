import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import Timetable from './pages/Timetable';
import Profile from './pages/Profile';

export default function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [auraPoints, setAuraPoints] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('auraPoints');
    setToken('');
    setUsername('');
    setEmail('');
    setAuraPoints(0);
    setTotalTasks(0);
    setCompletedTasks(0);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home token={token} username={username} auraPoints={auraPoints} handleLogout={handleLogout} />} />
        <Route path="/dashboard" element={<Dashboard token={token} username={username} auraPoints={auraPoints} setAuraPoints={setAuraPoints} handleLogout={handleLogout} />} />
        <Route exact path="/login" element={<Login setToken={setToken} setUsername={setUsername} setAuraPoints={setAuraPoints} handleLogout={handleLogout} />} />
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
  );
}
