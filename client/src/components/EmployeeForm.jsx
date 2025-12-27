import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiUser, FiMail, FiPhone, FiBriefcase, FiDollarSign, FiCalendar, FiActivity } from 'react-icons/fi';
import { employeeAPI } from '../services/api';

function EmployeeForm({ isEdit = false }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        salary: '',
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'Active'
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (isEdit && id) {
            fetchEmployee();
        }
    }, [isEdit, id]);

    const fetchEmployee = async () => {
        try {
            setLoading(true);
            const response = await employeeAPI.getById(id);
            const emp = response.data;
            setFormData({
                name: emp.name,
                email: emp.email,
                phone: emp.phone,
                role: emp.role,
                department: emp.department,
                salary: emp.salary,
                joiningDate: new Date(emp.joiningDate).toISOString().split('T')[0],
                status: emp.status
            });
        } catch (error) {
            setSubmitError('Failed to fetch employee data');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        if (!formData.role.trim()) {
            newErrors.role = 'Role is required';
        }

        if (!formData.department.trim()) {
            newErrors.department = 'Department is required';
        }

        if (!formData.salary) {
            newErrors.salary = 'Salary is required';
        } else if (Number(formData.salary) < 0) {
            newErrors.salary = 'Salary cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!validateForm()) return;

        try {
            setLoading(true);
            const dataToSend = {
                ...formData,
                salary: Number(formData.salary)
            };

            if (isEdit) {
                await employeeAPI.update(id, dataToSend);
            } else {
                await employeeAPI.create(dataToSend);
            }

            navigate('/');
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Something went wrong';
            setSubmitError(message);
        } finally {
            setLoading(false);
        }
    };

    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Support'];

    if (loading && isEdit) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading employee data...</p>
            </div>
        );
    }

    return (
        <div className="form-container">
            <div className="form-header">
                <h2>{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
                <p>{isEdit ? 'Update employee information' : 'Fill in the details to add a new employee'}</p>
            </div>

            {submitError && (
                <div className="error-alert">
                    <span>{submitError}</span>
                    <button onClick={() => setSubmitError('')}><FiX /></button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="employee-form">
                <div className="form-grid">
                    <div className={`form-group ${errors.name ? 'error' : ''}`}>
                        <label htmlFor="name">
                            <FiUser className="label-icon" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter full name"
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className={`form-group ${errors.email ? 'error' : ''}`}>
                        <label htmlFor="email">
                            <FiMail className="label-icon" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className={`form-group ${errors.phone ? 'error' : ''}`}>
                        <label htmlFor="phone">
                            <FiPhone className="label-icon" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>

                    <div className={`form-group ${errors.role ? 'error' : ''}`}>
                        <label htmlFor="role">
                            <FiBriefcase className="label-icon" />
                            Role / Position
                        </label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            placeholder="e.g. Software Engineer"
                        />
                        {errors.role && <span className="error-text">{errors.role}</span>}
                    </div>

                    <div className={`form-group ${errors.department ? 'error' : ''}`}>
                        <label htmlFor="department">
                            <FiBriefcase className="label-icon" />
                            Department
                        </label>
                        <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                        {errors.department && <span className="error-text">{errors.department}</span>}
                    </div>

                    <div className={`form-group ${errors.salary ? 'error' : ''}`}>
                        <label htmlFor="salary">
                            <FiDollarSign className="label-icon" />
                            Monthly Salary (₹)
                        </label>
                        <input
                            type="number"
                            id="salary"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            placeholder="Enter salary"
                            min="0"
                        />
                        {errors.salary && <span className="error-text">{errors.salary}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="joiningDate">
                            <FiCalendar className="label-icon" />
                            Joining Date
                        </label>
                        <input
                            type="date"
                            id="joiningDate"
                            name="joiningDate"
                            value={formData.joiningDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">
                            <FiActivity className="label-icon" />
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-cancel" onClick={() => navigate('/')}>
                        <FiX />
                        <span>Cancel</span>
                    </button>
                    <button type="submit" className="btn btn-submit" disabled={loading}>
                        <FiSave />
                        <span>{loading ? 'Saving...' : (isEdit ? 'Update Employee' : 'Add Employee')}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EmployeeForm;
