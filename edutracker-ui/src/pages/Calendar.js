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
                if (!userId) {
                    console.log("User ID not found");
                    return;
                }
                if (!token) {
                    console.log("Token not found");
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
            return taskDate.toDateString() === new Date(selectedDate).toDateString();  // Match tasks to selected date
        })
        : tasks;

    return (
        <div>
            <div className="calendar-container">
                <h2>Select a Date:</h2>
                <input
                    type="date"
                    onChange={(e) => setSelectedDate(e.target.value)} // Update date when selected
                />
            </div>

            <div className="tasks-container">
                {/* Pass the filtered tasks and other props to the Tasks component */}
                <Tasks
                    token={token}
                    username={username}
                    setAuraPoints={setAuraPoints}
                    handleLogout={handleLogout}
                    tasks={filteredTasks}  // Pass filtered tasks to Tasks component
                />
            </div>
        </div>
    );
};

export default Calendar;
