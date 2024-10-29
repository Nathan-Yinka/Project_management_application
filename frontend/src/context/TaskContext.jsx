import React, { createContext, useContext, useMemo } from "react";
import { useTask } from "@/hooks/useTask";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const taskContext = useTask();

    const value = useMemo(() => ({
        ...taskContext,
    }), [taskContext]);

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => useContext(TaskContext);
