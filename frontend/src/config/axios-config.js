import { getToken, authRedirect } from "@/helpers/auth";
import axios from "axios";

export const createAxiosInstance = () => {
  const baseServerUrl = import.meta.env.VITE_PUBLIC_BASEURL || "http://127.0.0.1:8000/";
  const axiosInstance = axios.create({
    baseURL: baseServerUrl,
    timeout: 100000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Setup request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      // console.log(`Request made to ${config.url} with data:`, config.data);
      return config;
    },
    (error) => {
      console.error("Failed to make request:", error);
      return Promise.reject(error);
    }
  );

  // Setup response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      // console.log(`Response received from ${response.config.url} with status: ${response?.status}`);
      return response;
    },
    (error) => {
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        // Handle Unauthorized (401) or Forbidden (403) error
        // console.log("Unauthorized or forbidden access. Redirecting to login.");
        authRedirect(); // Clear token and navigate to login
      } else if (error.response && error.response.data) {
        // Handle other errors
        const errors = error.response.data;
        Object.keys(errors).forEach((field) => {
          errors[field].forEach((message) => {
            // console.log(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${message}`);
          });
        });
      } else {
        // console.log("Something went wrong, please try again.");
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
