document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://35.153.50.19:3000/auth/login', { email, password });
        if (response.status === 200) {
            alert('Login successful. Redirecting to expense page.');
            window.localStorage.setItem('token', response.data.token); // Store the token
            window.localStorage.setItem('ispremium',response.data.ispremium);
            window.location.href = 'expense.html'; // Redirect to expense page
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed. Please try again.');
    }
});

document.getElementById('forgot-password-btn').addEventListener('click', function() {
    document.getElementById('forgot-password-form').style.display = 'block';
});

document.getElementById('send-reset-email-btn').addEventListener('click', function() {
    const email = document.getElementById('reset-email').value;
    axios.post('http://35.153.50.19:3000/password/forgotpassword', { email })
        .then(response => {
            alert('Reset password email sent');
        })
        .catch(error => {
            console.error('Error sending reset email:', error);
            alert('Error sending reset email');
        });
});