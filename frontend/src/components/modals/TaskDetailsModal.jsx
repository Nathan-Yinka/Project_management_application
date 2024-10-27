import React, { useState } from "react";
import { Button, Dialog, DialogBody } from "@material-tailwind/react";
import { AiOutlineClose } from "react-icons/ai";
import { BsCalendar } from "react-icons/bs";
import EditTaskModal from "./EditTaskModal";

export function TaskDetailsModal({ open, setOpen, task,handleEdit }) {
  const handleOpen = () => setOpen(!open);
  

  const taskData = task || {};


  const statusColors = {
    "Not Started": "rgba(128, 128, 128)", // gray
    "In Progress": "rgba(30, 144, 255)", // blue
    "Completed": "rgba(34, 139, 34)",    // green
    "Done": "rgba(34, 139, 34)",         // green
    "Abandoned": "rgba(74, 74, 74)",     // dark gray
    "Canceled": "rgba(246, 114, 20)",    // orange
  };

  const getGradientBackground = (status) => {
    const color = statusColors[status] || "rgba(74, 74, 74, 0.04)"; // fallback gray
  
    return {
      background: `linear-gradient(180deg, ${color} 0%, ${color.replace('0.04', '0')} 36.76%)`
    };
  };

  const priorityColors = {
    "Low - Priority": "bg-green-100 text-green-500",
    "Medium - Priority": "bg-yellow-100 text-yellow-500",
    "High - Priority": "bg-red-100 text-red-500",
  };
  return (
    <Dialog open={open} handler={handleOpen} className="p-6 rounded-lg max-w-xl w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">Task Details</h2>
        <button onClick={handleOpen} className="text-gray-500 hover:text-gray-700">
          <AiOutlineClose className="w-6 h-6" />
        </button>
      </div>

      <DialogBody>
        {/* Creation Date */}
        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <BsCalendar className="text-lg" />
          <span>Creation Date:</span>
          <span className="ml-auto text-gray-700 font-medium">{taskData.date}</span>
        </div>

        {/* Task Title */}
        <h3 className="text-xl font-normal text-gray-900 mb-5 text-center md:text-start">{taskData.title}</h3>

        {/* Status, Priority, Assignee */}
        <div className="flex mb-6 flex-wrap gap-4 md:justify-between justify-center">
          {/* Status */}
          <div className="flex flex-col items-center">
            <span className="text-lg font-medium text-black">Status</span>
            <span
                className="px-2 py-1 mt-1 rounded-md text-black font-semibold"
                style={getGradientBackground(taskData.status)}
                >
                {taskData.status}
                </span>
  
          </div>

          {/* Priority */}
          <div className="flex flex-col items-center">
            <span className="text-lg font-medium text-black">Priority</span>
            <span
              className={`px-2 py-1 mt-1 rounded-md text-black font-semibold ${priorityColors[taskData.priority]}`}
            >
              {taskData.priority}
            </span>
          </div>

          {/* Assignee */}
          <div className="flex flex-col items-center">
            <span className="text-lg font-medium text-black">Assignee</span>
            <span className="px-2 py-1 mt-1 rounded-md font-bold text-white bg-gray-700">
              {taskData.name}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-black mb-2 text-center md:text-start">Description</label>
          <p className="text-gray-700 text-base leading-relaxed">{taskData.description}</p>
        </div>

        {/* Edit Button */}
        <div className="flex justify-center mt-8">
          <Button
            variant="gradient"
            color="blue"
            className="w-full px-6 py-3"
            onClick={ handleEdit}
          >
            Edit Task
          </Button>
        </div>
      </DialogBody>

      {/* modal for the editing */}
      
    </Dialog>
  );
}

export default TaskDetailsModal;
