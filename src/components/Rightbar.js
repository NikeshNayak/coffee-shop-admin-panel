import React, { useState, useEffect } from "react";
import { FormGroup, Label, Input } from "reactstrap";
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";
import "./rightbar.scss";
import layout1 from "../assets/images/layouts/layout-1.jpg";
import layout2 from "../assets/images/layouts/layout-2.jpg";
import layout3 from "../assets/images/layouts/layout-3.jpg";

const RightSidebar = (props) => {
  const [layoutType, setLayoutType] = useState(props.layoutType);
  const [sidebarType, setSidebarType] = useState(props.leftSideBarType);
  const [layoutWidth, setLayoutWidth] = useState(props.layoutWidth);
  const [sidebarTheme, setSidebarTheme] = useState(props.leftSideBarTheme);
  const [topbarTheme, setTopbarTheme] = useState(props.topbarTheme);
  const [theme, setTheme] = useState(props.theme);

  useEffect(() => {
    setLayoutType(props.layoutType);
    setSidebarType(props.leftSideBarType);
    setLayoutWidth(props.layoutWidth);
    setSidebarTheme(props.leftSideBarTheme);
    setTopbarTheme(props.topbarTheme);
    setTheme(props.theme);
  }, [
    props.layoutType,
    props.leftSideBarType,
    props.layoutWidth,
    props.leftSideBarTheme,
    props.topbarTheme,
    props.theme,
  ]);

  const hideRightbar = (e) => {
    e.preventDefault();
    props.hideRightSidebar();
  };

  const changeLayout = (e) => {
    if (e.target.checked) {
      props.changeLayout(e.target.value);
    }
  };

  const changeLayoutWidth = (e) => {
    if (e.target.checked) {
      props.changeLayoutWidth(e.target.value);
    }
  };

  const changeLeftSidebarType = (e) => {
    if (e.target.checked) {
      props.changeSidebarType(e.target.value);
    }
  };

  const changeLeftSidebarTheme = (e) => {
    if (e.target.checked) {
      props.changeSidebarTheme(e.target.value);
    }
  };

  const changeTopbarTheme = (e) => {
    if (e.target.checked) {
      props.changeTopbarTheme(e.target.value);
    }
  };

  const changeLayoutTheme = (e) => {
    if (e.target.checked) {
      props.changeLayoutTheme(e.target.value);
    }
  };

  const changeThemePreloader = () => {
    props.changePreloader(!props.isPreloader);
  };

  return (
    <React.Fragment>
      <div className="right-bar">
        <SimpleBar style={{ height: "900px" }}>
          <div data-simplebar className="h-100">
            <div className="rightbar-title px-3 py-4">
              <Link to="#" onClick={hideRightbar} className="right-bar-toggle float-end">
                <i className="mdi mdi-close noti-icon"></i>
              </Link>
              <h5 className="m-0">Settings</h5>
            </div>

            <hr className="my-0" />

            <div className="p-4">
              <div className="radio-toolbar">
                <span className="mb-2 d-block">Layouts</span>
                <Input
                  type="radio"
                  id="radioVertical"
                  name="radioFruit"
                  value="vertical"
                  checked={layoutType === "vertical"}
                  onChange={changeLayout}
                />
                <Label htmlFor="radioVertical">Vertical</Label>
                {"   "}
                <Input
                  type="radio"
                  id="radioHorizontal"
                  name="radioFruit"
                  value="horizontal"
                  checked={layoutType === "horizontal"}
                  onChange={changeLayout}
                />
                <Label htmlFor="radioHorizontal">Horizontal</Label>
              </div>

              <hr className="mt-1" />

              <div className="radio-toolbar">
                <span className="mb-2 d-block" id="radio-title">Layout Width</span>
                <Input
                  type="radio"
                  id="radioFluid"
                  name="radioWidth"
                  value="fluid"
                  checked={layoutWidth !== "boxed"}
                  onChange={changeLayoutWidth}
                />
                <Label htmlFor="radioFluid">Fluid</Label>
                {"   "}
                <Input
                  type="radio"
                  id="radioBoxed"
                  name="radioWidth"
                  value="boxed"
                  checked={layoutWidth === "boxed"}
                  onChange={changeLayoutWidth}
                />
                <Label htmlFor="radioBoxed">Boxed</Label>
              </div>
              <hr className="mt-1" />

              <div className="radio-toolbar">
                <span className="mb-2 d-block" id="radio-title">Topbar Theme</span>
                <Input
                  type="radio"
                  id="radioThemeLight"
                  name="radioTheme"
                  value="light"
                  checked={topbarTheme === "light"}
                  onChange={changeTopbarTheme}
                />
                <Label htmlFor="radioThemeLight">Light</Label>
                {"   "}
                <Input
                  type="radio"
                  id="radioThemeDark"
                  name="radioTheme"
                  value="dark"
                  checked={topbarTheme === "dark"}
                  onChange={changeTopbarTheme}
                />
                <Label htmlFor="radioThemeDark">Dark</Label>
                {"   "}
              </div>

              <div className="radio-toolbar">
                <span className="mb-2 d-block" id="radio-title">Theme</span>
                <Input
                  type="radio"
                  id="radioThemeLightMode"
                  name="radioThemeMode"
                  value="light"
                  checked={theme === "light"}
                  onClick={changeLayoutTheme}
                  onChange={changeLayoutTheme}
                />
                <Label htmlFor="radioThemeLightMode">Light</Label>
                {"   "}
                <Input
                  type="radio"
                  id="radioThemeDarkMode"
                  name="radioThemeMode"
                  value="dark"
                  checked={theme === "dark"}
                  onClick={changeLayoutTheme}
                  onChange={changeLayoutTheme}
                />
                <Label htmlFor="radioThemeDarkMode">Dark</Label>
                {"   "}
              </div>

              {layoutType === "vertical" ? (
                <React.Fragment>
                  <hr className="mt-1" />
                  <div className="radio-toolbar">
                    <span className="mb-2 d-block" id="radio-title">Left Sidebar Type</span>
                    <Input
                      type="radio"
                      id="sidebarDefault"
                      name="sidebarType"
                      value="default"
                      checked={sidebarType === "default"}
                      onChange={changeLeftSidebarType}
                    />
                    <Label htmlFor="sidebarDefault">Default</Label>
                    {"   "}
                    <Input
                      type="radio"
                      id="sidebarCompact"
                      name="sidebarType"
                      value="compact"
                      checked={sidebarType === "compact"}
                      onChange={changeLeftSidebarType}
                    />
                    <Label htmlFor="sidebarCompact">Compact</Label>
                    {"   "}
                    <Input
                      type="radio"
                      id="sidebarIcon"
                      name="sidebarType"
                      value="icon"
                      checked={sidebarType === "icon"}
                      onChange={changeLeftSidebarType}
                    />
                    <Label htmlFor="sidebarIcon">Icon</Label>
                  </div>

                  <hr className="mt-1" />

                  <div className="radio-toolbar">
                    <span className="mb-2 d-block" id="radio-title">Left Sidebar Color</span>
                    <Input
                      type="radio"
                      id="leftsidebarThemelight"
                      name="leftsidebarTheme"
                      value="light"
                      checked={sidebarTheme === "light"}
                      onChange={changeLeftSidebarTheme}
                    />
                    <Label htmlFor="leftsidebarThemelight">Light</Label>
                    {"   "}
                    <Input
                      type="radio"
                      id="leftsidebarThemedark"
                      name="leftsidebarTheme"
                      value="dark"
                      checked={sidebarTheme === "dark"}
                      onChange={changeLeftSidebarTheme}
                    />
                    <Label htmlFor="leftsidebarThemedark">Dark</Label>
                    {"   "}
                    <Input
                      type="radio"
                      id="leftsidebarThemecolored"
                      name="leftsidebarTheme"
                      value="colored"
                      checked={sidebarTheme === "colored"}
                      onChange={changeLeftSidebarTheme}
                    />
                    <Label htmlFor="leftsidebarThemecolored">Colored</Label>
                  </div>

                  <hr className="mt-1" />
                </React.Fragment>
              ) : null}

              <FormGroup>
                <span className="mb-2 d-block" id="radio-title">Preloader</span>
                <div className="form-check form-switch mb-3">
                  <Input
                    type="checkbox"
                    className="form-check-input theme-choice"
                    id="checkbox_1"
                    checked={props.isPreloader}
                    onChange={changeThemePreloader}
                  />
                  <Label className="form-check-label" htmlFor="checkbox_1">Preloader</Label>
                </div>
              </FormGroup>

              <h6 className="text-center">Choose Layouts</h6>

              <div className="mb-2">
                <Link to="#" target="_blank">
                  <img src={layout1} className="img-fluid img-thumbnail" alt="" />
                </Link>
              </div>

              <div className="mb-2">
                <Link to="#" target="_blank">
                  <img src={layout2} className="img-fluid img-thumbnail" alt="" />
                </Link>
              </div>

              <div className="mb-2">
                <Link to="#" target="_blank">
                  <img src={layout3} className="img-fluid img-thumbnail" alt="" />
                </Link>
              </div>

              <Link
                to="#"
                className="btn btn-primary btn-block mt-3"
                target="_blank"
              >
                <i className="mdi mdi-cart me-1"></i> Purchase Now
              </Link>
            </div>
          </div>
        </SimpleBar>
      </div>
      <div className="rightbar-overlay"></div>
    </React.Fragment>
  );
};

export default RightSidebar;
