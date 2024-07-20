// routes/password.js
const express = require('express');
const passwordController = require('../controllers/password');
const router = express.Router();

router.post('/forgotpassword', passwordController.forgotPassword);
router.get('/resetpassword/:id', passwordController.getResetPasswordForm);
router.post('/resetpassword/:id', passwordController.resetPassword);

module.exports = router;
