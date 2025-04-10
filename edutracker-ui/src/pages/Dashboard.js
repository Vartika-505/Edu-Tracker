import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";
import MotivationQuote from "./MotivationQuote";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    token,
    setToken,
    username,
    setUsername,
    auraPoints,
    setAuraPoints,
    setUserId,
    handleLogout,
  } = useContext(AuthContext);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const receivedToken = queryParams.get("token");
    if (receivedToken) {
      const googleProfile = localStorage.getItem("googleProfile");
      const profile = googleProfile ? JSON.parse(googleProfile) : null;
      const userId = profile?.googleId || "";
      const username = profile?.name || "";
      const email = profile?.email || "";
      const auraPoints = 0;

      localStorage.setItem("token", receivedToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      localStorage.setItem("auraPoints", auraPoints.toString());

      setToken(receivedToken);
      setUserId(userId);
      setUsername(username);
      setAuraPoints(auraPoints);

      navigate("/dashboard");
    } else if (!token) {
      navigate("/home");
    }
  }, [
    location,
    token,
    setToken,
    setUserId,
    setUsername,
    setAuraPoints,
    navigate,
  ]);

  function calculateLevel(auraPoints) {
    if (auraPoints < 500) return 1;
    return 1 + Math.ceil((auraPoints - 500) / 600);
  }

  const level = calculateLevel(auraPoints);

  const handleClick = () => {
    navigate("/timer", { state: { hours, minutes } });
  };

  const handleHourChange = (e) => {
    let value = parseInt(e.target.value) || 0;
    setHours(value > 24 ? 24 : value);
  };

  const handleMinuteChange = (e) => {
    let value = parseInt(e.target.value) || 0;
    setMinutes(value > 59 ? 59 : value);
  };

  return (
    token && (
      <div className="min-h-screen bg-white flex flex-col items-center px-4 sm:px-6 md:px-10 lg:px-16 py-6">
        <Navbar handleLogout={handleLogout} />

        {/* Aura Points Card */}
        <div className="bg-[#5a189a] shadow-md rounded-xl px-6 py-4 w-full max-w-xs sm:max-w-sm md:max-w-md text-center mt-16">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Aura Points
          </h2>
          <p className="text-2xl sm:text-3xl text-white font-bold">
            {auraPoints}
          </p>
          <p className="text-base sm:text-lg font-semibold text-white mt-2">
            Level: {level}
          </p>
        </div>

        {/* Header */}
        <header className="text-center mt-24 md:mt-36 mb-10 px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#5a189a]">
            Welcome, {username}!
          </h1>
          <p className="text-base sm:text-lg text-[#6a4c93] mt-2">
            Track your progress and manage your learning.
          </p>
        </header>

        {/* Timer Input */}
        <div className="w-full flex justify-center">
          <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md">
            <div className="mb-4 w-full flex justify-center">
              <input
                type="number"
                id="hours"
                value={hours}
                onChange={handleHourChange}
                className="w-24 p-2 border border-gray-300 rounded-lg text-center"
                placeholder="Hours"
                min="0"
                max="24"
              />
            </div>
            <div className="mb-4 w-full flex justify-center">
              <input
                type="number"
                id="minutes"
                value={minutes}
                onChange={handleMinuteChange}
                className="w-24 p-2 border border-gray-300 rounded-lg text-center"
                placeholder="Minutes"
                min="0"
                max="59"
              />
            </div>
            <button
              onClick={handleClick}
              className="bg-[#9d4edd] hover:bg-[#7b2cbf] text-white py-2 px-6 rounded-lg transition-all"
            >
              Start Timer
            </button>
          </div>
        </div>

        <div className="mt-10 w-full">
          <MotivationQuote />
        </div>
      </div>
    )
  );
};

export default Dashboard;
