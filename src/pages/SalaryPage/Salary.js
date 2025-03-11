import React, { useState } from "react";
import "./Salary.css";

const Salary = () => {
  // Sample salary data (replace with API data)
  const [salaries, setSalaries] = useState([
    { id: 1, name: "John Doe", basic: 50000, bonus: 5000, deduction: 2000, net: 53000, status: "Pending" },
    { id: 2, name: "Jane Smith", basic: 60000, bonus: 4000, deduction: 3000, net: 61000, status: "Pending" },
  ]);

  const [selectedSalary, setSelectedSalary] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Handle salary release
  const handleRelease = (id) => {
    setSalaries((prevSalaries) =>
      prevSalaries.map((salary) =>
        salary.id === id ? { ...salary, status: "Paid" } : salary
      )
    );
    setShowModal(false);
  };

  return (
    <div className="salary-container">
      <h2>Admin Salary Review</h2>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Basic Salary</th>
            <th>Bonus</th>
            <th>Deductions</th>
            <th>Net Salary</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {salaries.map((salary) => (
            <tr key={salary.id}>
              <td>{salary.name}</td>
              <td>${salary.basic}</td>
              <td>${salary.bonus}</td>
              <td>${salary.deduction}</td>
              <td>${salary.net}</td>
              <td className={salary.status === "Paid" ? "paid" : "pending"}>{salary.status}</td>
              <td>
                {salary.status === "Pending" && (
                  <button className="release-btn" onClick={() => { setSelectedSalary(salary); setShowModal(true); }}>
                    Review & Release
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Salary Release</h3>
            <p>Are you sure you want to release the salary for {selectedSalary.name}?</p>
            <button className="confirm-btn" onClick={() => handleRelease(selectedSalary.id)}>Confirm</button>
            <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salary;