// NameAvatar.jsx
import React, { useState, useEffect } from "react";

const NameAvatar = ({ name }) => {
  const initial = name.charAt(0);

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];

  const [avatarColor, setAvatarColor] = useState("");

  useEffect(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setAvatarColor(randomColor);
  }, []);

  return (
    <div className="flex items-center space-x-3">
      <div
        className={`h-8 w-8 rounded-full ${avatarColor} flex items-center justify-center text-white font-normal`}
      >
        {initial}
      </div>
      <span className="text-gray-800 font-light">{name}</span>
    </div>
  );
};

export default NameAvatar;
