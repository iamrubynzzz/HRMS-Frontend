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
  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    setAttendanceData([]); // Clear table before fetching new data

    try {
      const response = await axios.get('http://localhost:8080/api/attendance/all', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          name,
          startDate,
          endDate,
          status,
          page,
          size,
        },
      });

      console.log('Response:', response.data);
      setAttendanceData(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching attendance data:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data : 'Failed to fetch attendance data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance data on component mount and when filters change
  useEffect(() => {
    fetchAttendance();
  }, [page, size]); // Add dependencies if you want to refetch when filters change

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchAttendance();
    }
  };

  return (
    <div className="attendance-page">
      <div className="filters">
        {/* Filter by name */}
        <div className="filter-item">
          <input
            type="text"
            placeholder="Search by Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress} // Add Enter key support
          />
          <FaSearch />
        </div>

        {/* Filter by start date */}
        <div className="filter-item">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
            onKeyPress={handleKeyPress} // Add Enter key support
          />
          <FaCalendarAlt />
        </div>

        {/* Filter by end date */}
        <div className="filter-item">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
            onKeyPress={handleKeyPress} // Add Enter key support
          />
          <FaCalendarAlt />
        </div>

        {/* Filter by status */}
        <div className="filter-item">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            onKeyPress={handleKeyPress} // Add Enter key support
          >
            <option value="">Select Status</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
          </select>
        </div>

        {/* Pagination size */}
        <div className="filter-item">
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            onKeyPress={handleKeyPress} // Add Enter key support
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        {/* Search button */}
        <button onClick={fetchAttendance}>Apply Filters</button>
      </div>

      {/* Error handling */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Attendance table */}
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
              {attendanceData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.name}</td>
                  <td>{entry.date}</td>
                  <td>{entry.punchIn || 'N/A'}</td>
                  <td>{entry.punchOut || 'N/A'}</td>
                  <td>{entry.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination controls */}
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
    </div>
  );
};

export default Attendance;