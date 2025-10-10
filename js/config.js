import { API_BASE_URL as LOCAL_API_URL } from "./config.local.js";

export const url = LOCAL_API_URL || "http://localhost:8000";
