// About.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from './Navbar';

const About = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleStartJourney = () => {
    navigate('/signup'); // Navigate to Signup page
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center flex-grow p-8 space-y-12">
        
        {/* Introduction Section */}
        <section className="text-center mt-20">
          <h1 className="text-5xl font-extrabold text-blue-900">Discover EduTracker</h1>
          <p className="text-lg text-blue-700 mt-2 italic">Your ultimate partner in learning.</p>
        </section>

        {/* What is EduTracker Section */}
        <section className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl text-center transition-transform transform hover:scale-105">
          <h2 className="text-4xl font-semibold text-blue-800 mb-6 font-['Roboto']">What is EduTracker?</h2>
          <p className="text-gray-700 mb-4 text-lg">
            EduTracker is not just an app; it’s a transformative educational tool designed to enhance your learning experience. Whether you're a student, professional, or lifelong learner, EduTracker provides you with resources that simplify and enrich your educational journey.
          </p>
        </section>

        {/* Why Choose EduTracker Section */}
        <section className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl text-center transition-transform transform hover:scale-105">
          <h3 className="text-3xl font-semibold text-blue-800 mb-4 font-['Roboto']">Why Choose EduTracker?</h3>
          <p className="text-gray-700 mb-4 text-lg">
            We tailor our platform to meet your individual needs, making education accessible and effective. Join our thriving community and explore the resources that will propel your learning forward.
          </p>
        </section>

        {/* Key Features Section */}
        <section className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl text-center transition-transform transform hover:scale-105">
          <h3 className="text-3xl font-semibold text-blue-800 mb-4 font-['Roboto']">Key Features:</h3>
          <ul className="list-disc list-inside text-left mb-4 text-gray-600">
            <li className="mb-2">📈 <strong>Progress Tracking:</strong> Celebrate milestones and stay motivated.</li>
            <li className="mb-2">🗓️ <strong>Personalized Learning Plans:</strong> Tailor your education to your unique interests.</li>
            <li className="mb-2">📚 <strong>Resource Library:</strong> Access a wealth of educational materials.</li>
            <li className="mb-2">🔍 <strong>Insightful Analytics:</strong> Understand your learning habits with analytics.</li>
          </ul>
        </section>

        {/* Call to Action Section */}
        <section className="text-center">
          <button 
            onClick={handleStartJourney} // Add onClick event
            className="bg-gradient-to-r from-pink-500 to-pink-700 hover:bg-gradient-to-l text-white px-6 py-3 rounded-lg transition duration-200"
          >
            Start Your Journey
          </button>
        </section>

      </div>

      {/* Footer */}
      <footer className="mt-10 mb-4 text-blue-600 text-center">
        <p className="text-sm">© 2024 EduTracker. All rights reserved. | Your Gateway to Effective Learning</p>
      </footer>
    </div>
  );
};

export default About;
