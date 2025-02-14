import React, { useState } from 'react';
import './SignupPage.css';
import UsePasswordToggle from "../../hooks/UsePasswordToggle";
import WelcomeImage from '../../assets/cropped-Human-Resources-1.jpg';
import { FontAwesomeIcon } from "../../utils/fontawesome";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [PasswordInputType, ToggleIcon] = UsePasswordToggle();
  const [ConfirmPasswordInputType, ConfirmPasswordToggleIcon] = UsePasswordToggle();

  // State for form data and error messages
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [errors, setErrors] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  // Handle input change and update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form fields
  const validateForm = () => {
    let formIsValid = true;
    let newErrors = { ...errors };

    if (!formData.userName) {
      newErrors.userName = "Full Name is required.";
      formIsValid = false;
    } else {
      newErrors.userName = '';
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!formData.email) {
      newErrors.email = "Email is required.";
      formIsValid = false;
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email format.";
      formIsValid = false;
    } else {
      newErrors.email = '';
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      formIsValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password should be at least 6 characters.";
      formIsValid = false;
    } else {
      newErrors.password = '';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
      formIsValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      formIsValid = false;
    } else {
      newErrors.confirmPassword = '';
    }

    if (!formData.role) {
      newErrors.role = "Please select a role.";
      formIsValid = false;
    } else {
      newErrors.role = '';
    }

    setErrors(newErrors);
    return formIsValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Form Submitted:', formData);
      try {
        await axios.post("/api/v1/auth/signup", formData)
        .then(response => {
        if (response.status === 200) {
          navigate('/login');
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
    } else {
      console.log('Form contains errors.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="welcome-section">
          <img src={WelcomeImage} alt="Welcome" className="welcome-image" />
          <h1>Welcome to Flourish HR Automation</h1>
          <p>Manage your team with ease and efficiency.</p>
          <p>Your ultimate HR solution for SMEs.</p>
        </div>
        <div className="form-section">
          <h2>Create Your Account</h2>
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <div className="input-containers">
              <input 
                type="text" 
                name="userName"
                placeholder="Enter your full name" 
                value={formData.userName} 
                onChange={handleChange} 
              />
              <FontAwesomeIcon icon="envelope" className="input-icons" />
            </div>
            {errors.userName && <p className="error">{errors.userName}</p>}

            <label>Email</label>
            <div className="input-containers">
              <input 
                type="email" 
                name="email" 
                placeholder="Enter your email" 
                value={formData.email} 
                onChange={handleChange} 
              />
              <FontAwesomeIcon icon="envelope" className="input-icons" />
            </div>
            {errors.email && <p className="error">{errors.email}</p>}

            <label>Password</label>
            <div className="input-containers">
              <input 
                type={PasswordInputType} 
                name="password" 
                placeholder="Enter your password" 
                value={formData.password} 
                onChange={handleChange} 
              />
              <span className="passwords-toggle">{ToggleIcon}</span>
            </div>
            {errors.password && <p className="error">{errors.password}</p>}

            <label>Confirm Password</label>
            <div className="input-containers">
              <input 
                type={ConfirmPasswordInputType} 
                name="confirmPassword" 
                placeholder="Confirm your password" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
              />
              <span className="passwords-toggle">{ConfirmPasswordToggleIcon}</span>
            </div>
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

            <label>Role</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="" disabled>Select your role</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="error">{errors.role}</p>}

            <button type="submit" className="signup-btn">
              Sign Up
            </button>
          </form>
          <p>
          {message && <p className="message">{message}</p>}
          </p>
          <p>
            Already have an account? <a href="/login">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
