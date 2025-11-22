const express = require('express');
const router = express.Router();
const { getProfile, getUserById, blockUser, unblockUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/profile', getProfile);
router.get('/:id', getUserById);
router.post('/:id/block', blockUser);
router.delete('/:id/block', unblockUser);

module.exports = router;

