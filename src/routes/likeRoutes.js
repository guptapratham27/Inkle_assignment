const express = require('express');
const router = express.Router();
const { likePost, unlikePost } = require('../controllers/likeController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/:id/like', likePost);
router.delete('/:id/like', unlikePost);

module.exports = router;

