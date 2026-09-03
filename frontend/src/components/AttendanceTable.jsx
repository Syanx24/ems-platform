function AttendanceTable({ records, showEmployee, showLeaveDetails, onLeaveAction }) {
  const columnCount =
    5 + (showEmployee ? 1 : 0) + (showLeaveDetails ? 2 : 0) + (onLeaveAction ? 1 : 0);

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {showEmployee && <th>Employee</th>}
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Hours</th>
            <th>Status</th>
            {showLeaveDetails && <th>Leave Reason</th>}
            {showLeaveDetails && <th>Leave Status</th>}
            {onLeaveAction && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={columnCount}>No records found</td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record._id}>
                {showEmployee && (
                  <td>{record.userId?.name || 'Employee'}</td>
                )}
                <td>{record.date}</td>
                <td>{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</td>
                <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                <td>{record.workingHours || 0}</td>
                <td>{record.status}</td>
                {showLeaveDetails && <td>{record.leaveReason || '-'}</td>}
                {showLeaveDetails && <td>{record.leaveStatus || 'None'}</td>}
                {onLeaveAction && (
                  <td>
                    {record.leaveStatus === 'Pending' ? (
                      <div className="small-actions">
                        <button onClick={() => onLeaveAction(record._id, 'Approved')}>Accept</button>
                        <button className="danger-btn" onClick={() => onLeaveAction(record._id, 'Rejected')}>
                          Deny
                        </button>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceTable;
