const User = require('../models/user');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createuser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Create a new user in the database
    const hashedpassword=await bcrypt.hash(password,10);
    console.log('Request received:', req.body);
    const newUser = await User.create({ name:name,email:email,password:hashedpassword });

    // Respond with the created user's information
    console.log('user created succesfully');
    res.status(201).json({
      message: 'User created successfully!',
      user: newUser
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({
      message: 'Error creating user',
      error: error.errors[0].message
    });
  }
};

exports.loginuser = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_PRIVATE_KEY, {
            expiresIn: '1h' // Token expires in 1 hour
        });

        // Successful login
        res.status(200).json({ message: 'Login successful', token,ispremium:user.ispremium });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
