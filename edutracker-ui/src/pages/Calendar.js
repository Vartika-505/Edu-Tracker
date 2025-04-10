import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tasks from './Tasks'; // Import the Tasks component

const Calendar = ({ token, username, setAuraPoints, handleLogout }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [tasks, setTasks] = useState([]);

    // Fetch tasks when the component mounts
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId || !token) {
                    console.log("User ID or Token missing");
                    return;
                }
                const response = await axios.get(`http://localhost:5000/api/tasks/${userId}`);
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks", error);
            }
        };
        fetchTasks();
    }, [token]);

    // Filter tasks based on selected date
    const filteredTasks = selectedDate
        ? tasks.filter(task => {
            const taskDate = new Date(task.deadline);
            return taskDate.toDateString() === new Date(selectedDate).toDateString();
        })
        : tasks;

    return (
        <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-10">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#5a189a] mb-4 sm:mb-0">
                        Select a Date:
                    </h2>
                    <input
                        type="date"
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-auto"
                    />
                </div>

                <div className="mt-4">
                    <Tasks
                        token={token}
                        username={username}
                        setAuraPoints={setAuraPoints}
                        handleLogout={handleLogout}
                        tasks={filteredTasks}
                    />
                </div>
            </div>
        </div>
    );
};

export default Calendar;
