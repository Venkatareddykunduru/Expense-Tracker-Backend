const User = require('../models/user');

exports.createuser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Create a new user in the database
    console.log('Request received:', req.body);
    const newUser = await User.create({ name:name,email:email,password:password });

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
