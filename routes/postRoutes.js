const express = require('express');
const { getPost, getAllPosts, createPost, authenticateToken, deletePost, handleLikes, updatePost } = require('../controllers/postController');

const router = express.Router();
router.get('/',authenticateToken, getAllPosts);
router.post('/createpost',authenticateToken, createPost)
router.put('/update/:id',authenticateToken, updatePost )
router.delete('/delete/:id', authenticateToken, deletePost)
router.put('/likes/:id', authenticateToken, handleLikes)
router.get('/:id',authenticateToken, getPost)


module.exports = router;