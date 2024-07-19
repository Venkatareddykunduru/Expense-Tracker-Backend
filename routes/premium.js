const express = require('express');
const premiumController = require('../controllers/premium');
const isAuthenticated = require('../middleware/authenticate'); // Middleware to check if user is authenticated
const router = express.Router();

router.get('/leaderboard',isAuthenticated,premiumController.showleaderboard);

module.exports=router;