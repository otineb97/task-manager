const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');

// Middleware for checking if the deadline is valid
const validateDeadline = (req, res, next) => {
  const { deadline } = req.body;
  const currentDate = new Date().setHours(0, 0, 0, 0);
  const selectedDate = new Date(deadline).setHours(0, 0, 0, 0);
  if (selectedDate < currentDate) {
    return res.status(400).json({ error: 'The deadline must be equal to or after the current date.' });
  }
  next();
};

// Route to add a new task
router.post('/add', validateDeadline, async (req, res) => {
  try {
    const { title, description, deadline, userId } = req.body;
    const newTask = new Task({ title, description, deadline, user: userId });
    await newTask.save();
    res.status(201).json({ message: 'Task added successfully' });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get all tasks of a user
router.get('/all/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.params.userId });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Middleware for handling task not found
const handleTaskNotFound = (task, res) => {
  if (!task) {
    res.status(404).json({ error: 'No task found with the provided ID' });
    return true;
  }
  return false;
};

// Route to mark a task as completed
router.patch('/complete/:taskId', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, { completed: true });
    if (handleTaskNotFound(task, res)) return;
    res.status(200).json({ message: 'Task marked as completed' });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update a task
router.put('/update/:taskId', async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, { title, description, deadline }, { new: true });
    if (handleTaskNotFound(updatedTask, res)) return;
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a task
router.delete('/delete/:taskId', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (handleTaskNotFound(task, res)) return;
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
