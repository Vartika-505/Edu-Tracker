// routes/tasks.js
import express from 'express';
import Task from '../models/Task.js';
import User from '../models/User.js';

const router = express.Router();

// Get tasks by user ID
router.get('/:userId', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.params.userId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});

// Add a new task
router.post('/', async (req, res) => {
    const { userId, name, category, deadline, difficultyLevel } = req.body;
    try {
        const task = new Task({ userId, name, category, deadline, difficultyLevel });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error adding task', error });
    }
});

// Mark task as complete and update user aura points
router.patch('/:taskId/complete', async (req, res) => {
    const { taskId } = req.params;
    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.completed) return res.status(400).json({ message: 'Task already completed' });

        task.completed = true;
        await task.save();

        const user = await User.findById(task.userId);
        user.auraPoints += task.difficultyLevel; // Add aura points based on task difficulty
        await user.save();

        res.json({ task, auraPoints: user.auraPoints });
    } catch (error) {
        res.status(500).json({ message: 'Error completing task', error });
    }
});

export default router;
