document.addEventListener('DOMContentLoaded', () => {
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

        if (!validateTaskDeadline(taskData.deadline)) return;
        if (!validateUserLoggedIn()) return;

        try {
            const response = await fetch('/tasks/add', {
                method: 'POST',
                headers: getAuthorizationHeader(),
                body: JSON.stringify(taskData)
            });

            if (response.ok) {
                alert('Task added successfully!');
                getAndDisplayTasks(taskData.userId);
            } else {
                handleErrorResponse(await response.json());
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
        window.location.href = 'index';
    }

    // Function to validate task deadline
    function validateTaskDeadline(deadline) {
        const selectedDate = new Date(deadline);
        const currentDate = new Date();
        if (selectedDate < currentDate) {
            alert('Deadline must be equal to or after the current date.');
            return false;
        }
        return true;
    }

    // Function to validate if the user is logged in
    function validateUserLoggedIn() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must log in to add a task.');
            return false;
        }
        return true;
    }

    // Function to get the authorization header
    function getAuthorizationHeader() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };
    }

    // Function to handle error response
    function handleErrorResponse(responseData) {
        if (response.status === 400 && responseData.message === 'User already exists') {
            alert('User already exists. Please choose another.');
        } else {
            alert('Error: ' + responseData.message);
        }
    }

    // Function to get and display tasks
    async function getAndDisplayTasks(userId) {
        try {
            const response = await fetch(`/tasks/all/${userId}`);
            if (response.ok) {
                const tasks = await response.json();
                displayTasks(tasks);
            } else {
                handleErrorResponse(await response.json());
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
            const taskItem = createTaskListItem(task);
            if (task.completed) {
                completedTasksList.appendChild(taskItem);
            } else {
                pendingTasksList.appendChild(taskItem);
            }
        });
    }

    // Function to create a task list item
    function createTaskListItem(task) {
        const formattedDeadline = formatDate(new Date(task.deadline));
        const taskItem = document.createElement('li');
        taskItem.classList.add('list-group-item', 'd-flex', 'flex-column');
        taskItem.dataset.taskId = task._id;

        const taskContent = document.createElement('div');
        taskContent.classList.add('d-flex', 'flex-column');

        const taskTitle = createTaskElement('h5', 'mb-2', task.title);
        const taskDescription = createTaskElement('p', 'mb-1', task.description);
        const taskDeadline = createTaskElement('p', 'text-secondary', `Deadline: ${formattedDeadline}`);

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('btn-group', 'mb-2', 'col-12', 'col-md-4');

        const completeBtn = createTaskButton('btn-success', 'Finished', async () => {
            await markTaskAsCompleted(task._id);
        });

        const deleteBtn = createTaskButton('btn-danger', 'Delete', async () => {
            await deleteTask(taskItem.dataset.taskId);
        });

        const updateBtn = createTaskButton('btn-warning', 'Update', () => {
            updateTaskHandler(task._id);
        });

        if (task.completed) {
            actionsDiv.appendChild(deleteBtn);
        } else {
            actionsDiv.appendChild(completeBtn);
            actionsDiv.appendChild(deleteBtn);
            actionsDiv.appendChild(updateBtn);
        }

        appendElements(taskContent, [taskTitle, taskDescription, taskDeadline]);
        appendElements(taskItem, [taskContent, actionsDiv]);

        return taskItem;
    }

    // Helper function to create task elements
    function createTaskElement(tag, className, textContent) {
        const element = document.createElement(tag);
        element.classList.add(className);
        element.textContent = textContent;
        return element;
    }

    // Helper function to create task buttons
    function createTaskButton(className, textContent, onClick) {
        const button = document.createElement('button');
        button.classList.add('btn', className, 'btn-sm');
        button.textContent = textContent;
        button.addEventListener('click', onClick);
        return button;
    }

    // Helper function to append multiple elements to a parent element
    function appendElements(parent, children) {
        children.forEach(child => parent.appendChild(child));
    }

    // Function to mark a task as completed
    async function markTaskAsCompleted(taskId) {
        try {
            const response = await fetch(`/tasks/complete/${taskId}`, { method: 'PATCH' });
            if (response.ok) {
                alert('Task marked as completed!');
                getAndDisplayTasks(localStorage.getItem('userId'));
            } else {
                handleErrorResponse(await response.json());
            }
        } catch (error) {
            console.error('Error marking task as completed:', error);
        }
    }

    // Function to delete a task
    async function deleteTask(taskId) {
        const confirmation = confirm('Are you sure you want to delete this task?');
        if (confirmation) {
            try {
                const response = await fetch(`/tasks/delete/${taskId}`, { method: 'DELETE' });
                if (response.ok) {
                    alert('Task deleted successfully!');
                    getAndDisplayTasks(localStorage.getItem('userId'));
                } else {
                    handleErrorResponse(await response.json());
                }
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    }

    // Function to update a task
    async function updateTaskHandler(taskId) {
        const taskToUpdate = await fetch(`/tasks/all/${taskId}`);
        const taskData = await taskToUpdate.json();

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
                const response = await fetch(`/tasks/update/${taskId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedTaskData)
                });

                if (response.ok) {
                    alert('Task updated successfully!');
                    getAndDisplayTasks(localStorage.getItem('userId'));
                } else {
                    handleErrorResponse(await response.json());
                }
            } catch (error) {
                console.error('Error updating task:', error);
                alert('There was an error updating the task. Please try again.');
            }
        }
    }

    // Function to format date
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
});
