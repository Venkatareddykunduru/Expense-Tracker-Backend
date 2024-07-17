const express = require('express');
const router = express.Router();
const authenticate=require('../middleware/authenticate.js');
const expenseController = require('../controllers/expense.js');

router.use(authenticate);

router.get('/getexpenses', expenseController.getexpenses);
router.post('/addexpense', expenseController.addexpense);
router.delete('/deleteexpense/:id', expenseController.deleteexpense);
router.put('/editexpense/:id',expenseController.editexpense);

module.exports = router;