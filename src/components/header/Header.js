import React from 'react';
import './Header.css'
const Header = () => {
  return (
    <div className="header-container">
      <header className="header">
        <div className="header-logo-container">
          <img src="null" alt="" className="header-logo" />
          <h1 className="header-company-name">Flourish HR Automation</h1>
        </div>
        <div className="header-search-container">
          <div className="header-search-box">
            <input type="text" placeholder="Search..." className="header-search-input" />
            <button className="header-search-btn">🔍</button>
          </div>
        </div>
        <div className="header-notification-icon">🔔</div>
      </header>
    </div>
  );
};

export default Header;
