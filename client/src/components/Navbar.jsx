import { Link, useLocation } from 'react-router-dom';
import { FiUsers, FiUserPlus, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

function Navbar() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="brand-icon">
                        <FiUsers />
                    </div>
                    <span>EmpManager</span>
                </Link>

                <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <FiX /> : <FiMenu />}
                </button>

                <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link
                        to="/"
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <FiUsers />
                        <span>Employees</span>
                    </Link>
                    <Link
                        to="/add"
                        className={`nav-link ${isActive('/add') ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <FiUserPlus />
                        <span>Add Employee</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
