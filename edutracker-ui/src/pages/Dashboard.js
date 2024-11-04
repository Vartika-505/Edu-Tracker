// Dashboard.js
import React from 'react';
import Navbar from './Navbar'; // Ensure Navbar is imported
import Home from './Home';
import { useNavigate } from 'react-router-dom';
import logo11 from '../logo11.png';
import TaskManager from '../components/TaskManager';


const Dashboard = ({token, username,auraPoints,setAuraPoints, handleLogout }) => {
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
                <p className="text-xl text-white">Aura Points: <span className="font-bold">{auraPoints}</span></p>
                <p>Dashboard features will be displayed here.</p>
                {/* Logout button */}
            </main>

            <section className="w-full max-w-2xl p-6 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Manage Your Tasks</h3>
                <TaskManager username={username} setAuraPoints={setAuraPoints} />
            </section>
        </div> )
    );

};

export default Dashboard;
