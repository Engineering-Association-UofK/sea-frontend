import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useProfileSummary } from '../features/profile/hooks/useProfile';
import './UserDropdownMenu.css';

const UserDropdownMenu = ({ isMobile = false, onItemClick }) => {
    const { user, logout } = useAuth();
    const { translations, language } = useLanguage();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { summary, loading } = useProfileSummary();

    const currentName = summary?.username || (language === 'ar'
        ? (user?.name_ar || user?.name_en || '')
        : (user?.name_en || user?.name_ar || ''));
        
    const avatarUrl = summary?.profile_pic || user?.avatar_url;
    const studentIndex = summary?.id;
    const studentEmail = summary?.email;

    const getInitials = () => {
        if (!currentName) return '?';
        const parts = currentName.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0][0]?.toUpperCase() || '?';
    };

    const initials = getInitials();
    const menuItems = translations.navbar?.userMenu || {};

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        if (onItemClick) onItemClick();
        navigate('/');
    };

    const handleItemClick = () => {
        setIsOpen(false);
        if (onItemClick) onItemClick();
    };

    // Reusable Avatar
    const AvatarCircle = ({ size = 'default', className = '' }) => (
        <div className={`${size === 'large' ? 'user-dropdown-header-avatar' : size === 'mobile' ? 'mobile-user-avatar' : 'user-avatar'} ${className}`}>
            {avatarUrl ? (
                <img src={avatarUrl} alt={currentName} />
            ) : (
                initials
            )}
        </div>
    );

    // ─── Mobile Layout ───
    if (isMobile) {
        return (
            <div className="mobile-user-section">
                <div className="mobile-user-header">
                    <AvatarCircle size="mobile" />
                    <div className="mobile-user-info">
                        <div className="mobile-user-name">
                            {currentName || 'Loading...'}
                        </div>
                        {studentIndex && (
                            <div className="mobile-user-index">
                                <span className="index-badge">Index: {studentIndex}</span>
                            </div>
                        )}
                    </div>
                </div>

                <Link to="/profile" className="mobile-menu-item" onClick={handleItemClick}>
                    <i className="bi bi-person"></i>
                    {menuItems.profile || 'Profile'}
                </Link>
                {/* <Link to="/settings" className="mobile-menu-item" onClick={handleItemClick}>
                    <i className="bi bi-gear"></i>
                    {menuItems.settings || 'Settings'}
                </Link> */}

                <button className="mobile-menu-item logout-item" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i>
                    {translations.navbar?.logout || 'Logout'}
                </button>
            </div>
        );
    }

    // ─── Desktop Layout ───
    return (
        <div className="user-dropdown-wrapper" ref={dropdownRef}>
            <button
                className="user-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                id="user-dropdown-trigger"
            >
                <AvatarCircle />
                <span className="user-trigger-name">{currentName || 'User'}</span>
                <i className={`bi bi-chevron-down user-trigger-chevron ${isOpen ? 'open' : ''}`}></i>
            </button>

            {isOpen && (
                <>
                    <div className="user-dropdown-overlay" onClick={() => setIsOpen(false)} />
                    <div className="user-dropdown-menu shadow-lg" role="menu" aria-labelledby="user-dropdown-trigger">
                        
                        {/* Header Profile Card */}
                        <div className="user-dropdown-header">
                            <AvatarCircle size="large" />
                            <div className="user-dropdown-header-info">
                                <div className="user-dropdown-header-name" title={currentName}>
                                    {currentName || 'Loading...'}
                                </div>
                                
                                {loading ? (
                                    <div className="loading-skeleton"></div>
                                ) : (
                                    <>
                                        {studentIndex && (
                                            <div className="user-dropdown-header-index mt-1">
                                                <span className="index-badge px-2 py-1 rounded-pill">
                                                    <i className="bi bi-hash me-1"></i>{studentIndex}
                                                </span>
                                            </div>
                                        )}
                                        {studentEmail && (
                                            <div className="user-dropdown-header-email text-muted mt-1" title={studentEmail}>
                                                {studentEmail}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="user-dropdown-divider" />

                        {/* Menu Items */}
                        <div className="menu-items-container px-2 pb-2">
                            <Link to="/profile" className="user-dropdown-item" role="menuitem" onClick={handleItemClick}>
                                <div className="item-icon-wrapper">
                                    <i className="bi bi-person"></i>
                                </div>
                                {menuItems.profile || 'Profile'}
                            </Link>

                            {/* <Link to="/settings" className="user-dropdown-item" role="menuitem" onClick={handleItemClick}>
                                <div className="item-icon-wrapper">
                                    <i className="bi bi-gear"></i>
                                </div>
                                {menuItems.settings || 'Settings'}
                            </Link> */}

                            <div className="user-dropdown-divider my-2" />

                            <button className="user-dropdown-item logout-item" role="menuitem" onClick={handleLogout}>
                                <div className="item-icon-wrapper">
                                    <i className="bi bi-box-arrow-right"></i>
                                </div>
                                {translations.navbar?.logout || 'Logout'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserDropdownMenu;