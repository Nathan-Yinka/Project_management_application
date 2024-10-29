import { useUserContext } from "@/context/UserContext";
import React from "react";

// Helper function to get initials from a name
const getInitials = (name) => {
  if (!name) return ""; // Prevent error if name is undefined
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.toUpperCase();
};

// Array of background colors for the avatars
const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
];

// Function to consistently map a name to a color
const getColorByName = (name) => {
  if (!name) return colors[0];
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const AvatarStack = ({ maxDisplay = 3 }) => {
  const { usersInOrganization, isLoadingInOrg } = useUserContext();

  const renderPlaceholderStack = () =>
    [...Array(maxDisplay)].map((_, index) => (
      <div
        key={index}
        className="p-2 w-10 h-10 rounded-full bg-gray-300 animate-pulse -ml-3 border-2 border-white flex items-center justify-center text-xs font-medium text-white"
      >
        
      </div>
    ));

  return (
    <div className="flex items-center ml-3">
      {isLoadingInOrg || usersInOrganization?.length === 0 ? (
        // Show loading or empty placeholders
        renderPlaceholderStack()
      ) : (
        // Render actual avatar stack when users are available
        usersInOrganization.slice(0, maxDisplay).map((avatar, index) => {
          const colorClass = getColorByName(avatar.first_name);

          return (
            <div
              key={index}
              className="group relative"
              style={{ zIndex: usersInOrganization.length - index }}
            >
              <div
                className={`p-2 w-10 h-10 rounded-full ${colorClass} flex items-center justify-center text-white font-semibold text-sm -ml-3 border-2 border-white
                            transition-transform duration-300 transform group-hover:z-[1000000]`}
              >
                {avatar.image ? (
                  <img
                    src={avatar.image}
                    alt={avatar.first_name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  getInitials(avatar.first_name)
                )}
              </div>
            </div>
          );
        })
      )}
      {!isLoadingInOrg && usersInOrganization?.length > maxDisplay && (
        <div className="p-2 -ml-3  w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold text-sm  border-2 border-white">
          +{usersInOrganization?.length - maxDisplay}
        </div>
      )}
    </div>
  );
};

export default AvatarStack;
