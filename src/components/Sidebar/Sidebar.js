import React, { useState } from 'react';
import { FaThLarge, FaUsers, FaCalendarCheck, FaFileInvoiceDollar, FaRegCalendarCheck, FaTasks } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ setActiveSection }) => {
  const [active, setActive] = useState('dashboard'); 
  const [activeSubSection, setActiveSubSection] = useState(null);
  const [showApprovalsSubItems, setShowApprovalsSubItems] = useState(false);
  const [showAttendanceSubItems, setShowAttendanceSubItems] = useState(false);

  // Inside Sidebar component, modify handleSectionClick
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