import React from 'react';
import { NavLink, Link } from "react-router-dom";
import './AdminSidebar.css';

const AdminSidebar = ({ onNavigate }) => {
    const handleLinkClick = () => {
        if (onNavigate) onNavigate();
    };

    return (
        <div className="d-flex flex-column h-100 bg-white">
            <div className="flex-grow-1 p-3 overflow-auto admin-sidebar-nav">
                <ul className="nav nav-pills flex-column gap-1">
                    <li className="nav-item text-muted small fw-bold px-3 py-2 text-uppercase letter-spacing-1">Analytics</li>
                    <li className="nav-item">
                        <NavLink to="/admin/dashboard" className="nav-link text-dark rounded-3" onClick={handleLinkClick}>
                            <i className="bi bi-speedometer2 me-3 fs-5"></i>
                            <span className="fw-medium">Dashboard</span>
                        </NavLink>
                    </li>

                    <li className="nav-item text-muted small fw-bold px-3 py-2 mt-3 text-uppercase letter-spacing-1">Content</li>
                    <li className="nav-item">
                        <NavLink to="/admin/posts" className="nav-link text-dark rounded-3" onClick={handleLinkClick}>
                            <i className="bi bi-newspaper me-3 fs-5"></i>
                            <span className="fw-medium">Posts</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/image-storage" className="nav-link text-dark rounded-3" onClick={handleLinkClick}>
                            <i className="bi bi-images me-3 fs-5"></i>
                            <span className="fw-medium">Media Storage</span>
                        </NavLink>
                    </li>

                    <li className="nav-item text-muted small fw-bold px-3 py-2 mt-3 text-uppercase letter-spacing-1">Operations</li>
                    <li className="nav-item">
                        <NavLink to="/admin/events" className="nav-link text-dark rounded-3" onClick={handleLinkClick}>
                            <i className="bi bi-calendar-event me-3 fs-5"></i>
                            <span className="fw-medium">Events</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/forms" className="nav-link text-dark rounded-3" onClick={handleLinkClick}>
                            <i className="bi bi-file-earmark-text me-3 fs-5"></i>
                            <span className="fw-medium">Forms</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/bot" className="nav-link text-dark rounded-3" onClick={handleLinkClick}>
                            <i className="bi bi-robot me-3 fs-5"></i>
                            <span className="fw-medium">Automated Bot</span>
                        </NavLink>
                    </li>

                    <li className="nav-item text-muted small fw-bold px-3 py-2 mt-3 text-uppercase letter-spacing-1">Accounts</li>
                    <li className="nav-item">
                        <NavLink to="/admin/teams" className="nav-link text-dark rounded-3" onClick={handleLinkClick}>
                            <i className="bi bi-person-badge-fill me-3 fs-5"></i>
                            <span className="fw-medium">Team Council</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/admin-users" className="nav-link text-dark rounded-3" onClick={handleLinkClick}>
                            <i className="bi bi-shield-lock me-3 fs-5"></i>
                            <span className="fw-medium">Admin Users</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/users" className="nav-link text-dark rounded-3" onClick={handleLinkClick}>
                            <i className="bi bi-people me-3 fs-5"></i>
                            <span className="fw-medium">Platform Users</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/passcode" className="nav-link text-dark rounded-3" onClick={handleLinkClick}>
                            <i className="bi bi-person-badge-fill me-3 fs-5"></i>
                            <span className="fw-medium">Passcodes</span>
                        </NavLink>
                    </li>

                    <li className="nav-item text-muted small fw-bold px-3 py-2 mt-3 text-uppercase letter-spacing-1">Certificates Management</li>
                    <li className="nav-item">
                        <NavLink to="/admin/certificates" className="nav-link text-dark rounded-3" onClick={handleLinkClick}>
                            <i className="bi bi-patch-check me-3 fs-5"></i>
                            <span className="fw-medium">Certificates</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/certificate-templates" className="nav-link text-dark rounded-3" onClick={handleLinkClick}>
                            <i className="bi bi-file-earmark-richtext me-3 fs-5"></i>
                            <span className="fw-medium">Templates</span>
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Bottom Global Actions */}
            <div className="p-3 border-top mt-auto bg-light">
                <Link to="/" className="btn btn-outline-secondary w-100 rounded-pill fw-bold" onClick={handleLinkClick}>
                    <i className="bi bi-box-arrow-left me-2"></i> Exit to Public Site
                </Link>
            </div>
        </div>
    );
};

export default AdminSidebar;