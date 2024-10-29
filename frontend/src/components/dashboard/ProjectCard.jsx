import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import clock from "../../assets/Icon.svg";
import { formatDate } from "@/helpers/time_formatter";

const ProjectCard = ({ project, onTaskClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(project.status);
  const [avatarColor, setAvatarColor] = useState("");
  const modalRef = useRef(null);

  const toggleModal = (e) => {
    e.stopPropagation(); // Prevents triggering onTaskClick when clicking status
    setIsModalOpen(!isModalOpen);
  };

  const changeStatus = (status) => {
    setCurrentStatus(status);
    setIsModalOpen(false);
  };

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Set background color for priority badge
  const getPriorityColor = () => {
    switch (project.priority) {
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

  // Generate random color for the avatar
  const getRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Set avatar color on component mount
  useEffect(() => {
    setAvatarColor(getRandomColor());
  }, []);

  return (
    <div className="mx-2 relative" onClick={() => onTaskClick(project)}>
      <div className="bg-white rounded-lg p-4 max-w-[18rem] border border-gray-200 relative [17rem]">
        <div className="flex items-center justify-between mb-7">
          <span className={`${getPriorityColor()} rounded-full px-3 py-1 text-xs`}>
            {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
          </span>
          <span
            className="text-black font-bold cursor-pointer relative"
            onClick={toggleModal} // Toggle modal on click
          >
            •••
            {isModalOpen && (
              <div
                ref={modalRef}
                className="absolute top-8 right-0 transform translate-x-2 -translate-y-2 bg-white border border-gray-300 rounded-lg shadow-lg p-2 w-36 z-20"
              >
                <p className="text-gray-500 font-medium mb-1 text-sm">Status</p>
                {["done", "in_progress", "complete", "abandoned"].map((status) => (
                  <button
                    key={status}
                    className={`w-full text-left px-2 py-1 rounded-md flex items-center 
                    ${status === currentStatus ? "text-black font-semibold" : "text-gray-500"} text-sm`}
                    onClick={() => changeStatus(status)}
                  >
                    <span className="text-xs">
                      {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    {status === currentStatus && (
                      <span className="ml-2 text-sm">
                        <AiOutlineCheck className="text-black" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </span>
        </div>
        <div className="flex items-center mb-5">
          <span className={`${avatarColor} rounded-full h-8 w-8 flex items-center justify-center text-white mr-2`}>
            {project?.user?.name.charAt(0)}
          </span>
          <span className="text-gray-700 font-medium capitalize text-sm md:text:md">{project?.user?.name}</span>
        </div>
        <div className="flex items-center text-gray-400 text-sm md:text-md mb-4">
          <img src={clock} alt="Clock icon" />
          <span className="ml-2">{formatDate(project.created_at)}</span>
        </div>
        <h3 className="md:text-xl font-semibold mb-4 line-clamp-2">{project.name}</h3>
        <p className="text-gray-600 line-clamp-2 text-sm md:text:md">{project.description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
