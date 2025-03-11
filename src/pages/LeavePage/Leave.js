import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Leave.css'; 

const Leave = () => {
  const [employees, setEmployees] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(''); 
  const [nameFilter, setNameFilter] = useState(''); 
  const [page, setPage] = useState(0); // Current page number
  const [size, setSize] = useState(10); // Page size
  const [totalPages, setTotalPages] = useState(0); 
  const [totalElements, setTotalElements] = useState(0); 

  const token = localStorage.getItem('authToken'); 

  // Fetch employees with pagination and filtering
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

  // Fetch employees when filters/pagination change
  useEffect(() => {
    fetchEmployees();
  }, [page, size, nameFilter]);

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
    setPage(0); // Reset to the first page when filtering
  };

  return (
    <div className="admin-leave-page">
      <h2>Leave Balances</h2>

      {/* Search Filter */}
      <div className="filters">
        <label>
          Search:
          <input
            type="text"
            value={nameFilter}
            onChange={handleNameFilterChange}
            placeholder="Enter employee name..."
          />
        </label>
      </div>

      {/* Employees Table */}
      <div className="employees-table">
        {loading ? (
          <p>Loading employees...</p>
        ) : employees.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Annual Leave Balance</th>
                  <th>Sick Leave Balance</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>{employee.annualLeaveBalance}</td>
                    <td>{employee.sickLeaveBalance}</td>
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

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Leave;