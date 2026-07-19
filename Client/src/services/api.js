import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Attach the saved JWT to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ucab_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, clear it so the user is redirected to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("ucab_token");
      localStorage.removeItem("ucab_user");
    }
    return Promise.reject(err);
  }
);

export default api;
