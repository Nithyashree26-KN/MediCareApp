const formatDate = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function PatientTable({ patients, loading, onEdit, onDelete, onDischarge }) {
  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading patients…</p>
        </div>
      </div>
    );
  }

  if (!patients.length) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <div className="empty-emoji">🏥</div>
          <h3>No patients found</h3>
          <p>Try adjusting your search or filters, or add a new patient.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="patient-table" role="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Patient Name</th>
            <th>Age / Gender</th>
            <th>Ward</th>
            <th>Department</th>
            <th>Doctor</th>
            <th>Admitted On</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p, i) => (
            <tr key={p.id} className="patient-row">
              <td className="serial-num">{i + 1}</td>

              {/* Name + avatar */}
              <td>
                <div className="name-cell">
                  <div className="avatar">{p.name.charAt(0)}</div>
                  <span className="patient-name">{p.name}</span>
                </div>
              </td>

              <td>{p.age} / {p.gender}</td>

              <td><span className="ward-pill">{p.ward}</span></td>

              <td>{p.department}</td>

              <td>{p.doctor}</td>

              <td>{formatDate(p.admissionDate)}</td>

              {/* Status badge */}
              <td>
                <span className={`status-badge ${p.status.toLowerCase()}`}>
                  <span className={`status-dot ${p.status.toLowerCase()}`} />
                  {p.status}
                </span>
              </td>

              {/* Actions */}
              <td>
                <div className="actions">
                  {p.status === 'Admitted' && (
                    <button
                      id={`discharge-btn-${p.id}`}
                      className="btn-act discharge"
                      onClick={() => onDischarge(p.id)}
                      title="Mark as Discharged"
                    >
                      Discharge
                    </button>
                  )}
                  <button
                    id={`edit-btn-${p.id}`}
                    className="btn-act edit"
                    onClick={() => onEdit(p)}
                    title="Edit Patient"
                  >
                    Edit
                  </button>
                  <button
                    id={`delete-btn-${p.id}`}
                    className="btn-act delete"
                    onClick={() => onDelete(p)}
                    title="Delete Patient"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
