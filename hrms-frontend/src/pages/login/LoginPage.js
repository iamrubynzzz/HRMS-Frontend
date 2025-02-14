import React, { useState } from "react";
import "./LoginPage.css";
import Button from "../../components/common/Button";
import UsePasswordToggle from "../../hooks/UsePasswordToggle";
import { FontAwesomeIcon } from "../../utils/fontawesome";
import LoginImage from "../../assets/loginImage.png";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [PasswordInputType, ToggleIcon] = UsePasswordToggle();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  // Correct handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target; // Extract name and value from the input
    setFormData((prev) => ({
      ...prev, // Keep other formData values
      [name]: value, // Update the changed field
    }));
  };

  const handleLogin = async () => {
    setMessage(null);
    console.log("--------->>>>>>>"+formData.email)
    console.log("--------->>>>>>>"+formData.password)
    console.log("--------->>>>>>>"+formData.role)
    if (!formData.email || !formData.password || !formData.role) {
      alert("Please fill in all fields, including selecting your role.");
      return;
    }

    try {
      await axios.post("/api/v1/auth/login", formData)
      .then(response => {
        console.log("Login successful:", response.data);
        
      setMessage("Login successful!");

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userRole", formData.role);
         
         if (formData.role === "admin") {
          navigate('/admin-dashboard');
         } else if (formData.role === "manager") {
           window.location.href = "/manager-dashboard";
         } else {
           window.location.href = "/employee-dashboard";
         }
      }
      })
      .catch(error => {
        console.error("Login failed:", error);
      });
    } catch (error) {
      console.log(error);
      if (error.response) {
        setMessage(error.response.data.message || "Invalid login credentials.");
      } else {
        setMessage("An error occurred. Please try again.");
      }
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
                name="email" // Must match the formData key
                placeholder="Enter your email"
                value={formData.email} // Controlled input
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
                name="password" // Must match the formData key
                placeholder="Enter your password"
                value={formData.password} // Controlled input
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
                name="role" // Must match the formData key
                className="role-select"
                value={formData.role} // Controlled input
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="user">Employee</option>
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
          <Button label="Login" onClick={handleLogin} className="btn-primary" />
          {message && <p className="message">{message}</p>}
          <p className="signup-text">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
