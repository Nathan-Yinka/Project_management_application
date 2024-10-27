import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Card,
} from "@material-tailwind/react";
import { AiOutlineDown, AiOutlineClose } from "react-icons/ai";

export function CreateTaskModal({open,setOpen}) {
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
    priority: ["High", "Medium", "Low"],
    status: ["Not Started", "In Progress", "Completed"],
  };

  const assignees = [
    { name: "Adeyinka Boye", email: "ab@example.com" },
    { name: "John Doe", email: "john.doe@example.com" },
    { name: "Jane Smith", email: "jane.smith@example.com" },
  ];

  const handleOptionSelect = (type, value) => {
    setFormData((prev) => ({ ...prev, [type]: value }));
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
    console.log("Form Data:", {
      ...formData,
      assigneeEmail: assignees.find((a) => a.name === formData.assignee)?.email,
    });
    handleOpen();
  };

  const getInitials = (name) => name.split(" ")[0][0].toUpperCase();

  const getRandomColor = () => {
    const colors = [
        "#FF6B6B", // Soft Red
        "#4ECDC4", // Mint Green
        "#556270", // Slate Gray
        "#FFD93D", // Sunny Yellow
        "#1E90FF", // Dodger Blue
        "#FF9A76", // Coral
        "#8E44AD", // Purple
        "#2ECC71", // Emerald Green
        "#F39C12", // Orange
        "#3498DB", // Bright Blue
        "#E74C3C", // Red
        "#16A085", // Greenish Teal
        "#2980B9", // Deep Blue
        "#F1C40F", // Golden Yellow
        "#D35400", // Burnt Orange
      ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>

      <Dialog open={open} handler={handleOpen} className="rounded-lg max-w-2xl sm:w-[90%] w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold px-5 pt-5 text-black ">Create New Task</h2>
          <button onClick={handleOpen} className="text-gray-500 hover:text-gray-700 px-5 pt-5">
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
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Priority Dropdown */}
            <div className="relative flex-grow sm:flex-grow-0 sm:w-[28%]" ref={dropdownRefs.priority}>
              <label className="block text-sm font-medium text-black mb-1">Priority</label>
              <div
                className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-gray-300 cursor-pointer"
                onClick={() => toggleDropdown("priority")}
              >
                <span className="text-black capitalize">
                  {formData.priority || "Select Priority"}
                </span>
                <AiOutlineDown className="h-5 w-5 text-gray-400" />
              </div>
              {dropdownOpen.priority && (
                <Card className="absolute mt-2 w-full border text-black rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {options.priority.map((option) => (
                    <div
                      key={option}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleOptionSelect("priority", option)}
                    >
                      <span className="text-gray-700">{option}</span>
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
                  {formData.status || "Select Status"}
                </span>
                <AiOutlineDown className="h-5 w-5 text-gray-400" />
              </div>
              {dropdownOpen.status && (
                <Card className="absolute mt-2 w-full border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {options.status.map((option) => (
                    <div
                      key={option}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleOptionSelect("status", option)}
                    >
                      <span className="text-black">{option}</span>
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
            Submit
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default CreateTaskModal;
