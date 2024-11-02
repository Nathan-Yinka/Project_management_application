// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  isLoggedIn,
  getToken,
  handleLoginSuccess,
  handleLogout,
} from "@/helpers/auth";

const AuthContext = createContext();
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const navigate = useNavigate();

  // useEffect(() => {
  //     // Redirect to login if no token is found
  //     if (!isLoggedIn()) {
  //         navigate("/login");
  //     }
  // }, [token, navigate]);

  useEffect(() => {
    // Listen for token changes in localStorage and update state
    const handleTokenChange = (e) => {
      if (e.key === "authToken") {
        setToken(getToken());
        window.location.reload(); // Refresh page on token update
      }
    };
    window.addEventListener("storage", handleTokenChange);

    return () => window.removeEventListener("storage", handleTokenChange);
  }, []);

  const login = (payload) => {
    handleLoginSuccess(payload);
    setToken(payload.token);
  };

  const logout = () => {
    handleLogout();
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
