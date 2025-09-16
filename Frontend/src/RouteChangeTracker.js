import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loader from "./components/Loader/Loader";

const RouteChangeTracker = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show loader on route change
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 800); // Simulate load time

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, [location]);

  return (
    <>
      {loading && <Loader />}
      {!loading && children}
    </>
  );
};

export default RouteChangeTracker;
