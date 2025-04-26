import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import './EmailPage.css';

const EmailPage = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [recipientFilter, setRecipientFilter] = useState('');

  const token = localStorage.getItem('authToken');

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8080/api/email/email-messages', {
        params: { page, size, recipientAddress: recipientFilter },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Email response:', response.data);
      setEmails(response.data.content); // content is the list
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (err) {
      setError(err.message || 'Failed to load emails');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [page, size, recipientFilter]);

  const handleViewEmail = (email) => {
    setSelectedEmail(email);
  };

  const closeModal = () => {
    setSelectedEmail(null);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage(prev => prev - 1);
  };

  const handleRecipientFilterChange = (e) => {
    setRecipientFilter(e.target.value);
    setPage(0); // Reset to first page when filtering
  };

  if (loading) return <div className="loading">Loading emails...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="emails-page">
      <div className="emails-header">
        <h2>Email Logs</h2>
      </div>

     {/* Filter Input */}
        <div className="filters">
        <div className="filter-item">
            <input
            type="text"
            placeholder="Search by Recipient Email"
            value={recipientFilter}
            onChange={handleRecipientFilterChange}
            autoFocus 
            />
            <FaSearch />
        </div>
        <button onClick={fetchEmails}>Apply Filters</button>
        </div>


      {/* Emails Table */}
      <div className="emails-table">
        {emails.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Subject</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((email) => (
                  <tr key={email.id}>
                    <td>{email.recipientAddress}</td>
                    <td>{email.subject}</td>
                    <td>{email.companyName}</td>
                    <td>
                      <span className={`email-status status-${email.status.toLowerCase()}`}>
                        {email.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="view-email-btn"
                        onClick={() => handleViewEmail(email)}
                      >
                        View
                      </button>
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
              <span>Page {page + 1} of {totalPages} (Total Emails: {totalElements})</span>
              <button onClick={handleNextPage} disabled={page === totalPages - 1}>
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No emails found.</p>
        )}
      </div>

      {/* Modal to view email */}
      {selectedEmail && (
        <div className="email-modal">
          <div className="email-modal-content">
            <div className="email-modal-header">
              <h3>{selectedEmail.subject}</h3>
              <button className="close-modal-btn" onClick={closeModal}>×</button>
            </div>
            <div className="email-modal-body">
              <p><strong>To:</strong> {selectedEmail.recipientAddress}</p>
              <p><strong>Company:</strong> {selectedEmail.companyName}</p>
              <p><strong>Status:</strong> 
                <span className={`email-status status-${selectedEmail.status.toLowerCase()}`}>
                  {selectedEmail.status}
                </span>
              </p>
              <div className="email-html-content"
                   dangerouslySetInnerHTML={{ __html: selectedEmail.message }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailPage;
