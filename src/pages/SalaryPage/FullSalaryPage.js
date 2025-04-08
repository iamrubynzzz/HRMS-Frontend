// SalaryPage.js
import React from 'react';
import EmployeeSalary from './EmployeeSalary';
import ManagerSalary from './ManagerSalary';
import AdminSalary from './Salary'; // Your existing admin component

const SalaryPage = () => {
  const userRole = localStorage.getItem('userRole')?.toLowerCase(); // Convert to lowercase
  
  switch(userRole) {
    case 'admin':
      return <AdminSalary />;
    case 'manager':
      return <ManagerSalary />;
    case 'employee':
      return <EmployeeSalary />;
    default:
      return <div>Unauthorized - Please contact HR</div>;
  }
};

export default SalaryPage;