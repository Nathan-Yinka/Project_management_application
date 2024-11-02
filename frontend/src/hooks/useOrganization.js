import { useNavigate } from "react-router-dom";
import { createAxiosInstance } from "@/config/axios-config";
import { useCallback, useState, useMemo, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";

export const useOrganization = () => {
  const navigate = useNavigate();
  const { token } = useAuthContext();

  // Memoize Axios instance
  const baseAxios = useMemo(() => createAxiosInstance(), []);

  const [organizationDetails, setOrganizationDetails] = useState({});
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingRemoveMember, setIsLoadingRemoveMember] = useState(false);
  const [isLoadingLeave, setIsLoadingLeave] = useState(false);
  const [initLoading, setInitLoading] = useState(false);

  const didInitRef = useRef(false); // Ref to track if init has run

  // Error handling function
  const handleError = (err) => {
    if (err.response && err.response.data) {
      const errors = err.response.data;
      Object.keys(errors).forEach((field) => {
        const messages = Array.isArray(errors[field])
          ? errors[field]
          : [errors[field]];
        messages.forEach((message) => {
          toast.error(
            `${field.charAt(0).toUpperCase() + field.slice(1)}: ${message}`,
          );
        });
      });
    } else {
      toast.error("Something went wrong, please try again.");
    }
  };

  const hasPermission = (permission) => {
   // console.log("the permission that you have is ",organizationDetails)
    return organizationDetails?.user_permissions?.includes(permission) || false;
  };

  // Fetch all organizations
  const fetchAllOrganizations2 = async () => {
    // console.log("hi i am here")
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await baseAxios.get(`/organization/`);
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a single organization by ID
  const fetchOrganizationDetails = useCallback(
    async (organizationId) => {
      setIsLoading(true);
      try {
        const response = await baseAxios.get(`/organization/${organizationId}`);
        setOrganizationDetails(response.data);
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [baseAxios],
  );

  const init = useCallback(async () => {
   if (initLoading || didInitRef.current || !token) return;
   setInitLoading(true);
   didInitRef.current = true;

   try {
       const organizations = await fetchAllOrganizations2();
       if (organizations.length > 0) {
           setOrganizationDetails(organizations[0]);
           setAllOrganizations(organizations);
       } else {
           setOrganizationDetails({});
           setAllOrganizations([]);
       }
   } catch (err) {
       console.log(err);
       toast.error("Failed to initialize organization data");
   } finally {
       setInitLoading(false);
   }
}, [fetchAllOrganizations2, token]);

useEffect(() => {
   didInitRef.current = false; 
}, [token]);

  // Create a new organization
  const createOrganization = useCallback(
    async (organizationData, onSuccess) => {
      setIsLoadingCreate(true);
      try {
        const response = await baseAxios.post(
          `/organization/`,
          organizationData,
        );
        const res = await fetchAllOrganizations2();
        setAllOrganizations(res);
        setOrganizationDetails(response.data);
        toast.success("Organization Created Successfully");

        if (onSuccess) onSuccess();
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoadingCreate(false);
      }
    },
    [baseAxios, fetchAllOrganizations2,organizationDetails],
  );

  // Update an existing organization
  const updateOrganization = useCallback(
    async (organizationId, organizationData, onSuccess) => {
      setIsLoadingUpdate(true);
      try {
        await baseAxios.put(
          `/organizations/${organizationId}`,
          organizationData,
        );
        toast.success("Organization Updated Successfully");
        if (onSuccess) onSuccess();
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoadingUpdate(false);
      }
    },
    [baseAxios],
  );

  // Remove a member from an organization
  const removeMemberFromOrganization = useCallback(
    async (organizationId, memberId) => {
      setIsLoadingRemoveMember(true);
      try {
        await baseAxios.delete(
          `/organizations/${organizationId}/remove-member/${memberId}`,
        );
        await init();
        toast.success("Member removed successfully");
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoadingRemoveMember(false);
      }
    },
    [baseAxios, fetchOrganizationDetails],
  );

  // Leave the organization
  const leaveOrganization = useCallback(
    async (organizationId, onSuccess) => {
      setIsLoadingLeave(true);
      try {
        await baseAxios.post(`organization/leave-organization`, {
          organization_id: organizationId,
        });
        didInitRef.current = false;
        await init();
        toast.success("Successfully left the organization");

        if (onSuccess) onSuccess();
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoadingLeave(false);
      }
    },
    [baseAxios, init],
  );

  // Explicitly call init() from a parent component or another trigger

  return {
    init,
    fetchAllOrganizations2,
    hasPermission,
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
    isLoadingRemoveMember,
    initLoading,
  };
};
