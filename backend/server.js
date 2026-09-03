const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const hrRoutes = require('./routes/hrRoutes');

const app = express();

let databaseConnection;

const connectDatabase = () => {
  if (!databaseConnection) {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employee_attendance';
    databaseConnection = mongoose.connect(mongoUri).catch((error) => {
      databaseConnection = undefined;
      throw error;
    });
  }

  return databaseConnection;
};

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    res.status(503).json({ message: 'Database connection failed' });
  }
});

app.get('/', (req, res) => {
  res.send('Employee Attendance Management API');
});

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/hr', hrRoutes);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDatabase()
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });
}

module.exports = app;