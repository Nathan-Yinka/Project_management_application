import React, { useState } from "react";
import { FaChevronDown, FaPlus } from "react-icons/fa";

// Sample data for organizations
const organizations = [
  { name: "MTN Organisation" },
  { name: "Glo Organisation" },
  { name: "Airtel Organisation" },
];

// Helper function to get the first letter as initial
const getInitial = (name) => name.charAt(0).toUpperCase();

// Array of background colors for initials (fixed assignment)
const colors = [
    "bg-yellow-400", // A brighter shade of yellow
    "bg-green-500",  // A more visible shade of green
    "bg-red-400",    // A lighter shade of red
    "bg-blue-600",   // A darker shade of blue
    "bg-purple-500"  // A balanced shade of purple
  ];
  

const DropdownMenu = ({ handleOrganizationCreate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(organizations[0]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectOrg = (org) => {
    setSelectedOrg(org);
    setIsOpen(false);
  };

  return (
    <div className={`w-72 mx-auto mt-8 ${isOpen && 'bg-white'} rounded-lg p-4`}>
      {/* Dropdown Header */}
      <div
        onClick={toggleDropdown}
        className={`flex items-center justify-between p-2 py-4 cursor-pointer shadow-md mb-4 rounded-lg transition-colors ${
          isOpen ? "!bg-black" : "!bg-[rgba(255,255,255,0.05)]"
        }`}
      >
        <div className="flex items-center gap-2">
          {/* Square Avatar for Selected Organization with rounded corners */}
          <div
            className={`w-8 h-8 flex items-center justify-center text-white font-semibold rounded-lg ${
              colors[organizations.indexOf(selectedOrg) % colors.length]
            }`}
          >
            {getInitial(selectedOrg.name)}
          </div>
          <span className="text-white">{selectedOrg.name}</span>
        </div>
        <FaChevronDown className="text-white" />
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="bg-white rounded-lg text-black">
          {organizations.map((org, index) => (
            <div
              key={index}
              onClick={() => handleSelectOrg(org)}
              className="flex items-center gap-2 p-2 py-4 cursor-pointer rounded-lg hover:bg-gray-200"
            >
              {/* Square Avatar for Each Organization with fixed color */}
              <div
                className={`w-8 h-8 flex items-center justify-center text-black font-semibold rounded-md ${
                  colors[index % colors.length]
                }`}
              >
                {getInitial(org.name)}
              </div>
              <span className="text-black">{org.name}</span>
            </div>
          ))}
          <hr className="my-2 border/50" />
          <div onClick={handleOrganizationCreate} className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200 rounded">
            <div className="w-8 h-8 bg-gray-500/20 flex items-center justify-center rounded-md">
              <FaPlus className="text-black" />
            </div>
            <span className="text-black">Add New Organisation</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
