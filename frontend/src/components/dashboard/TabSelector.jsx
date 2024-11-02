import React from "react";
import { BsClipboardData, BsListTask } from "react-icons/bs";
import { motion } from "framer-motion";
import { useTaskContext } from "@/context/TaskContext";

function TabSelector({ activeTab, setActiveTab }) {
  const { search,handleSearch } = useTaskContext();

  return (
    <div className="flex items-center space-x-8">
      {/* Board Tab */}
      <div
        className="relative flex flex-col items-center cursor-pointer"
        onClick={() => setActiveTab("Board")}
      >
        <div
          className={`flex items-center gap-2 transition-colors duration-300 ${
            activeTab === "Board" ? "text-black" : "text-gray-400"
          }`}
        >
          <BsClipboardData className="text-2xl" />
          <span>Board</span>
        </div>
        {activeTab === "Board" && (
          <motion.div
            key="underline-board"
            layoutId={`underline-${activeTab}`}
            className="w-full h-[2px] bg-gray-600 rounded mt-1"
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* List Tab */}
      <div
        className="relative flex flex-col items-center cursor-pointer"
        onClick={() => setActiveTab("List")}
      >
        <div
          className={`flex items-center gap-2 transition-colors duration-300 ${
            activeTab === "List" ? "text-black" : "text-gray-400"
          }`}
        >
          <BsListTask className="text-2xl" />
          <span>List</span>
        </div>
        {activeTab === "List" && (
          <motion.div
            key="underline-list" // Unique key per tab
            layoutId={`underline-${activeTab}`} // Unique layoutId
            className="w-full h-[2px] bg-gray-600 rounded mt-1"
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Search Bar */}
      <div className="flex-grow relative">
        <input
          type="text"
          onChange={(e)=>handleSearch(e.target.value)}
          value={search}
          placeholder="Search..."
          className="w-full py-2 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>
    </div>
  );
}

export default TabSelector;
