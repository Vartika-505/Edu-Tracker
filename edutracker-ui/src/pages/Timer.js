import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Timer = () => {
    const location = useLocation(); // Get the state passed from the Dashboard page
    const { hours: initialHours, minutes: initialMinutes } = location.state || {}; // Default to empty if no state is provided
    
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const intervalRef = useRef(null); // Ref to store the interval ID

    // Start timer function
    const startTimer = () => {
        const totalSeconds = initialHours * 3600 + initialMinutes * 60;
        setTimeLeft(totalSeconds);
        setIsTimerActive(true);

        // Start countdown (1-second interval)
        intervalRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalRef.current); // Clear the interval when time is up
                    setIsTimerActive(false);
                    alert("Time's up! Great job!");
                    return 0;
                }
                return prevTime - 1; // Decrement time by 1 second
            });
        }, 1000); // Decrement by 1 second
    };

    // Format time in HH:MM:SS
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return { hours, minutes, remainingSeconds };
    };

    // Start the timer when the component mounts
    useEffect(() => {
        if (initialHours !== undefined && initialMinutes !== undefined) {
            startTimer();
        }
        return () => {
            clearInterval(intervalRef.current); // Clear interval if the component unmounts
        };
    }, [initialHours, initialMinutes]);

    const { hours, minutes, remainingSeconds } = formatTime(timeLeft);

    return (
        <div className="min-h-screen bg-black flex justify-center items-center">
            <div className="p-8 rounded-lg shadow-lg text-center">
                {/* Timer Display */}
                {isTimerActive && (
                    <div className="flex justify-around items-center space-x-4 bg-black w-[80vw] h-[80vh]">
                        {/* Hours */}
                        <div className="bg-white px-4 py-2 rounded-lg shadow-lg h-[55vh] w-[20vw] text-[7vw] text-gray-700 flex items-center justify-center">
                            {hours < 10 ? '0' + hours : hours}
                        </div>

                        {/* Minutes */}
                        <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-gray-700 h-[55vh] w-[20vw] text-[7vw] flex items-center justify-center">
                            {minutes < 10 ? '0' + minutes : minutes}
                        </div>

                        {/* Seconds */}
                        <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-gray-700 h-[55vh] w-[20vw] text-[7vw] flex items-center justify-center">
                            {remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}
                        </div>
                    </div>
                )}

                {/* Finished Message */}
                {timeLeft === 0 && (
                    <div className="mt-6 text-2xl text-center text-green-600">
                        Time's up! Great job!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Timer;
