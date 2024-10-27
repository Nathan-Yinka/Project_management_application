import React from "react";
import ProjectCardSkeleton from "./ProjectCardSkeleton"; // Assuming a skeleton for individual project cards

const ProjectListLoad = () => {
  return (
    <div className="space-y-4">
      {/* Render a few skeleton loaders to simulate multiple project cards */}
      {Array.from({ length: 3 }).map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProjectListLoad;
