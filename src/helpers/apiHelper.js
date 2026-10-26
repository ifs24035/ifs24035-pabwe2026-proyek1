import axios from "axios";
import { getToken, setToken } from "./tokenStorage";

// Diekspor ulang agar pemakai lama tetap bisa mengimpor dari apiHelper
export { getToken, setToken };

export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
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