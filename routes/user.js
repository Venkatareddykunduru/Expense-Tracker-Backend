const express=require('express');
const router=express.Router();
const usercontroller=require('../controllers/user');

router.post('/user/signup',usercontroller.createuser);

module.exports=router;