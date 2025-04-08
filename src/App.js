import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';  
import AdminWelcomePage from "./pages/dashboard/AdminDashboard";
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ForgotPassword/ResetPassword ";
import Settings from "./pages/Settings/Settings";
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import ProtectedRoute from './routes/ProtectedRoute'; 

const App = () => {
  return (
    <GoogleOAuthProvider clientId="777107196271-smequh3mvjhb5m7ttkovqcepdqau55i8.apps.googleusercontent.com">
      <Router>
        <Routes>
          {/* Route for the homepage */}
          <Route path="/" element={<h1>Welcome to the Home Page</h1>} />
          
          {/* Route for the login page */}
          <Route path="/login" element={<LoginPage />} />

           {/* Protected route for the admin dashboard, accessible by Admin, Manager, Employee, and Super Admin */}
           <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE']}>
                <AdminWelcomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE']}>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
