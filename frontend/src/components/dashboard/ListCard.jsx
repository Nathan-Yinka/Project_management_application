import { useTaskContext } from "@/context/TaskContext";
import { formatDate } from "@/helpers/time_formatter";
import React, { useState, useRef, useEffect } from "react";
import { AiOutlineCheck } from "react-icons/ai";

const ListCard = ({ task, onTaskClick }) => {
  const { changeTaskStatus } = useTaskContext();
  const [currentStatus, setCurrentStatus] = useState(task.status);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setCurrentStatus(task.status);
  }, [task.status]);

  const getPriorityColor = () => {
    switch (task.priority) {
      case "low":
        return "bg-green-100 text-green-500";
      case "mid":
        return "bg-yellow-100 text-yellow-500";
      case "high":
        return "bg-red-100 text-red-500";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const getStatusColorStyle = () => {
    switch (currentStatus) {
      case "abandoned":
        return { backgroundColor: "rgba(74, 74, 74, 0.1)" };
      case "in_progress":
        return { backgroundColor: "rgba(246, 20, 91, 0.1)" };
      case "canceled":
        return { backgroundColor: "rgba(246, 114, 20, 0.1)" };
      case "done":
        return { backgroundColor: "rgba(0, 218, 65, 0.1)" };
      default:
        return { backgroundColor: "rgba(200, 200, 200, 0.1)" };
    }
  };

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    changeTaskStatus(task.id, newStatus); // Update status in context or API
    setShowDropdown(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  return (
    <tr
      className="border-b last:border-none text-gray-800 relative cursor-pointer"
      onClick={() => onTaskClick(task)}
    >
      <td className="px-4 py-2 whitespace-nowrap min-w-[220px] flex items-center gap-2 relative">
        {/* Status Color Dot with Dropdown Toggle */}
        <div
          ref={dropdownRef}
          className="flex items-center cursor-pointer"
          onClick={toggleDropdown}
        >
          <div className="h-3 w-3 rounded-full" style={getStatusColorStyle()} />

          {/* Dropdown for changing status */}
          {showDropdown && (
            <div
              className="absolute left-6 top-6 mt-1 p-2 border rounded-lg bg-white shadow-lg z-50"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <p className="text-gray-500 font-medium mb-1 text-sm">Status</p>
              {["done", "in_progress", "canceled", "abandoned"].map(
                (status) => (
                  <button
                    key={status}
                    className={`w-full text-left px-2 py-1 rounded-md flex items-center 
                    ${status === currentStatus ? "text-black font-semibold" : "text-gray-500"} text-sm`}
                    onClick={() => handleStatusChange(status)}
                  >
                    <span className="text-xs">
                      {status.replace("_", " ").charAt(0).toUpperCase() +
                        status.slice(1)}
                    </span>
                    {status === currentStatus && (
                      <span className="ml-2 text-sm">
                        <AiOutlineCheck className="text-black" />
                      </span>
                    )}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
        <span className="font-medium truncate overflow-hidden text-ellipsis">
          {task.name}
        </span>
      </td>

      <td className="px-4 py-2 text-center min-w-[180px] whitespace-nowrap truncate overflow-hidden text-ellipsis">
        <span className="text-sm bg-green-200 text-green-700 rounded-full px-3 py-1">
          {task?.user?.name}
        </span>
      </td>
      <td className="px-4 py-2 text-center text-gray-600 min-w-[180px] whitespace-nowrap truncate overflow-hidden text-ellipsis">
        {formatDate(task.created_at)}
      </td>
      <td className="px-4 py-2 text-center min-w-[140px] whitespace-nowrap truncate overflow-hidden text-ellipsis">
        <span
          className={`${getPriorityColor()} rounded-full px-2 py-1 text-sm`}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}{" "}
          Priority
        </span>
      </td>
      <td className="px-4 py-2 text-gray-600 min-w-[240px] whitespace-nowrap truncate overflow-hidden text-ellipsis">
        <span className="truncate block text-gray-500 text-sm">
          {task.description}
        </span>
      </td>
    </tr>
  );
};

export default ListCard;
