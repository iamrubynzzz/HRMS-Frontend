import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaThLarge, FaUsers, FaCalendarCheck, FaFileInvoiceDollar, FaRegCalendarCheck, FaTasks,FaSignOutAlt  } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ setActiveSection }) => {
  const [active, setActive] = useState('dashboard'); 
  const navigate = useNavigate();
  const [activeSubSection, setActiveSubSection] = useState(null);
  const [showApprovalsSubItems, setShowApprovalsSubItems] = useState(false);
  const [showAttendanceSubItems, setShowAttendanceSubItems] = useState(false);

const handleSectionClick = (section) => {
  if (section === 'approvals') {
    setShowApprovalsSubItems(!showApprovalsSubItems);
    setShowAttendanceSubItems(false); // Hide Attendance sub-items
  } else if (section === 'attendance') {
    setShowAttendanceSubItems(!showAttendanceSubItems);
    setShowApprovalsSubItems(false); // Hide Approvals sub-items
    // Set default sub-section (e.g., byDate) when attendance is clicked
    setActiveSubSection('byDate');
    setActive(section);
    setActiveSection('byDate'); // Set the active section to the default sub-section
  } else {
    setShowApprovalsSubItems(false);
    setShowAttendanceSubItems(false);
    setActive(section);
    setActiveSubSection(null); // Reset sub-section
    setActiveSection(section);
  }
};

  const handleSubSectionClick = (subSection) => {
    setActiveSubSection(subSection);
    setActiveSection(subSection);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Get token from local storage
      const response = await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('token'); // Remove token from local storage
        navigate('/login'); // Redirect to login page
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-items">
        <SidebarItem 
          icon={<FaThLarge />} 
          label="Dashboard" 
          active={active === 'dashboard'} 
          onClick={() => handleSectionClick('dashboard')} 
        />
        <SidebarItem 
          icon={<FaUsers />} 
          label="Users" 
          active={active === 'users'} 
          onClick={() => handleSectionClick('users')} 
        />

        {/* Attendance Section */}
        <SidebarItem 
          icon={<FaCalendarCheck />} 
          label="Attendance" 
          active={active === 'attendance'} 
          onClick={() => handleSectionClick('attendance')} 
        />

        <SidebarItem 
          icon={<FaFileInvoiceDollar />} 
          label="Payroll" 
          active={active === 'payroll'} 
          onClick={() => handleSectionClick('payroll')} 
        />
        <SidebarItem 
          icon={<FaRegCalendarCheck />} 
          label="Leave" 
          active={active === 'leave'} 
          onClick={() => handleSectionClick('leave')} 
        />
        <SidebarItem 
          icon={<FaTasks/>} 
          label="Request" 
          active={active === 'request'} 
          onClick={() => handleSectionClick('request')} 
        />
      </div>

      {/* Logout Button */}
      <div className="sidebar-logout">
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" /> Logout
        </button>
      </div>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, active, onClick }) => (
  <div className={`sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>
    <span className="sidebar-icon">{icon}</span>
    {label}
  </div>
);

// Sidebar Sub-Item Component
const SidebarSubItem = ({ label, active, onClick }) => (
  <div className={`sidebar-sub-item ${active ? 'active' : ''}`} onClick={onClick}>
    {label}
  </div>
);

export default Sidebar;