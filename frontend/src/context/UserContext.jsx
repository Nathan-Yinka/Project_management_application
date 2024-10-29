import React, { createContext, useContext, useMemo } from "react";
import { useUser } from "@/hooks/useUser";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const userContext = useUser();

    const value = useMemo(() => ({
        ...userContext,
    }), [userContext]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);
