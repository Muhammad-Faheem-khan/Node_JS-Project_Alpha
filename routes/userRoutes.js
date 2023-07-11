const express = require('express');
const { getUser, getAllUsers, createUser, loginUser } = require('../controllers/userController');

const router = express.Router();

router.get('/', getAllUsers);
router.post('/signup', createUser)
router.post('/login', loginUser)
router.get('/:id', getUser)


module.exports = router;