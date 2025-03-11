import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../components/common/Button';
import UserForm from '../../components/UserForm/UserForm';
import ConfirmationMessage from '../../components/ConfirmationModal/Confirmation';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Pagination and Filtering State
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [nameFilter, setNameFilter] = useState('');

  // Error Message State
  const [errorMessage, setErrorMessage] = useState('');

  const token = localStorage.getItem('authToken');

  // Fetch users with pagination and filtering
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    setUsers([]);

    try {
      const response = await axios.get('/api/v1/user/all', {
        params: {
          page,
          size,
          name: nameFilter,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Users Response:', response.data);
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching users:', error.response ? error.response.data : error.message);
      setErrorMessage('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when the component mounts or when filters/pagination change
  useEffect(() => {
    fetchUsers();
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

  // Handle add user
  const handleAddUser = async (newUser) => {
    try {
      const response = await axios.post('/api/v1/user/create', newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prevUsers) => [...prevUsers, response.data]);
      setShowForm(false); // Close the form on success
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error adding user:', error);
      throw error; // Rethrow the error to be handled in UserForm
    }
  };

  // Handle edit user
  const handleEditUser = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setCurrentUser(userToEdit);
    setFormMode('edit');
    setShowForm(true);
  };

  // Handle update user
  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await axios.put(`/api/v1/user/${updatedUser.id}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? response.data : user))
      );
      setShowForm(false); // Close the form on success
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error updating user:', error);
      throw error; // Rethrow the error to be handled in UserForm
    }
  };

  // Handle delete user
  const handleDeleteUser = async (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await axios.delete(`/api/v1/user/${userToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete));
      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user.');
      console.error('Error deleting user:', error);
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="users-page">
      <h2>All Users</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Add User Button */}
      <div className="users-header">
        <Button
          label="Add User"
          onClick={() => {
            setShowForm(true);
            setFormMode('add');
            setCurrentUser(null);
          }}
          className="add-user-btn"
          disabled={loading}
        />
      </div>

      {/* Name Filter Input */}
      <div className="filters">
        <label>
          Search:
          <input
            type="text"
            value={nameFilter}
            onChange={handleNameFilterChange}
            placeholder="Enter name..."
          />
        </label>
      </div>

      {/* User Form */}
      {showForm && (
        <div className="user-form-overlay">
          <UserForm
            initialValues={
              currentUser || {
                name: '',
                email: '',
                password: '',
                role: 'EMPLOYEE',
                rfid: '',
                address: '',
                contact: '',
                dateOfBirth: '',
                gender: 'MALE',
                hireDate: '',
                salary: '',
                annualLeaveBalance: 0,
                sickLeaveBalance: 0,
                managerName: '',
              }
            }
            onSubmit={formMode === 'add' ? handleAddUser : handleUpdateUser}
            mode={formMode}
            onClose={() => setShowForm(false)}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        </div>
      )}

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationMessage
          message={`Are you sure you want to delete user ID: ${userToDelete}?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {/* Users Table */}
      <div className="users-table">
        {loading ? (
          <p>Loading users...</p>
        ) : users.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Manager</th>
                  <th>Address</th>
                  <th>RFID</th>
                  <th>Contact</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Hire Date</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.managerName || 'N/A'}</td>
                    <td>{user.address}</td>
                    <td>{user.rfid || 'N/A'}</td>
                    <td>{user.contact}</td>
                    <td>{user.dateOfBirth}</td>
                    <td>{user.gender}</td>
                    <td>{user.hireDate}</td>
                    <td>{user.salary}</td>
                    <td className="actions-cell">
                      <FaEdit onClick={() => handleEditUser(user.id)} className="action-icon edit-icon" />
                      <FaTrash onClick={() => handleDeleteUser(user.id)} className="action-icon delete-icon" />
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
              <span>Page {page + 1} of {totalPages} (Total Employees: {totalElements})</span>
              <button onClick={handleNextPage} disabled={page === totalPages - 1}>
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No users found.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Users;