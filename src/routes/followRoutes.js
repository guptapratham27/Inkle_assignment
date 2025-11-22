const express = require('express');
const router = express.Router();
const { followUser, unfollowUser } = require('../controllers/followController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/:id/follow', followUser);
router.delete('/:id/follow', unfollowUser);

module.exports = router;

