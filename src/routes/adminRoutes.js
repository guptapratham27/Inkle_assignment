const express = require('express');
const router = express.Router();
const {
  deleteUser,
  deletePost,
  deleteLike,
  createAdmin,
  deleteAdmin
} = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate);
router.use(requireRole('admin', 'owner'));

router.delete('/users/:id', deleteUser);
router.delete('/posts/:id', deletePost);
router.delete('/likes/:id', deleteLike);

router.post('/admins', requireRole('owner'), createAdmin);
router.delete('/admins/:id', requireRole('owner'), deleteAdmin);

module.exports = router;

