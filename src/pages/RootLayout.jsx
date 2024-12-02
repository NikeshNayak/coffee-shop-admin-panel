import { Outlet, useLoaderData, useLocation } from "react-router-dom";
import Sidebar from "../components/SideMenu";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Layout from "./Layout";
import Footer from "../components/Footer";
import { authProtectedRoutes } from "../routes";

function RootLayout() {
  const token = useLoaderData();
  const location = useLocation();

  const knownRoutes = authProtectedRoutes.filter((value) => value !== '*');
  console.log(knownRoutes);
  const is404Page = !knownRoutes.includes(location.pathname);
  console.log(location.pathname);

  return (
    <>
      <div id="layout-wrapper">
        {!is404Page && <Header />}
        {!is404Page && <NavBar />}
        <div className="main-content">
          {<Outlet />}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default RootLayout;
