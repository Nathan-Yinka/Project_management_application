import React, { useEffect, useState } from "react";
import ListCard from "@/components/dashboard/ListCard";
import TaskListSkeleton from "@/components/loaders/TaskListSkeleton";
import done_icon from "../../assets/done.svg";
import abandoned_icon from "../../assets/abandoned.svg";
import cancel_icon from "../../assets/cancelled.svg";
import in_progress_icon from "../../assets/in_progress.svg";
import { useTaskContext } from "@/context/TaskContext";
import { useOrganizationContext } from "@/context/OrganizationContext";

// Statuses and Icons
const statuses = ["abandoned", "in_progress", "canceled", "done"];
const statusIcons = {
  abandoned: abandoned_icon,
  in_progress: in_progress_icon,
  canceled: cancel_icon,
  done: done_icon,
};
const statusLabels = {
  abandoned: "Abandoned",
  in_progress: "In Progress",
  canceled: "Canceled",
  done: "Done",
};

// Functions to get gradient and header backgrounds
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

const TaskListView = ({ onTaskClick }) => {
  const { allTasks, isLoadingAll } = useTaskContext();
  const { initLoading } = useOrganizationContext();
  const [isLoadingMain, setIsLoadingMain] = useState(
    initLoading || isLoadingAll,
  );

  useEffect(() => {
    setIsLoadingMain(initLoading || isLoadingAll);
  }, [initLoading, isLoadingAll]);

  // Group tasks by status
  const groupedTasks = allTasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {});

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4 max-w-full mx-auto">
      {statuses.map((status) => (
        <div
          key={status}
          className="mb-8 rounded-lg"
          style={getGradientBackground(status)}
        >
          <div
            className="flex items-center gap-2 p-3 mb-4 rounded-md"
            style={getHeaderBackground(status)}
          >
            <img
              src={statusIcons[status]}
              alt={`${statusLabels[status]} icon`}
              className="w-5 h-5"
            />
            <h2 className="text-lg font-bold text-gray-800">
              {statusLabels[status]}
            </h2>
          </div>

          <div className="overflow-x-auto mb-4">
            <table className="min-w-[1000px] w-full">
              <thead>
                <tr className="text-gray-500 font-normal border-b">
                  <th className="px-4 py-2 text-left min-w-[220px]">Name</th>
                  <th className="px-4 py-2 text-center min-w-[180px]">
                    Assignee
                  </th>
                  <th className="px-4 py-2 text-center min-w-[180px]">
                    Due Date
                  </th>
                  <th className="px-4 py-2 text-center min-w-[140px]">
                    Priority
                  </th>
                  <th className="px-4 py-2 text-center min-w-[240px]">
                    Task Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoadingMain ? (
                  <TaskListSkeleton />
                ) : (
                  (groupedTasks[status] || []).map((task) => (
                    <ListCard
                      key={task.id}
                      task={task}
                      onTaskClick={() => onTaskClick(task)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskListView;
