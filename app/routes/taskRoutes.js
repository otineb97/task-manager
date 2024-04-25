const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/add', taskController.addTask);
router.get('/all/:userId', taskController.getTasks);
router.patch('/complete/:taskId', taskController.completeTask);
router.put('/update/:taskId', taskController.updateTask);
router.delete('/delete/:taskId', taskController.deleteTask);

module.exports = router;
