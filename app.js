const express = require('express');
const app = express()
const mongoose = require('mongoose')
require('dotenv').config();

const postRoutes = require('./routes/postRoutes')
const userRoutes = require('./routes/userRoutes')

const mongoURI = process.env.MONGODB_URI;

app.use(express.json())
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes)

async function connectToMongoDB() {
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB Atlas');
    } catch (error) {
      console.error('Failed to connect to MongoDB Atlas:', error);
    }
  }
  
  connectToMongoDB();

module.exports = app;