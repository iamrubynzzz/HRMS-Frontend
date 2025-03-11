import React, { useState, useEffect } from "react";
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
    companyName: "",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [companies, setCompanies] = useState([]); // State to store companies
  const navigate = useNavigate();

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/companies");
        setCompanies(response.data);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
    };

    fetchCompanies();
  }, []);

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

    // If role is not SUPER_ADMIN, company name is required
    if (formData.role !== "SUPER_ADMIN" && !formData.companyName) {
      toast.error("Company name is required for login.", {
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
        navigate('/admin-dashboard');
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
                </option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>
          </div>
          {formData.role !== "SUPER_ADMIN" && (
            <div className="form-group">
              <label htmlFor="companyName">Company</label>
              <div className="role-select-container">
                <select
                  id="companyName"
                  name="companyName" 
                  className="role-select"
                  value={formData.companyName}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select your company
                  </option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.name.trim()}>
                      {company.name.trim()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
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