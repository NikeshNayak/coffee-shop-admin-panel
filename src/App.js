import { useSelector } from "react-redux";
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { authProtectedRoutes, publicRoutes } from "./routes";
import NonAuthLayout from "./pages/NonAuthLayout";
import "./assets/scss/theme.scss";
import "./index.css";
import AppRoute from "./routes/route";
import Layout from "./pages/Layout";

const App = () => {
  const layout = useSelector((state) => state.Layout);
  return (
    <React.Fragment>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
            key={idx}
            exact={true}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <AppRoute>
                <Layout>{route.component}</Layout>
              </AppRoute>
            }
            key={idx}
          />
        ))}
      </Routes>
    </React.Fragment>
  );
};

export default App;
