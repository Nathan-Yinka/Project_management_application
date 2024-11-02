import React, { useEffect, useRef, useState } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { zoomIn } from "../../../motion";
import { useLocation } from "react-router-dom";
import SidebarContent from "@/components/sidebar/SidebarContent";

function SideBarMobile({ showside, toggle, handleOrganizationCreate }) {
  const location = useLocation();
  const sidebarRef = useRef(null);

  const isActiveLink = (route) => {
    const pathParts = location.pathname.split("/");
    const lastPathPart = pathParts[pathParts.length - 1];
    return lastPathPart.includes(route);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggle(); // Close the sidebar if clicked outside
      }
    };

    if (showside) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showside]);

  return (
    <div
      ref={sidebarRef}
      className={`w-[300px] bg-black px-[2%] h-screen fixed ${
        !showside ? "-left-[30rem]" : ""
      } z-40 flex flex-col justify-between py-10 `}
      style={{ height: window.innerHeight }}
    >
      <div>
        <motion.div
          initial={zoomIn(1, "min").initial}
          whileInView={zoomIn(1, "min").animate}
          className="flex ml-5 w-full"
        >
          <button
            onClick={toggle}
            className="w-full flex justify-end items-end"
          >
            <RiCloseCircleFill className="text-3xl text-white justify-end items-end mr-10" />
          </button>
        </motion.div>
      </div>

      <SidebarContent handleOrganizationCreate={handleOrganizationCreate} />
    </div>
  );
}

SideBarMobile.propTypes = {
  showside: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  handleOrganizationCreate: PropTypes.func,
};

export default SideBarMobile;
