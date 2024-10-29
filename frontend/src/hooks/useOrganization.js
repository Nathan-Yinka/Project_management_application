import { useNavigate } from "react-router-dom";
import { createAxiosInstance } from "@/config/axios-config";
import { useCallback, useState, useMemo } from "react";
import { toast } from "sonner";

export const useOrganization = () => {
   const navigate = useNavigate();

   // Memoize Axios instance
   const baseAxios = useMemo(() => createAxiosInstance(), []);

   const [organizationDetails, setOrganizationDetails] = useState({});
   const [allOrganizations, setAllOrganizations] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isLoadingCreate, setIsLoadingCreate] = useState(false);
   const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
   const [isLoadingAddMember, setIsLoadingAddMember] = useState(false);
   const [isLoadingRemoveMember, setIsLoadingRemoveMember] = useState(false);
   const [isLoadingLeave, setIsLoadingLeave] = useState(false);
   const [initLoading, setInitLoading] = useState(false); // Initialize loading state for init function

   // Error handling function
   const handleError = (err) => {
      if (err.response && err.response.data) {
         const errors = err.response.data;
         Object.keys(errors).forEach((field) => {
            const messages = Array.isArray(errors[field]) ? errors[field] : [errors[field]];
            messages.forEach((message) => {
               toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${message}`);
            });
         });
      } else {
         toast.error("Something went wrong, please try again.");
      }
   };

   // Fetch all organizations
   const fetchAllOrganizations = useCallback(async () => {
      setIsLoading(true);
      try {
         const response = await baseAxios.get(`/organization/`);
         return response.data
      } catch (err) {
         handleError(err);
      } finally {
         setIsLoading(false);
      }
   }, [baseAxios]);

   // Fetch a single organization by ID
   const fetchOrganizationDetails = useCallback(async (organizationId) => {
      setIsLoading(true);
      try {
         const response = await baseAxios.get(`/organization/${organizationId}`);
         setOrganizationDetails(response.data);
      } catch (err) {
         handleError(err);
      } finally {
         setIsLoading(false);
      }
   }, [baseAxios]);

   // Create a new organization
   const createOrganization = useCallback(async (organizationData, onSuccess) => {
      setIsLoadingCreate(true);
      try {
         const response = await baseAxios.post(`/organization/`, organizationData);
         await fetchAllOrganizations();
         setOrganizationDetails(response.data);
         toast.success("Organization Created Successfully");

         if (onSuccess) onSuccess();
      } catch (err) {
         handleError(err);
      } finally {
         setIsLoadingCreate(false);
      }
   }, [baseAxios, fetchAllOrganizations]);

   // Update an existing organization
   const updateOrganization = useCallback(async (organizationId, organizationData,onSuccess) => {
      setIsLoadingUpdate(true);
      try {
         await baseAxios.put(`/organizations/${organizationId}`, organizationData);
         toast.success("Organization Updated Successfully");
         if (onSuccess) onSuccess();
      } catch (err) {
         handleError(err);
      } finally {
         setIsLoadingUpdate(false);
      }
   }, [baseAxios, navigate]);

   // Add members to an organization
   const addMembersToOrganization = useCallback(async (organizationId, emailList,onSuccess) => {
      setIsLoadingAddMember(true);
      try {
         await baseAxios.post(`/organization/add_member`, {
            emails: emailList,
            organization: organizationId
         });
         
         await fetchOrganizationDetails(organizationId);
         toast.success("Members added successfully");
         if (onSuccess) onSuccess();
      } catch (err) {
         handleError(err);
      } finally {
         setIsLoadingAddMember(false);
      }
   }, [baseAxios, fetchOrganizationDetails]);

   // Remove a member from an organization
   const removeMemberFromOrganization = useCallback(async (organizationId, memberId) => {
      setIsLoadingRemoveMember(true);
      try {
         await baseAxios.delete(`/organizations/${organizationId}/remove-member/${memberId}`);
         toast.success("Member removed successfully");
         await fetchOrganizationDetails(organizationId);
      } catch (err) {
         handleError(err);
      } finally {
         setIsLoadingRemoveMember(false);
      }
   }, [baseAxios, fetchOrganizationDetails]);


   // Leave the organization
const leaveOrganization = useCallback(async (organizationId, onSuccess) => {
   setIsLoadingLeave(true);
   try {
      await baseAxios.post(`organization/leave-organization`,
      {
         organization_id:organizationId
      });
      
      // Perform any additional cleanup, such as fetching updated organizations
      await init();
      toast.success("Successfully left the organization");
      
      if (onSuccess) onSuccess(); // Optional callback after successful leave
   } catch (err) {
      handleError(err); // Error handling if any issues
   } finally {
      setIsLoadingLeave(false); // Reset loading state
   }
}, [baseAxios, fetchAllOrganizations]);

// Init function to fetch all required data
const init = useCallback(async () => {
   if (initLoading) return; // Prevent re-triggering
   setInitLoading(true);
   try {
      const organizations = await fetchAllOrganizations();
      if (organizations.length > 0) {
         setOrganizationDetails(organizations[0]); // Set the first organization as organizationDetails
         setAllOrganizations(organizations); // Set all organizations
      } else {
         setOrganizationDetails({}); // If no organizations, set details to empty
         setAllOrganizations([]); // Set empty array
      }
   } catch (err) {
      console.log(err)
      toast.error("Failed to initialize organization data");
   } finally {
      setInitLoading(false);
   }
}, [fetchAllOrganizations]);

   return {
      init,
      fetchAllOrganizations,
      addMembersToOrganization,
      removeMemberFromOrganization,
      fetchOrganizationDetails,
      createOrganization,
      updateOrganization,
      setOrganizationDetails,
      leaveOrganization,
      organizationDetails,
      allOrganizations,
      isLoading,
      isLoadingCreate,
      isLoadingUpdate,
      isLoadingLeave,
      isLoadingAddMember,
      isLoadingRemoveMember,
      initLoading, // Return initLoading for tracking initialization status
   };
};
