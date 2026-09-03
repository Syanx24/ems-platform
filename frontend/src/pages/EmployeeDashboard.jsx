import { useEffect, useState } from 'react';
import AttendanceTable from '../components/AttendanceTable';
import Message from '../components/Message';
import { useAuth } from '../context/AuthContext';

function EmployeeDashboard() {
  const { user, authFetch, updateUser } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadAttendance = async () => {
    try {
      const data = await authFetch('/attendance/my');
      setAttendance(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleAction = async (url, successText) => {
    setMessage('');
    setError('');

    try {
      await authFetch(url, { method: 'POST' });
      setMessage(successText);
      loadAttendance();
    } catch (err) {
      setError(err.message);
    }
  };

  const applyLeave = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const data = await authFetch('/leave/apply', {
        method: 'POST',
        body: JSON.stringify({ date: leaveDate, reason: leaveReason })
      });
      updateUser({ leaveBalance: data.leaveBalance });
      setLeaveDate('');
      setLeaveReason('');
      setMessage('Leave applied successfully');
      loadAttendance();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Employee Dashboard</h1>
          <p>{user.department}</p>
        </div>
        <div className="leave-box">
          <span>Leave Balance</span>
          <strong>{user.leaveBalance}</strong>
        </div>
      </div>

      <Message type="success" text={message} />
      <Message type="error" text={error} />

      <section className="panel">
        <h2>Today Attendance</h2>
        <div className="button-row">
          <button onClick={() => handleAction('/attendance/check-in', 'Checked in successfully')}>
            Check In
          </button>
          <button onClick={() => handleAction('/attendance/check-out', 'Checked out successfully')}>
            Check Out
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>Apply Leave</h2>
        <form className="inline-form" onSubmit={applyLeave}>
          <input
            type="date"
            value={leaveDate}
            onChange={(e) => setLeaveDate(e.target.value)}
            required
          />
          <input
            value={leaveReason}
            onChange={(e) => setLeaveReason(e.target.value)}
            placeholder="Short reason for leave"
            required
          />
          <button type="submit">Apply</button>
        </form>
      </section>

      <section className="panel">
        <h2>My Attendance History</h2>
        <AttendanceTable records={attendance} showLeaveDetails />
      </section>
    </div>
  );
}

export default EmployeeDashboard;
