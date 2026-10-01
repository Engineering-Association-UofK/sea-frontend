import React, { useState, useRef } from 'react';
import {
  Navbar,
  Nav,
  Container,
  Dropdown,
  Offcanvas,
} from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ADMIN_ROLES } from '../utils/roles';
import UserDropdownMenu from './Layout/UserDropdownMenu/UserDropdownMenu';

const NavigationBar = () => {
  const { translations, switchLanguage, language } = useLanguage();
  const { user, logout } = useAuth();
  const isAdmin = user?.roles?.some((r) => ADMIN_ROLES.includes(r));

  // Offcanvas state
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  // Hover timeout for desktop dropdowns
  const timeoutRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownMouseEnter = (key) => {
    clearTimeout(timeoutRef.current);
    setOpenDropdown(key);
  };

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 200);
  };

  const currentLabel = language === 'en' ? 'English' : 'العربية';

  // Desktop dropdown renderer
  const renderDesktopDropdown = (title, items, dropdownKey) => (
    <Dropdown
      show={openDropdown === dropdownKey}
      onMouseEnter={() => handleDropdownMouseEnter(dropdownKey)}
      onMouseLeave={handleDropdownMouseLeave}
      className="mx-2"
    >
      <Dropdown.Toggle
        variant="link"
        className="fw-medium text-dark text-decoration-none p-0 border-0"
        style={{ boxShadow: 'none' }}
      >
        {title}
      </Dropdown.Toggle>

      <Dropdown.Menu
        align={language === 'ar' ? 'start' : 'end'}
        className="shadow-sm border-0 rounded-3 py-2"
        style={{ minWidth: '200px' }}
      >
        {items.map((item, idx) => (
          <Dropdown.Item
            key={idx}
            as={NavLink}
            to={item.to}
            end={item.end}
            className="py-2 px-3 text-center"
            style={{ color: '#333' }}
            onClick={() => setOpenDropdown(null)}
          >
            {item.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );

  // Mobile collapsible section
  const MobileCollapsibleSection = ({ title, items }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="w-100">
        <div
          className="d-flex justify-content-between align-items-center px-2 py-2"
          style={{ cursor: 'pointer' }}
          onClick={() => setOpen(!open)}
        >
          <span className="fw-bold text-muted text-uppercase small">{title}</span>
          <i className={`bi bi-chevron-${open ? 'up' : 'down'}`}></i>
        </div>
        {open && (
          <div className="ps-3">
            {items.map((item, idx) => (
              <Nav.Link
                key={idx}
                as={NavLink}
                to={item.to}
                end={item.end}
                className="fw-medium text-dark py-2"
                onClick={handleClose}
              >
                {item.label}
              </Nav.Link>
            ))}
          </div>
        )}
        <hr className="my-2" />
      </div>
    );
  };

  // Define dropdown items
  const aboutItems = [
    { to: '/about/association', end: true,  label: translations.navbar.about.association },
    { to: '/about/organization-structure',  label: translations.navbar.about.organizationStructure },
    { to: '/about/council-of-thirty',       label: translations.navbar.about.councilOfThirty },
    { to: '/about/elections',               label: translations.navbar.about.elections },
  ];

  const postsItems = [
    { to: '/posts/news',          label: translations.navbar.posts.news },
    { to: '/posts/issues',        label: translations.navbar.posts.issues },
    { to: '/posts/announcements', label: translations.navbar.posts.blogs },
    { to: '/posts/donations',     label: translations.navbar.posts.donations },
  ];

  return (
    <>
      <style>
        {`
          /* Desktop Hover Dropdown */
          @media (min-width: 992px) {
            .dropdown:hover .dropdown-menu {
              display: block;
              margin-top: 0;
            }
          }

          .desktop-nav .nav-link, 
          .desktop-nav .dropdown-toggle {
            color: #333 !important;
            border-bottom: 2px solid transparent;
            padding-bottom: 2px !important;
            transition: all 0.2s ease-in-out;
          }

          /* Simple Hover & Active Underline */
          .desktop-nav .nav-link:hover,
          .desktop-nav .nav-link.active,
          .desktop-nav .dropdown-toggle:hover {
            color: #22B2E6 !important;
          }

          .language-toggle {
            color: #22B2E6 !important;
            text-decoration: none !important;
            border: none !important;
          }

          /* Dropdown Menu Styling */
          .dropdown-item {
            transition: background 0.2s;
          }
          .dropdown-item.active {
            background-color: #f8f9fa !important;
            color: #22B2E6 !important;
            font-weight: bold !important;
          }

          .desktop-nav {
            display: flex;
            gap: 20px;
          }
        `}
      </style>

      <Navbar expand={false} className="shadow-sm py-2 sticky-top bg-white border-bottom">
        <Container fluid className="px-3 px-lg-5 gap-lg-3">
          {/* Logo */}
          <Navbar.Brand as={Link} to="/" className="me-1 me-lg-4 py-0">
            <img
              src={language === 'ar' ? '/Logo-ar.png' : '/Logo-en.png'}
              alt="Logo"
              style={{ height: '45px', width: 'auto', objectFit: 'contain' }}
            />
          </Navbar.Brand>

          {/* DESKTOP NAVIGATION */}
          <div className="d-none d-lg-flex align-items-center desktop-nav">
            <Nav.Link as={NavLink} to="/" end className="fw-medium text-dark">
              {translations.navbar.home}
            </Nav.Link>
            {renderDesktopDropdown(translations.navbar.about.title, aboutItems, 'about')}
            {renderDesktopDropdown(translations.navbar.posts.title, postsItems, 'posts')}
            <Nav.Link as={NavLink} to="/events" end className="fw-medium text-dark">
              {translations.navbar.events}
            </Nav.Link>
            {isAdmin && (
              <Nav.Link as={NavLink} to="/admin" className="fw-medium text-dark">
                {translations.navbar.admin}
              </Nav.Link>
            )}
          </div>

          {/* Right side */}
          <div className="d-flex align-items-center ms-auto gap-3 gap-lg-4">
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                className="language-toggle text-decoration-none fw-bold p-0 border-0 d-flex align-items-center"
                style={{ color: '#22B2E6', fontSize: '0.95rem' }}
              >
                <i className="bi bi-translate me-1"></i> {currentLabel}
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => switchLanguage('en')} active={language === 'en'}>
                  English (EN)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => switchLanguage('ar')} active={language === 'ar'}>
                  Arabic (AR)
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <div className="d-none d-lg-block">
              {user ? (
                <UserDropdownMenu />
              ) : (
                <Link
                  to="/login"
                  className="btn fw-bold px-4 py-2 rounded-1 shadow-sm border-0 text-white"
                  style={{ backgroundColor: '#22B2E6' }}
                >
                  {translations.navbar.login}
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <Navbar.Toggle
              aria-controls="offcanvasNavbar"
              onClick={handleShow}
              className="d-lg-none ms-0 px-2 border-0 shadow-none"
            />
          </div>

          {/* MOBILE OFFCANVAS */}
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement={language === 'ar' ? 'start' : 'end'}
            show={showOffcanvas}
            onHide={handleClose}
          >
            <Offcanvas.Header closeButton className="border-bottom">
              <Offcanvas.Title className="fw-bold" style={{ color: '#22B2E6' }}>
                {translations.navbar.brand}
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex flex-column">
              <Nav className="flex-column gap-1">
                <Nav.Link as={NavLink} to="/" end className="fw-medium text-dark fs-5" onClick={handleClose}>
                  {translations.navbar.home}
                </Nav.Link>
                <MobileCollapsibleSection title={translations.navbar.about.title} items={aboutItems} />
                <MobileCollapsibleSection title={translations.navbar.posts.title} items={postsItems} />
                <Nav.Link as={NavLink} to="/events" end className="fw-medium text-dark fs-5" onClick={handleClose}>
                  {translations.navbar.events}
                </Nav.Link>
                {isAdmin && (
                  <Nav.Link as={NavLink} to="/admin" className="fw-medium text-dark fs-5" onClick={handleClose}>
                    {translations.navbar.admin}
                  </Nav.Link>
                )}
              </Nav>

              <div className="mt-auto pt-4 border-top">
                {user ? (
                  <UserDropdownMenu isMobile onItemClick={handleClose} />
                ) : (
                  <Link
                    to="/login"
                    className="btn w-100 fw-bold py-3 rounded-2 shadow-sm border-0 text-white"
                    onClick={handleClose}
                    style={{ backgroundColor: '#22B2E6' }}
                  >
                    {translations.navbar.login}
                  </Link>
                )}
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default NavigationBar;