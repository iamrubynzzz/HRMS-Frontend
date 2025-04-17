import React from 'react';
import './RequestForm.css';

const RequestForm = ({ formData, handleInputChange, handleSubmit, setShowForm, errors }) => {
  return (
    <div className="form-overlay">
      <div className="request-form">
        <h3>Create New Request</h3>
        <form onSubmit={handleSubmit}>
          {/* General error message */}
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label>Request Type</label>
            <select name="requestType" value={formData.requestType} onChange={handleInputChange}>
              <option value="ALLOWANCE">Allowance</option>
              <option value="OVERTIME">Overtime</option>
              <option value="UNPAID_SICK_LEAVE">Unpaid Sick Leave</option>
              <option value="UNPAID_ANNUAL_LEAVE">Unpaid Annual Leave</option>
              <option value="PAID_SICK_LEAVE">Paid Sick Leave</option>
              <option value="PAID_ANNUAL_LEAVE">Paid Annual Leave</option>
              <option value="MISSED_ATTENDANCE">Missed Attendance</option>
            </select>
            {errors.requestType && <p className="request-error-message">{errors.requestType}</p>}
          </div>

          {(formData.requestType === 'MISSED_ATTENDANCE' ||
            formData.requestType === 'OVERTIME' ||
            formData.requestType === 'UNPAID_SICK_LEAVE' ||
            formData.requestType === 'UNPAID_ANNUAL_LEAVE' ||
            formData.requestType === 'PAID_SICK_LEAVE' ||
            formData.requestType === 'PAID_ANNUAL_LEAVE') && (
            <>
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
                {errors.startDate && <p className="request-error-message">{errors.startDate}</p>}
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required />
                {errors.endDate && <p className="request-error-message">{errors.endDate}</p>}
              </div>
            </>
          )}

          <div className="form-group">
            <label>Reason</label>
            <input type="text" name="reason" value={formData.reason} onChange={handleInputChange} required />
            {errors.reason && <p className="request-error-message">{errors.reason}</p>}
          </div>

          {formData.requestType === 'ALLOWANCE' && (
            <div className="form-group">
              <label>Allowance Amount</label>
              <input type="number" name="allowanceAmount" value={formData.allowanceAmount} onChange={handleInputChange} required />
              {errors.allowanceAmount && <p className="request-error-message">{errors.allowanceAmount}</p>}
            </div>
          )}

          {formData.requestType === 'OVERTIME' && (
            <div className="form-group">
              <label>Overtime Hours</label>
              <input type="number" name="overtimeHours" value={formData.overtimeHours} onChange={handleInputChange} required />
              {errors.overtimeHours && <p className="request-error-message">{errors.overtimeHours}</p>}
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;