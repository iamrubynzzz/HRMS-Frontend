import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSearch, FaBuilding } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../components/common/Button';
import CompanyForm from '../../components/CompanyForm/CompanyForm';
import ConfirmationMessage from '../../components/ConfirmationModal/Confirmation';
import './Company.css';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [currentCompany, setCurrentCompany] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  // Pagination and Filtering State
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [nameFilter, setNameFilter] = useState('');

  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole')?.toLowerCase();
  const isAdmin = userRole === 'admin';
  const isSuperAdmin = userRole === 'super_admin';

  // Fetch companies
  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    setCompanies([]);

    try {
      const response = await axios.get('/api/companies', {
        params: {
          page,
          size,
          name: nameFilter,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setCompanies(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching companies:', error.response ? error.response.data : error.message);
      setError('Failed to fetch companies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch companies when the component mounts or when filters/pagination change
  useEffect(() => {
    fetchCompanies();
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
    setPage(0);
  };

  const handleAddCompany = async (newCompany) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/companies/create', // Full URL for clarity
        newCompany,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setCompanies((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      let errorMsg = 'Failed to create company.';
      if (error.code === "ERR_NETWORK") {
        errorMsg = "Network error - backend may be down.";
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      toast.error(errorMsg);
      throw error;
    }
  };

  // Handle edit company
  const handleEditCompany = (id) => {
    const companyToEdit = companies.find((company) => company.id === id);
    setCurrentCompany(companyToEdit);
    setFormMode('edit');
    setShowForm(true);
  };

  // Handle update company
  const handleUpdateCompany = async (updatedCompany) => {
    try {
      const response = await axios.put(`/api/companies/update/${updatedCompany.id}`, updatedCompany, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCompanies((prevCompanies) =>
        prevCompanies.map((company) => (company.id === updatedCompany.id ? response.data : company))
      );
      setShowForm(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  };

  // Handle delete company
  const handleDeleteCompany = async (id) => {
    setCompanyToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!companyToDelete) return;

    try {
      await axios.delete(`/api/companies/delete/${companyToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCompanies(); // Refresh list
    } catch (error) {
      console.error('Error deleting company:', error);
    } finally {
      setShowDeleteModal(false);
      setCompanyToDelete(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCompanyToDelete(null);
  };

  return (
    <div className="companies-page">
      <h2>All Companies</h2>
      {error && <p className="error-message">{error}</p>}

      {/* Create Company Button (admin/super_admin only) */}
      {(isAdmin || isSuperAdmin) && (
        <div className="companies-header">
          <Button
            label="Create Company"
            onClick={() => {
              setShowForm(true);
              setFormMode('add');
              setCurrentCompany(null);
            }}
            className="add-company-btn"
            disabled={loading}
          />
        </div>
      )}

      {/* Name Filter Input */}
      <div className="filters">
        <div className="filter-item">
          <input
            type="text"
            placeholder="Search by Company Name"
            value={nameFilter}
            onChange={handleNameFilterChange}
            onKeyPress={(e) => e.key === 'Enter' && fetchCompanies()}
          />
          <FaSearch />
        </div>
        <button onClick={fetchCompanies}>Apply Filters</button>
      </div>

      {/* Company Form */}
      {showForm && (
        <div className="company-form-overlay">
          <CompanyForm
            initialValues={
              currentCompany || {
                name: '',
                address: '',
                phone: '',
                email: '',
                website: '',
                description: '',
              }
            }
            onSubmit={formMode === 'add' ? handleAddCompany : handleUpdateCompany}
            mode={formMode}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationMessage
          message={`Are you sure you want to delete company ID: ${companyToDelete}?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {/* Companies Table */}
      <div className="companies-table">
        {loading ? (
          <p>Loading companies...</p>
        ) : companies.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Website</th>
                  <th>Industry Type</th>
                  <th>Registration</th>
                  <th>Established Date</th>
                  {(isAdmin || isSuperAdmin) && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id}>
                    <td>{company.id}</td>
                    <td>{company.name}</td>
                    <td>{company.address}</td>
                    <td>{company.phone}</td>
                    <td>{company.email}</td>
                    <td>
                      {company.website ? (
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          {company.website}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>{company.industryType}</td>
                    <td>{company.registrationNumber}</td>
                    <td>{company.establishedDate}</td>
                    {(isAdmin || isSuperAdmin) && (
                      <td className="actions-cell">
                        <FaEdit onClick={() => handleEditCompany(company.id)} className="action-icon edit-icon" />
                        <FaTrash onClick={() => handleDeleteCompany(company.id)} className="action-icon delete-icon" />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination-controls">
              <button onClick={handlePreviousPage} disabled={page === 0}>
                Previous
              </button>
              <span>Page {page + 1} of {totalPages} (Total Companies: {totalElements})</span>
              <button onClick={handleNextPage} disabled={page === totalPages - 1}>
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No companies found.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Companies;