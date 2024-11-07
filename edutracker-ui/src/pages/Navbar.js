// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext to access token and handleLogout
import logo from '../logo.png';

const Navbar = () => {
    const { token, handleLogout } = useContext(AuthContext); // Access token and handleLogout from AuthContext
    const currentPath = useLocation().pathname; // Get current path

    return (
        <nav className="flex items-center px-6 py-4 fixed top-0 left-0 right-0 justify-between w-full z-10 bg-white">
            <img src={logo} alt="EduTracker Logo" width="100px" />
            <div className="flex justify-center items-center h-full absolute right-0 m-[1vw]">
                <ul className="flex gap-5 mr-10 h-full">
                    {!token ? (
                        <>
                            <li className="h-full">
                                <Link
                                    to="/home"
                                    className={`flex items-center h-full px-4 py-2 ${
                                        currentPath === '/home' || currentPath === '/' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'
                                    }`}
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="h-full">
                                <Link
                                    to="/about"
                                    className={`flex items-center h-full px-4 py-2 ${
                                        currentPath === '/about' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'
                                    }`}
                                >
                                    About
                                </Link>
                            </li>
                            <li className="h-full">
                                <Link
                                    to="/services"
                                    className={`flex items-center h-full px-4 py-2 ${
                                        currentPath === '/services' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'
                                    }`}
                                >
                                    Services
                                </Link>
                            </li>
                            <li className="h-full">
                                <Link
                                    to="/contact"
                                    className={`flex items-center h-full px-4 py-2 ${
                                        currentPath === '/contact' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'
                                    }`}
                                >
                                    Contact
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="h-full">
                                <Link
                                    to="/dashboard"
                                    className={`flex items-center h-full px-4 py-2 ${
                                        currentPath === '/dashboard' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li className="h-full">
                                <Link
                                    to="/timetable"
                                    className={`flex items-center h-full px-4 py-2 ${
                                        currentPath === '/timetable' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'
                                    }`}
                                >
                                    Timetable
                                </Link>
                            </li>
                            <li className="h-full">
                                <Link
                                    to="/tasks"
                                    className={`flex items-center h-full px-4 py-2 ${
                                        currentPath === '/tasks' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'
                                    }`}
                                >
                                    Tasks
                                </Link>
                            </li>
                            <li className="h-full">
                                <Link
                                    to="/profile"
                                    className={`flex items-center h-full px-4 py-2 ${
                                        currentPath === '/profile' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'
                                    }`}
                                >
                                    Profile
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
                {!token ? (
                    <>
                        <Link to="/signup">
                            <button className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 mr-2">Sign Up</button>
                        </Link>
                        <Link to="/login">
                            <button className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">Login</button>
                        </Link>
                    </>
                ) : (
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
