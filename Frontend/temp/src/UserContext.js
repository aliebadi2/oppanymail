import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import config from "./config";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Define checkLoginStatus using useCallback to avoid unnecessary re-renders
  const checkLoginStatus = useCallback(async () => {
    try {
      const response = await axios.get(`${config.path}/is_logged_in`, {
        withCredentials: true,
      });
      const { is_logged_in, user_id, username, role } = response.data;
      setIsLoggedIn(is_logged_in);
      setUserInfo(is_logged_in ? { user_id, username, role } : null);
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();  // Check login status on component mount
  }, [checkLoginStatus]);

  return (
    <UserContext.Provider
      value={{ isLoggedIn, userInfo, setIsLoggedIn, setUserInfo, checkLoginStatus }}
    >
      {children}
    </UserContext.Provider>
  );
};
