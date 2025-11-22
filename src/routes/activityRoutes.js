const express = require('express');
const router = express.Router();
const { getActivityFeed } = require('../controllers/activityController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getActivityFeed);

module.exports = router;

