import axios from "axios";

// Define baseURL variable
export const baseURL = "http://localhost:5000";

// Create axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: baseURL,
});

export default axiosInstance;
