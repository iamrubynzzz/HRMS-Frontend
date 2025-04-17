import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "../../components/common/Button";
import UsePasswordToggle from "../../hooks/UsePasswordToggle";
import { FaTimes } from "react-icons/fa";
import "../../styles/ToastStyles.css";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [PasswordInputType, ToggleIcon] = UsePasswordToggle();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match");
      } else if (newPassword.length < 6) {
        setPasswordError("Password must be at least 6 characters");
      } else {
        setPasswordError("");
      }
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (passwordError) {
      toast.error(passwordError, {
        className: 'custom-toast-error',
      });
      return;
    }
  
    setLoading(true);
  
    try {
      await axios.post(
        `/api/v1/password/reset-password?token=${token}&newPassword=${newPassword}`,
        {},
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      setSuccess(true);
      toast.success("Password reset successfully!", {
        className: 'custom-toast',
      });
      
      // Navigate after 3 seconds to show the success message
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Reset error:", error);
      let errorMessage = "Failed to reset password.";
  
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
  
      toast.error(errorMessage, {
        className: 'custom-toast-error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/login"); 
  };
  

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
      <button className="close-button-top" onClick={handleCancel}>
        <FaTimes />
    </button>
        <h2>Reset Password</h2>
        <p>Please enter your new password</p>
        
        {success ? (
          <div className="success-message">
            Password reset successfully! You will be redirected to the login page shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="reset-form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-container">
                <input
                  type={PasswordInputType}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="6"
                  placeholder="At least 6 characters"
                />
                <span className="password-toggle">{ToggleIcon}</span>
              </div>
            </div>
            
            <div className="reset-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-container">
                <input
                  type={PasswordInputType}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                  placeholder="Confirm your password"
                />
                <span className="password-toggle">{ToggleIcon}</span>
              </div>
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}
            </div>
            
            <Button
              type="submit"
              label={loading ? "Resetting..." : "Reset Password"}
              className="reset-link-btn"
              disabled={loading || !!passwordError}
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;