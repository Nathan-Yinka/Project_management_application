import { useOrganizationContext } from "@/context/OrganizationContext";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaPlus } from "react-icons/fa";
// import "./DropdownMenu.css"; // Import custom CSS for animations

// Array of background colors for initials (fixed assignment)
const colors = [
  "bg-yellow-400",
  "bg-green-500",
  "bg-red-400",
  "bg-blue-600",
  "bg-purple-500",
];

const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "N/A");

const DropdownMenu = ({ handleOrganizationCreate }) => {
  const {
    allOrganizations,
    isLoading,
    // fetchAllOrganizations,
    organizationDetails,
    setOrganizationDetails,
  } = useOrganizationContext();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState({});
  const dropdownRef = useRef(null); // Ref to track the dropdown element

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (organizationDetails) {
      setSelectedOrg(organizationDetails);
    }
  }, [organizationDetails]);

  const handleSelectOrg = (org) => {
    setSelectedOrg(org);
    setIsOpen(false);
    setOrganizationDetails(org);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Attach listener on mount
    document.addEventListener("mousedown", handleClickOutside);

    // Remove listener on unmount
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return !isLoading ? (
    <div
      ref={dropdownRef}
      className={`w-72 mx-auto mt-8 ${isOpen ? "bg-white" : "bg-transparent"} rounded-lg p-4`}
    >
      {/* Dropdown Header */}
      <div
        onClick={toggleDropdown}
        className={`flex items-center justify-between p-2 py-4 cursor-pointer shadow-md mb-4 rounded-lg transition-colors ${
          isOpen ? "!bg-black" : "!bg-[rgba(255,255,255,0.05)]"
        }`}
      >
        <div className="flex items-center gap-2">
          {/* Avatar for Selected Organization */}
          <div
            className={`w-8 h-8 flex items-center justify-center text-white font-semibold rounded-lg ${
              colors[allOrganizations.indexOf(selectedOrg) % colors.length]
            }`}
          >
            {getInitial(selectedOrg?.name)}
          </div>
          <span className="text-white">
            {selectedOrg?.name || "No Organization"}
          </span>
        </div>
        <FaChevronDown className="text-white" />
      </div>

      {/* Dropdown List with animation */}
      <div
        className={`dropdown-content ${isOpen ? "open" : "closed"} bg-white rounded-lg text-black`}
      >
        {allOrganizations.map((org, index) => (
          <div
            key={index}
            onClick={() => handleSelectOrg(org)}
            className="flex items-center gap-2 p-2 py-4 cursor-pointer rounded-lg hover:bg-gray-200"
          >
            {/* Avatar for Each Organization */}
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
        <hr className="my-2 border-gray-300" />
        <div
          onClick={handleOrganizationCreate}
          className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200 rounded"
        >
          <div className="w-8 h-8 bg-gray-500/20 flex items-center justify-center rounded-md">
            <FaPlus className="text-black" />
          </div>
          <span className="text-black">Add New Organization</span>
        </div>
      </div>
    </div>
  ) : (
    // Skeleton Loader
    <div className="w-72 mx-auto mt-8 p-4">
      <div className="h-10 p-5 bg-gray-300 rounded-md animate-pulse mb-4"></div>
    </div>
  );
};

export default DropdownMenu;
