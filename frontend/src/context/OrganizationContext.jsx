// OrganizationProvider.jsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useOrganization } from "@/hooks/useOrganization";

const OrganizationContext = createContext();

export const OrganizationProvider = ({ children }) => {
  const organizationContext = useOrganization();
  const [initLoading, setInitLoading] = useState(false);

  // Initialize function to fetch organizations at start
  const value = useMemo(
    () => ({
      ...organizationContext,
    }),
    [organizationContext],
  );

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganizationContext = () => useContext(OrganizationContext);
