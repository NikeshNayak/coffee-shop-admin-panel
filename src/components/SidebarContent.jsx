/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import withRouter from "../components/withRouter";

const SidebarContent = (props) => {
  const navigate = useNavigate();
  const [pathName, setPathName] = useState(props.router.location.pathname);
  const { leftSideBarType } = useSelector((state) => state.Layout);
  const { staffDetails } = useSelector((state) => state.staffDetails);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathName]);

  useEffect(() => {
    const handleLocationChange = () =>
      setPathName(props.router.location.pathname);
    handleLocationChange();
  }, [props.router.location.pathname]);

  const isActive = (path) => (pathName === path ? "mm-active" : ""); // Check if the current path matches

  const hasPermission = (permissionAlias) =>
    staffDetails?.permissions?.some(
      (perm) => perm.groupPermissionAlias === permissionAlias
    ) || false;

  const renderLink = (to, icon, label, permission) => {
    if (permission === undefined || hasPermission(permission)) {
      return (
        <li>
          <Link to={to} className={`waves-effect ${isActive(to)}`}>
            <i className={icon}></i>
            {leftSideBarType !== "condensed" && (
              <span className="ms-1">{label}</span>
            )}
          </Link>
        </li>
      );
    }
    return null; // If permission not granted, return null
  };

  return (
    <div id="sidebar-menu">
      <ul className="metismenu list-unstyled" id="side-menu">
        {staffDetails?.userType === "STAFF" ? (
          <>
            {renderLink(
              "/dashboard",
              "ri-dashboard-line",
              "Dashboard",
              "dashboard"
            )}
            {renderLink(
              "/agents",
              "ri-customer-service-fill",
              "Agents",
              "agents"
            )}
            {renderLink(
              "/companies",
              "ri-building-4-fill",
              "Companies",
              "companies"
            )}
            {renderLink(
              "/categories",
              "ri-shapes-fill",
              "Categories",
              "categories"
            )}
            {renderLink("/keys", "ri-key-fill", "Keys", "keys")}
            {renderLink("/reports", "ri-file-text-fill", "Reports", "reports")}
            {renderLink(
              "/changepassword",
              "ri-lock-password-fill",
              "Change Password"
            )}
            <li>
              <a
                href="#"
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }}
                className="waves-effect"
              >
                <i className="ri-logout-box-line"></i>
                {leftSideBarType !== "condensed" && (
                  <span className="ms-1">Logout</span>
                )}
              </a>
            </li>
          </>
        ) : (
          <>
            {renderLink("/dashboard", "ri-dashboard-line", "Dashboard")}
            {renderLink("/staff-list", "ri-group-fill", "Staffs")}
            {renderLink("/agents", "ri-customer-service-fill", "Agents")}
            {renderLink("/companies", "ri-building-4-fill", "Companies")}
            {renderLink("/categories", "ri-shapes-fill", "Categories")}
            {renderLink("/keys", "ri-key-fill", "Keys")}
            {renderLink("/reports", "ri-file-text-fill", "Reports")}
            {renderLink(
              "/changepassword",
              "ri-lock-password-fill",
              "Change Password"
            )}
            <li>
              <a
                href="#"
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }}
                className="waves-effect"
              >
                <i className="ri-logout-box-line"></i>
                {leftSideBarType !== "condensed" && (
                  <span className="ms-1">Logout</span>
                )}
              </a>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default withRouter(SidebarContent);
