// src/public/js/tasks.js

document.addEventListener('DOMContentLoaded', async () => {
    const addTaskForm = document.getElementById('add-task-form');
    const clearFormButton = document.getElementById('clear-form');
    const logoutButton = document.getElementById('logout-btn');

    // Call function to get and display tasks when the page loads
    const userId = localStorage.getItem('userId');
    if (userId) {
        getAndDisplayTasks(userId);
    }

    // Event handlers
    addTaskForm.addEventListener('submit', addTaskHandler);
    clearFormButton.addEventListener('click', clearFormHandler);
    logoutButton.addEventListener('click', logoutHandler);

    // Get current date in 'YYYY-MM-DD' format
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zeros if necessary
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zeros if necessary
        return `${year}-${month}-${day}`;
    }

    // Function to handle submission of add task form
    async function addTaskHandler(event) {
        event.preventDefault();
        const formData = new FormData(addTaskForm);
        const taskData = {
            title: formData.get('title'),
            description: formData.get('description'),
            deadline: formData.get('deadline'),
            userId: localStorage.getItem('userId')
        };

        // Check validity of selected date
        const selectedDate = new Date(taskData.deadline);
        const currentDate = new Date();
        if (selectedDate < currentDate) {
            alert('Deadline must be equal to or after the current date.');
            return;
        }

        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must log in to add a task.');
            return;
        }

        try {
            const response = await fetch('/tasks/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(taskData)
            });

            if (response.ok) {
                alert('Task added successfully!');
                getAndDisplayTasks(taskData.userId);
            } else {
                const errorMessage = await response.json();
                alert(errorMessage.error);
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    // Function to clear form fields
    function clearFormHandler() {
        addTaskForm.reset();
    }

    // Function to handle logout
    function logoutHandler() {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        alert('Logged out successfully!');
        window.location.href = 'index.html';
    }

    // Function to get and display tasks
    async function getAndDisplayTasks(userId) {
        try {
            const response = await fetch(`/tasks/all/${userId}`);
            if (response.ok) {
                const tasks = await response.json();
                displayTasks(tasks);
            } else {
                const errorMessage = await response.json();
                alert(errorMessage.error);
            }
        } catch (error) {
            console.error('Error getting tasks:', error);
        }
    }

    // Function to display tasks on the user interface
    function displayTasks(tasks) {
        const pendingTasksList = document.getElementById('pending-tasks-list');
        const completedTasksList = document.getElementById('completed-tasks-list');
        pendingTasksList.innerHTML = '';
        completedTasksList.innerHTML = '';

        tasks.forEach(task => {
            // Format deadline date
            const formattedDeadline = formatDate(new Date(task.deadline));

            const taskItem = document.createElement('li');
            taskItem.classList.add('list-group-item', 'd-flex', 'flex-column');
            taskItem.dataset.taskId = task._id;

            const taskContent = document.createElement('div');
            taskContent.classList.add('d-flex', 'flex-column');

            const taskTitle = document.createElement('h5');
            taskTitle.classList.add('mb-2');
            taskTitle.textContent = task.title;

            const taskDescription = document.createElement('p');
            taskDescription.classList.add('mb-1');
            taskDescription.textContent = task.description;

            const taskDeadline = document.createElement('p');
            taskDeadline.classList.add('text-secondary');
            taskDeadline.textContent = `Deadline: ${formattedDeadline}`;

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('btn-group', 'mb-2', 'col-12', 'col-md-4');

            const completeBtn = document.createElement('button');
            completeBtn.classList.add('btn', 'btn-success', 'btn-sm');
            completeBtn.textContent = 'Complete';
            completeBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch(`/tasks/complete/${task._id}`, {
                        method: 'PATCH'
                    });

                    if (response.ok) {
                        alert('Task marked as completed!');
                        getAndDisplayTasks(localStorage.getItem('userId'));
                    } else {
                        const errorMessage = await response.json();
                        alert(errorMessage.error);
                    }
                } catch (error) {
                    console.error('Error marking task as completed:', error);
                }
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', async () => {
                const confirmation = confirm('Are you sure you want to delete this task?');
                if (confirmation) {
                    const taskId = taskItem.dataset.taskId;
                    try {
                        const response = await fetch(`/tasks/delete/${taskId}`, {
                            method: 'DELETE'
                        });

                        if (response.ok) {
                            alert('Task deleted successfully!');
                            getAndDisplayTasks(localStorage.getItem('userId'));
                        } else {
                            const errorMessage = await response.json();
                            alert(errorMessage.error);
                        }
                    } catch (error) {
                        console.error('Error deleting task:', error);
                    }
                }
            });

            const updateBtn = document.createElement('button');
            updateBtn.classList.add('btn', 'btn-warning', 'btn-sm', 'me-1');
            updateBtn.textContent = 'Update';
            updateBtn.addEventListener('click', () => {
                updateTaskHandler(task._id);
            });

            if (task.completed) {
                actionsDiv.appendChild(deleteBtn);
                taskContent.appendChild(taskTitle);
                taskContent.appendChild(taskDescription);
                taskContent.appendChild(taskDeadline);
                taskItem.appendChild(taskContent);
                taskItem.appendChild(actionsDiv);
                completedTasksList.appendChild(taskItem);
            } else {
                actionsDiv.appendChild(completeBtn);
                actionsDiv.appendChild(deleteBtn);
                actionsDiv.appendChild(updateBtn);
                taskContent.appendChild(taskTitle);
                taskContent.appendChild(taskDescription);
                taskContent.appendChild(taskDeadline);
                taskItem.appendChild(taskContent);
                taskItem.appendChild(actionsDiv);
                pendingTasksList.appendChild(taskItem);
            }
        });
    }

    // Function to handle task update
    const updateTaskHandler = async (taskId) => {
        const taskToUpdate = await fetch(`/tasks/all/${taskId}`);
        const taskData = await taskToUpdate.json();

        // Show current values in text input fields
        const newTitle = prompt('Enter the new task title:', taskData.title);
        const newDescription = prompt('Enter the new task description:', taskData.description);
        const newDeadline = prompt('Enter the new task deadline (YYYY-MM-DD):', taskData.deadline);

        if (newTitle !== null || newDescription !== null || newDeadline !== null) {
            const updatedTaskData = {
                title: newTitle || taskData.title,
                description: newDescription || taskData.description,
                deadline: newDeadline || taskData.deadline
            };

            try {
                // Update task
                const response = await fetch(`/tasks/update/${taskId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedTaskData)
                });

                if (response.ok) {
                    alert('Task updated successfully!');
                    getAndDisplayTasks(localStorage.getItem('userId'));
                } else {
                    const errorMessage = await response.json();
                    alert(errorMessage.error);
                }
            } catch (error) {
                console.error('Error updating task:', error);
                alert('There was an error updating the task. Please try again.');
            }
        }
    };
});
