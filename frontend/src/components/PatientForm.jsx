import { useState, useEffect } from 'react';

const GENDERS     = ['Male', 'Female', 'Other'];
const WARDS       = ['General', 'ICU', 'Pediatric', 'Maternity', 'Surgical', 'Orthopedic'];
const DEPARTMENTS = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Oncology', 'Gynecology'];
const DOCTORS     = ['Dr. Arjun Mehta', 'Dr. Priya Sharma', 'Dr. Rahul Nair', 'Dr. Sunita Rao', 'Dr. Vikram Das'];

const today = () => new Date().toISOString().split('T')[0];

const INIT = {
  name: '', age: '', gender: '', ward: '',
  department: '', doctor: '', admissionDate: today(), status: 'Admitted',
};

export default function PatientForm({ patient, onSubmit, onClose }) {
  const [form,       setForm]       = useState(INIT);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* Populate when editing */
  useEffect(() => {
    if (patient) {
      setForm({
        name:          patient.name          || '',
        age:           patient.age           ?? '',
        gender:        patient.gender        || '',
        ward:          patient.ward          || '',
        department:    patient.department    || '',
        doctor:        patient.doctor        || '',
        admissionDate: patient.admissionDate || today(),
        status:        patient.status        || 'Admitted',
      });
    }
  }, [patient]);

  /* ---- Frontend Validation ---- */
  const validate = () => {
    const e = {};
    const nameVal = form.name.trim();

    if (!nameVal)
      e.name = 'Name is required';
    else if (!/^[a-zA-Z ]+$/.test(nameVal))
      e.name = 'Name must contain letters only';

    if (form.age === '' || form.age === null)
      e.age = 'Age is required';
    else if (Number(form.age) < 0 || Number(form.age) > 120)
      e.age = 'Age must be between 0 and 120';

    if (!form.gender)     e.gender     = 'Gender is required';
    if (!form.ward)       e.ward       = 'Ward is required';
    if (!form.department) e.department = 'Department is required';
    if (!form.doctor)     e.doctor     = 'Doctor is required';

    if (!form.admissionDate)
      e.admissionDate = 'Admission date is required';
    else if (form.admissionDate > today())
      e.admissionDate = 'Admission date cannot be a future date';

    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'age' ? (value === '' ? '' : Number(value)) : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vErrors = validate();
    if (Object.keys(vErrors).length) { setErrors(vErrors); return; }

    setSubmitting(true);
    try {
      await onSubmit({ ...form, name: form.name.trim() });
    } catch (err) {
      /* Backend validation errors */
      const data = err.response?.data;
      if (data?.fieldErrors) {
        setErrors(data.fieldErrors);
      } else {
        setErrors({ _general: data?.message || 'Failed to save patient. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="form-modal-title">
        {/* Header */}
        <div className="modal-header">
          <h2 id="form-modal-title">
            {patient ? '✏️ Edit Patient' : '➕ Add New Patient'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Form */}
        <form className="patient-form" onSubmit={handleSubmit} noValidate>

          {errors._general && (
            <div className="form-error-banner" role="alert">{errors._general}</div>
          )}

          <div className="form-grid">

            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="inp-name">Patient Name *</label>
              <input
                id="inp-name"
                className={`form-input ${errors.name ? 'invalid' : ''}`}
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name (letters only)"
                autoComplete="off"
              />
              {errors.name && <span className="field-error" role="alert">{errors.name}</span>}
            </div>

            {/* Age */}
            <div className="form-group">
              <label className="form-label" htmlFor="inp-age">Age *</label>
              <input
                id="inp-age"
                className={`form-input ${errors.age ? 'invalid' : ''}`}
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="0 – 120"
                min="0"
                max="120"
              />
              {errors.age && <span className="field-error" role="alert">{errors.age}</span>}
            </div>

            {/* Gender */}
            <div className="form-group">
              <label className="form-label" htmlFor="inp-gender">Gender *</label>
              <select
                id="inp-gender"
                className={`form-select ${errors.gender ? 'invalid' : ''}`}
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.gender && <span className="field-error" role="alert">{errors.gender}</span>}
            </div>

            {/* Ward */}
            <div className="form-group">
              <label className="form-label" htmlFor="inp-ward">Ward *</label>
              <select
                id="inp-ward"
                className={`form-select ${errors.ward ? 'invalid' : ''}`}
                name="ward"
                value={form.ward}
                onChange={handleChange}
              >
                <option value="">Select ward</option>
                {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              {errors.ward && <span className="field-error" role="alert">{errors.ward}</span>}
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label" htmlFor="inp-dept">Department *</label>
              <select
                id="inp-dept"
                className={`form-select ${errors.department ? 'invalid' : ''}`}
                name="department"
                value={form.department}
                onChange={handleChange}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <span className="field-error" role="alert">{errors.department}</span>}
            </div>

            {/* Doctor */}
            <div className="form-group">
              <label className="form-label" htmlFor="inp-doctor">Doctor *</label>
              <select
                id="inp-doctor"
                className={`form-select ${errors.doctor ? 'invalid' : ''}`}
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
              >
                <option value="">Select doctor</option>
                {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.doctor && <span className="field-error" role="alert">{errors.doctor}</span>}
            </div>

            {/* Admission Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="inp-date">Admission Date *</label>
              <input
                id="inp-date"
                className={`form-input ${errors.admissionDate ? 'invalid' : ''}`}
                type="date"
                name="admissionDate"
                value={form.admissionDate}
                onChange={handleChange}
                max={today()}
              />
              {errors.admissionDate && <span className="field-error" role="alert">{errors.admissionDate}</span>}
            </div>

            {/* Status — only show when editing */}
            {patient && (
              <div className="form-group">
                <label className="form-label" htmlFor="inp-status">Status</label>
                <select
                  id="inp-status"
                  className="form-select"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Admitted">Admitted</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              id="cancel-form-btn"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-form-btn"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving…' : (patient ? 'Update Patient' : 'Add Patient')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
