// axiosInstance.js
import axios from 'axios';
import { baseURL } from './baseURLConfig';

const axiosInstance = axios.create({
  baseURL: baseURL,
});

export default axiosInstance;
