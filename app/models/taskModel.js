const mongoose = require('mongoose');

// Define the schema for tasks
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  deadline: {
    type: Date,
    validate: {
      validator: value => value >= new Date().setHours(0, 0, 0, 0),
      message: props => `${props.value} is not a valid date for the deadline. It must be in the future or equal to the current date.`
    }
  },
  completed: {
    type: Boolean,
    default: false
  },
  // Reference to the user who created the task
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Create the Task model based on the schema
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
