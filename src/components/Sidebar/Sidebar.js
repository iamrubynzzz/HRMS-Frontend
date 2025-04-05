import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaThLarge, FaUsers, FaCalendarCheck, FaFileInvoiceDollar, FaRegCalendarCheck, FaTasks, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ setActiveSection }) => {
  const [active, setActive] = useState('dashboard'); 
  const navigate = useNavigate();
  const [activeSubSection, setActiveSubSection] = useState(null);
  const [showApprovalsSubItems, setShowApprovalsSubItems] = useState(false);
  const [showAttendanceSubItems, setShowAttendanceSubItems] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Get user role from localStorage or your auth context
  const userRole = localStorage.getItem('userRole') || 'employee'; // Default to 'employee' if not found

  const handleSectionClick = (section) => {
    if (section === 'approvals') {
      setShowApprovalsSubItems(!showApprovalsSubItems);
      setShowAttendanceSubItems(false);
    } else if (section === 'attendance') {
      setShowAttendanceSubItems(!showAttendanceSubItems);
      setShowApprovalsSubItems(false);
      setActiveSubSection('byDate');
      setActive(section);
      setActiveSection('byDate');
    } else {
      setShowApprovalsSubItems(false);
      setShowAttendanceSubItems(false);
      setActive(section);
      setActiveSubSection(null);
      setActiveSection(section);
    }
  };

  const handleSubSectionClick = (subSection) => {
    setActiveSubSection(subSection);
    setActiveSection(subSection);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        await fetch('/api/v1/auth/logout', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }

      localStorage.clear();
      setTimeout(() => navigate('/login'), 1500);
      
    } catch (error) {
      console.error('Error logging out:', error);
      localStorage.clear();
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  // Check if user is admin or manager
  const shouldShowUsers = ['admin', 'manager'].includes(userRole.toLowerCase());

  return (
    <div className="sidebar-container">
      <div className="sidebar-items">
        <SidebarItem 
          icon={<FaThLarge />} 
          label="Dashboard" 
          active={active === 'dashboard'} 
          onClick={() => handleSectionClick('dashboard')} 
        />
        
        {/* Conditionally render Users item */}
        {shouldShowUsers && (
          <SidebarItem 
            icon={<FaUsers />} 
            label="Users" 
            active={active === 'users'} 
            onClick={() => handleSectionClick('users')} 
          />
        )}
        
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

        <SidebarItem 
          icon={<FaTasks/>} 
          label="Settings" 
          active={active === 'settings'} 
          onClick={() => handleSectionClick('settings')} 
        />
      </div>

      <div className="sidebar-logout">
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" /> Logout
        </button>
      </div>

      {isLoggingOut && (
        <div className="logout-overlay">
          <div className="logout-spinner"></div>
          <div className="logout-message">Logging out...</div>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <div className={`sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>
    <span className="sidebar-icon">{icon}</span>
    {label}
  </div>
);

const SidebarSubItem = ({ label, active, onClick }) => (
  <div className={`sidebar-sub-item ${active ? 'active' : ''}`} onClick={onClick}>
    {label}
  </div>
);

export default Sidebar;