import { useNavigate } from "react-router-dom";
import { createAxiosInstance } from "@/config/axios-config";
import { useCallback, useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useOrganizationContext } from "@/context/OrganizationContext"; // Import the organization context
import { useDebounce } from "./use-debounce";

export const useTask = () => {
  const navigate = useNavigate();
  const { organizationDetails } = useOrganizationContext(); 


  // Memoize Axios instance
  const baseAxios = useMemo(() => createAxiosInstance(), []);

  const [search, setSearch] = useState(""); 
  const debouncedSearchTerm = useDebounce(search, 1000);
  const [taskDetails, setTaskDetails] = useState({});
  const [allTasks, setAllTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [initLoading, setInitLoading] = useState(false);


    // Set search term and fetch tasks based on the new term
   const handleSearch = (newSearchTerm) => {
      setSearch(newSearchTerm);
    };

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
    [baseAxios],
  );


  // Fetch all tasks for the organization
  const fetchAllTasks = useCallback(async () => {
    if (!organizationDetails?.id) return;
    setIsLoadingAll(true);
    try {
      const response = await baseAxios.get(
        `/project/?organization_id=${organizationDetails.id}&search=${search}`,
      );
      setAllTasks(response.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoadingAll(false);
    }
  }, [baseAxios, organizationDetails?.id,debouncedSearchTerm]);

  useEffect(()=>{
   fetchAllTasks()
  },[debouncedSearchTerm])

  // Create a new task
  const createTask = useCallback(
    async (taskData, onSuccess) => {
      if (isLoadingCreate) return;
      setIsLoadingCreate(true);
      try {
        const response = await baseAxios.post(`/project/`, taskData);
        toast.success("Task Created Successfully");
        setAllTasks((prevTasks) => [...prevTasks, response.data]);
        if (onSuccess) onSuccess();
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoadingCreate(false);
      }
    },
    [baseAxios],
  );

  // Update an existing task
  const updateTask = useCallback(
    async (taskId, taskData, onSuccess) => {
      if (isLoadingUpdate) return;
      setIsLoadingUpdate(true);
      try {
        const response = await baseAxios.patch(
          `/project/${taskId}/${organizationDetails.id}/`,
          taskData,
        );
        toast.success("Task Updated Successfully");
        setAllTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? response.data : task)),
        );
        if (onSuccess) onSuccess();
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoadingUpdate(false);
      }
    },
    [baseAxios, organizationDetails?.id],
  );

  const changeTaskStatus = useCallback(
    async (taskId, newStatus, onSuccess = null) => {
      if (isLoadingUpdate) return;
      setIsLoadingUpdate(true);
      try {
        const response = baseAxios.patch(
          `/project/${taskId}/update-status/`,
          {
            status: newStatus,
            organization: organizationDetails?.id,
          },
        );
        toast.success("Status Updated Successfully");
        setAllTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task,
          ),
        );
        if (onSuccess) onSuccess();
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoadingUpdate(false);
      }
    },
    [baseAxios, organizationDetails?.id, isLoadingUpdate],
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
    [navigate, baseAxios],
  );

// Initialize function to fetch tasks when organizationDetails changes
useEffect(() => {
   if (!organizationDetails?.id) {
       setAllTasks([]); // Clear tasks if organizationDetails.id is not available
       return;
   }

   // Optionally set loading state if needed to prevent duplicate fetches
   const fetchTasks = async () => {
       setIsLoading(true);  // Set a loading state if you have one

       try {
            handleSearch("")
            // console.log("fjhjhh")
           await fetchAllTasks();
       } catch (err) {
           console.error("Failed to fetch tasks", err);
       } finally {
           setIsLoading(false);  // Reset loading state
       }
   };

   fetchTasks();
}, [organizationDetails?.id]);

  return {
    taskDetails,
    allTasks,
    organizationDetails,
    fetchTaskDetails,
    handleSearch,
    search,
    changeTaskStatus,
    fetchAllTasks,
    createTask,
    updateTask,
    deleteTask,
    isLoading,
    isLoadingAll,
    isLoadingCreate,
    isLoadingUpdate,
    isLoadingDelete,
    initLoading,
  };
};
