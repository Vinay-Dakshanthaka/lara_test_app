import axios from "axios";

// Define baseURL variable
// export const baseURL = "http://localhost:8080";
// export const baseURL = "http://localhost:5000";
export const baseURL = "https://paintpulse.in"

// Create axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: baseURL,
});

export default axiosInstance;
