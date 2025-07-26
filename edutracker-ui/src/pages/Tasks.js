import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Tasks = () => {
    const { token, username, auraPoints, setAuraPoints, handleLogout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Lecture Attendance');
    const [deadline, setDeadline] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState(50);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            const fetchTasks = async () => {
                try {
                    const userId = localStorage.getItem('userId');
                    if (!userId) navigate('/login');

                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/${userId}`);
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
        if (!userId) return console.error("User ID not found");
        const newTask = { userId, name, category, deadline, difficultyLevel };
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks`, newTask);
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
    const response = await axios.patch(
      `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/complete`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTasks(tasks.map(task => (
      task._id === taskId ? { ...task, completed: true } : task
    )));

    setAuraPoints(response.data.auraPoints);

  } catch (error) {
    console.error('Error completing task', error);
  }
};

    const formatDeadline = (date) => {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        return `${d.getDate().toString().padStart(2, '0')}/${
            (d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 via-purple-300 to-purple-200 p-4 mt-16 sm:p-6 pt-20">
            <Navbar token={token} handleLogout={handleLogout} />

            <div className="mt-8 flex flex-col lg:flex-row lg:justify-between gap-6">
                {/* Add Task Form */}
                <div className="flex-1">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center lg:text-left">Add Task</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto lg:mx-0 space-y-4 mb-6">
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
                <div className="flex-1">
                    <h3 className="text-3xl sm:text-4xl font-semibold text-white mb-6 text-center lg:text-left">Your Tasks</h3>
                    <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {tasks.map(task => (
                            <li
                                key={task._id}
                                className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
                            >
                                <div>
                                    <h4 className="text-lg font-semibold text-purple-800">{task.name}</h4>
                                    <p className="text-sm text-gray-500">Due: {formatDeadline(task.deadline)}</p>
                                </div>
                                <button
                                    onClick={() => completeTask(task._id, task.difficultyLevel)}
                                    disabled={task.completed}
                                    className={`py-2 px-4 rounded-md text-white text-sm ${
                                        task.completed
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-purple-600 hover:bg-purple-800'
                                    }`}
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
