import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import Button from "../../components/common/Button";
import UsePasswordToggle from "../../hooks/UsePasswordToggle";
import { FontAwesomeIcon } from "../../utils/fontawesome";
import LoginImage from "../../assets/loginImage.png";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/ToastStyles.css'; 
import { GoogleLogin } from '@react-oauth/google'; 

const LoginPage = () => {
  const [PasswordInputType, ToggleIcon] = UsePasswordToggle();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyName: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    toast.dismiss();

    if (!formData.email || !formData.password ) {
      toast.error("Please fill in all fields.", {
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
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("userRole", response.data.role); 
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

  const handleGoogleLogin = async (response) => {
    try {
        console.log("Google Response:", response);

        // Clear all tokens before storing the new one
        localStorage.clear();

        const googleToken = response.credential;
        if (!googleToken) {
            toast.error("Google token is missing", {
                className: 'custom-toast-error'
            });
            return;
        }

        const backendResponse = await axios.post(
            "http://localhost:8080/oauth2/success",
            { token: googleToken },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            }
        );

        console.log("Backend Response:", backendResponse.data);

        // Store new tokens
        localStorage.setItem("authToken", backendResponse.data.token);
        localStorage.setItem("refreshToken", backendResponse.data.refreshToken);
        localStorage.setItem("userRole", backendResponse.data.role);
      
        // Show success toast
        toast.success("Login successful!", {
            className: 'custom-toast'
        });
      
        // Redirect after successful login
        navigate('/admin-dashboard');
        
    } catch (error) {
        console.error("Google login failed:", error);
        localStorage.clear();
        
        // Default error message
        let errorMessage = "Login failed. Please try again.";
        
        if (error.response) {
            if (error.response.data) {
                if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } 
                else if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                }
            }
            
            // Specific error messages from backend
            if (errorMessage.includes("User not registered")) {
                errorMessage = "User not registered. Please contact your admin to create an account.";
            } else if (errorMessage.includes("not approved yet")) {
                errorMessage = "Your account is not approved yet. Please wait for approval.";
            } else if (errorMessage.includes("Google token verification failed")) {
                errorMessage = "Google authentication failed. Please try again.";
            } else if (errorMessage.includes("Google email not verified")) {
                errorMessage = "Your Google email is not verified. Please use a verified email.";
            }
        }

        toast.error(errorMessage, {
            className: 'custom-toast-error',
            autoClose: 5000
        });
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
          <div className="login-form-group">
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
          <div className="login-form-group">
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
              <span className="eye-toggle">{ToggleIcon}</span>
            </div>
          </div>
          <div className="form-footer">
            <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          </div>
          <Button label={loading ? "Logging in..." : "Login"} onClick={handleLogin} className="login-btn" disabled={loading} />
          <ToastContainer />
          <div className="divider">OR</div>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={(error) => console.error("Google login error:", error)}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
