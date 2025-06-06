import axios from "axios";
import { HOST } from "@/utils/constants.js";

// const BASE_URL=import.meta.env.MODE ==="development" ? HOST : "/"
export const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true,
  headers: {
      'Content-Type': 'application/json'
  }});
 