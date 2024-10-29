import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Spinner,
} from "@material-tailwind/react";
import { AiOutlineClose } from "react-icons/ai";
import { useOrganizationContext } from "@/context/OrganizationContext";
import { toast } from "sonner"

export function CreateOrganizationModal({ open, setOpen }) {
  const [formData, setFormData] = useState({
    organizationName: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const { createOrganization } = useOrganizationContext();

  const handleOpen = () => setOpen(!open);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onCreateSuccess = () =>{
    // toast.success("Organization created successfully");
    handleOpen(); // Close the modal
    setFormData({
      organizationName: "",
      description: "",
    })
  }

  const handleSubmit = async () => {
    const { organizationName, description } = formData;
    // Validate organization name
    if (!organizationName.trim()) {
      toast.error("Organization Name cannot be empty.");
      return; // Stop the form submission
    }
    const data = { name:organizationName, description };

    setIsLoading(true); // Start loading
    try {
      await createOrganization(data,onCreateSuccess); // Call createOrganization with data
      // Close the modal after submission
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Dialog open={open} handler={handleOpen} className="rounded-lg max-w-lg w-full">
      <div className="flex items-center justify-between mb-4 px-5 pt-5">
        <h2 className="text-2xl font-semibold text-black">Create New Organization</h2>
        <button
          onClick={handleOpen}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <AiOutlineClose className="w-6 h-6" />
        </button>
      </div>

      <DialogBody>
        {/* Organization Name Input */}
        <div className="mb-4 px-5">
          <label className="block text-sm font-semibold text-black mb-2">Organization Name</label>
          <input
            type="text"
            name="organizationName"
            placeholder="Enter organization name"
            value={formData.organizationName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none"
          />
        </div>

        {/* Description Textarea */}
        <div className="mb-4 px-5">
          <label className="block text-sm font-semibold text-black mb-2">Description</label>
          <textarea
            name="description"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none"
            rows="4"
          ></textarea>
        </div>
      </DialogBody>

      <DialogFooter className="px-5 pb-5">
  <Button
    variant="gradient"
    size="lg"
    color="black"
    className="w-full flex items-center justify-center" // Center content in the button
    onClick={handleSubmit}
    disabled={isLoading} // Disable button when loading
  >
    {isLoading ? <Spinner color="white" className="font-bold" /> : "Create"}
  </Button>
</DialogFooter>

    </Dialog>
  );
}

export default CreateOrganizationModal;
