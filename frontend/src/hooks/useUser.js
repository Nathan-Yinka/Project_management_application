import { useNavigate } from "react-router-dom";
import { createAxiosInstance } from "@/config/axios-config";
import { useCallback, useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { clearToken, handleLoginSuccess } from "@/helpers/auth";
import { useOrganizationContext } from "@/context/OrganizationContext";

export const useUser = () => {
   const navigate = useNavigate();
   const { organizationDetails } = useOrganizationContext(); // Access organization ID
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

   // Fetch authenticated user details
   const fetchUserDetails = useCallback(async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
         const response = await baseAxios.get(`/auth/me/`);
         setUserDetails(response.data);
      } catch (err) {
         toast.error(err.message);
      } finally {
         setIsLoading(false);
      }
   }, [baseAxios]);

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
         const response = await baseAxios.get(`/organization/${organizationDetails.id}/users`);
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
         const response = await baseAxios.get(`/organization/${organizationDetails.id}/non-members`);
         setUsersNotInOrganization(response.data);
      } catch (err) {
         toast.error(err.message);
      } finally {
         setIsLoadingNotInOrg(false);
      }
   }, [baseAxios, organizationDetails?.id]);

   // Create a new user
   const createUser = useCallback(async (userData, redirectTo = `/dashboard`) => {
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
   }, [navigate, baseAxios]);

   // Update authenticated user
   const updateUser = useCallback(async (userData, redirectTo = `/profile`) => {
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
   }, [navigate, baseAxios]);

   // Delete authenticated user
   const deleteUser = useCallback(async (redirectTo = `/goodbye`) => {
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
   }, [navigate, baseAxios]);

   // User signup
   const signUpUser = useCallback(async (signUpData, redirectTo = `/login`) => {
      if (isLoadingSignUp) return;
      setIsLoadingSignUp(true);
      try {
         await baseAxios.post(`/auth/register`, signUpData);
         toast.success("Signup Successful");
         navigate(redirectTo, { replace: true });
      } catch (err) {
         if (err.response && err.response.data) {
            Object.keys(err.response.data).forEach((field) => {
               err.response.data[field].forEach((message) => {
                  toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${message}`);
               });
            });
         } else {
            toast.error("Something went wrong, please try again.");
         }
      } finally {
         setIsLoadingSignUp(false);
      }
   }, [navigate, baseAxios]);

   // User login
   const loginUser = useCallback(async (loginData, redirectTo = `/dashboard`) => {
      if (isLoadingLogin) return;
      setIsLoadingLogin(true);
      try {
         clearToken();
         const response = await baseAxios.post(`/auth/login`, loginData);
         toast.success("Login Successful");
         handleLoginSuccess(response.data);
         navigate(redirectTo, { replace: true });
      } catch (err) {
         toast.error("Invalid Login Details");
      } finally {
         setIsLoadingLogin(false);
      }
   }, [navigate, baseAxios]);

   // Init function to fetch all required data once organizationId is available
   const init = useCallback(async () => {
      if (initLoading || !organizationDetails?.id) return;
      setInitLoading(true);
      try {
         await Promise.all([
            fetchUserDetails(),
            // fetchAllUsers(),
            fetchUsersInOrganization(),
            fetchUsersNotInOrganization()
         ]);
      } catch (err) {
         toast.error("Failed to initialize data");
      } finally {
         setInitLoading(false);
      }
   }, [fetchUserDetails, fetchAllUsers, fetchUsersInOrganization, fetchUsersNotInOrganization, organizationDetails?.id]);

   useEffect(() => {
      init();
   }, [init]);

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
      init,
      userDetails,
      allUsers,
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
