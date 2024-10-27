// TaskListSkeleton.jsx
import React from "react";

const TaskListSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="animate-pulse border-b last:border-none">
          {/* Name Column Skeleton */}
          <td className="px-4 py-2 whitespace-nowrap min-w-[220px]">
            <div className="bg-gray-200 h-4 w-3/4 rounded-md"></div>
          </td>

          {/* Assignee Column Skeleton */}
          <td className="px-4 py-2 text-center min-w-[180px]">
            <div className="bg-gray-200 h-6 w-1/2 rounded-full mx-auto"></div>
          </td>

          {/* Due Date Column Skeleton */}
          <td className="px-4 py-2 text-center min-w-[180px]">
            <div className="bg-gray-200 h-4 w-2/3 mx-auto rounded-md"></div>
          </td>

          {/* Priority Column Skeleton */}
          <td className="px-4 py-2 text-center min-w-[140px]">
            <div className="bg-gray-200 h-6 w-1/2 rounded-full mx-auto"></div>
          </td>

          {/* Task Details Column Skeleton */}
          <td className="px-4 py-2 text-center min-w-[240px]">
            <div className="bg-gray-200 h-4 w-full rounded-md mb-1"></div>
            <div className="bg-gray-200 h-4 w-3/4 rounded-md"></div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default TaskListSkeleton;
