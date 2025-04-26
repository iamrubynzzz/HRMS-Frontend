import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import Logo from "../../assets/logo3.png";
import DashboardPreview from "../../assets/Dashboard1.png";
import EmployeePreview from "../../assets/Dashboard2.png";
import Dashboard from "../../assets/Dashboard.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="landing-page">
      {/* Header Section */}
      <header className="landing-header">
        <div className="landing-header-container">
          <div className="landing-header-content">
            <img src={Logo} alt="Flourish HR Logo" className="landing-header-logo" />
            <div className="h1">Flourish HR Automation</div>
            <button className="login-button" onClick={handleLoginClick}>
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h2 className="hero-tagline">Easy & Affordable</h2>
          <h1 className="hero-title">Smart Attendance, HR & Payroll for Growing Teams</h1>
          <p className="hero-subtext">
            Trusted by small and medium-sized businesses to simplify workforce management — Empower your team with Flourish HR.
          </p>
          
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="dashboard-preview">
        <div className="container">
          <div className="preview-headings">
            <div className="preview-heading">
              <span className="heading-background">Dashboard</span>
            </div>
            <div className="preview-heading">
              <span className="heading-background">Employee Records</span>
            </div>
          </div>

          <div className="dashboard-images">
            <img src={DashboardPreview} alt="Dashboard Preview 1" className="dashboard-img" />
            <img src={EmployeePreview} alt="Dashboard Preview 2" className="dashboard-img" />
          </div>
        </div>
      </section>

              {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="container">
            <h2 className="section-title">Check what our Clients are Saying</h2>
            <p className="section-subtext">
              See how Flourish HR is transforming HR processes for businesses like yours.
            </p>
            <div className="testimonials-slider">
              {/* Testimonial 1 */}
              <div className="testimonial-card">
                <img src="https://gohire.io/hubfs/Top%20HR%20Tools%20Every%20HR%20Manager%20Should%20Know.png" alt="Client 1" className="client-img" />
                <p className="client-feedback">
                  "Flourish HR has made our payroll process so much easier and faster!"
                </p>
                <p className="client-name">– Sarah P., HR Manager</p>
              </div>

              {/* Testimonial 2 */}
              <div className="testimonial-card">
                <img src="https://static.vecteezy.com/system/resources/previews/029/891/975/non_2x/business-american-man-in-light-cream-ai-generative-free-photo.jpg" alt="Client 2" className="client-img" />
                <p className="client-feedback">
                  "Managing attendance has never been this smooth. Great product!"
                </p>
                <p className="client-name">– James L., CEO</p>
              </div>

              {/* Testimonial 3 */}
              <div className="testimonial-card">
                <img src="https://lthumb.lisimg.com/408/16639408.jpg?width=280&sharpen=true" alt="Client 3" className="client-img" />
                <p className="client-feedback">
                  "Leave approvals are now super quick with Flourish HR."
                </p>
                <p className="client-name">– Priya S., HR Officer</p>
              </div>

              {/* Testimonial 4 */}
              <div className="testimonial-card">
                <img src="https://i.pinimg.com/736x/25/c8/63/25c863ac34031fa4f2c84e351192b1b7.jpg" alt="Client 4" className="client-img" />
                <p className="client-feedback">
                  "A very user-friendly HRMS. Our team loves it!"
                </p>
                <p className="client-name">– Daniel M., COO</p>
              </div>

              {/* Testimonial 5 */}
              <div className="testimonial-card">
                <img src="https://i.pinimg.com/736x/bf/96/7f/bf967f57fb111c244209000e5f8b61f8.jpg" alt="Client 5" className="client-img" />
                <p className="client-feedback">
                  "Payroll reports are accurate and fast now. Thank you!"
                </p>
                <p className="client-name">– Dew Jsu., Finance Lead</p>
              </div>
            </div>
          </div>
        </section>


       {/* Features Section */}
          <section className="features-section">
            <div className="container features-container">
              {/* Left Side */}
              <div className="features-left">
                <h2 className="features-title">Powerful Features for Modern HR Management</h2>
                <p className="features-description">
                  Flourish HR brings all-in-one solutions to handle your HR operations with ease.
                  From attendance tracking to payroll, we help you manage your workforce effortlessly.
                </p>
                <img src={Dashboard} alt="Feature Illustration" className="features-image" />
              </div>

              {/* Right Side */}
              <div className="features-right">
                <div className="feature-item">
                  <i className="fas fa-user-tie feature-icon"></i>
                  <div>
                    <h4 className="feature-name">Employee Record Management</h4>
                    <p className="feature-text">Store and manage employee records securely and efficiently.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <i className="fas fa-clock feature-icon"></i>
                  <div>
                    <h4 className="feature-name">Attendance Tracking</h4>
                    <p className="feature-text">Track employee attendance with RFID and mobile integration.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <i className="fas fa-money-bill-wave feature-icon"></i>
                  <div>
                    <h4 className="feature-name">Payroll Management</h4>
                    <p className="feature-text">Automate payroll calculations and simplify salary releases.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <i className="fas fa-calendar-check feature-icon"></i>
                  <div>
                    <h4 className="feature-name">Leave Management</h4>
                    <p className="feature-text">Manage leave requests, approvals, and balances efficiently.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <i className="fas fa-chart-line feature-icon"></i>
                  <div>
                    <h4 className="feature-name">Reports and Analytics</h4>
                    <p className="feature-text">Generate insightful reports for better HR decision-making.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <i className="fas fa-shield-alt feature-icon"></i>
                  <div>
                    <h4 className="feature-name">Secure Access Control</h4>
                    <p className="feature-text">Role-based access to protect sensitive HR data and workflows.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

                {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="container">
            <h2 className="section-title">WHAT'S THE FUNCTION</h2>
            <p className="section-subtext">Let's see how it works</p>

            <div className="steps-row">
              {/* Step 1 */}
              <div className="step-card">
                <div className="step-number">01</div>
                <h4 className="step-title">Contact Support</h4>
                <p className="step-description">Reach out to our support team to get started easily.</p>
              </div>

              {/* Step 2 */}
              <div className="step-card">
                <div className="step-number">02</div>
                <h4 className="step-title">Get Your Demo</h4>
                <p className="step-description">Schedule a free demo to explore all features live.</p>
              </div>

              {/* Step 3 */}
              <div className="step-card">
                <div className="step-number">03</div>
                <h4 className="step-title">Implement System</h4>
                <p className="step-description">We assist you in setting up the system smoothly.</p>
              </div>

              {/* Step 4 */}
              <div className="step-card">
                <div className="step-number">04</div>
                <h4 className="step-title">Update Data</h4>
                <p className="step-description">Upload your organization data and go live.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
          <section className="contact-section">
            <div className="container">
              <h2 className="section-title">Contact</h2>
              <p className="section-subtext">Let's talk and solve your problems</p>
              <p className="contact-description">
                We’re here to help and answer any question you might have. We look forward to hearing from you.
              </p>

              <div className="contact-info-grid">
                <div className="contact-info-item">
                  <h4>Location</h4>
                  <p>Kathmandu, Nepal | Sankhu, Nepal</p>
                </div>

                <div className="contact-info-item">
                  <h4>Phone</h4>
                  <p>+977-9843031853</p>
                </div>

                <div className="contact-info-item">
                  <h4>Email</h4>
                  <p>flourishhr07@gmail.com</p>
                </div>
              </div>
            </div>
          </section>


          {/* FAQ Section */}
              <section className="faq-section">
                <div className="container">
                  <h2 className="section-title">Frequently Asked Questions</h2>
                  <p className="section-subtext">Find answers to common queries about Flourish HR.</p>

                  <div className="faq-list">
                    {/* FAQ Item 1 */}
                    <details className="faq-item">
                      <summary>How can Flourish HR help my business?</summary>
                      <p>
                        Flourish HR streamlines attendance, payroll, leave management, and overall HR processes to save you time and effort.
                      </p>
                    </details>
                    <hr className="faq-divider" />

                    {/* FAQ Item 2 */}
                    <details className="faq-item">
                      <summary>Is Flourish HR customizable for my company's needs?</summary>
                      <p>
                        Yes! We offer customization options to fit your organization’s specific HR policies and workflows.
                      </p>
                    </details>
                    <hr className="faq-divider" />

                    {/* FAQ Item 3 */}
                    <details className="faq-item">
                      <summary>Can I manage multiple companies with Flourish HR?</summary>
                      <p>
                        Absolutely. Flourish HR supports managing multiple companies with separate admins and employees.
                      </p>
                    </details>
                    <hr className="faq-divider" />

                    {/* FAQ Item 4 */}
                    <details className="faq-item">
                      <summary>Does Flourish HR support biometric attendance?</summary>
                      <p>
                      Flourish HR is based on RFID technology for accurate attendance tracking, ensuring reliability and ease of use.
                      </p>
                    </details>
                    <hr className="faq-divider" />

                    {/* FAQ Item 5 */}
                    <details className="faq-item">
                      <summary>Is there customer support if I face any issues?</summary>
                      <p>
                        Definitely! Our support team is always ready to help you with any queries or technical support you need.
                      </p>
                    </details>
                  </div>
                </div>
              </section>

        {/* Footer Section */}
{/* Footer Section */}
<footer className="footer">
  <div className="container footer-container">
    <div className="footer-left">
      <img
        src={Logo}
        alt="Flourish HR Logo"
        className="footer-logo"
      />
      <p className="footer-company-desc">
        Flourish HR is a modern cloud-based HRMS solution designed for SMEs to simplify payroll, attendance, and leave management.
      </p>
    </div>
    <div className="footer-center">
      <h4>Contact Us</h4>
      <p>Location: Kathmandu, Nepal | Sankhu, Nepal</p>
      <p>Phone: +977-9843031853</p>
      <p>Email: flourishhr07@gmail.com</p>
    </div>
    <div className="footer-right">
    <img
        src="https://cdn.pixabay.com/photo/2017/10/24/16/52/flag-2885282_1280.png"
        alt="Flourish HR Logo"
        className="footer-image"
      />
      <p> Made in Nepal</p>
    </div>
  </div>
  <div className="footer-bottom">
    <p>© {new Date().getFullYear()} Flourish HR. All rights reserved.</p>
  </div>
</footer>


    </div>
  );
};

export default LandingPage;
