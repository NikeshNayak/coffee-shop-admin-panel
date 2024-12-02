import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  toggleRightSidebar,
  changeTopbarTheme,
  changeLayoutTheme,
  changeLayoutWidth,
} from "../store/actions";

// Layout Related Components
import Header from "../components/Header";
import Sidebar from "../components/SideBar";
// import Footer from "./Footer";
import Rightbar from "../components/Rightbar";
import withRouter from "../components/withRouter";

const Layout = (props) => {
  const [isMobile, setIsMobile] = useState(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  
  const dispatch = useDispatch();
  
  const {
    leftSideBarTheme,
    layoutWidth,
    leftSideBarType,
    topbarTheme,
    theme,
    showRightSidebar,
    isPreloader,
  } = useSelector((state) => state.Layout);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(1).toUpperCase() + string.slice(2);
  };

  useEffect(() => {
    if (isPreloader) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";

      setTimeout(() => {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("status").style.display = "none";
      }, 2500);
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }
  }, [isPreloader]);

  useEffect(() => {
    // Scroll Top to 0
    window.scrollTo(0, 0);

    let currentPage = capitalizeFirstLetter(props.router.location.pathname);
    currentPage = currentPage.replaceAll("-", " ");

    document.title = `${currentPage}`;

    if (leftSideBarTheme) {
      dispatch(changeSidebarTheme(leftSideBarTheme));
    }

    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }

    if (leftSideBarType) {
      dispatch(changeSidebarType(leftSideBarType));
    }

    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }

    if (theme) {
      dispatch(changeLayoutTheme(theme));
    }
  }, [
    dispatch,
    leftSideBarTheme,
    layoutWidth,
    leftSideBarType,
    topbarTheme,
    theme,
    showRightSidebar,
    props.router.location.pathname,
  ]);

  const toggleMenuCallback = () => {
    if (leftSideBarType === "default") {
      dispatch(changeSidebarType("condensed", isMobile));
    } else if (leftSideBarType === "condensed") {
      dispatch(changeSidebarType("default", isMobile));
    }
  };

  const toggleChangeThemeCallback = () => {
    if (theme === "light") {
      dispatch(changeLayoutTheme("dark"));
      dispatch(changeSidebarTheme("dark"));
    } else {
      dispatch(changeLayoutTheme("light"));
      dispatch(changeSidebarTheme("light"));
    }
  };

  return (
    <React.Fragment>
      <div id="preloader">
        <div id="status">
          <div className="spinner">
            <i className="ri-loader-line spin-icon"></i>
          </div>
        </div>
      </div>

      <div id="layout-wrapper">
        <Header
          toggleMenuCallback={toggleMenuCallback}
          toggleChangeThemeCallback={toggleChangeThemeCallback}
        />
        <Sidebar
          theme={leftSideBarTheme}
          type={leftSideBarType}
          isMobile={isMobile}
        />
        <div className="main-content">
          {props.children}
          {/* <Footer /> */}
        </div>
      </div>
      <Rightbar />
    </React.Fragment>
  );
};

export default withRouter(Layout);
