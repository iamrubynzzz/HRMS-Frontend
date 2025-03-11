import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import AttendancePage from '../../pages/AttendancePage/Attendance';
import UserPage from '../../pages/UserManagement/Users';
import RequestPage from '../Request/RequestPage';
import LeavePage from '../LeavePage/Leave';
import SalaryPage from '../SalaryPage/Salary'
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="admin-dashboard">
      <Header />
      <div className="main-content">
        <Sidebar setActiveSection={setActiveSection} />
        <div className="content">
          {activeSection === 'byDate' && <AttendancePage activeSubSection="byDate" />}
          {activeSection === 'byRange' && <AttendancePage activeSubSection="byRange" />}
          {activeSection === 'byStatus' && <AttendancePage activeSubSection="byStatus" />}
          {activeSection === 'users' && <UserPage />}
          {activeSection === 'request' && <RequestPage />}
          {activeSection === 'leave' && <LeavePage />}
          {activeSection === 'salary' && <SalaryPage />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;