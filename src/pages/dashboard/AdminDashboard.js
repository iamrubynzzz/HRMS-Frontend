import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Header from '../../components/header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import AttendancePage from '../../pages/AttendancePage/Attendance';
import UserPage from '../../pages/UserManagement/Users';
import RequestPage from '../Request/RequestPage';
import LeavePage from '../LeavePage/Leave';
import SalaryPage from '../SalaryPage/Salary';
import Settings from '../Settings/Settings';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [employeeStats, setEmployeeStats] = useState({
    totalEmployees: 0,
    totalMale: 0,
    totalFemale: 0,
  });
  const [attendanceStats, setAttendanceStats] = useState({
    Present: 0,
    Absent: 0,
    Leave: 0,
  });
  const [salaryOverview, setSalaryOverview] = useState({
    totalSalaries: 0,
    pendingPayments: 0,
    totalDeductions: 0,
  });

  const token = localStorage.getItem('authToken');

  // Fetch employee stats
  const fetchEmployeeStats = async () => {
    try {
      const response = await fetch('/api/v1/user/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch employee stats');
      const data = await response.json();
      setEmployeeStats(data);
    } catch (error) {
      console.error('Error fetching employee stats:', error);
    }
  };

  // Fetch attendance stats
  const fetchAttendanceStats = async () => {
    try {
      const response = await fetch('/api/attendance/stats/today', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch attendance stats');
      const data = await response.json();
      setAttendanceStats(data);
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
    }
  };

  // Fetch salary overview
  const fetchSalaryOverview = async () => {
    try {
      const response = await fetch('/api/v1/salaries/overview', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch salary overview');
      const data = await response.json();
      setSalaryOverview(data);
    } catch (error) {
      console.error('Error fetching salary overview:', error);
    }
  };

  // Fetch data only once when the component mounts
  useEffect(() => {
    fetchEmployeeStats();
    fetchAttendanceStats();
    fetchSalaryOverview();
  }, [token]);

  // Format data for the pie chart
  const pieChartData = [
    { name: 'Present', value: attendanceStats.Present },
    { name: 'Absent', value: attendanceStats.Absent },
    { name: 'Leave', value: attendanceStats.Leave },
  ];

  // Format data for the bar graph
  const barGraphData = [
    { name: 'Released Salaries', amount: salaryOverview.totalSalaries },
    { name: 'Pending Payments', amount: salaryOverview.pendingPayments },
    { name: 'Deductions', amount: salaryOverview.totalDeductions },
  ];

  // Colors for the pie chart
  const COLORS = ['#7F9A49', '#9E403E', '#406A9C'];

  return (
    <div className="admin-dashboard">
      <Header />
      <div className="main-content">
        <Sidebar setActiveSection={setActiveSection} />
        <div className="content">
          {activeSection === 'dashboard' && (
            <>
              <div className="stats-cards">
                <StatCard label="Total Employees" value={employeeStats.totalEmployees} />
                <StatCard label="Total Male" value={employeeStats.totalMale} />
                <StatCard label="Total Female" value={employeeStats.totalFemale} />
              </div>
              <div className="charts-container">
                <div className="pie-chart-container">
                  <h3>Today's Attendance Status</h3>
                  <PieChart width={450} height={400} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
                      paddingAngle={5}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" align="centre" verticalAlign="middle" />
                  </PieChart>
                </div>
                <div className="bar-chart-container">
                  <h3>Salary Overview (in NPR)</h3>
                  <BarChart
                    width={500}
                    height={400}
                    data={barGraphData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </div>
              </div>
            </>
          )}
          {activeSection === 'byDate' && <AttendancePage activeSubSection="byDate" />}
          {activeSection === 'byRange' && <AttendancePage activeSubSection="byRange" />}
          {activeSection === 'byStatus' && <AttendancePage activeSubSection="byStatus" />}
          {activeSection === 'users' && <UserPage />}
          {activeSection === 'request' && <RequestPage />}
          {activeSection === 'leave' && <LeavePage />}
          {activeSection === 'payroll' && <SalaryPage />}
          {activeSection === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => {
  return (
    <div className="stat-card">
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  );
};

export default AdminDashboard;