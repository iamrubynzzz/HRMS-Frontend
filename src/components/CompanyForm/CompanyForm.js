import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../../components/common/Button';
import './CompanyForm.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompanyForm = ({ initialValues, onSubmit, mode, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    industryType: '',
    registrationNumber: '',
    establishedDate: '',
    ...initialValues,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialValues }));
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
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
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address.';
        }
        break;
      case 'website':
        if (value && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value)) {
          error = 'Please enter a valid website URL.';
        }
        break;
      case 'phone':
        if (!/^[0-9]{10,15}$/.test(value)) {
          error = 'Please enter a valid phone number (10-15 digits).';
        }
        break;
      case 'establishedDate':
        if (value && new Date(value) > new Date()) {
          error = 'Established date cannot be in the future.';
        }
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

    if (isSubmitting) return;
    setIsSubmitting(true);

    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
      toast.success(`Company ${mode === 'add' ? 'created' : 'updated'} successfully!`);
      onClose();
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrors((prev) => ({
            ...prev,
            ...data.errors,
          }));
        } else if (status === 409) {
          setErrors((prev) => ({
            ...prev,
            name: data.message.includes("name") ? data.message : '',
            registrationNumber: data.message.includes("registration") ? data.message : '',
          }));
        } else {
          toast.error(data.message || 'An unexpected error occurred. Please try again.');
        }
      } else {
        toast.error('An error occurred while submitting the form. Please check your connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="company-form-overlay">
      <div className="company-form-container">
        <form className="company-form" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="form-row">
            <label htmlFor="name">Company Name:</label>
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

          {/* Phone Field */}
          <div className="form-row">
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={errors.phone ? 'error-input' : ''}
              aria-describedby="phone-error"
            />
            {touched.phone && errors.phone && (
              <p id="phone-error" className="error-message" aria-live="polite">
                {errors.phone}
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

          {/* Website Field */}
          <div className="form-row">
            <label htmlFor="website">Website:</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.website ? 'error-input' : ''}
              aria-describedby="website-error"
            />
            {touched.website && errors.website && (
              <p id="website-error" className="error-message" aria-live="polite">
                {errors.website}
              </p>
            )}
          </div>

          {/* Industry Type Field */}
          <div className="form-row">
            <label htmlFor="industryType">Industry Type:</label>
            <input
              type="text"
              id="industryType"
              name="industryType"
              value={formData.industryType}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={errors.industryType ? 'error-input' : ''}
              aria-describedby="industryType-error"
            />
            {touched.industryType && errors.industryType && (
              <p id="industryType-error" className="error-message" aria-live="polite">
                {errors.industryType}
              </p>
            )}
          </div>

          {/* Registration Number Field */}
          <div className="form-row">
            <label htmlFor="registrationNumber">Registration Number:</label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={errors.registrationNumber ? 'error-input' : ''}
              aria-describedby="registrationNumber-error"
            />
            {touched.registrationNumber && errors.registrationNumber && (
              <p id="registrationNumber-error" className="error-message" aria-live="polite">
                {errors.registrationNumber}
              </p>
            )}
          </div>

          {/* Established Date Field */}
          <div className="form-row">
            <label htmlFor="establishedDate">Established Date:</label>
            <input
              type="date"
              id="establishedDate"
              name="establishedDate"
              value={formData.establishedDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.establishedDate ? 'error-input' : ''}
              aria-describedby="establishedDate-error"
            />
            {touched.establishedDate && errors.establishedDate && (
              <p id="establishedDate-error" className="error-message" aria-live="polite">
                {errors.establishedDate}
              </p>
            )}
          </div>

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

export default CompanyForm;