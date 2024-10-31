import React from 'react';
import Navbar from './Navbar'; // Adjust the path as necessary

const Home = ({ token }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center p-6">
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <header className="text-center mb-10 mt-20">
        <img src="/logo.png" alt="EduTracker Logo" className="w-20 h-20 mx-auto mb-4 rounded-full shadow-md" />
        <h1 className="text-5xl font-extrabold text-blue-800">Welcome to EduTracker</h1>
        <p className="text-lg text-blue-600 mt-2">Keep track of your learning journey with ease.</p>
      </header>

      {/* Main Content */}
      <main className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-semibold text-blue-700 mb-6">Hello, User!</h2>
        {token ? (
          <div className="bg-blue-50 p-6 rounded-lg shadow-inner">
            <p className="text-blue-700 font-medium">Your token:</p>
            <span className="text-blue-900 font-mono font-bold text-lg break-all">{token}</span>
          </div>
        ) : (
          <p className="text-blue-500">Please log in to see your token.</p>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-10 mb-4 text-blue-600">
        <p>© 2024 EduTracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
