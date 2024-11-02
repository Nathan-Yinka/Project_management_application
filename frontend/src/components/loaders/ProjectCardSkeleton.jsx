import React from "react";

const ProjectCardSkeleton = () => {
  return (
    <div className="mx-2 relative">
      <div className="bg-white rounded-lg p-4 w-[15rem] md:w-[18rem]  border border-gray-200 relative md:h-[17rem] animate-pulse">
        <div className="flex items-center justify-between mb-7">
          {/* Priority badge skeleton */}
          <span className="bg-gray-200 rounded-full h-4 w-20"></span>
          <span className="bg-gray-200 rounded-full h-4 w-8"></span>
        </div>
        <div className="flex items-center mb-5">
          {/* Avatar circle skeleton */}
          <span className="bg-gray-300 rounded-full h-8 w-8 mr-2"></span>
          {/* Name placeholder */}
          <span className="bg-gray-200 h-4 w-20 rounded"></span>
        </div>
        <div className="flex items-center text-gray-400 text-sm md:text-md mb-4">
          {/* Clock icon skeleton */}
          <span className="bg-gray-200 h-4 w-4 rounded-full"></span>
          {/* Date placeholder */}
          <span className="bg-gray-200 h-4 w-24 ml-2 rounded"></span>
        </div>
        <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
