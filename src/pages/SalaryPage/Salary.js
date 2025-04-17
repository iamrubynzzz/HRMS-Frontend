import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaSearch,FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Salary.css';

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [consolidatedSalaries, setConsolidatedSalaries] = useState([]);
  const [selectedConsolidatedSalaryId, setSelectedConsolidatedSalaryId] = useState(null);
  const [employeeName, setEmployeeName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [consolidatedStartDate, setConsolidatedStartDate] = useState('');
  const [consolidatedEndDate, setConsolidatedEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('calculationDate');
  const [sortDir, setSortDir] = useState('desc');

  const token = localStorage.getItem('authToken');

  // Fetch consolidated salaries
  const fetchConsolidatedSalaries = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/api/consolidated-salaries', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          startDate: consolidatedStartDate,
          endDate: consolidatedEndDate,
          page,
          size,
        },
      });

      setConsolidatedSalaries(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching consolidated salary data:', error);
      setError(error.response ? JSON.stringify(error.response.data) : 'Failed to fetch consolidated salary data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch individual salaries for a consolidated salary
  const fetchSalaries = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`/api/v1/salaries/by-consolidated-salary/${selectedConsolidatedSalaryId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          employeeName,
          startDate,
          endDate,
          page,
          size,
          sortBy,
          sortDir,
        },
      });

      setSalaries(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching salary data:', error);
      setError(error.response ? JSON.stringify(error.response.data) : 'Failed to fetch salary data.');
    } finally {
      setLoading(false);
    }
  };

  // Handle approval of salaries by consolidated salary ID
  const handleApproveConsolidatedSalary = async (consolidatedSalaryId) => {
    try {
      const response = await axios.put(
        `/api/v1/salaries/approve/by-consolidated-salary/${consolidatedSalaryId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      fetchConsolidatedSalaries(); // Refresh the consolidated salary list
    } catch (error) {
      console.error('Error approving salaries:', error);
      toast.error(error.response?.data || 'Failed to approve salaries.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // Handle release of salaries by consolidated salary ID
  const handleReleaseConsolidatedSalary = async (consolidatedSalaryId) => {
    try {
      const response = await axios.put(
        `/api/v1/salaries/release/by-consolidated-salary/${consolidatedSalaryId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      fetchConsolidatedSalaries(); // Refresh the consolidated salary list
    } catch (error) {
      console.error('Error releasing salaries:', error);
      toast.error(error.response?.data || 'Failed to release salaries.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // Handle generating a report for an individual salary
  const handleGenerateReport = async (salaryId) => {
    try {
      const response = await axios.get(`/api/v1/salaries/generate/${salaryId}/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Extract the file path from the response
      const filePath = response.data.split(': ')[1];

      // Trigger file download
      const link = document.createElement('a');
      link.href = filePath;
      link.setAttribute('download', `salary_report_${salaryId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success toast
      toast.success(`Report saved to: ${filePath}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error generating salary report:', error);

      // Show error toast
      toast.error('Failed to generate salary report.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // Handle key press for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  // Handle applying filters
  const handleApplyFilters = () => {
    if (selectedConsolidatedSalaryId) {
      fetchSalaries();
    } else {
      fetchConsolidatedSalaries();
    }
  };

  // Fetch consolidated salaries on component mount
  useEffect(() => {
    fetchConsolidatedSalaries();
  }, []);

  // Fetch individual salaries when selectedConsolidatedSalaryId changes
  useEffect(() => {
    if (selectedConsolidatedSalaryId) {
      fetchSalaries();
    }
  }, [selectedConsolidatedSalaryId, page, size, sortBy, sortDir]);

  return (
    <div className="salary-page">
      <ToastContainer />
      <div className="filters">
        {/* Consolidated Salary Filters */}
        {!selectedConsolidatedSalaryId && (
          <>
            <div className="filter-item">
              <input
                type="date"
                value={consolidatedStartDate}
                onChange={(e) => setConsolidatedStartDate(e.target.value)}
                placeholder="Start Date"
                onKeyPress={handleKeyPress}
              />
              <FaCalendarAlt />
            </div>
            <div className="filter-item">
              <input
                type="date"
                value={consolidatedEndDate}
                onChange={(e) => setConsolidatedEndDate(e.target.value)}
                placeholder="End Date"
                onKeyPress={handleKeyPress}
              />
              <FaCalendarAlt />
            </div>
            <button onClick={handleApplyFilters}>Apply Filters</button>
          </>
        )}

        {/* Individual Salary Filters */}
        {selectedConsolidatedSalaryId && (
          <>
            <div className="filter-item">
              <input
                type="text"
                placeholder="Search by Employee Name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
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
            <button onClick={handleApplyFilters}>Apply Filters</button>
          </>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Consolidated Salary Table */}
      {!selectedConsolidatedSalaryId && (
        <div className="consolidated-salary-table">
          {loading ? (
            <p>Loading consolidated salary data...</p>
          ) : (
            <table>
              <thead>
                <tr>
                <th>ID</th>
                  <th>Calculation Date</th>
                  <th>Total Number of Employees</th>
                  <th>Total Expense</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {consolidatedSalaries.map((consolidatedSalary) => (
                  <tr key={consolidatedSalary.id}>
                     <td>{consolidatedSalary.id}</td>
                    <td>{consolidatedSalary.calculationDate}</td>
                    <td>{consolidatedSalary.totalNumberOfEmployees}</td>
                    <td>{consolidatedSalary.totalExpense}</td>
                    <td>{consolidatedSalary.status}</td>
                    <td>
                      <button
                        className="view-details"
                        onClick={() => setSelectedConsolidatedSalaryId(consolidatedSalary.id)}
                      >
                        View Details
                      </button>
                      {consolidatedSalary.status === 'PENDING_REVIEW' && (
                        <button
                          className="approve"
                          onClick={() => handleApproveConsolidatedSalary(consolidatedSalary.id)}
                        >
                          Approve
                        </button>
                      )}
                      {consolidatedSalary.status === 'APPROVED' && (
                        <button
                          className="release"
                          onClick={() => handleReleaseConsolidatedSalary(consolidatedSalary.id)}
                        >
                          Release
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Individual Salary Table */}
      {selectedConsolidatedSalaryId && (
        <div className="salary-table">
          <button
            className="back-button"
            onClick={() => setSelectedConsolidatedSalaryId(null)}
          >
            <FaArrowLeft/>
            Back 
          </button>
          {loading ? (
            <p>Loading salary data...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('employeeName')}>
                    Employee Name {sortBy === 'employeeName' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('grossSalary')}>
                    Gross Salary {sortBy === 'grossSalary' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Tax Deduction</th>
                  <th>Overtime Pay</th>
                  <th>Allowance</th>
                  <th onClick={() => handleSort('netSalary')}>
                    Net Salary {sortBy === 'netSalary' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('calculationDate')}>
                    Calculation Date {sortBy === 'calculationDate' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((salary) => (
                  <tr key={salary.id}>
                    <td>{salary.employeeName}</td>
                    <td>{salary.grossSalary}</td>
                    <td>{salary.taxDeduction}</td>
                    <td>{salary.overtimePayTotal}</td>
                    <td>{salary.allowanceAmountTotal}</td>
                    <td>{salary.netSalary}</td>
                    <td>{salary.calculationDate}</td>
                    <td>{salary.status}</td>
                    <td>
                      {salary.status === 'RELEASED' && (
                      <button 
                        className="generate"
                        onClick={() => handleGenerateReport(salary.id)}>
                        Generate Report
                      </button>
                    )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Pagination */}
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

export default Salary;