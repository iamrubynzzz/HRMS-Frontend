import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../../components/common/Button';
import './UserForm.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserForm = ({ initialValues, onSubmit, mode, onClose, errorMessage, setErrorMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
    companyName: '',
    ...initialValues,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [companies, setCompanies] = useState([]); // State for company dropdown
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent double submission

  // Fetch companies for the dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('/api/companies'); // Adjust the API endpoint as needed
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error('Failed to fetch companies. Please try again.');
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialValues }));
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name);
  };

  const validateField = (fieldName) => {
    const value = formData[fieldName];
    let error = '';

    switch (fieldName) {
      case 'salary':
        if (!value || value <= 0) error = 'Salary must be a positive number.';
        break;
      case 'annualLeaveBalance':
        if (formData.role !== 'ADMIN' && value < 0) error = 'Annual Leave Balance cannot be negative.';
        break;
      case 'sickLeaveBalance':
        if (formData.role !== 'ADMIN' && value < 0) error = 'Sick Leave Balance cannot be negative.';
        break;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((fieldName) => {
      validateField(fieldName);
      if (errors[fieldName]) {
        newErrors[fieldName] = errors[fieldName];
      }
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);

    setErrorMessage('');

    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
      toast.success(`User ${mode === 'add' ? 'created' : 'updated'} successfully!`);
      onClose();
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrors((prev) => ({
            ...prev,
            annualLeaveBalance: data.message.includes("Annual Leave Balance") ? data.message : '',
            sickLeaveBalance: data.message.includes("Sick Leave Balance") ? data.message : '',
            managerId:
            (formData.role === 'EMPLOYEE' && data.message.includes("Manager ID")) ||
            (formData.role === 'MANAGER' && data.message.includes("Admin ID"))
              ? data.message
              : '',
           
          }));
        } else if (status === 403) {
          setErrors((prev) => ({
            ...prev,
            role: data.message,
          }));
        } else if (status === 404) {
          setErrors((prev) => ({
            ...prev,
            managerId: data.message,
          }));
        } else if (status === 409) {
          setErrors((prev) => ({
            ...prev,
            rfid: data.message,
          }));
        } else {
          setErrorMessage(data.message || 'An unexpected error occurred. Please try again.');
        }
      } else {
        setErrorMessage('An error occurred while submitting the form. Please check your connection.');
      }
    } finally {
      setIsSubmitting(false);
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
              required
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
              required
              className={errors.email ? 'error-input' : ''}
              aria-describedby="email-error"
            />
            {touched.email && errors.email && (
              <p id="email-error" className="error-message" aria-live="polite">
                {errors.email}
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
              required
              className={errors.role ? 'error-input' : ''}
              aria-describedby="role-error"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
            {touched.role && errors.role && (
              <p id="role-error" className="error-message" aria-live="polite">
                {errors.role}
              </p>
            )}
          </div>

          {/* Company Name Field (only for ADMIN role) */}
          {formData.role === 'ADMIN' && (
            <div className="form-row">
              <label htmlFor="companyName">Company Name:</label>
              <select
                id="companyName"
                name="companyName"
                value={formData.companyName}
                required
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.companyName ? 'error-input' : ''}
                aria-describedby="companyName-error"
              >
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>
              {touched.companyName && errors.companyName && (
                <p id="companyName-error" className="error-message" aria-live="polite">
                  {errors.companyName}
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
              required
              className={errors.rfid ? 'error-input' : ''}
              aria-describedby="rfid-error"
            />
            {touched.rfid && errors.rfid && (
              <p id="rfid-error" className="error-message" aria-live="polite">
                {errors.rfid}
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
              required
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
              required
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
              required
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
              required
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
              required
              className={errors.hireDate ? 'error-input' : ''}
              aria-describedby="hireDate-error"
            />
            {touched.hireDate && errors.hireDate && (
              <p id="hireDate-error" className="error-message" aria-live="polite">
                {errors.hireDate}
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
              required
              className={errors.salary ? 'error-input' : ''}
              aria-describedby="salary-error"
            />
            {touched.salary && errors.salary && (
              <p id="salary-error" className="error-message" aria-live="polite">
                {errors.salary}
              </p>
            )}
          </div>

          {/* Annual Leave Balance Field (only for EMPLOYEE and MANAGER roles) */}
          {formData.role !== 'ADMIN' && (
            <div className="form-row">
              <label htmlFor="annualLeaveBalance">Annual Leave Balance:</label>
              <input
                type="number"
                id="annualLeaveBalance"
                name="annualLeaveBalance"
                value={formData.annualLeaveBalance}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={errors.annualLeaveBalance ? 'error-input' : ''}
                aria-describedby="annualLeaveBalance-error"
              />
              {touched.annualLeaveBalance && errors.annualLeaveBalance && (
                <p id="annualLeaveBalance-error" className="error-message" aria-live="polite">
                  {errors.annualLeaveBalance}
                </p>
              )}
            </div>
          )}

          {/* Sick Leave Balance Field (only for EMPLOYEE and MANAGER roles) */}
          {formData.role !== 'ADMIN' && (
            <div className="form-row">
              <label htmlFor="sickLeaveBalance">Sick Leave Balance:</label>
              <input
                type="number"
                id="sickLeaveBalance"
                name="sickLeaveBalance"
                value={formData.sickLeaveBalance}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={errors.sickLeaveBalance ? 'error-input' : ''}
                aria-describedby="sickLeaveBalance-error"
              />
              {touched.sickLeaveBalance && errors.sickLeaveBalance && (
                <p id="sickLeaveBalance-error" className="error-message" aria-live="polite">
                  {errors.sickLeaveBalance}
                </p>
              )}
            </div>
          )}

          {/* Manager ID Field (for Employee and Manager roles) */}
          {formData.role !== 'ADMIN' && (
            <div className="form-row">
              <label htmlFor="managerId">Manager ID:</label>
              <input
                type="text"
                id="managerId"
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={errors.managerId ? 'error-input' : ''}
                aria-describedby="managerId-error"
              />
              {touched.managerId && errors.managerId && (
                <p id="managerId-error" className="error-message" aria-live="polite">
                  {errors.managerId}
                </p>
              )}
            </div>
          )}

          {/* Form Buttons */}
          <div className="form-buttons">
            <Button label="Cancel" onClick={onClose} className="cancel-btn" />
            <Button
              label={mode === 'edit' ? 'Update' : 'Create'}
              type="submit"
              className="create-btn"
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;