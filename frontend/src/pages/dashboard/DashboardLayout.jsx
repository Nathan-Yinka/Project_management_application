import { useState } from "react";
import { Outlet } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import { motion } from "framer-motion";
import { slideIn } from "../../motion";
import SideBarWeb from "./component/SideBarWeb";
import SideBarMobile from "./component/SideBarMobile";
import NameAvatar from "../../components/dashboard/NameAvatar";
import DateDisplay from "../../components/dashboard/DateDisplay";
import AvatarStack from "../../components/dashboard/AvatarStack";
import TabSelector from "@/components/dashboard/TabSelector";
import CreateOrganizationModal from "@/components/modals/CreateOrganizationModal";

const DashboardLayout = () => {
  const [showside, setShowside] = useState(false);
  const [OpenOragization,setOpenOrganiztion] = useState(false);

  const toggle = () => {
    setShowside(!showside);
  };

  const handleOrganizationCreate = ()=>setOpenOrganiztion(!OpenOragization) ;

  return (
    <div className="flex bg-[#FDFDFD] h-screen overflow-hidden">
      {/* SIDE BAR */}
      <SideBarWeb handleOrganizationCreate={handleOrganizationCreate}/>
      <SideBarMobile handleOrganizationCreate={handleOrganizationCreate} showside={showside} toggle={toggle} />

      {/* BODY LAYER */}
      <div className="flex flex-col w-full h-full relative">
        {/* TOP NAV */}
        <div className="md:mx-5">
        <motion.div className="flex w-full items-center justify-between md:mb-2 z-30 p-5 shadow-[0px_0px_24px_0px_rgba(0,0,0,0.07)]">
          {/* Left Side: Menu Button (only visible on mobile) */}
          <div className="block md:hidden">
            <button onClick={toggle}>
              <MdMenu className="text-2xl" />
            </button>
          </div>

          {/* Center: Animated Name (visible on all screen sizes, centered on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex justify-end md:justify-start"
          >
            <CreateOrganizationModal open={OpenOragization} setOpen={setOpenOrganiztion}/>
            <NameAvatar name={"Oludare Nathan"} />
          </motion.div>

          {/* Right Side: Date Display (visible only on medium screens and larger) */}
          <motion.div
            initial={slideIn("left", null).initial}
            whileInView={slideIn("left", 1 * 2).animate}
            className="hidden md:flex items-center gap-x-5"
          >
            <DateDisplay />
          </motion.div>
          
        </motion.div>
        </div>
        

      
        
        {/* MAIN SECTION */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
