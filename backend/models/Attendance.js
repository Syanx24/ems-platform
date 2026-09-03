const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: String,
      required: true
    },
    checkInTime: {
      type: Date
    },
    checkOutTime: {
      type: Date
    },
    workingHours: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'On Leave', 'Half Day'],
      default: 'Absent'
    },
    leaveReason: {
      type: String,
      default: ''
    },
    leaveStatus: {
      type: String,
      enum: ['None', 'Pending', 'Approved', 'Rejected'],
      default: 'None'
    }
  },
  { timestamps: true }
);

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
