document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://54.146.59.50:3000/auth/signup', { name, email, password });
        if (response.status === 201) {
            alert('Registration successful. Redirecting to login page.');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed. Please try again.');
    }
});