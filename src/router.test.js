import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { createMemoryHistory } from "vue-router";

vi.mock("./api/authApi", () => ({ authApi: { me: vi.fn(), login: vi.fn(), register: vi.fn() } }));

import { createAppRouter, routes } from "./router";
import { useAuthStore } from "./stores/authStore";

async function visit(path, user = null) {
  const auth = useAuthStore();
  auth.initialized = true;
  auth.user = user;
  const router = createAppRouter(createMemoryHistory());
  await router.push(path);
  return router.currentRoute.value;
}

describe("router guard", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it("memiliki rute utama aplikasi", () => {
    expect(routes.length).toBeGreaterThan(2);
  });

  it("tamu bebas membuka katalog", async () => {
    expect((await visit("/produk")).name).toBe("products");
    expect((await visit("/")).name).toBe("home");
  });

  it("tamu diarahkan ke login saat membuka halaman terproteksi", async () => {
    const r = await visit("/pesanan");
    expect(r.name).toBe("login");
    expect(r.query.redirect).toBe("/pesanan");
  });

  it("peran yang salah dikembalikan ke beranda", async () => {
    expect((await visit("/penjual", { role: "buyer" })).name).toBe("home");
    expect((await visit("/pesanan", { role: "seller" })).name).toBe("home");
  });

  it("peran yang benar boleh masuk", async () => {
    expect((await visit("/pesanan", { role: "buyer" })).name).toBe("orders");
    expect((await visit("/penjual/produk", { role: "seller" })).name).toBe("seller-products");
  });

  it("pengguna yang sudah login tidak perlu membuka halaman login lagi", async () => {
    expect((await visit("/auth/login", { role: "buyer" })).name).toBe("home");
    expect((await visit("/auth/register", { role: "seller" })).name).toBe("seller-dashboard");
  });

  it("alamat tak dikenal menampilkan halaman 404", async () => {
    expect((await visit("/tidak-ada")).name).toBe("not-found");
  });
});