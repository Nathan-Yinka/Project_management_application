import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BsListTask } from "react-icons/bs";
import { AiFillClockCircle } from "react-icons/ai";
import { IoIosNotificationsOff } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { slideIn, zoomIn } from "@/motion";
import DropdownMenu from "@/components/dashboard/DropdownMenu";
import { notifications } from "@/constants/app.routes";

function SidebarContent({ handleOrganizationCreate }) {
  const location = useLocation();

  // Sidebar links data
  const links = [
    {
      to: notifications,
      name: "Tasks Management",
      icon: <BsListTask className="text-2xl" />,
    },
    {
      to: notifications,
      name: "Activities",
      icon: <AiFillClockCircle className="text-2xl" />,
    },
    {
      to: notifications,
      name: "Notifications",
      icon: <IoIosNotificationsOff className="text-2xl" />,
    },
  ];

  return (
    <>
      <motion.div
        initial={zoomIn(1, "min").initial}
        whileInView={zoomIn(1, "min").animate}
      >
        <h1 className="text-white text-4xl font-bold">Taskee...</h1>
      </motion.div>

      <div className="mt-10 flex flex-col space-y-3 flex-grow">
        {/* Dropdown Menu */}
        <motion.div
          initial={slideIn("left", 0).initial}
          whileInView={slideIn("left", 2).animate}
        >
          <NavLink>
            <DropdownMenu handleOrganizationCreate={handleOrganizationCreate} />
          </NavLink>
        </motion.div>

        {/* Dynamic NavLinks */}
        {links.map((link, index) => (
          <motion.div
            key={index}
            initial={slideIn("left", 0).initial}
            whileInView={slideIn("left", (index + 2) * 2).animate}
          >
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "text-white flex items-center gap-x-4 w-full px-5 py-3 relative"
                  : "text-gray-400 flex items-center gap-x-4 w-full px-5 py-3 relative"
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          </motion.div>
        ))}
      </div>

      {/* Logout Button */}
      <motion.button
        initial={slideIn("up", null).initial}
        whileInView={slideIn("up", 2).animate}
        className="text-red-500 flex items-center gap-x-4 mt-5"
      >
        <CiLogout className="text-2xl" />
        <p>Logout</p>
      </motion.button>
    </>
  );
}

export default SidebarContent;
