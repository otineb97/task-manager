const Task = require('../models/taskModel');

// Function to add a new task
exports.addTask = async (req, res) => {
    try {
        const { title, description, deadline, userId } = req.body;

        // Check if the deadline is valid
        const currentDate = new Date().setHours(0, 0, 0, 0);
        const selectedDate = new Date(deadline).setHours(0, 0, 0, 0);
        if (selectedDate < currentDate) {
            return res.status(400).json({ error: 'The deadline must be equal to or after the current date.' });
        }

        const newTask = new Task({ title, description, deadline, user: userId });
        await newTask.save();
        res.status(201).json({ message: 'Task added successfully' });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to get all tasks of a user
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.params.userId });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to mark a task as completed
exports.completeTask = async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.taskId, { completed: true });
        res.status(200).json({ message: 'Task marked as completed' });
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to update a task
exports.updateTask = async (req, res) => {
    try {
        const { title, description, deadline } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, { title, description, deadline }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ error: 'No task found with the provided ID' });
        }
        res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to delete a task
exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.taskId);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
