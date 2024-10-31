// Contact.js
import React from 'react';
import Navbar from './Navbar';

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />

      <div className="flex flex-col justify-center items-center flex-grow p-8 space-y-12">
        
        {/* Contact Header */}
        <header className="text-center mt-20">
          <h1 className="text-5xl font-extrabold text-blue-900 font-['Baloo Paaji 2']">Get in Touch with Us</h1>
          <p className="text-lg text-blue-700 mt-2 italic">We’re here to help you!</p>
        </header>

        {/* Contact Information Section */}
        <section className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl text-center">
          <h2 className="text-4xl font-semibold text-blue-800 mb-6 font-['Playfair Display']">Contact Information</h2>
          <p className="text-gray-700 mb-4 text-lg">
            If you have any questions, concerns, or feedback, feel free to reach out to us. 
            We're committed to providing you with the best support possible.
          </p>

          <div className="flex flex-col space-y-4">
            <div>
              <strong className="text-blue-600">Email:</strong>
              <p className="text-gray-700">support@edutracker.com</p>
            </div>
            <div>
              <strong className="text-blue-600">Phone:</strong>
              <p className="text-gray-700">+1 (123) 456-7890</p>
            </div>
            <div>
              <strong className="text-blue-600">Office Hours:</strong>
              <p className="text-gray-700">Monday to Friday: 9 AM - 5 PM</p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl text-center">
          <h2 className="text-4xl font-semibold text-blue-800 mb-6 font-['Playfair Display']">Contact Form</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <textarea
              placeholder="Your Message"
              className="w-full p-2 border border-gray-300 rounded"
              rows="4"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-pink-700 hover:bg-gradient-to-l text-white px-6 py-3 rounded-lg transition duration-200"
            >
              Send Message
            </button>
          </form>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-10 mb-4 text-blue-600 text-center">
        <p className="text-sm">© 2024 EduTracker. All rights reserved. | Your Gateway to Effective Learning</p>
      </footer>
    </div>
  );
};

export default Contact;
