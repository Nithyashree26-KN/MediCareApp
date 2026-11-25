import { useState, useEffect, useCallback } from 'react';
import {
  getAllPatients, createPatient, updatePatient,
  deletePatient, dischargePatient
} from './api/patients';
import PatientForm   from './components/PatientForm';
import PatientTable  from './components/PatientTable';
import FilterBar     from './components/FilterBar';
import DeleteModal   from './components/DeleteModal';

export default function App() {
  const [patients,  setPatients]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [filters,   setFilters]   = useState({ ward: '', department: '', doctor: '', search: '' });
  const [showForm,       setShowForm]       = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected,  setSelected]  = useState(null);   // patient for edit/delete
  const [toast,     setToast]     = useState(null);

  /* ---- Fetch patients ---- */
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllPatients(filters);
      setPatients(res.data);
      setError(null);
    } catch {
      setError('Could not connect to the backend. Make sure Spring Boot is running on port 8080.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  /* ---- Toast helper ---- */
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ---- Handlers ---- */
  const handleAdd = () => { setSelected(null); setShowForm(true); };

  const handleEdit = (patient) => { setSelected(patient); setShowForm(true); };

  const handleDeleteClick = (patient) => { setSelected(patient); setShowDeleteModal(true); };

  const handleFormSubmit = async (formData) => {
    if (selected) {
      await updatePatient(selected.id, formData);
      showToast('Patient updated successfully!');
    } else {
      await createPatient(formData);
      showToast('Patient added successfully!');
    }
    setShowForm(false);
    fetchPatients();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePatient(selected.id);
      showToast('Patient deleted.');
    } catch {
      showToast('Failed to delete patient.', 'error');
    }
    setShowDeleteModal(false);
    fetchPatients();
  };

  const handleDischarge = async (id) => {
    try {
      await dischargePatient(id);
      showToast('Patient marked as discharged.');
      fetchPatients();
    } catch {
      showToast('Failed to discharge patient.', 'error');
    }
  };

  /* ---- Stats ---- */
  const admitted   = patients.filter(p => p.status === 'Admitted').length;
  const discharged = patients.filter(p => p.status === 'Discharged').length;

  return (
    <div className="app">
      {/* ======= HEADER ======= */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🏥</span>
          <div className="logo-text">
            <h1>MediCare</h1>
            <p>Patient Admission Management</p>
          </div>
        </div>
        <button className="btn btn-primary" id="add-patient-btn" onClick={handleAdd}>
          ＋ Add Patient
        </button>
      </header>

      {/* ======= STATS ======= */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-icon-wrap total">👥</div>
          <div className="stat-info">
            <div className="stat-value">{patients.length}</div>
            <div className="stat-label">Total Patients</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap admitted">🏥</div>
          <div className="stat-info">
            <div className="stat-value green">{admitted}</div>
            <div className="stat-label">Currently Admitted</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap discharged">✅</div>
          <div className="stat-info">
            <div className="stat-value muted">{discharged}</div>
            <div className="stat-label">Discharged</div>
          </div>
        </div>
      </div>

      {/* ======= MAIN CONTENT ======= */}
      <main className="main-content">
        <FilterBar filters={filters} onFilterChange={setFilters} />
        {error && <div className="error-banner">⚠️ {error}</div>}
        <PatientTable
          patients={patients}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onDischarge={handleDischarge}
        />
      </main>

      {/* ======= MODALS ======= */}
      {showForm && (
        <PatientForm
          patient={selected}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          patient={selected}
          onConfirm={handleDeleteConfirm}
          onClose={() => setShowDeleteModal(false)}
        />
      )}

      {/* ======= TOAST ======= */}
      {toast && (
        <div className={`toast ${toast.type}`} role="alert">
          {toast.type === 'success' ? '✓' : '✕'} {toast.message}
        </div>
      )}
    </div>
  );
}
