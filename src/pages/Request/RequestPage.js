import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RequestForm from './RequestForm';
import Confirmation from '../../components/ConfirmationModal/Confirmation';
import SuccessModal from '../../components/SuccessModal/SuccessMessage';
import './RequestPage.css';

const RequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    requestType: 'ALLOWANCE',
    startDate: '',
    endDate: '',
    leaveDays:'',
    reason: '',
    allowanceAmount: 0,
    overtimeHours: 0,
    missedDate: '',
  });

  const[errors,setErrors] = useState({});

  // Pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filter state
  const [sort, setSort] = useState('createdDate,desc'); // Default sort
  const [statusFilter, setStatusFilter] = useState(''); // Default status filter
  const [dateFilter, setDateFilter] = useState(''); // Default date filter
  const [employeeNameFilter, setEmployeeNameFilter] = useState(''); // Employee name filter

  // Confirmation dialog state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);
  const [showApproveRejectConfirmation, setShowApproveRejectConfirmation] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user ID
  const fetchUserId = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`/api/v1/user/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(response.data);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  // Fetch requests with filters
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');

      let response;
      if (userRole === 'admin') {
        response = await axios.get(`/api/requests/all-requests`, {
          params: {
            page,
            size,
            sort,
            status: statusFilter,
            date: dateFilter,
            employeeName: employeeNameFilter,
          },
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // For the employee view of request page
        response = await axios.get(
          `/api/requests/my-requests?page=${page}&size=${size}&sort=${sort}&status=${statusFilter}&date=${dateFilter}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setRequests(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching requests', error);
    }
  };

  // Fetch data on component mount or when filters/pagination change
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsAdmin(userRole === 'admin');
    fetchUserId();
    fetchRequests();
  }, [page, size]);

  // Handle input change for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    //Clear the error for the field when the user types
    if(errors[name]){
      setErrors((prev)=>({...prev, [name]:''}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
  
      const payload = {
        ...formData,
        userId: parseInt(userId, 10),
        allowanceAmount: parseFloat(formData.allowanceAmount),
      };
  
      await axios.post(`/api/requests`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      fetchRequests(); // Refresh the list after creating a request
      setShowForm(false);
      setFormData({
        requestType: 'ALLOWANCE',
        startDate: '',
        endDate: '',
        reason: '',
        allowanceAmount: 0,
        overtimeHours: 0,
        missedDate: '',
      });
  
      // Show success toast
      toast.success('Request created successfully!');
    } catch (error) {
      console.error('Error creating request:', error);
  
      // Handle backend validation errors
      if (error.response && error.response.status === 400) {
        const backendError = error.response.data.message || 'An error occurred while creating the request.';
  
        // Set the error state for form fields 
        if (backendError.includes('Allowance amount')) {
          setErrors((prev) => ({ ...prev, allowanceAmount: backendError }));
        } else if (backendError.includes('Start date')) {
          setErrors((prev) => ({ ...prev, startDate: backendError }));
        } else if (backendError.includes('End date')) {
          setErrors((prev) => ({ ...prev, endDate: backendError }));
        } else if (backendError.includes('Reason')) {
          setErrors((prev) => ({ ...prev, reason: backendError }));
        } else if (backendError.includes('Overtime hours')) {
          setErrors((prev) => ({ ...prev, overtimeHours: backendError }));
        } else {
          // For general errors, show a toast
          toast.error(backendError);
        }
      } else {
        // Handle network or other errors
        toast.error(error.message || 'An error occurred while creating the request.');
      }
    }
  };

  // Handle cancel request click
  const handleCancelClick = (requestId) => {
    setRequestToCancel(requestId);
    setShowConfirmation(true);
  };

  // Handle confirm cancel request
  const handleConfirmCancel = async () => {
    try {
      const token = localStorage.getItem('authToken');

      await axios.delete(`/api/requests/${requestToCancel}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchRequests(); // Refresh the list after canceling a request
      toast.success('Request canceled successfully!');
    } catch (error) {
      console.error('Error canceling request:', error);
      toast.error('Failed to cancel request. Please try again.');
    } finally {
      setShowConfirmation(false);
      setRequestToCancel(null);
    }
  };

  // Handle cancel confirmation dialog
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setRequestToCancel(null);
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

  // Handle approve/reject confirmation
  const handleApproveRejectConfirmation = (requestId, action) => {
    setSelectedRequestId(requestId);
    setActionType(action);
    setShowApproveRejectConfirmation(true);
  };

  // Handle confirm approve/reject
  const handleConfirmApproveReject = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const endpoint =
        actionType === 'approve'
          ? `/api/requests/approve/${selectedRequestId}`
          : `/api/requests/reject/${selectedRequestId}`;

      const response = await axios.put(
        endpoint,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        fetchRequests(); // Refresh the list after approving/rejecting a request
        setSuccessMessage(`Request ${actionType}d successfully!`);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error(`Error ${actionType}ing request:`, error);
      toast.error(`Failed to ${actionType} request. Please try again.`);
    } finally {
      setShowApproveRejectConfirmation(false);
      setSelectedRequestId(null);
      setActionType(null);
    }
  };

  // Handle cancel approve/reject confirmation
  const handleCancelApproveRejectConfirmation = () => {
    setShowApproveRejectConfirmation(false);
    setSelectedRequestId(null);
    setActionType(null);
  };

  // Handle close success modal
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage('');
  };

  const resetForm = () => {
    setFormData({
      requestType: 'ALLOWANCE',
      startDate: '',
      endDate: '',
      leaveDays: '',
      reason: '',
      allowanceAmount: 0,
      overtimeHours: 0,
      missedDate: '',
    });
    setErrors({});
  };

  const handleCloseForm = () => {
    resetForm(); // Reset form data and errors
    setShowForm(false);
  };

   // Handle Enter key press
   const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchRequests();
    }
  };

  return (
    <div className="request-page">
      <h2>{isAdmin ? 'All Requests' : 'My Requests'}</h2>
      {!isAdmin && (
        <div className="request-header">
          <button className="create-request-btn" onClick={() => setShowForm(true)}>
            Create Request
          </button>
        </div>
      )}

      {showForm && (
        <RequestForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setShowForm={handleCloseForm}
          errors={errors}
        />
      )}

      <div className="filters">
        {isAdmin && (
          <label>
            Name:
            <input
              type="text"
              value={employeeNameFilter}
              onChange={(e) => setEmployeeNameFilter(e.target.value)}
              placeholder="Enter employee name..."
              onKeyPress={handleKeyPress}
            />
          </label>
        )}
        <label>
          Status:
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} onKeyPress={handleKeyPress}>
            <option value="">All</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </label>
        <label>
          Date:
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </label>
        <button onClick={fetchRequests}>Apply Filters</button>
      </div>

      <table className="request-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Request Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Leave Days</th>
            <th>Reason</th>
            <th>Allowance Amount</th>
            <th>Overtime Hours</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr key={index}>
              <td>{request.employeeName}</td>
              <td>{request.requestType}</td>
              <td>{request.startDate ? new Date(request.startDate).toLocaleDateString() : '-'}</td>
              <td>{request.endDate ? new Date(request.endDate).toLocaleDateString() : '-'}</td>
              <td>{request.leaveDays ? request.leaveDays : 'N/A'}</td>
              <td>{request.reason}</td>
              <td>{request.requestType === 'ALLOWANCE' ? request.allowanceAmount : '-'}</td>
              <td>{request.requestType === 'OVERTIME' ? request.overtimeHours : '-'}</td>
              <td>{request.status}</td>
              <td>
                {request.status === 'PENDING' && isAdmin && (
                  <>
                    <button
                      className="approve-request-btn"
                      onClick={() => handleApproveRejectConfirmation(request.id, 'approve')}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-request-btn"
                      onClick={() => handleApproveRejectConfirmation(request.id, 'reject')}
                    >
                      Reject
                    </button>
                  </>
                )}
                {request.status === 'PENDING' && !isAdmin && (
                  <button
                    className="cancel-request-btn"
                    onClick={() => handleCancelClick(request.id)}
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={page === 0}>
          Previous
        </button>
        <span>Page {page + 1} of {totalPages} (Total Requests: {totalElements}) </span>
        <button onClick={handleNextPage} disabled={page === totalPages - 1}>
          Next
        </button>
      </div>

      {showConfirmation && (
        <Confirmation
          message="Are you sure you want to cancel this request?"
          onConfirm={handleConfirmCancel}
          onCancel={handleCancelConfirmation}
        />
      )}

      {showApproveRejectConfirmation && (
        <Confirmation
          message={`Are you sure you want to ${actionType} this request?`}
          onConfirm={handleConfirmApproveReject}
          onCancel={handleCancelApproveRejectConfirmation}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          message={successMessage}
          onClose={handleCloseSuccessModal}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default RequestPage;