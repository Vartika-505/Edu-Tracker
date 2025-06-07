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
import Leaderboard from './pages/Leaderboard';
import { AuthProvider } from './context/AuthContext';
import Timer from './pages/Timer';
import Notes from './pages/Notes';  // Import Notes page
import { NotesProvider } from './context/NotesContext';  // Import NotesProvider
import { GoogleOAuthProvider } from '@react-oauth/google';
import Chat from './pages/Chat';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [auraPoints, setAuraPoints] = useState(parseInt(localStorage.getItem('auraPoints'), 10) || 0);
  const [totalTasks, setTotalTasks] = useState(parseInt(localStorage.getItem('totalTasks'), 10) || 0);
  const [completedTasks, setCompletedTasks] = useState(parseInt(localStorage.getItem('completedTasks'), 10) || 0);
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePicture') || '');

  // Persist state changes in localStorage
  useEffect(() => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    localStorage.setItem('auraPoints', auraPoints);
    localStorage.setItem('totalTasks', totalTasks);
    localStorage.setItem('completedTasks', completedTasks);
    localStorage.setItem('profilePicture', profilePic);
  }, [token, username, email, auraPoints, totalTasks, completedTasks,profilePic]);

  // Handle logout by clearing localStorage and state
  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setUsername('');
    setEmail('');
    setAuraPoints(0);
    setTotalTasks(0);
    setCompletedTasks(0);
    setProfilePic('');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <NotesProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Define routes with necessary props for each component */}
              <Route 
                path="/home" 
                element={<Home token={token} username={username} auraPoints={auraPoints} handleLogout={handleLogout} />} 
              />
              <Route 
                path="/dashboard" 
                element={<Dashboard token={token} username={username} auraPoints={auraPoints} setAuraPoints={setAuraPoints} handleLogout={handleLogout} />} 
              />
              <Route 
                path="/tasks" 
                element={<Tasks token={token} username={username} setAuraPoints={setAuraPoints} handleLogout={handleLogout}/>} 
              />
              <Route 
                path="/login" 
                element={<Login setToken={setToken} setUsername={setUsername} setAuraPoints={setAuraPoints} setProfilePic={setProfilePic}/>} 
              />
              <Route 
                path="/" 
                element={<Home token={token} username={username} />} 
              />
              <Route 
                path="/timetable" 
                element={<Timetable token={token} username={username} handleLogout={handleLogout} />} 
              />
              <Route 
                path="/signup" 
                element={<Signup />} 
              />
              <Route 
                path="/about" 
                element={<About />} 
              />
              <Route 
                path="/timer" 
                element={<Timer />} 
              />
              <Route 
                path="/contact" 
                element={<Contact />} 
              />
              <Route 
                path="/notes" 
                element={<Notes username={username} />} 
              />
              <Route 
                path="/leaderboard" 
                element={<Leaderboard />} 
              />
              <Route 
                path="/profile" 
                element={
                  <Profile
                    token={token}
                    username={username}
                    email={email}
                    auraPoints={auraPoints}
                    totalTasks={totalTasks}
                    completedTasks={completedTasks}
                    profilePic={profilePic}
                    handleLogout={handleLogout}
                  />
                } 
              />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </NotesProvider>
    </GoogleOAuthProvider>
  );
}
