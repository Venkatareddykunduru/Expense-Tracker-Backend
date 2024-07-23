// controllers/payment.js
const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');
require('dotenv').config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createorder = async (req, res) => {
    try {
        const amount = 5000; // Amount in paise (₹50.00)
        const options = {
            amount,
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpayInstance.orders.create(options);

        await req.user.createOrder({
            orderid: order.id,
            status: 'PENDING'
        });

        res.status(201).json({
            razorpayOrderId: order.id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating Razorpay order'
        });
    }
};

exports.verifyPayment = async (req, res) => {
    const { razorpayPaymentId, razorpayOrderId } = req.body;
    
    try {
        const order = await Order.findOne({ where: { orderid: razorpayOrderId } });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.paymentid = razorpayPaymentId;
        order.status = 'SUCCESS';
        await order.save();

        
        req.user.ispremium = true;
        await req.user.save();

        res.status(200).json({ message: 'Payment verified and order updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error verifying payment'
        });
    }
};

exports.paymentFailed = async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId } = req.body;

    try {
        const order = await Order.findOne({ where: { orderid: razorpayOrderId } });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = 'FAILED';
        order.paymentid = razorpayPaymentId;
        await order.save();

        res.status(200).json({ message: 'Payment failure recorded' });
    } catch (error) {
        console.error('Error recording payment failure:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};