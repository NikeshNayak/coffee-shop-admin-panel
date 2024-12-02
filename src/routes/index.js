import React from "react";
import { Navigate } from "react-router-dom";

// Dashboard
import Dashboard from "../pages/Dashboard/Dashboard";
import KeysListPage from "../pages/Keys/KeysListPage";
import AgentsListPage from "../pages/Agents/AgentsListPage";
import CompaniesListPage from "../pages/Companies/CompaniesListPage";
import CategoriesListPage from "../pages/Categories/CategoriesListPage";
import AddAgentPage from "../pages/Agents/AddAgentPage";
import UpdateAgentPage from "../pages/Agents/UpdateAgentPage";
import CreateCompanyPage from "../pages/Companies/CreateCompanyPage";
import UpdateCompanyPage from "../pages/Companies/UpdateCompanyPage";
import CreateCategoryPage from "../pages/Categories/CreateCategoryPage";
import LoginPage from "../pages/Login/LoginPage";
import ViewCompanyPage from "../pages/Companies/ViewCompanyPage";
import UpdateCategoryPage from "../pages/Categories/UpdateCategoryPage";
import ViewCategoryPage from "../pages/Categories/ViewCategoryPage";
import ViewAgentPage from "../pages/Agents/ViewAgentPage";
import Error404 from "../pages/Error/Error404";
import ReportsPage from "../pages/Reports/ReportsPage";
import ChangePasswordPage from "../pages/Login/changePasswordPage";
import ForgotPasswordPage from "../pages/Login/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Login/ResetPasswordPage";
import StaffListPage from "../pages/Staff/StaffListPage";
import AddStaffPage from "../pages/Staff/AddStaffPage";
import EditStaffPage from "../pages/Staff/EditStaffPage";
import ViewStaffPage from "../pages/Staff/ViewStaffPage";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/keys", component: <KeysListPage /> },
  { path: "/reports", component: <ReportsPage /> },

  { path: "/companies", component: <CompaniesListPage /> },
  { path: "/add-new-company", component: <CreateCompanyPage /> },
  { path: "/edit-company/:companyId", component: <UpdateCompanyPage /> },
  { path: "/view-company/:companyId", component: <ViewCompanyPage /> },

  { path: "/agents", component: <AgentsListPage /> },
  { path: "/add-new-agent", component: <AddAgentPage /> },
  { path: "/edit-agent/:agentId", component: <UpdateAgentPage /> },
  { path: "/view-agent/:agentId", component: <ViewAgentPage /> },

  { path: "/categories", component: <CategoriesListPage /> },
  { path: "/add-new-category/:companyId", component: <CreateCategoryPage /> },
  {
    path: "/edit-category/:categoryId/:companyId",
    component: <UpdateCategoryPage />,
  },
  { path: "/view-category/:categoryId", component: <ViewCategoryPage /> },
  
  { path: "/staff-list", component: <StaffListPage /> },
  { path: "/add-new-staff", component: <AddStaffPage /> },
  { path: "/edit-staff/:staffId", component: <EditStaffPage /> },
  { path: "/view-staff/:staffId", component: <ViewStaffPage /> },

  { path: "/changepassword", component: <ChangePasswordPage /> },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  // 404 route should be at the end
  { path: "*", component: <Error404 /> }, // 404 page
];

const publicRoutes = [
  // { path: "/logout", component: <Logout /> },
  { path: "/login", component: <LoginPage /> },
  { path: "*", component: <Error404 /> }, // 404 page

  { path: "/forgot-password", component: <ForgotPasswordPage /> },
  { path: "/reset-password/:token", component: <ResetPasswordPage /> },
  // { path: "/register", component: <Register /> },
  // // Authentication Inner
  // { path: "/auth-login", component: <Login1 /> },
  // { path: "/auth-register", component: <Register1 /> },
  // { path: "/auth-recoverpw", component: <ForgetPwd1 /> },
  // { path: "/maintenance", component: <Maintenance /> },
  // { path: "/comingsoon", component: <CommingSoon /> },
  // { path: "/404", component: <Error404 /> },
  // { path: "/500", component: <Error500 /> },
];

export { authProtectedRoutes, publicRoutes };
