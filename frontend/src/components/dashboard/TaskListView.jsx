import React, { useState, useEffect } from "react";
import ListCard from "@/components/dashboard/ListCard";
import TaskListSkeleton from "@/components/loaders/TaskListSkeleton";
import taskData from "../../data/task";
import done_icon from "../../assets/done.svg";
import abandoned_icon from "../../assets/abandoned.svg";
import cancel_icon from "../../assets/cancelled.svg";
import in_progress_icon from "../../assets/in_progress.svg";

const TaskListView = ({ onTaskClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const statuses = ["Abandoned", "In Progress", "Canceled", "Done"];

  const statusIcons = {
    Abandoned: abandoned_icon,
    "In Progress": in_progress_icon,
    Canceled: cancel_icon,
    Done: done_icon,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const groupedTasks = taskData.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {});

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4">
      {statuses.map((status) => (
        <div key={status} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <img src={statusIcons[status]} alt={`${status} icon`} className="w-5 h-5" />
            <h2 className="text-lg text-gray-800">{status}</h2>
          </div>

          <div className="overflow-x-auto mb-4">
            <table className="min-w-[1000px] w-full">
              <thead>
                <tr className="text-gray-500 font-normal border-b">
                  <th className="px-4 py-2 text-left min-w-[220px]">Name</th>
                  <th className="px-4 py-2 text-center min-w-[180px]">Assignee</th>
                  <th className="px-4 py-2 text-center min-w-[180px]">Due Date</th>
                  <th className="px-4 py-2 text-center min-w-[140px]">Priority</th>
                  <th className="px-4 py-2 text-center min-w-[240px]">Task Details</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TaskListSkeleton />
                ) : (
                  (groupedTasks[status] || []).map((task) => (
                    <ListCard key={task.id} task={task} onTaskClick={() => onTaskClick(task)} />
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
