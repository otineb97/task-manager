document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    // Handler for the registration form
    registerForm.addEventListener('submit', async event => {
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
                handleRegistrationError(response.status, responseData.message);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error registering user. Please try again.');
        }
    });

    // Function to handle registration errors
    function handleRegistrationError(status, message) {
        if (status === 400 && message === 'User already exists') {
            alert('User already exists. Please choose another.');
        } else {
            alert('Error: ' + message);
        }
    }
});
