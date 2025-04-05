import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Settings.css";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/requests/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.oldPassword) {
      errors.oldPassword = "Old password is required";
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(passwordData.newPassword)) {
      errors.newPassword = "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(passwordData.newPassword)) {
      errors.newPassword = "Password must contain at least one number";
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("http://localhost:8080/api/v1/password/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setPasswordErrors(prev => ({
          ...prev,
          oldPassword: errorData.message || "Failed to change password"
        }));
        throw new Error(errorData.message || "Failed to change password");
      }

      toast.success("Password changed successfully! You will be redirected to login page in 5 seconds.");
      
      setShowPasswordModal(false);
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }, 5000);

    } catch (err) {
      toast.error(err.message);
      console.error("Password change error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!user || !user.fullName) {
    return <div className="error">No user data available</div>;
  }

  const nickName = user.fullName ? user.fullName.split(' ')[0] : '';

  return (
    <div className="settings-container">
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="password-modal">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Old Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  disabled={isSubmitting}
                />
                {passwordErrors.oldPassword && (
                  <span className="error-text">{passwordErrors.oldPassword}</span>
                )}
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  disabled={isSubmitting}
                />
                {passwordErrors.newPassword && (
                  <span className="error-text">{passwordErrors.newPassword}</span>
                )}
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  disabled={isSubmitting}
                />
                {passwordErrors.confirmPassword && (
                  <span className="error-text">{passwordErrors.confirmPassword}</span>
                )}
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordErrors({});
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Profile Content */}
      <div className="profile-header">
        <div className="profile-avatar">{user.initials || 'US'}</div>
        <div className="profile-info">
          <h1 className="profile-name">{user.fullName || 'User'}</h1>
          <p className="profile-email">{user.email || 'No email provided'}</p>
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-row">
          <div className="detail-group">
            <label>Full Name</label>
            <div className="detail-value">{user.fullName}</div>
          </div>
          <div className="detail-group">
            <label>Nick Name</label>
            <div className="detail-value">{nickName}</div>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-group">
            <label>Gender</label>
            <div className="detail-value">
              {user.gender === 'FEMALE' ? 'Female' : 
               user.gender === 'MALE' ? 'Male' : user.gender || 'Not specified'}
            </div>
          </div>
          <div className="detail-group">
            <label>Country</label>
            <div className="detail-value">Nepal</div>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-group">
            <label>Language</label>
            <div className="detail-value">English</div>
          </div>
          <div className="detail-group">
            <label>Address</label>
            <div className="detail-value">{user.address || 'No address provided'}</div>
          </div>
        </div>

        <div className="email-section">
          <label>My email Address</label>
          <div className="email-value">{user.email || 'No email provided'}</div>
        </div>
        <button 
          className="change-password-btn"
          onClick={() => {
            setShowPasswordModal(true);
            setPasswordErrors({});
          }}
        >
          Change Password
        </button>
         <ToastContainer />
      </div>
    </div>
  );
};

export default Settings;