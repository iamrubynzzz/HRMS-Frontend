import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "../../components/common/Button";
import "../../styles/ToastStyles.css";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post("/api/v1/password/forgot-password", { email });
      toast.success("Password reset link sent to your email.", {
        className: 'custom-toast',
      });
      setSuccess(true);
      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        "Failed to send reset link.",
        { className: 'custom-toast-error' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Forgot Password</h2>
        
        {success ? (
          <div className="success-content">
            <div className="success-icon">✓</div>
            <div className="success-message">
              <p>Password reset link has been sent to your email address.</p>
              <p>Please check your inbox (and spam folder).</p>
            </div>
            <Button
              label="OK"
              className="btn-confirm"
              onClick={() => navigate("/login")}
            />
          </div>
        ) : (
          <>
            <p>Enter your email to receive a password reset link</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your registered email"
                />
              </div>
              
              <Button
                type="submit"
                label={loading ? "Sending..." : "Send Reset Link"}
                className="reset-link-btn"
                disabled={loading}
              />
            </form>
            <div className="back-to-login">
              <button onClick={() => navigate("/login")}>Back to Login</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;