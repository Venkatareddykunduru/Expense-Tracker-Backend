const express = require('express');
const reportcontroller=require('../controllers/report');
const isAuthenticated = require('../middleware/authenticate'); // Middleware to check if user is authenticated
const router = express.Router();

router.get('/generatereport',isAuthenticated,reportcontroller.generatereport);

module.exports=router;