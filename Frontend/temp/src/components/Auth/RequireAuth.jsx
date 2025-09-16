import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

const RequireAuth = ({ children }) => {
  const { isLoggedIn, checkLoginStatus } = useContext(UserContext);

  useEffect(() => {
    checkLoginStatus(); 
  }, [checkLoginStatus]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RequireAuth;
