import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getAuthToken } from "../util/auth";

const AppRoute = (props) => {
  // const navigate = useNavigate();
  const token = getAuthToken();
  //
  if (!token || token === null) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default AppRoute;
