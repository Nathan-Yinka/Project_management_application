import React from "react";

// Sample data for avatar images and names
const avatarData = [
  { name: "Oludare Nathan", image: null },
  { name: "Jane Doe", image: null },
  { name: "John Smith", image: null },
  { name: "Alice Johnson", image: null },
];

// Helper function to get initials from a name
const getInitials = (name) => {
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
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const AvatarStack = ({ avatars = avatarData, maxDisplay = 3 }) => {
  return (
    <div className="flex items-center">
      {avatars.slice(0, maxDisplay).map((avatar, index) => {
        // Use consistent color for each name
        const colorClass = getColorByName(avatar.name);

        return (
          <div
            key={index}
            className="group relative"
            style={{ zIndex: avatars.length - index }}
          >
            <div
              className={`p-2 md:w-10 md:h-10 rounded-full ${colorClass} flex items-center justify-center text-white font-semibold text-sm -ml-3 border-2 border-white
                          transition-transform duration-300 transform group-hover:z-[1000000]`} // High z-index on hover
            >
              {avatar.image ? (
                <img
                  src={avatar.image}
                  alt={avatar.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                getInitials(avatar.name) // Display the initials
              )}
            </div>
          </div>
        );
      })}
      {avatars.length > maxDisplay && (
        <div className="p-2 md:w-10 md:h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold text-sm -ml-3 border-2 border-white">
          +{avatars.length - maxDisplay}
        </div>
      )}
    </div>
  );
};

export default AvatarStack;
