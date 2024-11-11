import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { FaCheckCircle, FaStar } from 'react-icons/fa'; // Import star icons
import { AuthContext } from '../context/AuthContext';

const Timetable = () => {
    const { token, handleLogout, auraPoints, setAuraPoints } = useContext(AuthContext); // Add auraPoints and setAuraPoints from context
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [clickedDate, setClickedDate] = useState('');
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [daysInMonth, setDaysInMonth] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) navigate('/login');
                if (!token) return navigate('/home');

                const response = await axios.get(`http://localhost:5000/api/tasks/${userId}`);
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks", error);
            }
        };
        fetchTasks();
    }, [navigate, token]);

    const formatDeadline = (date) => {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        setDaysInMonth(eachDayOfInterval({ start, end }));
    }, [currentDate]);

    const handleDateClick = (date) => {
        setClickedDate(date);
        const filtered = tasks.filter(task => formatDeadline(task.deadline) === date);
        setFilteredTasks(filtered);
    };

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const handleTaskStarred = (taskId) => {
        const updatedTasks = tasks.map(task => {
            if (task._id === taskId) {
                return { ...task, isStarred: !task.isStarred };
            }
            return task;
        });

        const sortedTasks = updatedTasks.sort((a, b) => {
            if (a.isStarred && !b.isStarred) return -1;
            if (!a.isStarred && b.isStarred) return 1;
            return 0;
        });

        const filtered = sortedTasks.filter(task => formatDeadline(task.deadline) === clickedDate);
        setTasks(sortedTasks); 
        setFilteredTasks(filtered); 
    };

    // Mark task as complete, increase aura points, and update the backend
    const handleMarkComplete = async (taskId) => {
        try {
            const currentDate = new Date();
            const response = await axios.patch(`http://localhost:5000/api/tasks/${taskId}/complete`, { completionDate: currentDate });
            
            if (response.status === 200) { // If the task is marked complete successfully
                const newAuraPoints = auraPoints + 50; // Increase aura points by 50 (or any value you prefer)
                setAuraPoints(newAuraPoints); // Update the context with new aura points
                
                // Update task completion state
                setTasks(tasks.map(task => (task._id === taskId ? { ...task, completed: true } : task)));
                setFilteredTasks(filteredTasks.map(task => (task._id === taskId ? { ...task, completed: true } : task)));

                // Optional: Send a request to update aura points in the backend
                await axios.patch(`http://localhost:5000/api/users/${localStorage.getItem('userId')}/auraPoints`, { auraPoints: newAuraPoints });
            }
        } catch (error) {
            console.error("Error completing task", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 via-purple-300 to-purple-200 p-6 pt-20">
            <Navbar />
            
            <div className="mt-8 flex flex-col items-center">
                <div className="w-full max-w-[80vw] mb-8">
                    <h2 className="text-4xl font-bold text-white mb-6 text-center">Calendar</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={handlePrevMonth} className="text-purple-600 font-semibold">Prev</button>
                            <h3 className="font-semibold text-lg">{format(currentDate, 'MMMM yyyy')}</h3>
                            <button onClick={handleNextMonth} className="text-purple-600 font-semibold">Next</button>
                        </div>
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            <div className="font-bold text-center text-purple-600">Sun</div>
                            <div className="font-bold text-center text-purple-600">Mon</div>
                            <div className="font-bold text-center text-purple-600">Tue</div>
                            <div className="font-bold text-center text-purple-600">Wed</div>
                            <div className="font-bold text-center text-purple-600">Thu</div>
                            <div className="font-bold text-center text-purple-600">Fri</div>
                            <div className="font-bold text-center text-purple-600">Sat</div>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {daysInMonth.map((day, index) => {
                                const dayFormatted = format(day, 'dd/MM/yyyy');
                                return (
                                    <div
                                        key={index}
                                        className="text-center cursor-pointer p-3 rounded-lg bg-[#9d4edd] hover:bg-purple-300 transition duration-200 ease-in-out text-white font-semibold"
                                        onClick={() => handleDateClick(dayFormatted)}
                                    >
                                        {format(day, 'd')}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-[80vw]">
                    <h3 className="text-4xl font-semibold text-white mb-4 text-center">
                        Tasks for {clickedDate || 'Selected Date'}
                    </h3>
                    <ul className="space-y-4 max-h-[62vh] overflow-y-auto">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map(task => (
                                <li key={task._id} className="bg-gradient-to-r from-white via-purple-100 to-white p-6 rounded-lg shadow-lg flex justify-between items-center">
                                    <div>
                                        <h4 className="text-2xl font-semibold text-purple-800 mb-2">{task.name}</h4>
                                        <p className="text-md text-gray-500">Due Date: {formatDeadline(task.deadline)}</p>
                                        <p className="text-sm text-purple-700">Difficulty Level: {task.difficultyLevel}</p>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => handleTaskStarred(task._id)}
                                            className={`text-xl ${task.isStarred ? 'text-yellow-500' : 'text-gray-500'}`}
                                        >
                                            <FaStar />
                                        </button>

                                        <button
                                            onClick={() => handleMarkComplete(task._id)}
                                            disabled={task.completed}
                                            className={`py-2 px-4 rounded-lg font-semibold flex items-center space-x-2 ${task.completed ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-800'}`}
                                        >
                                            {task.completed ? (
                                                <>
                                                    <FaCheckCircle className="text-green-500" /> <span>Completed</span>
                                                </>
                                            ) : (
                                                <span>Mark as Complete</span>
                                            )}
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No tasks for this date</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Timetable;
