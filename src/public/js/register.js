// src/public/js/register.js

document.addEventListener('DOMContentLoaded', async () => {
    const registerForm = document.getElementById('register-form');

    // Handler for the registration form
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(registerForm);
        const userData = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                alert('Registration successful! Please log in.');
                registerForm.reset(); // Clear form fields
            } else {
                const responseData = await response.json();
                // Check if the error is due to existing user
                if (response.status === 400 && responseData.message === 'User already exists') {
                    alert('User already exists. Please choose another.');
                } else {
                    // Show any other error message
                    alert('Error: ' + responseData.message);
                }
            }
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error registering user. Please try again.');
        }
    });
});
