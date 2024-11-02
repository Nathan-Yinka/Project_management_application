import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const handleLoginSuccess = (payload) => {
  const { token } = payload;
  // console.log(payload);
  localStorage.setItem("authToken", token);
};

export const clearToken = () => {
  localStorage.removeItem("authToken");
};

export const handleLogout = () => {
  clearToken();
  toast.success("User logged out successfully");
};

export const isLoggedIn = () => {
  const token = localStorage.getItem("authToken");
  return token !== null;
};

export const isAdmin = () => {
  const isAdmin = localStorage.getItem("is_admin");
  return isAdmin === "true";
};

export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const authRedirect = () => {
  clearToken();
  window.location.href = "/login";  // Directly navigate to login page
};
