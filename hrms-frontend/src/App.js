import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';  
import SignupPage from './pages/signUp/SignupPage'
import AdminWelcomePage from "./pages/dashboard/admin-dashboard";

const App = () => {
  return (
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
      </Routes>
    </Router>
  );
};

export default App;
