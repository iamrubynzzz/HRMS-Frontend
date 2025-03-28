import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';  
import SignupPage from './pages/signUp/SignupPage';
import AdminWelcomePage from "./pages/dashboard/AdminDashboard";
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ForgotPassword/ResetPassword ";
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import the provider

const App = () => {
  return (
    <GoogleOAuthProvider clientId="777107196271-smequh3mvjhb5m7ttkovqcepdqau55i8.apps.googleusercontent.com">
      <Router>
        <Routes>
          {/* Route for the homepage */}
          <Route path="/" element={<h1>Welcome to the Home Page</h1>} />
          
          {/* Route for the login page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Route for the signup page */}
          <Route path="/signup" element={<SignupPage />} />

          {/* Route for the welcome page */}
          <Route path="/admin-dashboard" element={<AdminWelcomePage />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
