// src/components/Tasks.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; // Assuming Navbar is in the same folder
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext

const Tasks = () => {
    const { token, username, setAuraPoints, handleLogout } = useContext(AuthContext); // Access context values
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Lecture Attendance');
    const [deadline, setDeadline] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState(50);

    // Fetch tasks when the component mounts
    useEffect(() => {
        if (!token) {
            navigate('/login'); // Redirect to login if no token
        } else {
            const fetchTasks = async () => {
                try {
                    const userId = localStorage.getItem('userId');
                    if (!userId) navigate('/login'); // Redirect to login if no userId
                    
                    const response = await axios.get(`http://localhost:5000/api/tasks/${userId}`);
                    setTasks(response.data);
                } catch (error) {
                    console.error("Error fetching tasks", error);
                }
            };
            fetchTasks();
        }
    }, [token, navigate]);

    const addTask = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("User ID not found");
            return;
        }

        const newTask = { userId, name, category, deadline, difficultyLevel };
        try {
            const response = await axios.post('http://localhost:5000/api/tasks', newTask);
            const addedTask = response.data;
            setTasks([...tasks, addedTask]);
            setName('');
            setCategory('Lecture Attendance');
            setDeadline('');
            setDifficultyLevel(50);
        } catch (error) {
            console.error("Error adding task", error);
        }
    };

    const completeTask = async (taskId, difficulty) => {
        try {
            const currentDate = new Date();
            await axios.patch(`http://localhost:5000/api/tasks/${taskId}/complete`, { completionDate: currentDate });
            setTasks(tasks.map(task => (task._id === taskId ? { ...task, completed: true, completionDate: currentDate } : task)));
            setAuraPoints(prev => prev + difficulty);
        } catch (error) {
            console.error("Error completing task", error);
        }
    };

    const formatDeadline = (date) => {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 via-purple-300 to-purple-200 p-6 pt-20">
            {/* Navbar */}
            <Navbar token={token} handleLogout={handleLogout} />
            
            <div className="mt-8 flex justify-around">
                {/* Add Task Form */}
                <div>
                    <h2 className="text-4xl font-bold text-white mb-6 text-center">Add Task</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4 mb-8">
                        <input
                            type="text"
                            placeholder="Task Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full p-3 border-2 border-purple-300 rounded-md focus:outline-none focus:border-purple-500"
                        />
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full p-3 border-2 border-purple-300 rounded-md focus:outline-none focus:border-purple-500"
                        >
                            <option value="Lecture Attendance">Lecture Attendance</option>
                            <option value="Assignment Completion">Assignment Completion</option>
                            <option value="Academic Goals">Academic Goals</option>
                        </select>
                        <input
                            type="date"
                            value={deadline}
                            onChange={e => setDeadline(e.target.value)}
                            className="w-full p-3 border-2 border-purple-300 rounded-md focus:outline-none focus:border-purple-500"
                        />
                        <select
                            value={difficultyLevel}
                            onChange={e => setDifficultyLevel(Number(e.target.value))}
                            className="w-full p-3 border-2 border-purple-300 rounded-md focus:outline-none focus:border-purple-500"
                        >
                            <option value={50}>Easy (50 points)</option>
                            <option value={75}>Medium (75 points)</option>
                            <option value={100}>Hard (100 points)</option>
                        </select>
                        <button
                            onClick={addTask}
                            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-800 transition-colors"
                        >
                            Add Task
                        </button>
                    </div>
                </div>
                {/* Task List */}
                <div className="w-1/2">
                    <h3 className="text-4xl font-semibold text-white mb-4 text-center">Your Tasks:</h3>
                    <ul className="space-y-4 max-h-[62vh] overflow-y-auto">
                        {tasks.map(task => (
                            <li key={task._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                                <div>
                                    <h4 className="text-lg font-semibold text-purple-800">{task.name}</h4>
                                    <p className="text-sm text-gray-500">Due: {formatDeadline(task.deadline)}</p>
                                </div>
                                <button
                                    onClick={() => completeTask(task._id, task.difficultyLevel)}
                                    disabled={task.completed}
                                    className={`py-1 px-3 rounded-md text-white ${task.completed ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-800'}`}
                                >
                                    {task.completed ? 'Completed' : 'Complete'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Tasks;
