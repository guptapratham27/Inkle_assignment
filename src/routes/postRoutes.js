const express = require('express');
const router = express.Router();
const { createPost, getPosts, deletePost } = require('../controllers/postController');
const { authenticate } = require('../middleware/auth');
const { postValidation } = require('../middleware/validation');

router.use(authenticate);

router.post('/', postValidation, createPost);
router.get('/', getPosts);
router.delete('/:id', deletePost);

module.exports = router;

