import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Lecture Attendance');
    const [deadline, setDeadline] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState(50);

    // Access user data and auraPoints from AuthContext
    const { token, userId, auraPoints, setAuraPoints } = useContext(AuthContext);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks', error);
            }
        };
        if (userId) fetchTasks();
    }, [userId, token]);

    const addTask = async () => {
        if (!name || !category || !deadline) {
            console.error('All fields are required!');
            return;
        }

        const newTask = { userId, name, category, deadline, difficultyLevel };
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks`, newTask, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks([...tasks, response.data]);
            setName('');
            setCategory('Lecture Attendance');
            setDeadline('');
            setDifficultyLevel(50);
        } catch (error) {
            console.error('Error adding task', error);
        }
    };

    const completeTask = async (taskId, difficulty) => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(tasks.map(task => (task._id === taskId ? { ...task, completed: true } : task)));
            setAuraPoints(prev => prev + difficulty); // Update aura points using context
        } catch (error) {
            console.error('Error completing task', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-purple-300 to-purple-200 p-6">
            <h2 className="text-4xl font-bold text-white mb-6">Task Manager</h2>

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

            <h3 className="text-3xl font-semibold text-white mb-4">Your Tasks:</h3>
            <ul className="space-y-4 w-full max-w-md">
                {tasks.map(task => (
                    <li key={task._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                        <div>
                            <h4 className="text-lg font-semibold text-purple-800">{task.name}</h4>
                            <p className="text-sm text-gray-500">{task.category} - Due: {task.deadline}</p>
                        </div>
                        <button
                            onClick={() => completeTask(task._id, task.difficultyLevel)}
                            disabled={task.completed}
                            className={`py-1 px-3 rounded-md text-white ${task.completed ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-800 transition-colors'}`}
                        >
                            {task.completed ? 'Completed' : 'Complete'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskManager;
