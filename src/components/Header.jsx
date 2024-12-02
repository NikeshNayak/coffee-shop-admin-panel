import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, FormGroup, InputGroup, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";
import snapShare from "../assets/app-logo.png";
import snapShareSM from "../assets/app-sm-logo.png";

const Header = ({ toggleMenuCallback, toggleChangeThemeCallback }) => {
  const [isSearch, setIsSearch] = useState(false);
  const { staffDetails, loading, error } = useSelector((state) => {
    console.log(state.staffDetails);
    return state.staffDetails;
  });

  const theme = useSelector((state) => state.Layout.theme);

  const toggleMenu = () => {
    toggleMenuCallback();
  };

  const changeLayoutTheme = (theme) => {
    toggleChangeThemeCallback(theme);
  };

  const toggleFullscreen = () => {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  };

  const getNavigationLink = () => {
    const permissionsMap = {
      dashboard: "/",
      companies: "/companies",
      agents: "/agents",
      categories: "/categories",
      keys: "/keys",
      reports: "/reports",
    };

    const userPermissions = staffDetails?.permissions || [];
    for (const { groupPermissionAlias } of userPermissions) {
      if (permissionsMap[groupPermissionAlias]) {
        return permissionsMap[groupPermissionAlias];
      }
    }
    return "/"; // Default if no permissions match
  };

  const navigationLink =
    staffDetails?.userType === "STAFF" ? getNavigationLink() : "/dashboard";

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to={navigationLink} className="logo logo-dark">
                <span className="logo-sm">
                  <img src={snapShareSM} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={snapShare} alt="" height="40" />
                </span>
              </Link>
              <Link to={navigationLink} className="logo logo-light">
                <span className="logo-sm">
                  <img src={snapShareSM} alt="" height="28" />
                </span>
                <span className="logo-lg">
                  <img src={snapShare} alt="" height="40" />
                </span>
              </Link>
            </div>
            <Button
              size="sm"
              color="none"
              type="button"
              onClick={toggleMenu}
              className="px-3 font-size-24 header-item waves-effect"
              id="vertical-menu-btn"
            >
              <i className="ri-menu-2-line align-middle"></i>
            </Button>
            {/* <Form className="app-search d-none d-lg-block">
              <div className="position-relative">
                <Input
                  type="text"
                  className="form-control"
                  placeholder={"Search"}
                />
                <span className="ri-search-line"></span>
              </div>
            </Form> */}
            {/* <MegaMenu /> */}
          </div>
          <div className="d-flex">
            <div className="dropdown d-inline-block d-lg-none ms-2">
              <button
                type="button"
                onClick={() => setIsSearch(!isSearch)}
                className="btn header-item noti-icon waves-effect"
                id="page-header-search-dropdown"
              >
                <i className="ri-search-line"></i>
              </button>
              <div
                className={
                  isSearch
                    ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <Form className="p-3">
                  <FormGroup className="m-0">
                    <InputGroup>
                      <Input
                        type="text"
                        className="form-control"
                        placeholder={"Search"}
                      />
                      <div className="input-group-append">
                        <Button color="primaryPurple" type="submit">
                          <i className="ri-search-line"></i>
                        </Button>
                      </div>
                    </InputGroup>
                  </FormGroup>
                </Form>
              </div>
            </div>
            {/* <LanguageDropdown /> */}
            <div className="dropdown d-none d-lg-inline-block ms-1">
              <Button
                color="none"
                type="button"
                className="header-item noti-icon waves-effect"
                onClick={toggleFullscreen}
              >
                <i className="ri-fullscreen-line"></i>
              </Button>
            </div>
            {/* <NotificationDropdown /> */}
            {/* <ProfileMenu /> */}
            <div className="dropdown d-inline-block">
              <Button
                color="none"
                onClick={() =>
                  theme === "light"
                    ? changeLayoutTheme("dark")
                    : changeLayoutTheme("light")
                }
                type="button"
                className="header-item noti-icon right-bar-toggle waves-effect"
              >
                {theme === "dark" && <i className="ri-sun-fill"></i>}
                {theme === "light" && <i className="ri-moon-fill"></i>}
              </Button>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
