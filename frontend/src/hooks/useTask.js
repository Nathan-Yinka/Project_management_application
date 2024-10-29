import { useNavigate } from "react-router-dom";
import { createAxiosInstance } from "@/config/axios-config";
import { useCallback, useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useOrganizationContext } from "@/context/OrganizationContext"; // Import the organization context

export const useTask = () => {
   const navigate = useNavigate();
   const { organizationDetails } = useOrganizationContext(); // Access organization ID

   // Memoize Axios instance
   const baseAxios = useMemo(() => createAxiosInstance(), []);

   const [taskDetails, setTaskDetails] = useState({});
   const [allTasks, setAllTasks] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isLoadingAll, setIsLoadingAll] = useState(false);
   const [isLoadingCreate, setIsLoadingCreate] = useState(false);
   const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
   const [isLoadingDelete, setIsLoadingDelete] = useState(false);
   const [initLoading, setInitLoading] = useState(false);

   // Fetch a single task by ID
   const fetchTaskDetails = useCallback(
      async (taskId) => {
         if (isLoading) return;
         setIsLoading(true);
         try {
            const response = await baseAxios.get(`/tasks/${taskId}`);
            setTaskDetails(response.data);
         } catch (err) {
            toast.error(err.message);
         } finally {
            setIsLoading(false);
         }
      },
      [baseAxios]
   );

   // Fetch all tasks for the organization
   const fetchAllTasks = useCallback(
      async () => {
         if (isLoadingAll || !organizationDetails?.id) return;
         setIsLoadingAll(true);
         try {
            const response = await baseAxios.get(`/project/?organization_id=${organizationDetails.id}`);
            setAllTasks(response.data);
         } catch (err) {
            toast.error(err.message);
         } finally {
            setIsLoadingAll(false);
         }
      },
      [baseAxios, organizationDetails?.id]
   );

   // Create a new task
   const createTask = useCallback(
      async (taskData,onSuccess) => {
         if (isLoadingCreate) return;
         setIsLoadingCreate(true);
         try {
            const response = await baseAxios.post(`/project/`, taskData);
            toast.success("Task Created Successfully");
            setAllTasks((prevTasks) => [...prevTasks, response.data]);
            if (onSuccess) onSuccess();
            // navigate(`/tasks/${response.data.id}`, { replace: true });
         } catch (err) {
            toast.error(err.message);
         } finally {
            setIsLoadingCreate(false);
         }
      },
      [navigate, baseAxios]
   );

   // Update an existing task
   const updateTask = useCallback(
      async (taskId, taskData) => {
         if (isLoadingUpdate) return;
         setIsLoadingUpdate(true);
         try {
            await baseAxios.put(`/tasks/${taskId}`, taskData);
            toast.success("Task Updated Successfully");
            navigate(`/tasks/${taskId}`, { replace: true });
         } catch (err) {
            toast.error(err.message);
         } finally {
            setIsLoadingUpdate(false);
         }
      },
      [navigate, baseAxios]
   );

   // Delete a task
   const deleteTask = useCallback(
      async (taskId) => {
         if (isLoadingDelete) return;
         setIsLoadingDelete(true);
         try {
            await baseAxios.delete(`/tasks/${taskId}`);
            toast.success("Task Deleted Successfully");
            navigate(-1, { replace: true });
         } catch (err) {
            toast.error(err.message);
         } finally {
            setIsLoadingDelete(false);
         }
      },
      [navigate, baseAxios]
   );

   // Init function to fetch all required data once organizationId is available
   const init = useCallback(async () => {
      if (initLoading || !organizationDetails?.id) return;
      setInitLoading(true);
      try {
         await fetchAllTasks();
      } catch (err) {
         toast.error("Failed to initialize task data");
      } finally {
         setInitLoading(false);
      }
   }, [fetchAllTasks, organizationDetails?.id]);

   // Trigger init on component mount or when organizationId becomes available
   useEffect(() => {
      init();
   }, [init]);

   return {
      taskDetails,
      allTasks,
      fetchTaskDetails,
      fetchAllTasks,
      createTask,
      updateTask,
      deleteTask,
      init,
      organizationDetails,
      isLoading,
      isLoadingAll,
      isLoadingCreate,
      isLoadingUpdate,
      isLoadingDelete,
      initLoading,
   };
};
