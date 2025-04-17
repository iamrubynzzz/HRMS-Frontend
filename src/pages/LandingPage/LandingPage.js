import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import Logo from "../../assets/logo2.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <img src={Logo} alt="logo" className="header-logo" />
          <h1 className="logo">Flourish HR Automation</h1>
          <button className="login-button" onClick={handleLoginClick}>Login</button>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <h2>Streamline Your Human Resources</h2>
            <p>Manage employees, payroll, attendance, and more with our comprehensive HRMS solution.</p>
            <div className="cta-buttons">
              <button className="primary-btn" onClick={handleLoginClick}>Get Started</button>
              <button className="secondary-btn">Learn More</button>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://via.placeholder.com/600x400" alt="HRMS Dashboard Preview" />
          </div>
        </section>

        <section className="features-section">
          <h3>Key Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h4>Employee Management</h4>
              <p>Centralize all employee data in one secure location.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h4>Payroll Processing</h4>
              <p>Automate payroll calculations and tax deductions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏱️</div>
              <h4>Attendance Tracking</h4>
              <p>Monitor employee attendance and working hours.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h4>Performance Analytics</h4>
              <p>Generate reports and insights on employee performance.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} HRMS Pro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;