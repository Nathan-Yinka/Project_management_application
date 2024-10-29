import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Card,
} from "@material-tailwind/react";
import { AiOutlineDown, AiOutlineClose } from "react-icons/ai";

export function EditTaskModal({ open, setOpen, taskData }) {
  const [dropdownOpen, setDropdownOpen] = useState({
    priority: false,
    status: false,
    assignee: false,
  });
  const [formData, setFormData] = useState({
    taskName: "",
    description: "",
    priority: "",
    status: "",
    assignee: "",
  });
  
  useEffect(() => {
    if (taskData) {
      setFormData({
        taskName: taskData.title || "",
        description: taskData.description || "",
        priority: taskData.priority || "",
        status: taskData.status || "",
        assignee: taskData.name || "",
      });
    }
  }, [taskData]); // Only update formData when taskData changes

  const dropdownRefs = {
    priority: useRef(null),
    status: useRef(null),
    assignee: useRef(null),
  };

  const handleOpen = () => setOpen(!open);

  const toggleDropdown = (type) => {
    setDropdownOpen((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const options = {
    priority: [
      { key: 'low', label: 'Low' },
      { key: 'mid', label: 'Medium' },
      { key: 'high', label: 'High' },
    ],
    status: [
      { key: 'not_started', label: 'Not Started' },
      { key: 'in_progress', label: 'In Progress' },
      { key: 'completed', label: 'Completed' },
    ],
  };

  const assignees = [
    { name: "Adeyinka Boye", email: "ab@example.com" },
    { name: "John Doe", email: "john.doe@example.com" },
    { name: "Jane Smith", email: "jane.smith@example.com" },
  ];

  const handleOptionSelect = (type, key) => {
    setFormData((prev) => ({ ...prev, [type]: key }));
    setDropdownOpen((prev) => ({ ...prev, [type]: false }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs).forEach((type) => {
        if (
          dropdownRefs[type].current &&
          !dropdownRefs[type].current.contains(event.target) &&
          dropdownOpen[type]
        ) {
          setDropdownOpen((prev) => ({ ...prev, [type]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleSubmit = () => {
    console.log("Updated Task Data:", {
      ...formData,
      assigneeEmail: assignees.find((a) => a.name === formData.assignee)?.email,
    });
    handleOpen();
  };

  const getInitials = (name) => name.split(" ")[0][0].toUpperCase();

  const getRandomColor = () => {
    const colors = [
      "#FF6B6B", "#4ECDC4", "#556270", "#FFD93D", "#1E90FF", "#FF9A76",
      "#8E44AD", "#2ECC71", "#F39C12", "#3498DB", "#E74C3C", "#16A085",
      "#2980B9", "#F1C40F", "#D35400"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>
      <Dialog open={open} handler={handleOpen} className="rounded-lg max-w-2xl sm:w-[90%] w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold px-5 pt-5 text-black">Edit Task</h2>
          <button 
            onClick={handleOpen} 
            className="text-gray-500 hover:text-gray-700 px-5 pt-5 focus:outline-none"
            >
            <AiOutlineClose className="w-6 h-6" />
            </button>
        </div>

        <DialogBody>
          {/* Task Name Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-black mb-2">Task Name</label>
            <input
              type="text"
              name="taskName"
              placeholder="Enter task name"
              value={formData.taskName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none"
            />
          </div>

          {/* Description Textarea */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-black mb-2">Description</label>
            <textarea
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none"
              rows="4"
            ></textarea>
          </div>

          {/* Dropdowns for Priority, Status, and Assignee */}
          <div className="flex flex-wrap gap-4 mb-8">
            {/* Priority Dropdown */}
            <div className="relative flex-grow sm:flex-grow-0 sm:w-[28%]" ref={dropdownRefs.priority}>
              <label className="block text-sm font-medium text-black mb-1">Priority</label>
              <div
                className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-gray-300 cursor-pointer"
                onClick={() => toggleDropdown("priority")}
              >
                <span className="text-black capitalize">
                  {options.priority.find(option => option.key === formData.priority)?.label || "Select Priority"}
                </span>
                <AiOutlineDown className="h-5 w-5 text-gray-400" />
              </div>
              {dropdownOpen.priority && (
                <Card className="absolute mt-2 w-full border text-black rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {options.priority.map((option) => (
                    <div
                      key={option.key}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleOptionSelect("priority", option.key)}
                    >
                      <span className="text-gray-700">{option.label}</span>
                    </div>
                  ))}
                </Card>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="relative flex-grow sm:flex-grow-0 sm:w-[28%]" ref={dropdownRefs.status}>
              <label className="block text-sm font-medium text-black mb-1">Status</label>
              <div
                className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-gray-300 cursor-pointer"
                onClick={() => toggleDropdown("status")}
              >
                <span className="text-black capitalize">
                  {options.status.find(option => option.key === formData.status)?.label || "Select Status"}
                </span>
                <AiOutlineDown className="h-5 w-5 text-gray-400" />
              </div>
              {dropdownOpen.status && (
                <Card className="absolute mt-2 w-full border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {options.status.map(option => (
                    <div
                      key={option.key}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleOptionSelect("status", option.key)}
                    >
                      <span className="text-black">{option.label}</span>
                    </div>
                  ))}
                </Card>
              )}
            </div>

            {/* Assignee Dropdown */}
            <div className="relative flex-grow sm:flex-grow-0 sm:w-[38%]" ref={dropdownRefs.assignee}>
              <label className="block text-sm font-medium text-black mb-1">Assignee</label>
              <div
                className="flex items-center justify-between px-3 py-2 border border-gray-300 text-black rounded-lg cursor-pointer bg-gray-300"
                onClick={() => toggleDropdown("assignee")}
              >
                <span className="text-black">
                  {formData.assignee || "Select Assignee"}
                </span>
                <AiOutlineDown className="h-5 w-5 text-gray-400" />
              </div>
              {dropdownOpen.assignee && (
                <Card className="absolute mt-2 w-full border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {assignees.map((assignee) => (
                    <div
                      key={assignee.email}
                      className={`flex items-center px-3 py-2 text-black cursor-pointer hover:bg-gray-100 ${
                        formData.assignee === assignee.name ? "bg-gray-200" : ""
                      }`}
                      onClick={() => handleOptionSelect("assignee", assignee.name)}
                    >
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-full mr-3"
                        style={{ backgroundColor: getRandomColor() }}
                      >
                        {getInitials(assignee.name)}
                      </div>
                      <div>
                        <p className="font-medium text-black">{assignee.name}</p>
                      </div>
                    </div>
                  ))}
                </Card>
              )}
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="gradient" size="lg" color="black" className="w-full" onClick={handleSubmit}>
            Update Task
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default EditTaskModal;
