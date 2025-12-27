import { useState, useEffect } from 'react';
import { FiSearch, FiUsers, FiUserX, FiRefreshCw } from 'react-icons/fi';
import { employeeAPI } from '../services/api';
import EmployeeCard from './EmployeeCard';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        filterEmployees();
    }, [searchTerm, filterDepartment, employees]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await employeeAPI.getAll();
            setEmployees(response.data);
        } catch (err) {
            setError('Failed to fetch employees. Make sure the server is running.');
        } finally {
            setLoading(false);
        }
    };

    const filterEmployees = () => {
        let filtered = [...employees];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(emp =>
                emp.name.toLowerCase().includes(term) ||
                emp.email.toLowerCase().includes(term) ||
                emp.role.toLowerCase().includes(term)
            );
        }

        if (filterDepartment) {
            filtered = filtered.filter(emp => emp.department === filterDepartment);
        }

        setFilteredEmployees(filtered);
    };

    const handleDeleteClick = (id, name) => {
        setDeleteModal({ show: true, id, name });
    };

    const confirmDelete = async () => {
        try {
            await employeeAPI.delete(deleteModal.id);
            setEmployees(prev => prev.filter(emp => emp._id !== deleteModal.id));
            setDeleteModal({ show: false, id: null, name: '' });
        } catch (err) {
            setError('Failed to delete employee');
        }
    };

    const departments = [...new Set(employees.map(emp => emp.department))];

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading employees...</p>
            </div>
        );
    }

    return (
        <div className="employee-list-container">
            <div className="list-header">
                <div className="header-content">
                    <h1>
                        <FiUsers className="header-icon" />
                        Employee Directory
                    </h1>
                    <p>{employees.length} total employees</p>
                </div>
                <button className="btn btn-refresh" onClick={fetchEmployees}>
                    <FiRefreshCw />
                    <span>Refresh</span>
                </button>
            </div>

            {error && (
                <div className="error-alert">
                    <span>{error}</span>
                    <button onClick={() => setError('')}>×</button>
                </div>
            )}

            <div className="filters-bar">
                <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="filter-select"
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
            </div>

            {filteredEmployees.length === 0 ? (
                <div className="empty-state">
                    <FiUserX className="empty-icon" />
                    <h3>No employees found</h3>
                    <p>{employees.length === 0
                        ? 'Start by adding your first employee'
                        : 'Try adjusting your search or filter'
                    }</p>
                </div>
            ) : (
                <div className="employees-grid">
                    {filteredEmployees.map(employee => (
                        <EmployeeCard
                            key={employee._id}
                            employee={employee}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="modal-overlay" onClick={() => setDeleteModal({ show: false, id: null, name: '' })}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirm Delete</h3>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete <strong>{deleteModal.name}</strong>?</p>
                            <p className="warning-text">This action cannot be undone.</p>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="btn btn-cancel"
                                onClick={() => setDeleteModal({ show: false, id: null, name: '' })}
                            >
                                Cancel
                            </button>
                            <button className="btn btn-delete" onClick={confirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployeeList;
