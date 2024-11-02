import React from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { AiOutlineClose } from "react-icons/ai";
import { useOrganizationContext } from "@/context/OrganizationContext";
import { Spinner } from "@material-tailwind/react";

export function ConfirmLeaveModal({ open, setOpen, onConfirm }) {
  const { leaveOrganization, isLoadingLeave, organizationDetails } =
    useOrganizationContext();
  const handleOpen = () => setOpen(!open);

  const onSuccess = () => {
    onConfirm();
    handleOpen();
  };

  const handleConfirm = () => {
    leaveOrganization(organizationDetails?.id, onSuccess);
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="rounded-xl max-w-sm w-full"
    >
      <div className="flex items-center justify-between px-5 pt-5">
        <h2 className="sr-only">Contact Us</h2> {/* Accessible hidden header */}
        <button
          onClick={handleOpen}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <AiOutlineClose className="w-6 h-6" />
        </button>
      </div>

      <DialogBody className="px-5 py-4 text-center">
        <p className="text-xl font-medium text-black">
          Are you sure you want to leave?
        </p>
      </DialogBody>

      <DialogFooter className="flex justify-center gap-2 pb-5 px-5">
        <Button
          variant="gradient"
          color="red"
          disabled={isLoadingLeave}
          className="w-auto px-6 py-2 font-semibold flex items-center justify-center"
          onClick={handleConfirm}
        >
          {isLoadingLeave ? (
            <Spinner color="white" className="font-bold" />
          ) : (
            "Yes"
          )}
        </Button>
        <Button
          variant="outlined"
          color="gray"
          className="w-auto px-6 py-2 font-semibold"
          onClick={handleOpen}
        >
          No
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default ConfirmLeaveModal;
