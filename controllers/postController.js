const { post } = require('../app');
const Post = require('../models/post')
const jwt = require('jsonwebtoken');
require('dotenv')

const SECRETE_KEY = process.env.SECRETE_KEY;

exports.checkPostId = async (req, res, next) => {
    const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).send('Post not found');
      }

      next()
}

// Authentication middleware
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: Token missing' });
    }
  
    jwt.verify(token, SECRETE_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Authentication failed: Invalid token' });
      }
  
      // Attach decoded user data to the request object for use in subsequent handlers
      req.user = decoded;
      next();
    });
  }

exports.getAllPosts = async (req, res) => {
    
    try {
       const allPosts = await Post.find()
       res.status(200).json(allPosts)
    }catch(error) {
        res.status(404).json({message: error.message})
    }
}

exports.getPost = async (req, res) => {
    try {
    const {id} = req.params
    const post = await Post.findById(id);
      if (!post) {
        return res.status(404).send('Post not found');
      }
      else{
      res.status(200).json(post)
      }
    }catch(error) {
        res.status(404).json({message: error.message})
    }
}

exports.createPost = async (req, res) => {
    const {title, description, likes, filename, contentType, data} = req.body
    try {
        // Create a new Post instance with the provided data
        const post = new Post({
            title,
            description,
            postBy: req.user,
            likesInfo: {
                likes,
                userList: []
            },
            image: {
            filename,
            contentType,
            data: Buffer.from(data, 'base64'), 
            },
        });
    
        // Save the post to the database
        const savedPost = await post.save();
        res.status(200).json(savedPost)
    }catch(error) {
        res.status(404).json({message: error.message})
    }
}

exports.deletePost = async (req, res) => {
    try {
        const {id} = req.params
        const post = await Post.findByIdAndRemove(id);
        if (!post) {
          return res.status(404).send('Invalid Post Id');
        }
        res.send(post);
      } catch (error) {
        console.error('Failed to delete course:', error);
        res.status(500).send('An error occurred while deleting the post');
      }
}

exports.handleLikes = async (req, res) => {
    try {
        const {id} = req.params
        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).send('Invalid Post Id');
          }
        let likes = post.likesInfo.likes
        let index = post.likesInfo.userList.indexOf(req.user.userId)

        if (index > -1) {
            post.likesInfo.likes = likes-1
            post.likesInfo.userList.splice(index, 1)
        }else {
            post.likesInfo.likes = likes+1
            post.likesInfo.userList.push(req.user.userId)
        }
       
        await post.save()
        res.status(200).send(post)

    }catch (error) {
        console.error('Failed to like post:', error);
        res.status(500).send('An error occurred while liking the post');
    }
}