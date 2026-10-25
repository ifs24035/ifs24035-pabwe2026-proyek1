import Swal from "sweetalert2";
import { API_URL } from "./apiHelper";

const base = { confirmButtonColor: "#a82225" };

export const showErrorDialog = (message) =>
  Swal.fire({ ...base, title: "Terjadi Kesalahan", text: message, icon: "error", confirmButtonText: "Tutup" });

export const showSuccessDialog = (message) =>
  Swal.fire({ ...base, title: "Berhasil", text: message, icon: "success", confirmButtonText: "Tutup" });

export const showConfirmDialog = (message) =>
  Swal.fire({
    ...base,
    title: "Konfirmasi",
    text: message,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
  });

export function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatDate(value) {
  if (!value) return "-";
  // SQLite menyimpan UTC tanpa zona waktu: "YYYY-MM-DD HH:MM:SS"
  const date = new Date(String(value).replace(" ", "T") + "Z");
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function imageUrl(filename) {
  return filename ? `${API_URL}/uploads/${filename}` : "";
}

export const ORDER_STATUS = {
  pending: { label: "Menunggu", class: "bg-amber-100 text-amber-800" },
  diproses: { label: "Diproses", class: "bg-blue-100 text-blue-800" },
  dikirim: { label: "Dikirim", class: "bg-indigo-100 text-indigo-800" },
  selesai: { label: "Selesai", class: "bg-emerald-100 text-emerald-800" },
  dibatalkan: { label: "Dibatalkan", class: "bg-red-100 text-red-800" },
};