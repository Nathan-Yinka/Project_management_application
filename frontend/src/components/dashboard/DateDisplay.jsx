import React from "react";
import { FaCalendarAlt } from "react-icons/fa";

// Helper function to format today's date
const getFormattedDate = () => {
  const today = new Date();
  const options = { day: "numeric", month: "short", year: "numeric" };
  return today.toLocaleDateString("en-US", options);
};

const DateDisplay = () => {
  const date = getFormattedDate();

  return (
    <div className="flex font-light items-center text-black/80  border px-3 py-3 rounded-lg">
      <FaCalendarAlt className="mr-2" />
      <span>{date}</span>
    </div>
  );
};

export default DateDisplay;
