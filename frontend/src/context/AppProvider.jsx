// AppProvider.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TaskProvider } from "@/context/TaskContext";
import {
  OrganizationProvider,
  useOrganizationContext,
} from "@/context/OrganizationContext";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider, useAuthContext } from "@/context/AuthContext";

const OrganizationInitializer = ({ children }) => {
  const { init: initOrganizations } = useOrganizationContext();
  const { token } = useAuthContext(); // Get token from AuthContext

  useEffect(() => {
    // console.log(token);
    if (token) {
      initOrganizations();
    }
  }, [token, initOrganizations]);

  return <>{children}</>;
};

const AuthInitializer = ({ children }) => {
  const { token } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && location.pathname !== "/signup") {
      navigate("/login");
    }
  }, [token, navigate]);

  return <>{children}</>;
};

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <AuthInitializer>
        <OrganizationProvider>
          <OrganizationInitializer>
            <TaskProvider>
              <UserProvider>{children}</UserProvider>
            </TaskProvider>
          </OrganizationInitializer>
        </OrganizationProvider>
      </AuthInitializer>
    </AuthProvider>
  );
};
