import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext to access token and handleLogout
import logo from '../images/logo.png';

const Navbar = () => {
    const { token, username, handleLogout, profilePic } = useContext(AuthContext);
    const currentPath = useLocation().pathname; // Get current path
    const navigate = useNavigate(); // Use navigate hook for redirects

    const handleLogoutAndRedirect = () => {
        handleLogout(); // Call the context's logout function
        navigate('/home'); // Redirect to home page after logout
    };

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
                                    className={`flex items-center h-full px-4 py-2 ${currentPath === '/home' || currentPath === '/' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'}`}
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="h-full">
                                <Link
                                    to="/about"
                                    className={`flex items-center h-full px-4 py-2 ${currentPath === '/about' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'}`}
                                >
                                    About
                                </Link>
                            </li>
                            <li className="h-full">
                                <Link
                                    to="/services"
                                    className={`flex items-center h-full px-4 py-2 ${currentPath === '/services' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'}`}
                                >
                                    Services
                                </Link>
                            </li>
                            <li className="h-full">
                                <Link
                                    to="/contact"
                                    className={`flex items-center h-full px-4 py-2 ${currentPath === '/contact' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'}`}
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
                                    className={`flex items-center h-full px-4 py-2 ${currentPath === '/dashboard' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'}`}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li className="h-full">
                                <Link
                                    to="/timetable"
                                    className={`flex items-center h-full px-4 py-2 ${currentPath === '/timetable' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'}`}
                                >
                                    Timetable
                                </Link>
                            </li>
                            <li className="h-full">
                                <Link
                                    to="/tasks"
                                    className={`flex items-center h-full px-4 py-2 ${currentPath === '/tasks' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'}`}
                                >
                                    Tasks
                                </Link>
                            </li>
                            
                            {/* Add Notes Link */}
                            <li className="h-full">
                                <Link
                                    to="/notes"
                                    className={`flex items-center h-full px-4 py-2 ${currentPath === '/notes' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'}`}
                                >
                                    Notes
                                </Link>
                            </li>
                            {/* Leaderboard Link */}
                            <li className="h-full">
                                <Link
                                    to="/leaderboard"
                                    className={`flex items-center h-full px-4 py-2 ${currentPath === '/leaderboard' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'}`}
                                >
                                    Leaderboard
                                </Link>
                            </li>
                            <li className="h-full">
                                <Link
                                    to="/profile"
                                    className={`flex items-center h-full px-4 py-2 ${currentPath === '/profile' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'}`}
                                >
                                     <div className="flex items-center mr-4">
                            <img
                                src={profilePic || 'https://via.placeholder.com/40'}
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                            />
                            <span className={`ml-2 font-semibold ${currentPath === '/profile' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'} `}>{username}</span>
                        </div>
                                </Link>
                            </li>
                            {/* <div className="flex items-center h-full mr-4 px-4 py-2 ${currentPath === '/profile' ? 'bg-[#9d4edd] text-white rounded-b-3xl' : 'text-[#7636aa]'">
                            <img
                                src={profilePic || 'https://via.placeholder.com/40'}
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                            />
                            <span className="ml-2 text-purple-800 font-semibold"><Link
                                    to="/profile"
                                >
                                    {username}
                                </Link>
                            </span>
                        </div> */}
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
                    <button onClick={handleLogoutAndRedirect} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
