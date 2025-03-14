import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Salary.css';

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('calculationDate');
  const [sortDir, setSortDir] = useState('desc');

  const token = localStorage.getItem('authToken');

  const fetchSalaries = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/api/v1/salaries/all', {
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

  useEffect(() => {
    fetchSalaries();
  }, [page, size, sortBy, sortDir]);

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/v1/salaries/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSalaries(); // Refresh the list after approval
    } catch (error) {
      console.error('Error approving salary:', error);
      setError(error.response ? JSON.stringify(error.response.data) : 'Failed to approve salary.');
    }
  };

  const handleRelease = async (id) => {
    try {
      await axios.put(`/api/v1/salaries/release/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSalaries(); // Refresh the list after release
    } catch (error) {
      console.error('Error releasing salary:', error);
      setError(error.response ? JSON.stringify(error.response.data) : 'Failed to release salary.');
    }
  };

  const handleGenerateReport = async (salaryId) => {
    try {
      const response = await axios.get(`/api/v1/salaries/${salaryId}/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Extract the file path from the response
      const filePath = response.data.split(": ")[1];

      // Trigger file download
      const link = document.createElement('a');
      link.href = filePath;
      link.setAttribute('download', `salary_report_${salaryId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success toast
      toast.success(`Report saved to: ${filePath}`, {
        position: "top-right",
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
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchSalaries();
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  return (
    <div className="salary-page">
      <ToastContainer />
      <div className="filters">
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

        <button onClick={fetchSalaries}>Apply Filters</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="salary-table">
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
                    {salary.status === 'RELEASED' ? (
                      <button className="generate" onClick={() => handleGenerateReport(salary.id)}>Generate</button>
                    ) : (
                      <>
                        <button className="approve" onClick={() => handleApprove(salary.id)}>Approve</button>
                        <button className="release" onClick={() => handleRelease(salary.id)}>Release</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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