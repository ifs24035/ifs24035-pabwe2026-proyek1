import axios from "axios";

export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const TOKEN_KEY = "lapota_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

const http = axios.create({ baseURL: `${API_URL}/api`, timeout: 15000 });

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Ubah error axios menjadi Error biasa berisi pesan dari API
http.interceptors.response.use(
  (res) => res,
  (error) => {
    const data = error.response?.data;
    let message = data?.message || "Tidak dapat terhubung ke server";
    if (data?.errors?.length) {
      message += `: ${data.errors.map((e) => e.message).join(", ")}`;
    }
    const err = new Error(message);
    err.status = error.response?.status;
    return Promise.reject(err);
  }
);

export default http;