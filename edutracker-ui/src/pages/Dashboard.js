// Dashboard.js
import React from 'react';
import Navbar from './Navbar'; // Ensure Navbar is imported
import Home from './Home';
import { useNavigate } from 'react-router-dom';
import logo11 from '../logo11.png';
const Dashboard = ({token, username, handleLogout }) => {
    const navigate=useNavigate();
    return (
    !token?(
        navigate('/home')
    ):(
        <div className="min-h-screen bg-white flex flex-col items-center p-6">
            <Navbar token={token} handleLogout={handleLogout} />
            <header className="flex items-center mb-10 mt-20">
            <img src={logo11} className='align-center' width="150"/>
            <div className='text-left'>
                <h1 className="text-5xl text-[#2e2e2e]">Welcome to Your Dashboard, {username}!</h1>
                <p className="text-lg text-blue-500 mt-2">Here you can track your progress and manage your learning.</p>
                </div>
            </header>

            {/* Add more dashboard content here */}
            <main className="bg-gradient-to-r from-blue-300 to-green-300 shadow-lg rounded-lg p-8 w-full max-w-md text-center">
                <h2 className="text-3xl font-semibold text-white mb-6">Your Learning Progress</h2>
                <p>Dashboard features will be displayed here.</p>
                {/* Logout button */}
            </main>
        </div> )
    );

};

export default Dashboard;
