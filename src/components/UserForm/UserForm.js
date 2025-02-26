import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../../components/common/Button';
import './UserForm.css';

const UserForm = ({ initialValues, onSubmit, mode, onClose, errorMessage, setErrorMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    rfid: '',
    address: '',
    contact: '',
    dateOfBirth: '',
    gender: 'MALE',
    hireDate: '',
    salary: '',
    annualLeaveBalance: 0,
    sickLeaveBalance: 0,
    managerId: '',
    ...initialValues,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // Track touched fields

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialValues }));
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when the user types in a field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Clear the global error message when the user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true })); // Mark the field as touched
    validateField(name); // Validate the field when the user leaves it
  };

  const validateField = (fieldName) => {
    const value = formData[fieldName];
    let error = '';

    switch (fieldName) {
      case 'name':
        if (!value.trim()) error = 'Name is required.';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required.';
        break;
      case 'password':
        if (!value.trim() && mode === 'add') error = 'Password is required.';
        break;
      case 'rfid':
        if (!value.trim()) error = 'RFID is required.';
        break;
      case 'role':
        if (!value) error = 'Role is required.';
        break;
      case 'address':
        if (!value.trim()) error = 'Address is required.';
        break;
      case 'contact':
        if (!value.trim()) error = 'Contact is required.';
        break;
      case 'dateOfBirth':
        if (!value) error = 'Date of Birth is required.';
        break;
      case 'gender':
        if (!value) error = 'Gender is required.';
        break;
      case 'hireDate':
        if (!value) error = 'Hire Date is required.';
        break;
      case 'salary':
        if (!value || value <= 0) error = 'Salary must be a positive number.';
        break;
      case 'annualLeaveBalance':
        if (value < 0) error = 'Annual Leave Balance cannot be negative.';
        break;
      case 'sickLeaveBalance':
        if (value < 0) error = 'Sick Leave Balance cannot be negative.';
        break;
      case 'managerId':
        if (formData.role === 'EMPLOYEE' && !value) error = 'Manager ID is required for Employees.';
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach((fieldName) => {
      validateField(fieldName);
      if (errors[fieldName]) {
        newErrors[fieldName] = errors[fieldName];
      }
    });

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Clear the global error message before submission
    setErrorMessage('');
  
    // Validate the form
    const isValid = validateForm();
    if (!isValid) return; // Stop submission if there are errors
  
    try {
      console.log("==================111111111");
      await onSubmit(formData); // Call the onSubmit prop (handles API request)
      setErrorMessage(''); // Clear any remaining error message on success
    } catch (error) {
      console.log("==================111111111");
      console.log('Error caught in handleSubmit:', error); // Debugging
      if (error.response) {
        // Handle backend validation errors
        const { status, data } = error.response;
        console.log('Backend Error Response:', { status, data }); // Debugging
  
        if (status === 400) {
          // Handle BAD_REQUEST errors (e.g., missing leave balances)
          setErrors((prev) => ({
            ...prev,
            annualLeaveBalance: data.message.includes("Annual Leave Balance") ? data.message : '',
            sickLeaveBalance: data.message.includes("Sick Leave Balance") ? data.message : '',
          }));
        } else if (status === 403) {
          // Handle FORBIDDEN errors (e.g., invalid role)
          setErrors((prev) => ({
            ...prev,
            role: data.message,
          }));
        } else if (status === 404) {
          // Handle NOT_FOUND errors (e.g., manager not found)
          setErrors((prev) => ({
            ...prev,
            managerId: data.message,
          }));
        } else if (status === 409) {
          // Handle CONFLICT errors (e.g., RFID conflict)
          console.log('Setting RFID error:', data.message); // Debugging
          setErrors((prev) => ({
            ...prev,
            rfid: data.message, // Set the error message for the RFID field
          }));
          setTouched((prev) => ({ ...prev, rfid: true })); // Force display the error
        } else {
          // Handle other errors
          setErrorMessage(data.message || 'An unexpected error occurred. Please try again.');
        }
      } else {
        // Handle network or other errors
        setErrorMessage('An error occurred while submitting the form. Please check your connection.');
      }
    }
  };

  return (
    <div className="user-form-overlay">
      <div className="user-form-container">
        <form className="user-form" onSubmit={handleSubmit}>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {/* Name Field */}
          <div className="form-row">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.name ? 'error-input' : ''}
              aria-describedby="name-error"
            />
            {touched.name && errors.name && (
              <p id="name-error" className="error-message" aria-live="polite">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="form-row">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.email ? 'error-input' : ''}
              aria-describedby="email-error"
            />
            {touched.email && errors.email && (
              <p id="email-error" className="error-message" aria-live="polite">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field (only for add mode) */}
          {mode === 'add' && (
            <div className="form-row">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.password ? 'error-input' : ''}
                aria-describedby="password-error"
              />
              {touched.password && errors.password && (
                <p id="password-error" className="error-message" aria-live="polite">
                  {errors.password}
                </p>
              )}
            </div>
          )}

          {/* RFID Field */}
          <div className="form-row">
            <label htmlFor="rfid">RFID:</label>
            <input
              type="text"
              id="rfid"
              name="rfid"
              value={formData.rfid}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.rfid ? 'error-input' : ''}
              aria-describedby="rfid-error"
            />
            {touched.rfid && errors.rfid && (
              <p id="rfid-error" className="error-message" aria-live="polite">
                {errors.rfid}
              </p>
            )}
          </div>

          {/* Role Field */}
          <div className="form-row">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.role ? 'error-input' : ''}
              aria-describedby="role-error"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
            </select>
            {touched.role && errors.role && (
              <p id="role-error" className="error-message" aria-live="polite">
                {errors.role}
              </p>
            )}
          </div>

          {/* Salary Field */}
          <div className="form-row">
            <label htmlFor="salary">Salary:</label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.salary ? 'error-input' : ''}
              aria-describedby="salary-error"
            />
            {touched.salary && errors.salary && (
              <p id="salary-error" className="error-message" aria-live="polite">
                {errors.salary}
              </p>
            )}
          </div>

          {/* Annual Leave Balance Field */}
          <div className="form-row">
            <label htmlFor="annualLeaveBalance">Annual Leave Balance:</label>
            <input
              type="number"
              id="annualLeaveBalance"
              name="annualLeaveBalance"
              value={formData.annualLeaveBalance}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.annualLeaveBalance ? 'error-input' : ''}
              aria-describedby="annualLeaveBalance-error"
            />
            {touched.annualLeaveBalance && errors.annualLeaveBalance && (
              <p id="annualLeaveBalance-error" className="error-message" aria-live="polite">
                {errors.annualLeaveBalance}
              </p>
            )}
          </div>

          {/* Sick Leave Balance Field */}
          <div className="form-row">
            <label htmlFor="sickLeaveBalance">Sick Leave Balance:</label>
            <input
              type="number"
              id="sickLeaveBalance"
              name="sickLeaveBalance"
              value={formData.sickLeaveBalance}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.sickLeaveBalance ? 'error-input' : ''}
              aria-describedby="sickLeaveBalance-error"
            />
            {touched.sickLeaveBalance && errors.sickLeaveBalance && (
              <p id="sickLeaveBalance-error" className="error-message" aria-live="polite">
                {errors.sickLeaveBalance}
              </p>
            )}
          </div>

          {/* Manager ID Field */}
          <div className="form-row">
            <label htmlFor="managerId">Manager ID:</label>
            <input
              type="text"
              id="managerId"
              name="managerId"
              value={formData.managerId}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.managerId ? 'error-input' : ''}
              aria-describedby="managerId-error"
            />
            {touched.managerId && errors.managerId && (
              <p id="managerId-error" className="error-message" aria-live="polite">
                {errors.managerId}
              </p>
            )}
          </div>

          {/* Address Field */}
          <div className="form-row">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.address ? 'error-input' : ''}
              aria-describedby="address-error"
            />
            {touched.address && errors.address && (
              <p id="address-error" className="error-message" aria-live="polite">
                {errors.address}
              </p>
            )}
          </div>

          {/* Contact Field */}
          <div className="form-row">
            <label htmlFor="contact">Contact:</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.contact ? 'error-input' : ''}
              aria-describedby="contact-error"
            />
            {touched.contact && errors.contact && (
              <p id="contact-error" className="error-message" aria-live="polite">
                {errors.contact}
              </p>
            )}
          </div>

          {/* Date of Birth Field */}
          <div className="form-row">
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.dateOfBirth ? 'error-input' : ''}
              aria-describedby="dateOfBirth-error"
            />
            {touched.dateOfBirth && errors.dateOfBirth && (
              <p id="dateOfBirth-error" className="error-message" aria-live="polite">
                {errors.dateOfBirth}
              </p>
            )}
          </div>

          {/* Gender Field */}
          <div className="form-row">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.gender ? 'error-input' : ''}
              aria-describedby="gender-error"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {touched.gender && errors.gender && (
              <p id="gender-error" className="error-message" aria-live="polite">
                {errors.gender}
              </p>
            )}
          </div>

          {/* Hire Date Field */}
          <div className="form-row">
            <label htmlFor="hireDate">Hire Date:</label>
            <input
              type="date"
              id="hireDate"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.hireDate ? 'error-input' : ''}
              aria-describedby="hireDate-error"
            />
            {touched.hireDate && errors.hireDate && (
              <p id="hireDate-error" className="error-message" aria-live="polite">
                {errors.hireDate}
              </p>
            )}
          </div>

          {/* Form Buttons */}
          <div className="form-buttons">
            <Button label="Cancel" onClick={onClose} className="cancel-btn" />
            <Button
              label={mode === 'edit' ? 'Update User' : 'Create'}
              type="submit"
              className="create-btn"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;