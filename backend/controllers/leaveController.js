const Attendance = require('../models/Attendance');
const User = require('../models/User');

const applyLeave = async (req, res) => {
  try {
    const { date, reason } = req.body;
    const leaveDate = date || new Date().toISOString().split('T')[0];

    const user = await User.findById(req.user._id);

    if (user.leaveBalance <= 0) {
      return res.status(400).json({ message: 'No leave balance left' });
    }

    const existingAttendance = await Attendance.findOne({
      userId: user._id,
      date: leaveDate
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already exists for this date' });
    }

    user.leaveBalance -= 1;
    await user.save();

    const attendance = await Attendance.create({
      userId: user._id,
      date: leaveDate,
      status: 'On Leave',
      leaveReason: reason || '',
      leaveStatus: 'Pending'
    });

    res.json({
      message: 'Leave applied successfully',
      leaveBalance: user.leaveBalance,
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyLeave };
