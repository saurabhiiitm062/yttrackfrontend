// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // e.g., https://yttrackbackend.onrender.com
  withCredentials: true, // if needed for cookies/auth
});

export default API;
