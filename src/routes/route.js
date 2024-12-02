import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { getAuthToken } from "../util/auth";
import { fetchStaffDetails } from "../store/admin/adminDetailsSlice";

const AppRoute = (props) => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = getAuthToken();
  //
  useEffect(() => {
    const staffId = localStorage.getItem("staffId");
    if (token && staffId) {
      dispatch(fetchStaffDetails({ staffId: staffId })); // Fetch agent details on app load
    }
  }, [dispatch, token]);

  if (!token || token === null) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default AppRoute;
