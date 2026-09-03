const Attendance = require('../models/Attendance');

const getToday = () => new Date().toISOString().split('T')[0];

const getStatusFromHours = (hours) => {
  if (hours < 4) return 'Half Day';
  return 'Present';
};

const checkIn = async (req, res) => {
  try {
    const today = getToday();

    const existingAttendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    if (existingAttendance && existingAttendance.checkInTime) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const attendance = await Attendance.create({
      userId: req.user._id,
      date: today,
      checkInTime: new Date(),
      status: 'Present'
    });

    res.status(201).json({ message: 'Checked in successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkOut = async (req, res) => {
  try {
    const today = getToday();

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    const checkOutTime = new Date();
    const workingHours =
      (checkOutTime.getTime() - attendance.checkInTime.getTime()) / (1000 * 60 * 60);

    attendance.checkOutTime = checkOutTime;
    attendance.workingHours = Number(workingHours.toFixed(2));
    attendance.status = getStatusFromHours(attendance.workingHours);

    await attendance.save();

    res.json({ message: 'Checked out successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const myAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkIn, checkOut, myAttendance };
