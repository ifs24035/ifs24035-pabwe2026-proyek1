import { describe, it, expect, vi } from "vitest";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) } }));

import Swal from "sweetalert2";
import {
  formatRupiah,
  formatDate,
  imageUrl,
  ORDER_STATUS,
  showErrorDialog,
  showSuccessDialog,
  showConfirmDialog,
} from "./toolsHelper";

describe("toolsHelper", () => {
  it("memformat rupiah", () => {
    expect(formatRupiah(55000).replace(/\s/g, " ")).toContain("55.000");
    expect(formatRupiah("abc").replace(/\s/g, " ")).toContain("0");
  });

  it("memformat tanggal dari SQLite dan menangani nilai kosong", () => {
    expect(formatDate("")).toBe("-");
    expect(formatDate("2026-10-22 08:25:13")).toMatch(/2026/);
  });

  it("membuat URL gambar atau string kosong", () => {
    expect(imageUrl("a.jpg")).toContain("/uploads/a.jpg");
    expect(imageUrl("")).toBe("");
  });

  it("memiliki label untuk setiap status pesanan", () => {
    for (const s of ["pending", "diproses", "dikirim", "selesai", "dibatalkan"]) {
      expect(ORDER_STATUS[s].label).toBeTruthy();
    }
  });

  it("menampilkan dialog error, sukses, dan konfirmasi", async () => {
    await showErrorDialog("gagal");
    await showSuccessDialog("berhasil");
    const r = await showConfirmDialog("yakin?");
    expect(Swal.fire).toHaveBeenCalledTimes(3);
    expect(r.isConfirmed).toBe(true);
  });
});