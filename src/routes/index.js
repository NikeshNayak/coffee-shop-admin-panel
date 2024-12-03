import React from "react";
import { Navigate } from "react-router-dom";

// Dashboard
import LoginPage from "../pages/Login/LoginPage";
import Error404 from "../pages/Error/Error404";
import ChangePasswordPage from "../pages/Login/changePasswordPage";
import ForgotPasswordPage from "../pages/Login/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Login/ResetPasswordPage";
import UsersListPage from "../pages/Users/UsersListPage";
import ViewUserPage from "../pages/Users/ViewUserPage";
import AddProductPage from "../pages/Products/AddProductPage";
import ProductsListPage from "../pages/Products/ProductsListPage";
import UpdateProductPage from "../pages/Products/UpdateProductPage";
import ViewProductPage from "../pages/Products/ViewProductPage";

const authProtectedRoutes = [

  { path: "/products", component: <ProductsListPage /> },
  { path: "/add-new-product", component: <AddProductPage /> },
  { path: "/edit-product/:productId", component: <UpdateProductPage /> },
  { path: "/view-product/:productId", component: <ViewProductPage /> },

  { path: "/users", component: <UsersListPage /> },
  { path: "/view-user/:userId", component: <ViewUserPage /> },

  { path: "/changepassword", component: <ChangePasswordPage /> },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: <Navigate to="/users" /> },
  // 404 route should be at the end
  { path: "*", component: <Error404 /> }, // 404 page
];

const publicRoutes = [
  { path: "/login", component: <LoginPage /> },
  { path: "*", component: <Error404 /> }, // 404 page

  { path: "/forgot-password", component: <ForgotPasswordPage /> },
  { path: "/reset-password/:token", component: <ResetPasswordPage /> },
];

export { authProtectedRoutes, publicRoutes };
