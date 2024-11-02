import React, { useState, useEffect } from "react";
import ProjectList from "./ProjectList";
import ProjectListLoad from "../loaders/ProjectListLoad";
import done_icon from "../../assets/done.svg";
import abandoned_icon from "../../assets/abandoned.svg";
import cancel_icon from "../../assets/cancelled.svg";
import in_progress_icon from "../../assets/in_progress.svg";
import plus_icon from "../../assets/plus.svg";
import { useTaskContext } from "@/context/TaskContext";
import { useOrganizationContext } from "@/context/OrganizationContext";

const TaskBoard = ({ onTaskClick }) => {
  const { allTasks, isLoadingAll } = useTaskContext();
  const { initLoading } = useOrganizationContext();
  const [isLoadingMain, setIsLoadingMain] = useState(
    initLoading || isLoadingAll,
  );

  useEffect(() => {
    setIsLoadingMain(initLoading || isLoadingAll);
  }, [initLoading, isLoadingAll]);

  const statuses = ["abandoned", "in_progress", "canceled", "done"];

  // Icon mapping based on status key
  const statusIcons = {
    abandoned: abandoned_icon,
    in_progress: in_progress_icon,
    canceled: cancel_icon,
    done: done_icon,
  };

  // Label mapping based on status key
  const statusLabels = {
    abandoned: "Abandoned",
    in_progress: "In Progress",
    canceled: "Canceled",
    done: "Done",
  };

  // console.log(allTasks);

  // Group tasks by status key
  const groupedTasks = allTasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {});

  return (
    <div className="flex space-x-4 p-4 overflow-auto h-full justify-between">
      {statuses.map((status) => (
        <div
          key={status}
          className="flex-shrink-0 rounded-lg flex flex-col bg-white min-w-[19rem]"
          style={getGradientBackground(status)}
        >
          <div
            className="flex items-center justify-center mb-3 p-2 rounded-md text-center m-3 py-3"
            style={getHeaderBackground(status)}
          >
            <img
              src={statusIcons[status]}
              alt={`${statusLabels[status]} icon`}
              className="mr-2"
            />
            <span className="md:text-lg font-bold">{statusLabels[status]}</span>
          </div>
          <button className="text-sm text-black items-center mb-4 rounded-md p-2 m-3 bg-white justify-center hidden md:flex">
            <img src={plus_icon} className="mr-2" alt="" /> Add Task
          </button>
          <div className="flex-1 overflow-y-auto p-2">
            {isLoadingMain ? (
              <ProjectListLoad /> // Render loader while loading
            ) : (
              <ProjectList
                tasks={groupedTasks[status] || []}
                onTaskClick={onTaskClick}
              /> // Render actual list after loading
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const getGradientBackground = (status) => {
  switch (status) {
    case "abandoned":
      return {
        background:
          "linear-gradient(180deg, rgba(74, 74, 74, 0.04) 0%, rgba(74, 74, 74, 0) 36.76%)",
      };
    case "in_progress":
      return {
        background:
          "linear-gradient(180deg, rgba(246, 20, 91, 0.04) 0%, rgba(246, 20, 91, 0) 36.92%)",
      };
    case "canceled":
      return {
        background:
          "linear-gradient(180deg, rgba(246, 114, 20, 0.04) 0%, rgba(246, 114, 20, 0) 36.6%)",
      };
    case "done":
      return {
        background:
          "linear-gradient(180deg, rgba(0, 218, 65, 0.04) 0%, rgba(0, 218, 65, 0) 36.92%)",
      };
    default:
      return {
        background:
          "linear-gradient(180deg, rgba(74, 74, 74, 0.04) 0%, rgba(74, 74, 74, 0) 36.76%)",
      };
  }
};

const getHeaderBackground = (status) => {
  switch (status) {
    case "abandoned":
      return { backgroundColor: "rgba(74, 74, 74, 0.1)" };
    case "in_progress":
      return { backgroundColor: "rgba(246, 20, 91, 0.1)" };
    case "canceled":
      return { backgroundColor: "rgba(246, 114, 20, 0.1)" };
    case "done":
      return { backgroundColor: "rgba(0, 218, 65, 0.1)" };
    default:
      return { backgroundColor: "rgba(74, 74, 74, 0.1)" };
  }
};

export default TaskBoard;
