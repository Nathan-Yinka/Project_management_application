// AppProvider.jsx
import React, { useEffect } from "react";
import { TaskProvider } from "@/context/TaskContext";
import { OrganizationProvider, useOrganizationContext } from "@/context/OrganizationContext";
import { UserProvider } from "@/context/UserContext";

const OrganizationInitializer = ({ children }) => {
    const { init: initOrganizations } = useOrganizationContext();

    useEffect(() => {
        initOrganizations();
    }, [initOrganizations]);

    return <>{children}</>;
};

export const AppProvider = ({ children }) => {
    return (
        <OrganizationProvider>
            <OrganizationInitializer>
                <TaskProvider>
                    <UserProvider>
                        {children}
                    </UserProvider>
                </TaskProvider>
            </OrganizationInitializer>
        </OrganizationProvider>
    );
};
