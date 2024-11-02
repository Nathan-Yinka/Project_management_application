import { IoIosNotificationsOff } from "react-icons/io";
import { AiFillClockCircle } from "react-icons/ai";
import { BsListTask } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
// import logo from "../../../assets/darkoxypu.png";
import { VscBellDot } from "react-icons/vsc";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { MdOutlineDashboard } from "react-icons/md";
import { PiUsers } from "react-icons/pi";
import { BsBoxSeam } from "react-icons/bs";
import { PiContactlessPayment } from "react-icons/pi";
import { IoHeartOutline, IoKeyOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { slideIn, zoomIn } from "../../../motion";
import { useState, useEffect } from "react";
import { TbMessageChatbot } from "react-icons/tb";
import DropdownMenu from "../../../components/dashboard/DropdownMenu";
import SidebarContent from "../../../components/sidebar/SidebarContent";

function SideBarWeb({ handleOrganizationCreate }) {
  const location = useLocation();

  const isActiveLink = (route) => {
    return location.pathname.includes(route);
  };

  const [expandIndex, setExpandIndex] = useState(Array(2).fill(0));

  const expandMenu = (menuIndex, subIndex) => {
    setExpandIndex((prev) => {
      const newExpandIndex = [...prev];
      newExpandIndex[menuIndex] =
        newExpandIndex[menuIndex] === subIndex ? 0 : subIndex;
      return newExpandIndex;
    });
  };

  useEffect(() => {
    if (isActiveLink("") || isActiveLink(rolespermissions)) {
      setExpandIndex([0, 1]);
    }
  }, [location.pathname]);

  return (
    <div
      className={`w-[400px] bg-black px-[2%] hidden md:flex flex-col py-10 shadow-md h-svh overflow-y-scroll`}
    >
      <SidebarContent handleOrganizationCreate={handleOrganizationCreate} />
    </div>
  );
}

export default SideBarWeb;
