// routes/payment.js
const express = require('express');
const paymentController = require('../controllers/payment');
const isAuthenticated = require('../middleware/authenticate'); // Middleware to check if user is authenticated
const router = express.Router();

router.post('/create-order', isAuthenticated, paymentController.createorder);
router.post('/verify-payment', isAuthenticated, paymentController.verifyPayment);
router.post('/payment-failed',isAuthenticated,paymentController.paymentFailed);

module.exports = router;
