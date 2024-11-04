import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';

const Navbar = ({ token, handleLogout }) => {
    return (
        <nav className="bg-[#2e2e2e] text-white flex items-center px-6 py-4 fixed top-0 justify-between w-screen z-10 shadow-md">
            <img src={logo} alt="EduTracker Logo" width="100px" />
            <div className="flex justify-center items-center">
                <ul className="flex gap-5 mr-10">
                    {!token ? (
                        <>
                            <li><Link to="/home" className="hover:text-gray-300">Home</Link></li>
                            <li><Link to="/about" className="hover:text-gray-300">About</Link></li>
                            <li><Link to="/services" className="hover:text-gray-300">Services</Link></li>
                            <li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link></li>
                            <li><Link to="/timetable" className="hover:text-gray-300">Timetable</Link></li>
                            <li><Link to="/tasks" className="hover:text-gray-300">Tasks</Link></li>
                            <li><Link to="/profile" className="hover:text-gray-300">Profile</Link></li>
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
