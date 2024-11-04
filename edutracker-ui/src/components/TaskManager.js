// frontend/src/components/TaskManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskManager = ({ username, setAuraPoints }) => {
    const [tasks, setTasks] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Lecture Attendance');
    const [deadline, setDeadline] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState(50);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:5000/api/tasks/${userId}`);
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks", error);
            }
        };
        fetchTasks();
    }, []);

    const addTask = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("User ID not found");
            return; // Prevent further execution if userId is not found
        }
        const newTask = { userId, name, category, deadline, difficultyLevel };
        try {
            const response = await axios.post('http://localhost:5000/api/tasks', newTask);
            setTasks([...tasks, response.data]);
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
            const response = await axios.patch(`http://localhost:5000/api/tasks/${taskId}/complete`);
            setTasks(tasks.map(task => (task._id === taskId ? { ...task, completed: true } : task)));
            setAuraPoints(prev => prev + difficulty);
        } catch (error) {
            console.error("Error completing task", error);
        }
    };

    return (
        <div>
            <h2>Task Manager</h2>
            <input type="text" placeholder="Task Name" value={name} onChange={e => setName(e.target.value)} />
            <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Lecture Attendance">Lecture Attendance</option>
                <option value="Assignment Completion">Assignment Completion</option>
                <option value="Academic Goals">Academic Goals</option>
            </select>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
            <select value={difficultyLevel} onChange={e => setDifficultyLevel(Number(e.target.value))}>
                <option value={50}>Easy (50 points)</option>
                <option value={75}>Medium (75 points)</option>
                <option value={100}>Hard (100 points)</option>
            </select>
            <button onClick={addTask}>Add Task</button>

            <h3>Your Tasks:</h3>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        <span>{task.name} - {task.category} (Deadline: {task.deadline})</span>
                        <button onClick={() => completeTask(task._id, task.difficultyLevel)} disabled={task.completed}>
                            {task.completed ? 'Completed' : 'Complete'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskManager;
