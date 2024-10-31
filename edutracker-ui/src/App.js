import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
export default function App() {
  // State to store the token
  const [token, setToken] = useState('');

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/home" element={<Home/>} />
        <Route exact path="/login" element={<Login setToken={setToken} />} />
        <Route path="/" element={<Home token={token} />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}