import React, { useState, useEffect } from "react";
import ProjectList from "./ProjectList";
import ProjectListLoad from "../loaders/ProjectListLoad";
import taskData from "../../data/task";
import done_icon from "../../assets/done.svg";
import abandoned_icon from "../../assets/abandoned.svg";
import cancel_icon from "../../assets/cancelled.svg";
import in_progress_icon from "../../assets/in_progress.svg";
import plus_icon from "../../assets/plus.svg";

const TaskBoard = ({ onTaskClick }) => {
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const statuses = ["Abandoned", "In Progress", "Canceled", "Done"];

  // Icon mapping based on status
  const statusIcons = {
    Abandoned: abandoned_icon,
    "In Progress": in_progress_icon,
    Canceled: cancel_icon,
    Done: done_icon,
  };

  // Simulate data loading with a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after data is "loaded"
    }, 2000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, []);

  // Group tasks by status
  const groupedTasks = taskData.reduce((acc, task) => {
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
          className="flex-shrink-0 rounded-lg flex flex-col bg-white"
          style={getGradientBackground(status)}
        >
          <div
            className="flex items-center justify-center mb-3 p-2 rounded-md text-center m-3 py-3"
            style={getHeaderBackground(status)}
          >
            <img src={statusIcons[status]} alt={`${status} icon`} className="mr-2" />
            <span className="md:text-lg font-bold">{status}</span>
          </div>
          <button className="text-sm text-black items-center mb-4 rounded-md p-2 m-3 bg-white justify-center hidden md:flex">
            <img src={plus_icon} className="mr-2" alt="" /> Add Task
          </button>
          <div className="flex-1 overflow-y-auto p-2">
            {isLoading ? (
              <ProjectListLoad /> // Render loader while loading
            ) : (
              <ProjectList tasks={groupedTasks[status] || [] } onTaskClick={onTaskClick} /> // Render actual list after loading
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const getGradientBackground = (status) => {
  switch (status) {
    case "Abandoned":
      return {
        background: "linear-gradient(180deg, rgba(74, 74, 74, 0.04) 0%, rgba(74, 74, 74, 0) 36.76%)",
      };
    case "In Progress":
      return {
        background: "linear-gradient(180deg, rgba(246, 20, 91, 0.04) 0%, rgba(246, 20, 91, 0) 36.92%)",
      };
    case "Canceled":
      return {
        background: "linear-gradient(180deg, rgba(246, 114, 20, 0.04) 0%, rgba(246, 114, 20, 0) 36.6%)",
      };
    case "Done":
      return {
        background: "linear-gradient(180deg, rgba(0, 218, 65, 0.04) 0%, rgba(0, 218, 65, 0) 36.92%)",
      };
    default:
      return {
        background: "linear-gradient(180deg, rgba(74, 74, 74, 0.04) 0%, rgba(74, 74, 74, 0) 36.76%)",
      };
  }
};

const getHeaderBackground = (status) => {
  switch (status) {
    case "Abandoned":
      return { backgroundColor: "rgba(74, 74, 74, 0.1)" };
    case "In Progress":
      return { backgroundColor: "rgba(246, 20, 91, 0.1)" };
    case "Canceled":
      return { backgroundColor: "rgba(246, 114, 20, 0.1)" };
    case "Done":
      return { backgroundColor: "rgba(0, 218, 65, 0.1)" };
    default:
      return { backgroundColor: "rgba(74, 74, 74, 0.1)" };
  }
};

export default TaskBoard;
