import React, { useState, useRef, useEffect } from "react";

const ListCard = ({ task, onStatusChange, onTaskClick }) => {
  const [currentStatus, setCurrentStatus] = useState(task.status);
  const [showDropdown, setShowDropdown] = useState(false);
  const dotRef = useRef(null);

  useEffect(() => {
    // Update `currentStatus` if `task.status` prop changes
    setCurrentStatus(task.status);
  }, [task.status]);

  const getPriorityColor = () => {
    switch (task.priority) {
      case "Low - Priority":
        return "bg-green-100 text-green-500";
      case "Medium - Priority":
        return "bg-yellow-100 text-yellow-500";
      case "High - Priority":
        return "bg-red-100 text-red-500";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const getStatusColorStyle = () => {
    switch (currentStatus) {
      case "Abandoned":
        return { backgroundColor: "rgba(74, 74, 74, 0.1)" };
      case "In Progress":
        return { backgroundColor: "rgba(246, 20, 91, 0.1)" };
      case "Canceled":
        return { backgroundColor: "rgba(246, 114, 20, 0.1)" };
      case "Done":
        return { backgroundColor: "rgba(0, 218, 65, 0.1)" };
      default:
        return { backgroundColor: "rgba(200, 200, 200, 0.1)" };
    }
  };

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus); // Update locally
    onStatusChange(task.id, newStatus); 
    setShowDropdown(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dotRef.current && !dotRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    // Use pointerdown instead of mousedown for better control
    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  return (
    <tr
      className="border-b last:border-none text-gray-800 relative cursor-pointer "
      onClick={() => onTaskClick(task)}
    >
      <td className="px-4 py-2 whitespace-nowrap min-w-[220px] flex items-center gap-2 relative">
        {/* Status Color Dot */}
        <div
          ref={dotRef}
          className="h-3 w-3 rounded-full cursor-pointer"
          style={getStatusColorStyle()}
          onClick={toggleDropdown}
        />
        <span className="font-medium truncate overflow-hidden text-ellipsis">
          {task.title}
        </span>

        {/* Dropdown for changing status */}
        {showDropdown && (
          <div
            className="absolute left-6 top-6 mt-1 p-2 border rounded-lg bg-white shadow-lg z-[94995959595555]"
            onPointerDown={(e) => e.stopPropagation()} // Prevent closing on selection
          >
            {["Abandoned", "In Progress", "Canceled", "Done"].map((status) => (
              <button
                key={status}
                className={`block px-3 py-1 text-sm text-left w-full hover:bg-gray-100 ${
                  status === currentStatus ? "font-semibold text-black" : "text-gray-500"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(status);
                }}
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </td>

      <td className="px-4 py-2 text-center min-w-[180px] whitespace-nowrap truncate overflow-hidden text-ellipsis">
        <span className="text-sm bg-green-200 text-green-700 rounded-full px-3 py-1">
          {task.name}
        </span>
      </td>
      <td className="px-4 py-2 text-center text-gray-600 min-w-[180px] whitespace-nowrap truncate overflow-hidden text-ellipsis">
        {task.date}
      </td>
      <td className="px-4 py-2 text-center min-w-[140px] whitespace-nowrap truncate overflow-hidden text-ellipsis">
        <span className={`${getPriorityColor()} rounded-full px-2 py-1 text-sm`}>
          {task.priority}
        </span>
      </td>
      <td className="px-4 py-2 text-gray-600 min-w-[240px] whitespace-nowrap truncate overflow-hidden text-ellipsis">
        <span className="truncate block text-gray-500 text-sm">{task.description}</span>
      </td>
    </tr>
  );
};

export default ListCard;
