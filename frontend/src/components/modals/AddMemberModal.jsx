import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Card,
} from "@material-tailwind/react";
import { Spinner } from "@material-tailwind/react";
import { AiOutlineDown, AiOutlineClose } from "react-icons/ai";
import { useUserContext } from "@/context/UserContext";
import { useOrganizationContext } from "@/context/OrganizationContext";
import { toast } from "sonner";

export function AddMemberModal({ open, setOpen }) {
  const { usersNotInOrganization } = useUserContext();
  const { addMembersToOrganization, isLoadingAddMember } = useUserContext();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const dropdownRef = useRef(null);

  let members = usersNotInOrganization;

  const handleOpen = () => setOpen(!open);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Select or unselect a member
  const handleMemberSelect = (member) => {
    if (selectedMembers.some((m) => m.email === member.email)) {
      setSelectedMembers(
        selectedMembers.filter((m) => m.email !== member.email),
      );
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSuccess = () => {
    setSelectedMembers([]);
    handleOpen();
  };

  const handleSubmit = () => {
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member to add.");
      return;
    }

    const selectedEmails = selectedMembers.map((member) => member.email);
    addMembersToOrganization(selectedEmails, onSuccess);
  };

  // Remove a member from the selected list
  const handleRemoveMember = (memberToRemove) => {
    setSelectedMembers(
      selectedMembers.filter((member) => member !== memberToRemove),
    );
  };

  // Change input value and filter dropdown
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setDropdownOpen(true);
  };

  // Custom add member logic
  const handleCustomMemberAdd = () => {
    if (
      isValidEmail(inputValue) &&
      !selectedMembers.some((m) => m.email === inputValue)
    ) {
      const newMember = { name: inputValue, email: inputValue };
      setSelectedMembers([...selectedMembers, newMember]);
      setInputValue("");
      setDropdownOpen(false);
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate a random color for the initial circle
  const getRandomColor = () => {
    const colors = [
      "#f87171",
      "#60a5fa",
      "#34d399",
      "#fbbf24",
      "#a78bfa",
      "#f472b6",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>
      <Dialog open={open} handler={handleOpen} className="p-4 rounded-xl max-h-[calc(100vh-10px)] overflow-y-auto">
        <div className="flex justify-between items-center p-2">
          <DialogHeader className="text-lg font-semibold">
            Add Member
          </DialogHeader>
          <AiOutlineClose
            onClick={handleOpen}
            className="text-xl cursor-pointer"
          />
        </div>

        <DialogBody className="max-h-[60vh] overflow-y-auto md:max-h-none">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member
            </label>
            <div className="relative" ref={dropdownRef}>
              {/* Input Field with Tags */}
              <div
                className="flex flex-wrap items-center px-3 py-2 border border-gray-300 rounded-lg cursor-pointer"
                onClick={toggleDropdown}
              >
                {selectedMembers.map((member) => (
                  <div
                    key={member.email}
                    className="flex items-center bg-gray-200 rounded-full px-2 py-1 mr-2"
                  >
                    <span className="text-sm mr-1">{member.name}</span>
                    <AiOutlineClose
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMember(member);
                      }}
                      className="text-md text-black cursor-pointer"
                    />
                  </div>
                ))}
                <input
                  type="text"
                  placeholder={
                    selectedMembers.length === 0
                      ? "Select or type a member"
                      : ""
                  }
                  value={inputValue}
                  onChange={handleInputChange}
                  className="flex-grow focus:outline-none text-gray-700 placeholder-gray-500"
                  onClick={() => setDropdownOpen(true)}
                />
                <AiOutlineDown className="h-5 w-5 text-gray-400" />
              </div>

              {/* Animated Dropdown Menu */}
              <div
                className={`transition-all duration-300 ease-in-out ${dropdownOpen ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0"} overflow-hidden`}
              >
                {dropdownOpen && (
                  <Card className="w-full max-h-48 overflow-y-auto border border-gray-300 rounded-lg shadow-lg z-10">
                    {inputValue &&
                      !members.some((m) => m.email === inputValue) && (
                        <div
                          className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={handleCustomMemberAdd}
                        >
                          <Typography color="blue-gray" className="font-medium">
                            Add "{inputValue}"
                          </Typography>
                        </div>
                      )}
                    {members
                      .filter(
                        (member) =>
                          member.name
                            .toLowerCase()
                            .includes(inputValue.toLowerCase()) ||
                          member.email
                            .toLowerCase()
                            .includes(inputValue.toLowerCase()),
                      )
                      .map((member) => (
                        <div
                          key={member.email}
                          className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                            selectedMembers.some(
                              (m) => m.email === member.email,
                            )
                              ? "bg-gray-100"
                              : ""
                          }`}
                          onClick={() => handleMemberSelect(member)}
                        >
                          <div
                            className="h-8 w-8 flex items-center justify-center rounded-full mr-3 text-white font-bold"
                            style={{ backgroundColor: getRandomColor() }}
                          >
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <Typography
                              color="blue-gray"
                              className="font-medium"
                            >
                              {member.name}
                            </Typography>
                            <Typography color="gray" className="text-sm">
                              {member.email}
                            </Typography>
                          </div>
                        </div>
                      ))}
                  </Card>
                )}
              </div>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            variant="gradient"
            color="black"
            size="lg"
            className="w-full flex items-center justify-center"
            onClick={handleSubmit}
            disabled={isLoadingAddMember} // Disable button while loading
          >
            {!isLoadingAddMember ? (
              "Submit"
            ) : (
              <Spinner color="white" className="font-bold" />
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default AddMemberModal;
