import { useNavigate } from "react-router-dom";
import { createAxiosInstance } from "@/config/axios-config";
import { useCallback, useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { clearToken, handleLoginSuccess } from "@/helpers/auth";
import { useOrganizationContext } from "@/context/OrganizationContext";
import { useAuthContext } from "@/context/AuthContext";
import { dashboard } from "@/constants/app.routes";

export const useUser = () => {
  const navigate = useNavigate();
  const { organizationDetails } = useOrganizationContext(); // Access organization ID
  const { token, login } = useAuthContext();
  const baseAxios = useMemo(() => createAxiosInstance(), []);

  const [userDetails, setUserDetails] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingSignUp, setIsLoadingSignUp] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [usersInOrganization, setUsersInOrganization] = useState([]);
  const [usersNotInOrganization, setUsersNotInOrganization] = useState([]);
  const [isLoadingInOrg, setIsLoadingInOrg] = useState(false);
  const [isLoadingNotInOrg, setIsLoadingNotInOrg] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [isLoadingAddMember, setIsLoadingAddMember] = useState(false);

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

  // Fetch authenticated user details
  const fetchUserDetails = useCallback(async () => {
    if (isLoading || !token) return;
    setIsLoading(true);
    try {
      const response = await baseAxios.get(`/auth/me/`);
      setUserDetails(response.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [baseAxios,token]);

  // Fetch all users
  const fetchAllUsers = useCallback(async () => {
    if (isLoadingAll) return;
    setIsLoadingAll(true);
    try {
      const response = await baseAxios.get(`/users`);
      setAllUsers(response.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoadingAll(false);
    }
  }, [baseAxios]);

  // Fetch all users in a specific organization
  const fetchUsersInOrganization = useCallback(async () => {
    if (isLoadingInOrg || !organizationDetails?.id) return;
    setIsLoadingInOrg(true);
    try {
      const response = await baseAxios.get(
        `/organization/${organizationDetails.id}/users`,
      );
      setUsersInOrganization(response.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoadingInOrg(false);
    }
  }, [baseAxios, organizationDetails?.id]);

  // Fetch all users not in a specific organization
  const fetchUsersNotInOrganization = useCallback(async () => {
    if (isLoadingNotInOrg || !organizationDetails?.id) return;
    setIsLoadingNotInOrg(true);
    try {
      const response = await baseAxios.get(
        `/organization/${organizationDetails.id}/non-members`,
      );
      setUsersNotInOrganization(response.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoadingNotInOrg(false);
    }
  }, [baseAxios, organizationDetails?.id]);

  // Create a new user
  const createUser = useCallback(
    async (userData, redirectTo = `/dashboard`) => {
      if (isLoadingCreate) return;
      setIsLoadingCreate(true);
      try {
        await baseAxios.post(`/users`, userData);
        toast.success("User Created Successfully");
        navigate(redirectTo, { replace: true });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoadingCreate(false);
      }
    },
    [navigate, baseAxios],
  );

  // Update authenticated user
  const updateUser = useCallback(
    async (userData, redirectTo = `/profile`) => {
      if (isLoadingUpdate) return;
      setIsLoadingUpdate(true);
      try {
        await baseAxios.put(`/users/me`, userData);
        toast.success("User Updated Successfully");
        navigate(redirectTo, { replace: true });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoadingUpdate(false);
      }
    },
    [navigate, baseAxios],
  );

  // Delete authenticated user
  const deleteUser = useCallback(
    async (redirectTo = `/goodbye`) => {
      if (isLoadingDelete) return;
      setIsLoadingDelete(true);
      try {
        await baseAxios.delete(`/users/me`);
        toast.success("User Account Deleted Successfully");
        navigate(redirectTo, { replace: true });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoadingDelete(false);
      }
    },
    [navigate, baseAxios],
  );

  // User signup
  const signUpUser = useCallback(
    async (signUpData, redirectTo = `/login`) => {
      if (isLoadingSignUp) return;
      setIsLoadingSignUp(true);

      try {
        await baseAxios.post(`/auth/register`, signUpData);
        toast.success("Signup Successful");
        navigate(redirectTo, { replace: true });
      } catch (err) {
        if (err.response && err.response.data) {
          // Process each field's error messages, whether it's a single message or an array
          Object.entries(err.response.data).forEach(([field, messages]) => {
            const errorMessages = Array.isArray(messages)
              ? messages
              : [messages];
            errorMessages.forEach((message) => {
              toast.error(
                `${field.charAt(0).toUpperCase() + field.slice(1)}: ${message}`,
              );
            });
          });
        } else {
          toast.error("Something went wrong, please try again.");
        }
      } finally {
        setIsLoadingSignUp(false);
      }
    },
    [navigate, baseAxios, isLoadingSignUp],
  );

  // User login
  const loginUser = useCallback(
    async (loginData, redirectTo = dashboard) => {
      if (isLoadingLogin) return;
      setIsLoadingLogin(true);
      try {
        clearToken();
        const response = await baseAxios.post(`/auth/login`, loginData);
        toast.success("Login Successful");
        // handleLoginSuccess(response.data);
        login(response.data);
        navigate(redirectTo, { replace: true });
      } catch (err) {
        toast.error("Invalid Login Details");
      } finally {
        setIsLoadingLogin(false);
      }
    },
    [navigate, baseAxios],
  );

  // Add members to an organization
  const addMembersToOrganization = useCallback(
    async (emailList, onSuccess) => {
      setIsLoadingAddMember(true);
      try {
        await baseAxios.post(`/organization/add_member`, {
          emails: emailList,
          organization: organizationDetails.id,
        });

        await Promise.all([
          fetchUsersInOrganization(),
          fetchUsersNotInOrganization(),
        ]);
        toast.success("Members added successfully");
        if (onSuccess) onSuccess();
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoadingAddMember(false);
      }
    },
    [baseAxios, organizationDetails?.id],
  );
  const init = useCallback(async () => {
   if (initLoading || !organizationDetails?.id || !token) {
       setUsersInOrganization([]);
       setUsersNotInOrganization([]);
       return;  // Early return if initial conditions are not met
   }

   setInitLoading(true);

   try {
       await Promise.all([
           // Uncomment if you need these functions
           fetchUserDetails(),

           fetchUsersInOrganization(),
           fetchUsersNotInOrganization(),
       ]);
   } catch (err) {
       toast.error("Failed to initialize data");
   } finally {
       setInitLoading(false);
   }
}, [
   fetchUserDetails,
   fetchAllUsers,
   fetchUsersInOrganization,
   fetchUsersNotInOrganization,
   organizationDetails?.id,
   token,
]);

  useEffect(() => {
    token && fetchUserDetails();
  }, [token, fetchUserDetails]);

  useEffect(() => {
    init();
  }, [init, organizationDetails.id,token]);

  return {
    fetchUserDetails,
    fetchAllUsers,
    createUser,
    updateUser,
    deleteUser,
    signUpUser,
    loginUser,
    fetchUsersNotInOrganization,
    fetchUsersInOrganization,
    addMembersToOrganization,
    init,
    organizationDetails,
    userDetails,
    allUsers,
    isLoadingAddMember,
    usersInOrganization,
    usersNotInOrganization,
    isLoading,
    isLoadingAll,
    isLoadingCreate,
    isLoadingUpdate,
    isLoadingDelete,
    isLoadingSignUp,
    isLoadingLogin,
    isLoadingNotInOrg,
    isLoadingInOrg,
    initLoading,
  };
};
