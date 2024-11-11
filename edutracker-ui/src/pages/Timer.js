import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaPause, FaPlay } from 'react-icons/fa'; // Import pause and play icons

const Timer = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize useNavigate
    const { hours: initialHours, minutes: initialMinutes } = location.state || {}; // Default to empty if no state is provided

    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false); // Track pause state
    const [isTimeUp, setIsTimeUp] = useState(false); // Track if time is up
    const intervalRef = useRef(null); // Ref to store the interval ID

    const totalSeconds = initialHours * 3600 + initialMinutes * 60; // Calculate total time in seconds
    const [progress, setProgress] = useState(0); // Track the progress of the timer

    // Hardcoded path to the music file
    const musicPath = "/timer.mp3"; // Replace with the actual path to your music file

    // Initialize the audio element for sound (this is where you use the music path)
    const audio = new Audio(musicPath); // Use the hardcoded music path

    const startTimer = () => {
        setTimeLeft(totalSeconds);
        setIsTimerActive(true);
        setIsTimeUp(false); // Reset time up flag

        intervalRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalRef.current); // Clear the interval when time is up
                    setIsTimerActive(false);
                    setIsTimeUp(true); // Set time up flag
                    audio.play(); // Play the sound when time is up
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000); // Decrement by 1 second
    };

    const pauseTimer = () => {
        clearInterval(intervalRef.current); // Stop the interval
        setIsPaused(true); // Set the pause state
    };

    const resumeTimer = () => {
        setIsPaused(false); // Reset the pause state

        intervalRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalRef.current); // Clear the interval when time is up
                    setIsTimerActive(false);
                    setIsTimeUp(true); // Set time up flag
                    audio.play(); // Play the sound when time is up
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000); // Continue decrementing the time
    };

    useEffect(() => {
        if (isTimerActive) {
            const percentageProgress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
            setProgress(percentageProgress); // Update progress
        }
    }, [timeLeft, isTimerActive]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return { hours, minutes, remainingSeconds };
    };

    useEffect(() => {
        if (initialHours !== undefined && initialMinutes !== undefined) {
            startTimer();
        }
        return () => {
            clearInterval(intervalRef.current); // Clear interval if the component unmounts
        };
    }, [initialHours, initialMinutes]);

    useEffect(() => {
        // Stop the audio when navigating away to the dashboard or when the component unmounts
        const stopAudioOnNavigate = () => {
            audio.pause(); // Stop the music when navigating away from the current page
            audio.currentTime = 0; // Reset the audio to the start
        };

        // Listen for changes in the location (navigation)
        return stopAudioOnNavigate; // Cleanup function will stop the audio on unmount or location change
    }, [location]); // This hook depends on location, so it will run whenever the route changes

    const { hours, minutes, remainingSeconds } = formatTime(timeLeft);

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (progress / 100) * circumference;

    const glowStyle = {
        textShadow: '0 0 8px rgba(255, 255, 255, 1), 0 0 16px rgba(255, 255, 255, 1), 0 0 24px rgba(255, 255, 255, 0.8)',
        color: 'white',
        animation: 'glow 1.5s ease-in-out infinite alternate',
    };

    return (
        <div className="min-h-screen bg-black flex justify-center items-center relative">
            {/* Back to Dashboard Button */}
            <button
                onClick={() => navigate('/dashboard')} // Navigate back to dashboard
                className="absolute top-4 left-4 text-white text-xl bg-transparent border-none hover:text-yellow-400 focus:outline-none z-10"
            >
                &larr; Back to Dashboard
            </button>

            <div className="p-8 rounded-lg shadow-lg text-center bg-black relative">
                {/* Timer Display or Time's Up */}
                {!isTimeUp ? (
                    <div className="flex justify-around items-center space-x-4 bg-black w-[80vw] h-[70vh] relative">
                        {/* Hours */}
                        <div
                            className="text-[12vw] text-yellow-500 flex items-center justify-center"
                            style={glowStyle}
                        >
                            {hours < 10 ? '0' + hours : hours}
                        </div>

                        {/* Minutes */}
                        <div
                            className="text-[12vw] flex items-center justify-center"
                            style={glowStyle}
                        >
                            {minutes < 10 ? '0' + minutes : minutes}
                        </div>

                        {/* Seconds */}
                        <div
                            className="text-[12vw] flex items-center justify-center"
                            style={glowStyle}
                        >
                            {remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="mt-6 text-[6vw] font-bold text-center text-white mb-10">
                            Time's Up!
                        </div>
                        <div className="mt-6 text-[10vw] text-center text-white">
                            Great Job!
                        </div>
                    </div>
                )}

                {/* Circle Progress around Pause/Resume Button */}
                {!isTimeUp && (
                    <div className="mt-4 relative inline-block">
                        <svg width="120" height="120" className="transform rotate-90">
                            <circle
                                cx="60"
                                cy="60"
                                r={radius}
                                stroke="#ddd"
                                strokeWidth="8"
                                fill="none"
                            />
                            <circle
                                cx="60"
                                cy="60"
                                r={radius}
                                stroke="blue"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={dashoffset}
                                transition="stroke-dashoffset 1s linear"
                            />
                        </svg>

                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            {!isPaused && isTimerActive && (
                                <button
                                    onClick={pauseTimer}
                                    className="bg-red-500 text-white py-2 px-4 rounded-full"
                                >
                                    <FaPause size={30} />
                                </button>
                            )}

                            {isPaused && (
                                <button
                                    onClick={resumeTimer}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-full"
                                >
                                    <FaPlay size={30} />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Timer;
