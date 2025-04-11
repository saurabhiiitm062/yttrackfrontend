// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://yttrackbackend.onrender.com/",
  withCredentials: true, // if needed for cookies/auth
});

export default API;
