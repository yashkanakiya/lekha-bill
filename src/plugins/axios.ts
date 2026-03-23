import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  withXSRFToken: true,
});

export const initCSRF = async () => {
  await axios.get("/sanctum/csrf-cookie", {
    withCredentials: true,
  });
};

export default api;