/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import withRouter from "../components/withRouter";

const SidebarContent = (props) => {
  const navigate = useNavigate();
  const [pathName, setPathName] = useState(props.router.location.pathname);
  const { leftSideBarType } = useSelector((state) => state.Layout);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathName]);

  useEffect(() => {
    const handleLocationChange = () =>
      setPathName(props.router.location.pathname);
    handleLocationChange();
  }, [props.router.location.pathname]);

  const isActive = (path) => (pathName === path ? "mm-active" : ""); // Check if the current path matches

  const renderLink = (to, icon, label) => {
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
  };

  return (
    <div id="sidebar-menu">
      <ul className="metismenu list-unstyled" id="side-menu">
        <>
          {renderLink("/users", "ri-group-fill", "Users")}
          {renderLink("/products", "ri-shapes-fill", "Products")}
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
      </ul>
    </div>
  );
};

export default withRouter(SidebarContent);
