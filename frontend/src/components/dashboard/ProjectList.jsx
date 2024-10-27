// ProjectList.jsx
import React from "react";
import ProjectCard from "./ProjectCard";

const ProjectList = ({ tasks ,onTaskClick}) => {
    
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <ProjectCard key={task.id} project={task} onTaskClick={onTaskClick} />
      ))}
    </div>
  );
};

export default ProjectList;
