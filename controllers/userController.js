require('dotenv').config();
const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRETE_KEY = process.env.SECRETE_KEY ;


exports.getAllUsers = async (req, res) => {
    try {
       const allUsers = await User.find()
       res.status(200).json(allUsers)
    }catch(error) {
        res.status(404).json({message: error.message})
    }
}

exports.getUser = async (req, res) => {
    try {
    const {id} = req.params
    const user = await User.findById(id);
      if (!user) {
        return res.status(404).send('User not found');
      }else{
       res.status(200).json(user)
      }
    }catch(error) {
        res.status(404).json({message: error.message})
    }
}

exports.createUser = async (req, res) => {
    const { name, email, password } = req.body
    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }
    
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
    
        await user.save();
        
        // Return a success response
      res.status(201).json({ message: 'User registered successfully' });
    }catch(error) {
        console.error('Error registering user:', error);
      res.status(500).json({ message: 'An error occurred while registering the user' });
    }
}

exports.loginUser = async (req, res) => {
    try {
        // Extract user input from request body
        const { email, password } = req.body;
    
        // Retrieve the user from the database based on the provided email
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
    
        // Compare the hashed password with the input password using bcrypt
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
    
        // Generate a JSON Web Token (JWT) with user data and any necessary roles
        const token = jwt.sign({ userId: user._id, email: user.email }, SECRETE_KEY , { expiresIn: '1h' });
    
        // Return the token as a response
        res.json({ token });
      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An error occurred during login' });
      }
}