import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaSearch } from 'react-icons/fa';
import './Attendance.css';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [name, setName] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');

  const getApiEndpoint = () => {
    const role = userRole?.toUpperCase();
    switch (role) {
      case 'ADMIN':
        return '/api/attendance/all';
      case 'MANAGER':
        return '/api/attendance/manager-attendance';
      case 'EMPLOYEE':
        return '/api/attendance/my-attendance';
      default:
        return '/api/attendance/my-attendance';
    }
  };
  
  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    setAttendanceData([]);

    try {
      const endpoint = getApiEndpoint();
      const params = {
        page,
        size,
      };

      const role = userRole?.toUpperCase();
      if (role === 'ADMIN' || role === 'MANAGER') {
        if (name) params.name = name;
      }
      
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (status) params.status = status;

      console.log('Request Params:', params); 

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      console.log('API Response:', response.data);
      
      // All endpoints now return data in the same format
      setAttendanceData(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError(error.response?.data?.message || 'Failed to fetch attendance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [page, size, userRole]); 

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchAttendance();
    }
  };

  const role = userRole?.toUpperCase();
  return (
    <div className="attendance-page">
      <div className="filters">
        {(role === 'ADMIN' || role === 'MANAGER') && (
          <div className="filter-item">
            <input
              type="text"
              placeholder="Search by Employee Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <FaSearch />
          </div>
        )}

        <div className="filter-item">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
            onKeyPress={handleKeyPress}
          />
          <FaCalendarAlt />
        </div>

        <div className="filter-item">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
            onKeyPress={handleKeyPress} 
          />
          <FaCalendarAlt />
        </div>

        <div className="filter-item">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            onKeyPress={handleKeyPress} 
          >
            <option value="">Select Status</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="ANNUAL_LEAVE">Annual Leave</option> 
            <option value="SICK_LEAVE">Sick Leave</option>
            <option value="UNPAID_LEAVE">Unpaid Leave</option>
          </select>
        </div>

        <div className="filter-item">
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            onKeyPress={handleKeyPress}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        <button onClick={fetchAttendance}>Apply Filters</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="attendance-table">
        {loading ? (
          <p>Loading attendance data...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Punch In</th>
                <th>Punch Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.name || 'N/A'}</td>
                    <td>{entry.date || 'N/A'}</td>
                    <td>{entry.punchIn || 'N/A'}</td>
                    <td>{entry.punchOut || 'N/A'}</td>
                    <td>{entry.status || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
          >
            Previous
          </button>
          <span>Page {page + 1} of {totalPages}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page + 1 >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Attendance;