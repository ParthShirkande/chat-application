import axios from "axios";
import { HOST } from "@/utils/constants.js";

const BASE_URL=import.meta.env.MODE ==="development" ? HOST : "/"
export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
      'Content-Type': 'application/json'
  }});
 