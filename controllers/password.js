// controllers/password.js
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const ForgotPasswordRequest = require('../models/forgotPasswordRequest');
const bcrypt = require('bcrypt');
const sendResetEmail = require('../util/sendinblue'); // You'll need to implement this

exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const id = uuidv4();
        await ForgotPasswordRequest.create({ id, userId: user.id, isActive: true });

        const resetUrl = `http://54.146.59.50:3000/password/resetpassword/${id}`;
        await sendResetEmail(user.email, resetUrl);

        res.status(200).json({ message: 'Reset password email sent' });
    } catch (err) {
        console.error('Error handling forgot password:', err);
        res.status(500).json({ error: 'Failed to handle forgot password' });
    }
};

exports.getResetPasswordForm = async (req, res, next) => {
    const { id } = req.params;
    try {
        const request = await ForgotPasswordRequest.findOne({ where: { id, isActive: true } });
        if (!request) {
            return res.status(404).json({ error: 'Invalid or expired password reset request' });
        }

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Password</title>
            </head>
            <body>
                <div class="container">
                    <h2>Reset Password</h2>
                    <form id="reset-password-form">
                        <label for="password">New Password:</label>
                        <input type="password" id="password" name="password" required>
                        <button type="submit">Reset Password</button>
                    </form>
                </div>
                
                <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
                <script>
                    document.getElementById('reset-password-form').addEventListener('submit', function (e) {
                        e.preventDefault();
                        const password = document.getElementById('password').value;
                        const url = window.location.pathname; // Get the current URL path
                        const id = url.split('/').pop(); // Extract the id from the URL
    
                        axios.post(\`/password/resetpassword/\${id}\`, { password })
                            .then(response => {
                                alert('Password reset successfully');
                                
                            })
                            .catch(error => {
                                console.error('Error resetting password:', error);
                                alert('Failed to reset password');
                            });
                    });
                </script>
            </body>
            </html>
        `);
    } catch (err) {
        console.error('Error handling password reset form:', err);
        res.status(500).json({ error: 'Failed to load reset form' });
    }
};

exports.resetPassword = async (req, res, next) => {
    console.log(req.body);
    const { id } = req.params;
    const { password } = req.body;
    try {
        const request = await ForgotPasswordRequest.findOne({ where: { id, isActive: true } });
        if (!request) {
            return res.status(404).json({ error: 'Invalid or expired password reset request' });
        }

        const user = await User.findByPk(request.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add logging for debugging
        console.log('Resetting password for user:', user.email);
        //console.log('New password:', password);

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        await user.save();

        request.isActive = false;
        await request.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error('Error handling password reset:', err);
        res.status(500).json({ error: 'Failed to reset password' });
    }
};
