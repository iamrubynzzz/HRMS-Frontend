import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCalendarAlt, FaSearch,FaFileDownload } from 'react-icons/fa';
import './Attendance.css';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [name, setName] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [reportGenerating, setReportGenerating] = useState(false);
  const [reportMessage, setReportMessage] = useState('');

  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole')?.toLowerCase();
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';

  
  const getApiEndpoint = () => {
    if (isAdmin) {
      return '/api/attendance/all';
    } else if (isManager) {
      return '/api/attendance/manager-attendance';
    }
    return '/api/attendance/my-attendance';
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

      // Apply filters based on role
      if (isAdmin || isManager) {
        if (name) params.name = name;
      }
      
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (status) params.status = status;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setAttendanceData(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
      
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError(error.response?.data?.message || 'Failed to fetch attendance data.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
  
    if (!name) {
      toast.error('Please enter an employee name', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
  
    setReportGenerating(true);
    setReportMessage('');
  
    try {
      const response = await axios.get('/api/generate/attendance/report', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          name,  // Always send name parameter
          startDate,
          endDate,
        },
        responseType: 'blob'
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'attendance_report.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=(.+)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      // link.setAttribute('download', filename);
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
      
      toast.success('Report downloaded successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      let errorMessage = 'Failed to generate report';
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || 'Invalid request parameters';
        } else if (error.response.status === 404) {
          errorMessage = 'No attendance records found for the selected employee/period';
        } else {
          errorMessage = error.response.data || errorMessage;
        }
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setReportGenerating(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [page, size, userRole]); 

  // Reset to first page when filters change
  useEffect(() => {
    setPage(0);
  }, [name, startDate, endDate, status]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchAttendance();
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(prev => prev - 1);
    }
  };

  return (
    <div className="attendance-page">
      {/* Add ToastContainer at the top of component */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h2>Attendance Records</h2>
      
      {/* Filters Section */}
      <div className="filters">
        
          <div className="filter-item">
            <input
              type="text"
              placeholder="Search by Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <FaSearch />
          </div>
        

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
            <option value="">All Status</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="ANNUAL_LEAVE">Annual Leave</option> 
            <option value="SICK_LEAVE">Sick Leave</option>
            <option value="UNPAID_LEAVE">Unpaid Leave</option>
          </select>
        </div>
        <button onClick={fetchAttendance}>Apply Filters</button>
      </div>
      <div className="filter-actions">
          <button 
            onClick={handleGenerateReport}
            disabled={reportGenerating || !startDate || !endDate}
            className="generate-attendance-btn"
          >
            {reportGenerating ? 'Generating...' : (
              <>
                <FaFileDownload /> Generate Report
              </>
            )}
          </button>
        </div>

      {reportMessage && (
        <p className={reportMessage.includes('success') ? 'success-message' : 'error-message'}>
          {reportMessage}
        </p>
      )}

      {error && <p className="error-message">{error}</p>}

      {/* Attendance Table */}
      <div className="attendance-table">
        {loading ? (
          <p>Loading attendance data...</p>
        ) : (
          <>
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
                      <td className={`status-${entry.status?.toLowerCase()}`}>
                        {entry.status || 'N/A'}
                      </td>
                    
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={(isAdmin || isManager) ? 6 : 5} className="no-records">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls - Consistent with Users page */}
            {totalPages > 0 && (
              <div className="pagination-controls">
                <button 
                  onClick={handlePreviousPage} 
                  disabled={page === 0}
                >
                  Previous
                </button>
                <span>
                  Page {page + 1} of {totalPages} (Total Records: {totalElements})
                </span>
                <button 
                  onClick={handleNextPage} 
                  disabled={page >= totalPages - 1}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Attendance;