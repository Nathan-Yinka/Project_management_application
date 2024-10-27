import { CiLogout } from "react-icons/ci"; 
import React, { useState } from "react";
import TaskBoard from "@/components/dashboard/TaskBoard";
import TabSelector from "@/components/dashboard/TabSelector";
import AvatarStack from "@/components/dashboard/AvatarStack";
import { motion } from "framer-motion";
import TaskListView from "@/components/dashboard/TaskListView";
import { AddMemberModal } from "@/components/modals/AddMemberModal";
import CreateTaskModal from "@/components/modals/CreateTaskModal";
import TaskDetailsModal from "@/components/modals/TaskDetailsModal";
import EditTaskModal from "@/components/modals/EditTaskModal";
import ConfirmLeaveModal from "@/components/modals/ConfirmLeaveModal";
import { Button, Dialog } from "@material-tailwind/react";
// import { log } from "console";

const Dashboard = () => {
  const [view, setView] = useState("Board");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isLeaveModalOpen, setLeaveModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState({}); // State for selected task details

  const toggleAddMemberModal = () => setIsAddMemberOpen(!isAddMemberOpen);
  const toggleAddTaskModal = () => setIsAddTaskOpen(!isAddTaskOpen);
  const toggleTaskDetailsModal = () => setIsTaskDetailsOpen(!isTaskDetailsOpen);
  const handleEdit = ()=> setOpenEdit(!openEdit);

  // Function to open task details with the specific task data
  const openTaskDetails = (task) => {
    setSelectedTask(task); // Set the selected task data
    setIsTaskDetailsOpen(true); // Open the task details modal
  };
//   console.log(selectedTask)

const handleConfirmLeave = () => {
    console.log("User confirmed leave");
    // Additional leave logic here
  };

  return (
    <>
      <motion.div className="flex w-full items-center justify-between z-30 px-5 py-2 overflow-x-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex md:justify-start px-2 gap-2"
        >
          <Button
            onClick={toggleAddMemberModal}
            color="black"
            size="md"
            variant="gradient"
            className="md:p-3 md:py-3 px-1 text-sm text-gray-300 capitalize rounded-xl whitespace-nowrap min-w-[100px]"
            >
            <span className="px-1">+</span> Add Task
            </Button>
          
        </motion.div>

        {/* Tab Selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex md:justify-start"
        >
          <div className="hidden md:block">
            <TabSelector activeTab={view} setActiveTab={setView} />
          </div>
        </motion.div>

        {/* Avatar Stack and Add Member Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center md:gap-x-5 gap-x-2"
        >
          <AvatarStack maxDisplay={2} />
          <Button
            onClick={toggleAddMemberModal}
            color="black"
            size="md"
            variant="gradient"
            className="md:p-3 p-1 py-3 md:py-3 text-sm text-gray-300 rounded-xl flex items-center whitespace-nowrap min-w-[130px]"
            >
            <span className="px-2">+</span> Add Member
            </Button>

            <Button
            onClick={()=>setLeaveModalOpen(!isLeaveModalOpen)}
            color="red"
            size="md"
            variant="gradient"
            className="md:p-3 md:py-3 flex gap-1 justify-center items-center px-1 text-sm text-gray-300 capitalize rounded-xl whitespace-nowrap min-w-[100px]"
            >
            <CiLogout className="text-white font-bold text-lg"/>Leave Organization
            </Button>
        </motion.div>
      </motion.div>

      {/* Mobile Tab Selector */}
      <motion.div
        className="mx-5 md:hidden mt-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TabSelector activeTab={view} setActiveTab={setView} />
      </motion.div>

      {/* Modals */}
      <AddMemberModal open={isAddMemberOpen} setOpen={setIsAddMemberOpen} />
      <CreateTaskModal open={isAddTaskOpen} setOpen={setIsAddTaskOpen} />
      <TaskDetailsModal open={isTaskDetailsOpen} setOpen={setIsTaskDetailsOpen} task={selectedTask} handleEdit={handleEdit} />
      <EditTaskModal open={openEdit} setOpen={setOpenEdit} taskData={selectedTask} />
      <ConfirmLeaveModal open={isLeaveModalOpen} setOpen={setLeaveModalOpen} onConfirm={handleConfirmLeave} />;
      {/* Render TaskBoard or TaskListView based on activeTab */}
      {view === "Board" ? (
        <TaskBoard onTaskClick={openTaskDetails} />
      ) : (
        <TaskListView onTaskClick={openTaskDetails} />
      )}
    </>
  );
};

export default Dashboard;
