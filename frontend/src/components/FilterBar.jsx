const WARDS = ['General', 'ICU', 'Pediatric', 'Maternity', 'Surgical', 'Orthopedic'];
const DEPARTMENTS = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Oncology', 'Gynecology'];
const DOCTORS = ['Dr. Arjun Mehta', 'Dr. Priya Sharma', 'Dr. Rahul Nair', 'Dr. Sunita Rao', 'Dr. Vikram Das'];

export default function FilterBar({ filters, onFilterChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(prev => ({ ...prev, [name]: value }));
  };

  const hasFilters = filters.ward || filters.department || filters.doctor || filters.search;

  return (
    <div className="filter-bar">
      {/* Search */}
      <div className="search-wrap">
        <span className="search-icon-label" aria-hidden="true">🔍</span>
        <input
          id="search-input"
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search patients by name..."
          className="search-input"
          autoComplete="off"
        />
      </div>

      {/* Dropdowns */}
      <div className="filter-controls">
        <select
          id="filter-ward"
          name="ward"
          value={filters.ward}
          onChange={handleChange}
          className="filter-select"
          aria-label="Filter by ward"
        >
          <option value="">All Wards</option>
          {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
        </select>

        <select
          id="filter-department"
          name="department"
          value={filters.department}
          onChange={handleChange}
          className="filter-select"
          aria-label="Filter by department"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select
          id="filter-doctor"
          name="doctor"
          value={filters.doctor}
          onChange={handleChange}
          className="filter-select"
          aria-label="Filter by doctor"
        >
          <option value="">All Doctors</option>
          {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {hasFilters && (
          <button
            id="clear-filters-btn"
            className="btn-clear"
            onClick={() => onFilterChange({ ward: '', department: '', doctor: '', search: '' })}
          >
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  );
}
