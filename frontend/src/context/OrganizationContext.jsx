// OrganizationProvider.jsx
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useOrganization } from "@/hooks/useOrganization";

const OrganizationContext = createContext(); 

export const OrganizationProvider = ({ children }) => {
    const organizationContext = useOrganization();
    const [initLoading, setInitLoading] = useState(false);

    // Initialize function to fetch organizations at start
    const init = async () => {
        if (initLoading) return; // Avoid re-triggering
        setInitLoading(true);
        try {
            await organizationContext.fetchAllOrganizations();
        } finally {
            setInitLoading(false);
        }
    };

    useEffect(() => {
        init(); // Automatically initialize on mount
    }, []); // Empty dependency ensures it runs once on mount

    const value = useMemo(() => ({
        ...organizationContext,
        initLoading,
    }), [organizationContext, initLoading]);

    return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
};

export const useOrganizationContext = () => useContext(OrganizationContext);
