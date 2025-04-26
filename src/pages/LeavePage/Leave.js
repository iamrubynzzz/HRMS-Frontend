import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaUserTie, FaUsers } from 'react-icons/fa';
import './Leave.css';

const Leave = () => {
  const [userRole, setUserRole] = useState(''); // 'admin', 'manager', or 'employee'
  const [employees, setEmployees] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState({
    annualLeaveBalance: 0,
    sickLeaveBalance: 0
  });
  const [managerData, setManagerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const token = localStorage.getItem('authToken');
  const maxAnnualLeave = 18;
  const maxSickLeave = 12;

  // Determine user role on component mount
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || 'employee');
  }, []);

  // Fetch employees with pagination and filtering (for admin)
  const fetchEmployees = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/api/v1/user/all', {
        params: {
          page,
          size,
          name: nameFilter,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setEmployees(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching employees:', error.response ? error.response.data : error.message);
      toast.error('Failed to fetch employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch leave balances for the logged-in employee
  const fetchLeaveBalances = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/api/v1/user/my-leave-balance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaveBalances(response.data);
    } catch (error) {
      console.error('Error fetching leave balances:', error.response ? error.response.data : error.message);
      setError('Failed to fetch leave balances. Please try again.');
      toast.error('Failed to fetch leave balances. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch manager leave data (own + team)
  const fetchManagerLeaveData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/api/v1/user/manager/leave-balances', {
        params:{
          page,
          size,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setManagerData(response.data);
      setTotalPages(response.data.totalPages)
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching manager leave data:', error.response ? error.response.data : error.message);
      setError('Failed to fetch manager leave data. Please try again.');
      toast.error('Failed to fetch leave data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch appropriate data based on user role
  useEffect(() => {
    if (userRole === 'admin') {
      fetchEmployees();
    } else if (userRole === 'manager') {
      fetchManagerLeaveData();
    } else {
      fetchLeaveBalances();
    }
  }, [userRole, page, size, nameFilter]);

  // Calculate percentage for CSS progress circle
  const calculatePercentage = (current, max) => {
    return Math.min(100, (current / max) * 100);
  };

  // Handle next page
  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Handle previous page
  const handlePreviousPage = () => {
    if (page > 0) {
      setPage((prevPage) => prevPage - 1);
    }
  };

   // Handle name filter change
   const handleNameFilterChange = (e) => {
    setNameFilter(e.target.value);
    setPage(0); 
  };

  // Handle Enter key press for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchEmployees();
    }
  };

 // Admin view components
const AdminLeaveView = () => (
  <>
    <h2>Employee Leave Balances</h2>

    {/* Search Filter */}
    <div className="filters">
      <div className="filter-item">
        <input
          type="text"
          placeholder="Search by Name"
          value={nameFilter}
          autoFocus
          onChange={handleNameFilterChange}
          onKeyPress={handleKeyPress}
              />
        <FaSearch />
      </div>
      <button onClick={fetchEmployees}>Apply Filters</button>
    </div>

    {/* Employees Table */}
    <div className="employees-table">
      {loading ? (
        <p>Loading employees...</p>
      ) : employees.length > 0 ? (
        <>
          <table className="admin-leave-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Annual Leave</th>
                <th>Sick Leave</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar"
                        style={{
                          width: `${calculatePercentage(employee.annualLeaveBalance, maxAnnualLeave)}%`,
                          backgroundColor: employee.annualLeaveBalance < 5 ? '#FF5722' : '#4CAF50'
                        }}
                      ></div>
                      <span>{employee.annualLeaveBalance}/{maxAnnualLeave}</span>
                    </div>
                  </td>
                  <td>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar"
                        style={{
                          width: `${calculatePercentage(employee.sickLeaveBalance, maxSickLeave)}%`,
                          backgroundColor: employee.sickLeaveBalance < 3 ? '#FF5722' : '#2196F3'
                        }}
                      ></div>
                      <span>{employee.sickLeaveBalance}/{maxSickLeave}</span>
                    </div>
                  </td>
                  <td>
                    {employee.annualLeaveBalance < 5 || employee.sickLeaveBalance < 3 ? (
                      <span className="status-warning">Low Balance</span>
                    ) : (
                      <span className="status-ok">Good</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button onClick={handlePreviousPage} disabled={page === 0}>
              Previous
            </button>
            <span>
              Page {page + 1} of {totalPages} (Total Employees: {totalElements})
            </span>
            <button onClick={handleNextPage} disabled={page === totalPages - 1}>
              Next
            </button>
          </div>        
        </>
      ) : (
        <p>No employees found.</p>
      )}
    </div>
  </>
);

  // Employee view components
  const EmployeeLeaveView = () => (
    <>
      <h2 className='leave-heading'>My Leave Balances</h2>
      
      {loading ? (
        <div className="loading-spinner">Loading your leave balances...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="leave-cards-container">
          {/* Annual Leave Card */}
          <div className="leave-card annual-leave">
            <div className="progress-circle-container">
              <div 
                className="progress-circle"
                style={{
                  background: `conic-gradient(
                    #4CAF50 ${calculatePercentage(leaveBalances.annualLeaveBalance, maxAnnualLeave)}%,
                    #e0e0e0 ${calculatePercentage(leaveBalances.annualLeaveBalance, maxAnnualLeave)}% 100%
                  )`
                }}
              >
                <div className="progress-circle-inner">
                  <span className="progress-text">
                    {leaveBalances.annualLeaveBalance}/{maxAnnualLeave}
                  </span>
                </div>
              </div>
            </div>
            <div className="leave-details">
              <h3>Annual Leave</h3>
              <p>You have {leaveBalances.annualLeaveBalance} days remaining</p>
              <p className="leave-description">
                Paid time off for vacations, personal time, or other reasons.
              </p>
            </div>
          </div>

          {/* Sick Leave Card */}
          <div className="leave-card sick-leave">
            <div className="progress-circle-container">
              <div 
                className="progress-circle"
                style={{
                  background: `conic-gradient(
                    #2196F3 ${calculatePercentage(leaveBalances.sickLeaveBalance, maxSickLeave)}%,
                    #e0e0e0 ${calculatePercentage(leaveBalances.sickLeaveBalance, maxSickLeave)}% 100%
                  )`
                }}
              >
                <div className="progress-circle-inner">
                  <span className="progress-text">
                    {leaveBalances.sickLeaveBalance}/{maxSickLeave}
                  </span>
                </div>
              </div>
            </div>
            <div className="leave-details">
              <h3>Sick Leave</h3>
              <p>You have {leaveBalances.sickLeaveBalance} days remaining</p>
              <p className="leave-description">
                Paid time off for illness, medical appointments, or family care.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <button 
        className="refresh-button"
        onClick={fetchLeaveBalances}
        disabled={loading}
      >
        {loading ? 'Refreshing...' : 'Refresh Balances'}
      </button>
    </>
  );

 // Manager view components
const ManagerLeaveView = () => (
  <>  
    {loading ? (
      <div className="loading-spinner">Loading leave balances...</div>
    ) : error ? (
      <div className="error-message">{error}</div>
    ) : managerData ? (
      <div className="manager-leave-container">
        {/* Manager's own leave balances */}
        <section className="manager-section">
          <div className="section-header">
            <FaUserTie className="section-icon" />
            <h3>My Leave Balances</h3>
          </div>
          <div className="manager-balance-cards">
            {/* Annual Leave Card */}
            <div className="manager-balance-card">
              <h4>Annual Leave</h4>
              <div className="manager-balance-visual">
                <div className="manager-progress-circle-container">
                  <div 
                    className="manager-progress-circle"
                    style={{
                      background: `conic-gradient(
                        #4CAF50 ${calculatePercentage(managerData.managerLeaveBalance.annualLeaveBalance, maxAnnualLeave)}%,
                        #e0e0e0 ${calculatePercentage(managerData.managerLeaveBalance.annualLeaveBalance, maxAnnualLeave)}% 100%
                      )`
                    }}
                  >
                    <div className="manager-progress-circle-inner">
                      <span className="manager-progress-text">
                        {managerData.managerLeaveBalance.annualLeaveBalance}/{maxAnnualLeave}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="manager-balance-details">
                  <p className="manager-balance-text">
                    {managerData.managerLeaveBalance.annualLeaveBalance} days remaining
                    {managerData.managerLeaveBalance.annualLeaveBalance < 5 && (
                      <span className="balance-warning"> (Low Balance)</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Sick Leave Card */}
            <div className="manager-balance-card">
              <h4>Sick Leave</h4>
              <div className="manager-balance-visual">
                <div className="manager-progress-circle-container">
                  <div 
                    className="manager-progress-circle"
                    style={{
                      background: `conic-gradient(
                        #2196F3 ${calculatePercentage(managerData.managerLeaveBalance.sickLeaveBalance, maxSickLeave)}%,
                        #e0e0e0 ${calculatePercentage(managerData.managerLeaveBalance.sickLeaveBalance, maxSickLeave)}% 100%
                      )`
                    }}
                  >
                    <div className="manager-progress-circle-inner">
                      <span className="manager-progress-text">
                        {managerData.managerLeaveBalance.sickLeaveBalance}/{maxSickLeave}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="manager-balance-details">
                  <p className="manager-balance-text">
                    {managerData.managerLeaveBalance.sickLeaveBalance} days remaining
                    {managerData.managerLeaveBalance.sickLeaveBalance < 3 && (
                      <span className="balance-warning"> (Low Balance)</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team members' leave balances */}
        <section className="team-section">
          <div className="section-header">
            <FaUsers className="section-icon" />
            <h3>My Team's Leave Balances</h3>
            <span className="badge">{managerData.employeeLeaveBalances.length} members</span>
          </div>
          
          {managerData.employeeLeaveBalances.length > 0 ? (
            <div className="team-leave-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Annual Leave</th>
                    <th>Sick Leave</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {managerData.employeeLeaveBalances.map((employee, index) => (
                    <tr key={index}>
                      <td>{employee.name}</td>
                      <td>
                        <div className="progress-bar-container">
                          <div 
                            className="progress-bar"
                            style={{
                              width: `${calculatePercentage(employee.annualLeaveBalance, maxAnnualLeave)}%`,
                              backgroundColor: employee.annualLeaveBalance < 5 ? '#FF5722' : '#4CAF50'
                            }}
                          ></div>
                          <span>{employee.annualLeaveBalance}/{maxAnnualLeave}</span>
                        </div>
                      </td>
                      <td>
                        <div className="progress-bar-container">
                          <div 
                            className="progress-bar"
                            style={{
                              width: `${calculatePercentage(employee.sickLeaveBalance, maxSickLeave)}%`,
                              backgroundColor: employee.sickLeaveBalance < 3 ? '#FF5722' : '#2196F3'
                            }}
                          ></div>
                          <span>{employee.sickLeaveBalance}/{maxSickLeave}</span>
                        </div>
                      </td>
                      <td>
                        {employee.annualLeaveBalance < 5 || employee.sickLeaveBalance < 3 ? (
                          <span className="status-warning">Low Balance</span>
                        ) : (
                          <span className="status-ok">Good</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

               {/* Pagination Controls */}
              <div className="pagination-controls">
                <button onClick={handlePreviousPage} disabled={page === 0}>
                  Previous
                </button>
                <span>
                  Page {page + 1} of {totalPages} (Total Employees: {totalElements})
                </span>
                <button onClick={handleNextPage} disabled={page === totalPages - 1}>
                  Next
                </button>
              </div>        
            </div>
          ) : (
            <p className="no-team-members">No team members assigned.</p>
          )}
        </section>
      </div>
    ) : (
      <p>No leave data available.</p>
    )}

    {/* Refresh Button */}
    <button 
      className="refresh-button"
      onClick={fetchManagerLeaveData}
      disabled={loading}
    >
      {loading ? 'Refreshing...' : 'Refresh All Balances'}
    </button>
  </>
);

  return (
    <div className="leave-page">
      {userRole === 'admin' ? <AdminLeaveView /> : 
       userRole === 'manager' ? <ManagerLeaveView /> : 
       <EmployeeLeaveView />}
      <ToastContainer />
    </div>
  );
};

export default Leave;