const express = require('express');
const {
  checkIn,
  checkOut,
  myAttendance
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/check-in', protect, checkIn);
router.post('/check-out', protect, checkOut);
router.get('/my', protect, myAttendance);

module.exports = router;
