import { FiEdit2, FiTrash2, FiMail, FiPhone, FiBriefcase, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function EmployeeCard({ employee, onDelete }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatSalary = (salary) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(salary);
    };

    return (
        <div className="employee-card">
            <div className="card-header">
                <div className="employee-avatar">
                    {employee.name.charAt(0).toUpperCase()}
                </div>
                <div className="employee-basic">
                    <h3 className="employee-name">{employee.name}</h3>
                    <span className={`status-badge ${employee.status.toLowerCase()}`}>
                        {employee.status}
                    </span>
                </div>
            </div>

            <div className="card-body">
                <div className="info-row">
                    <FiBriefcase className="info-icon" />
                    <div className="info-content">
                        <span className="info-label">Role</span>
                        <span className="info-value">{employee.role}</span>
                    </div>
                </div>

                <div className="info-row">
                    <FiMail className="info-icon" />
                    <div className="info-content">
                        <span className="info-label">Email</span>
                        <span className="info-value">{employee.email}</span>
                    </div>
                </div>

                <div className="info-row">
                    <FiPhone className="info-icon" />
                    <div className="info-content">
                        <span className="info-label">Phone</span>
                        <span className="info-value">{employee.phone}</span>
                    </div>
                </div>

                <div className="info-row">
                    <FiBriefcase className="info-icon" />
                    <div className="info-content">
                        <span className="info-label">Department</span>
                        <span className="info-value">{employee.department}</span>
                    </div>
                </div>

                <div className="info-row">
                    <FiDollarSign className="info-icon" />
                    <div className="info-content">
                        <span className="info-label">Salary</span>
                        <span className="info-value salary">{formatSalary(employee.salary)}</span>
                    </div>
                </div>

                <div className="info-row">
                    <FiCalendar className="info-icon" />
                    <div className="info-content">
                        <span className="info-label">Joined</span>
                        <span className="info-value">{formatDate(employee.joiningDate)}</span>
                    </div>
                </div>
            </div>

            <div className="card-actions">
                <Link to={`/edit/${employee._id}`} className="btn btn-edit">
                    <FiEdit2 />
                    <span>Edit</span>
                </Link>
                <button
                    className="btn btn-delete"
                    onClick={() => onDelete(employee._id, employee.name)}
                >
                    <FiTrash2 />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
}

export default EmployeeCard;
