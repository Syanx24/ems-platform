const express = require('express');
const { applyLeave } = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/apply', protect, applyLeave);

module.exports = router;
