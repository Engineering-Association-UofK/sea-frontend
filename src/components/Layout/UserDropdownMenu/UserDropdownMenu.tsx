import React from "react";
import { Dropdown, Spinner, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useProfileSummary } from "@/features/profile/hooks/useProfile";
import CustomActionButton from "@/components/CustomActionButton";

interface UserDropdownMenuProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({
  isMobile = false,
  onItemClick,
}) => {
  const { logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { data: summary, isLoading, isError } = useProfileSummary();

  const displayName =
    language === "ar"
      ? summary?.name_ar || summary?.name_en || summary?.username
      : summary?.name_en || summary?.name_ar || summary?.username;

  const handleLogout = () => {
    logout();
    if (onItemClick) onItemClick();
    navigate("/login");
  };

  const avatarSrc = summary?.profile_pic || "/default-avatar.png";

  const menuHeader = (
    <div className="user-profile-header p-3 mb-3 d-flex align-items-center gap-3">
      <div className="position-relative">
        {isLoading ? (
          <div
            className="rounded-circle d-flex align-items-center justify-content-center bg-light"
            style={{ width: "48px", height: "48px" }}
          >
            <Spinner animation="border" size="sm" variant="info" />
          </div>
        ) : (
          <img
            src={avatarSrc}
            alt={displayName || "User"}
            className="rounded-circle mx-1 object-fit-cover shadow-sm border border-2 border-info"
            style={{ width: "48px", height: "48px" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/150";
            }}
          />
        )}
        <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-1"></span>
      </div>
      <div className="overflow-hidden">
        <h6 className="fw-bold mb-0 text-truncate text-dark">
          {displayName || "Student User"}
        </h6>
        <small className="text-muted text-truncate d-block">
          {summary?.email || summary?.department || "Member"}
        </small>
      </div>
    </div>
  );

  const menuItemsList = (
    <div className="specialized-menu-list px-2">
      <CustomActionButton
        to="/profile/"
        icon="bi-person-badge-fill"
        title={language === "ar" ? "الملف الشخصي" : "User Profile"}
        subtitle={
          language === "ar" ? "إدارة بياناتك وحسابك" : "Manage your account"
        }
        variant="cyan"
      />

      <CustomActionButton
        to="/profile/election"
        icon="bi-box-seam-fill"
        title={language === "ar" ? "انتخابات الجمعية" : "Elections"}
        subtitle={
          language === "ar"
            ? "التصويت والبطاقات الانتخابية"
            : "Vote & Election ticket"
        }
        variant="cyan"
        // badgeText={language === 'ar' ? 'نشط' : 'Active'}
      />

      <div className="menu-divider my-2"></div>

      <CustomActionButton
        onClick={handleLogout}
        icon="bi-box-arrow-right"
        title={language === "ar" ? "تسجيل الخروج" : "Logout"}
        subtitle={
          language === "ar" ? "إنهاء الجلسة الحالية" : "Sign out of account"
        }
        variant="danger"
      />
    </div>
  );

  // Styling wrapper for chamfered specialized shapes & hover dynamics
  const styles = (
    <style>{`
      /* Specialized Chamfered Hex Shape Styling */
      .specialized-btn {
        padding: 10px 14px;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        /* Geometric cut-corner chamfered shape */
        clip-path: polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px);
        background: #F4F8FA;
        border-left: 3px solid #22B2E6;
      }

      .specialized-btn-cyan:hover {
        background: linear-gradient(135deg, #22B2E6 0%, #1782A9 100%);
        color: #ffffff !important;
        transform: translateX(${language === "ar" ? "-4px" : "4px"});
        box-shadow: 0 4px 12px rgba(34, 178, 230, 0.3);
      }

      .specialized-btn-cyan:hover .btn-title,
      .specialized-btn-cyan:hover .btn-subtitle,
      .specialized-btn-cyan:hover .bi {
        color: #ffffff !important;
      }

      .specialized-btn-danger {
        background: #FFF5F5;
        border-left: 3px solid #DC3545;
      }

      .specialized-btn-danger .btn-title,
      .specialized-btn-danger .bi {
        color: #DC3545;
      }

      .specialized-btn-danger:hover {
        background: linear-gradient(135deg, #DC3545 0%, #A71D2A 100%);
        transform: translateX(${language === "ar" ? "-4px" : "4px"});
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
      }

      .specialized-btn-danger:hover .btn-title,
      .specialized-btn-danger:hover .btn-subtitle,
      .specialized-btn-danger:hover .bi {
        color: #ffffff !important;
      }

      .btn-icon-hex {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        color: #22B2E6;
      }

      .user-profile-header {
        background: linear-gradient(135deg, #EBF8FC 0%, #F4F8FA 100%);
        clip-path: polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px);
      }

      .menu-divider {
        height: 1px;
        background: linear-gradient(90deg, rgba(34,178,230,0.1) 0%, rgba(34,178,230,0.4) 50%, rgba(34,178,230,0.1) 100%);
      }

      .badge-pill-sm {
        font-size: 0.65rem;
        padding: 0.2em 0.5em;
      }
    `}</style>
  );

  // Render for Mobile drawer context
  if (isMobile) {
    return (
      <div className="w-100">
        {styles}
        {menuHeader}
        {menuItemsList}
      </div>
    );
  }

  // Render for Desktop Navbar Dropdown
  return (
    <Dropdown align={language === "ar" ? "start" : "end"}>
      {styles}
      <Dropdown.Toggle
        variant="link"
        id="user-dropdown-toggle"
        className="p-0 border-0 text-decoration-none d-flex align-items-center gap-2 shadow-none"
      >
        <div className="position-relative">
          {isLoading ? (
            <Spinner animation="border" size="sm" variant="info" />
          ) : (
            <img
              src={avatarSrc}
              alt={displayName || "User"}
              className="rounded-circle object-fit-cover border border-2 border-info"
              style={{ width: "38px", height: "38px" }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/150";
              }}
            />
          )}
        </div>
        <i className="bi bi-chevron-down text-dark small"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="shadow-lg border-0 p-2 rounded-3 mt-2"
        style={{ minWidth: "280px" }}
      >
        {menuHeader}
        {menuItemsList}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserDropdownMenu;
