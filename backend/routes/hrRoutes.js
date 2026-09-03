const express = require('express');
const {
  getEmployees,
  getAllAttendance,
  updateLeaveStatus
} = require('../controllers/hrController');
const { protect, hrOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/employees', protect, hrOnly, getEmployees);
router.get('/attendance', protect, hrOnly, getAllAttendance);
router.put('/leave/:id', protect, hrOnly, updateLeaveStatus);

module.exports = router;
