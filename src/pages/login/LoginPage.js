import React, { useState } from "react";
import "./LoginPage.css";
import Button from "../../components/common/Button";
import UsePasswordToggle from "../../hooks/UsePasswordToggle";
import { FontAwesomeIcon } from "../../utils/fontawesome";
import LoginImage from "../../assets/loginImage.png";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../styles/ToastStyles.css'; 

const LoginPage = () => {
  const [PasswordInputType, ToggleIcon] = UsePasswordToggle();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target; // Extract name and value from the input
    setFormData((prev) => ({
      ...prev, // Keep other formData values
      [name]: value, // Update the changed field
    }));
  };

  const handleLogin = async () => {
    toast.dismiss();

    if (!formData.email || !formData.password || !formData.role) {
      toast.error("Please fill in all fields, including selecting your role.", {
        className: 'custom-toast-error',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/v1/auth/login", formData);
      console.log("Login successful:", response.data);
      toast.success("Login successful!", {
        className: 'custom-toast',
      });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userRole", formData.role);
        
        if (formData.role === "admin") {
          navigate('/admin-dashboard');
        } else if (formData.role === "manager") {
          navigate('/manager-dashboard');
        } else {
          navigate('/employee-dashboard');
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
  
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Invalid email or password.", {
          className: 'custom-toast-error',
        });
      } else {
        toast.error("An error occurred. Please try again.", {
          className: 'custom-toast-error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-image">
          <img src={LoginImage} alt="Login Illustration" />
        </div>
        <div className="login-form">
          <h1>Login</h1>
          <p>Welcome back, please enter your details</p>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-container">
              <input
                type="text"
                id="email"
                name="email" 
                placeholder="Enter your email"
                value={formData.email} 
                onChange={handleChange}
              />
              <FontAwesomeIcon icon="envelope" className="input-icon" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <input
                type={PasswordInputType}
                id="password"
                name="password" 
                placeholder="Enter your password"
                value={formData.password} 
                onChange={handleChange}
              />
              <span className="password-toggle">{ToggleIcon}</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <div className="role-select-container">
              <select
                id="role"
                name="role" 
                className="role-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select your role
                </option ><option value="user">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="form-footer">
            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
          </div>
          <Button label={loading ? "Logging in..." : "Login"} onClick={handleLogin} className="btn-primary" disabled={loading} />
          <ToastContainer />
          <p className="signup-text">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;