import { useEffect, useState } from 'react';
import AttendanceTable from '../components/AttendanceTable';
import Message from '../components/Message';
import { useAuth } from '../context/AuthContext';

function HrDashboard() {
  const { authFetch } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filters, setFilters] = useState({ date: '', employeeId: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadEmployees = async () => {
    const data = await authFetch('/hr/employees');
    setEmployees(data);
  };

  const loadAttendance = async (selectedFilters = filters) => {
    const params = new URLSearchParams();
    if (selectedFilters.date) params.append('date', selectedFilters.date);
    if (selectedFilters.employeeId) params.append('employeeId', selectedFilters.employeeId);

    const data = await authFetch(`/hr/attendance?${params.toString()}`);
    setAttendance(data);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadEmployees();
        await loadAttendance();
      } catch (err) {
        setError(err.message);
      }
    };

    loadData();
  }, []);

  const handleFilter = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await loadAttendance();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLeaveAction = async (attendanceId, status) => {
    setMessage('');
    setError('');

    try {
      const data = await authFetch(`/hr/leave/${attendanceId}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });

      setMessage(data.message);
      await loadEmployees();
      await loadAttendance();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>HR Dashboard</h1>
          <p>Employees and attendance records</p>
        </div>
      </div>

      <Message type="success" text={message} />
      <Message type="error" text={error} />

      <section className="panel">
        <h2>All Employees</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Leaves</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>{employee.role}</td>
                  <td>{employee.leaveBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Attendance Records</h2>
        <form className="inline-form" onSubmit={handleFilter}>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
          <select
            value={filters.employeeId}
            onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
          >
            <option value="">All Employees</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </select>
          <button type="submit">Filter</button>
          <button
            type="button"
            onClick={() => {
              const emptyFilters = { date: '', employeeId: '' };
              setFilters(emptyFilters);
              loadAttendance(emptyFilters);
            }}
          >
            Clear
          </button>
        </form>
        <AttendanceTable
          records={attendance}
          showEmployee
          showLeaveDetails
          onLeaveAction={handleLeaveAction}
        />
      </section>
    </div>
  );
}

export default HrDashboard;
