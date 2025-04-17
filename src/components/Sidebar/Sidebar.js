import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaThLarge, FaUsers, FaCalendarCheck, FaFileInvoiceDollar, FaRegCalendarCheck, FaTasks, FaSignOutAlt,FaBuilding  } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ setActiveSection }) => {
  const [active, setActive] = useState('dashboard'); 
  const navigate = useNavigate();
  const [activeSubSection, setActiveSubSection] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showRequestSubItems, setShowRequestSubItems] = useState(false);
  const [showApprovalsSubItems, setShowApprovalsSubItems] = useState(false);
  const [showAttendanceSubItems, setShowAttendanceSubItems] = useState(false);
  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole') || 'employee';
  const isSuperAdmin = userRole.toLowerCase() === 'super_admin';
  const isManager = userRole.toLowerCase() === 'manager';
 
  const handleSectionClick = (section) => {
    // Reset all active states first
    setActive(section);
    setActiveSubSection(null);
    setShowApprovalsSubItems(false);
    setShowAttendanceSubItems(false);
    
    if (section === 'request') {
      if (isManager) {
        setShowRequestSubItems(!showRequestSubItems);
        // Default to 'my-request' when first clicking
        if (!showRequestSubItems) {
          setActiveSubSection('my-request');
          setActiveSection('my-request');
        }
      } else {
        setActiveSection(section);
      }
    } else {
      setShowRequestSubItems(false);
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

  // Check if user is admin or manager (for regular users)
  const shouldShowUsers = ['admin', 'manager', 'super_admin'].includes(userRole.toLowerCase());

  return (
    <div className="sidebar-container">
      <div className="sidebar-items">
        {isSuperAdmin ? (
          <>
            <SidebarItem 
              icon={<FaBuilding />} 
              label="Company" 
              active={active === 'company'} 
              onClick={() => handleSectionClick('company')} 
            />
            <SidebarItem 
              icon={<FaUsers />} 
              label="Users" 
              active={active === 'users'} 
              onClick={() => handleSectionClick('users')} 
            />
          </>
        ) : (
          <>
            <SidebarItem 
              icon={<FaThLarge />} 
              label="Dashboard" 
              active={active === 'dashboard'} 
              onClick={() => handleSectionClick('dashboard')} 
            />
  
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
              icon={<FaTasks />} 
              label="Request" 
              active={active === 'request' || activeSubSection === 'my-request' || activeSubSection === 'teams-request'} 
              onClick={() => handleSectionClick('request')} 
            />
            {isManager && showRequestSubItems && (
              <div className="sidebar-sub-items">
                <SidebarSubItem 
                  label="My Requests" 
                  active={activeSubSection === 'my-request'} 
                  onClick={() => handleSubSectionClick('my-request')} 
                />
                <SidebarSubItem 
                  label="Teams Requests" 
                  active={activeSubSection === 'teams-request'} 
                  onClick={() => handleSubSectionClick('teams-request')} 
                />
              </div>
            )}
            <SidebarItem 
              icon={<FaTasks />} 
              label="Settings" 
              active={active === 'settings'} 
              onClick={() => handleSectionClick('settings')} 
            />
          </>
        )}
      </div>
    </div>
  );
}  

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