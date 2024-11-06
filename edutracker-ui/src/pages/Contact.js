import React from 'react';
import Navbar from './Navbar';

const Contact = ({ token, username, handleLogout }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <Navbar token={token} handleLogout={handleLogout} />

      {/* Contact Information Section */}
      <div className="flex flex-col items-center justify-center bg-white text-[#9d4edd] rounded-lg max-w-6xl mt-20 p-10">
        <h1 className="text-[50px] font-bold text-[#5a189a] mb-6 text-center">Contact Information</h1>
        <p className="text-xl text-[#9d4edd] mb-8 text-center">Reach out to us for support or inquiries.</p>
        <div className="flex flex-col space-y-4 text-center">
          <div>
            <strong className="text-[#5a189a]">Email:</strong>
            <p className="text-[#9d4edd]">support@edutracker.com</p>
          </div>
          <div>
            <strong className="text-[#5a189a]">Phone:</strong>
            <p className="text-[#9d4edd]">+1 (123) 456-7890</p>
          </div>
          <div>
            <strong className="text-[#5a189a]">Office Hours:</strong>
            <p className="text-[#9d4edd]">Monday to Friday: 9 AM - 5 PM</p>
          </div>
        </div>

        {/* Email Us Button */}
        <div className="flex gap-10 mt-14 justify-center">
          <button
            onClick={() => window.location.href = 'mailto:support@edutracker.com'}
            className="px-8 py-4 bg-[#9d4edd] text-white font-semibold rounded-md border-2 border-[#9d4edd] hover:bg-white hover:text-[#9d4edd] transition duration-300"
          >
            Email Us
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 mb-4 text-[#9d4edd] text-center">
        <p className="text-sm">© 2024 EduTracker. All rights reserved. | Your Gateway to Effective Learning</p>
      </footer>
    </div>
  );
};

export default Contact;
