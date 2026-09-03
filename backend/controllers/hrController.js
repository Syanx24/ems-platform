const Attendance = require('../models/Attendance');
const User = require('../models/User');

const getEmployees = async (req, res) => {
  try {
    const employees = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const { date, employeeId } = req.query;
    const filter = {};

    if (date) filter.date = date;
    if (employeeId) filter.userId = employeeId;

    const attendance = await Attendance.find(filter)
      .populate('userId', 'name email department role')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Approved or Rejected' });
    }

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance || attendance.leaveStatus === 'None') {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (attendance.leaveStatus !== 'Pending') {
      return res.status(400).json({ message: 'Leave request already updated' });
    }

    attendance.leaveStatus = status;
    attendance.status = status === 'Approved' ? 'On Leave' : 'Absent';

    if (status === 'Rejected') {
      await User.findByIdAndUpdate(attendance.userId, { $inc: { leaveBalance: 1 } });
    }

    await attendance.save();

    const updatedAttendance = await Attendance.findById(attendance._id).populate(
      'userId',
      'name email department role'
    );

    res.json({
      message: `Leave ${status.toLowerCase()} successfully`,
      attendance: updatedAttendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEmployees, getAllAttendance, updateLeaveStatus };
