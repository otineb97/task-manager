// src/public/js/login.js

document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('login-form');

    // Handler for the login form
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const userData = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const { userId, token } = await response.json();
                // Store the user ID and token in local storage
                localStorage.setItem('userId', userId);
                localStorage.setItem('token', token);
                window.location.href = 'tasks.html'; // Redirect to the tasks page
                loginForm.reset(); // Clear form fields
            } else {
                const errorMessage = await response.json();
                alert(errorMessage.error);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    });
});
