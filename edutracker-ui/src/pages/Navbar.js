// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white flex items-center px-6 py-4 fixed top-0 justify-between w-screen z-10">
      <div className="text-xl font-bold">
        <Link to="/" className="hover:text-gray-400 font-extrabold">EduTracker</Link>
      </div>
      <div className='flex justify-center items-center'>
        <ul className="flex justify-center items-center gap-3 mr-10">
          <li>
            <Link to="/home" className="hover:text-gray-400">Home</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-gray-400">About</Link>
          </li>
          <li>
            <Link to="/services" className="hover:text-gray-400">Services</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-400">Contact</Link>
          </li>
        </ul>
        {/* Added Sign Up button */}
        <Link to="/signup">
          <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2">
            Sign Up
          </button>
        </Link>
        {/* Login button */}
        <Link to="/login">
          <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
