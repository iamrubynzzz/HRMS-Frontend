import React from 'react';
import './adminPage.css';

const AdminWelcomePage = () => {
  return (
    <div className="admin-welcome-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">Admin Panel</div>
        <div className="sidebar-item">Dashboard</div>
        <div className="sidebar-item">Manage Users</div>
        <div className="sidebar-item">Settings</div>
        <div className="sidebar-footer">
          <p>Logged in as Admin</p>
          <a href="/logout">Logout</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-welcome-card">
        <div className="admin-header">
          <h1>Welcome, Admin</h1>
          <p className="welcome-text">You're logged in as Admin. Manage the system with ease!</p>
        </div>

        <div className="admin-main-content">
          {/* Dashboard Cards */}
          <div className="dashboard-card">
            <div className="card-icon">👤</div>
            <h3>Users</h3>
            <p>Manage users and their roles</p>
            <button className="card-btn">Go to Users</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Adjust system settings and preferences</p>
            <button className="card-btn">Go to Settings</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Reports</h3>
            <p>View system reports and analytics</p>
            <button className="card-btn">View Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWelcomePage;
