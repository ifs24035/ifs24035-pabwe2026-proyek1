import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

vi.mock("../api/authApi", () => ({
  authApi: { login: vi.fn(), register: vi.fn(), me: vi.fn() },
}));

import { authApi } from "../api/authApi";
import { useAuthStore } from "./authStore";
import { getToken, setToken } from "../helpers/apiHelper";

const seller = { id: 2, name: "Penjual", role: "seller" };
const buyer = { id: 1, name: "Pembeli", role: "buyer" };

describe("authStore", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    setActivePinia(createPinia());
  });

  it("init tanpa token: tidak memanggil API", async () => {
    const auth = useAuthStore();
    await auth.init();
    expect(authApi.me).not.toHaveBeenCalled();
    expect(auth.initialized).toBe(true);
    expect(auth.isLoggedIn).toBe(false);
  });

  it("init dengan token valid memulihkan sesi, dan hanya berjalan sekali", async () => {
    setToken("tok");
    authApi.me.mockResolvedValue(buyer);
    const auth = useAuthStore();
    await auth.init();
    await auth.init();
    expect(authApi.me).toHaveBeenCalledTimes(1);
    expect(auth.isBuyer).toBe(true);
  });

  it("init dengan token tidak valid menghapus token", async () => {
    setToken("rusak");
    authApi.me.mockRejectedValue(new Error("401"));
    const auth = useAuthStore();
    await auth.init();
    expect(getToken()).toBeNull();
    expect(auth.user).toBeNull();
  });

  it("login dan register menyimpan token serta pengguna", async () => {
    authApi.login.mockResolvedValue({ token: "T1", user: seller });
    authApi.register.mockResolvedValue({ token: "T2", user: buyer });
    const auth = useAuthStore();
    await auth.login("a@b.c", "pw");
    expect(getToken()).toBe("T1");
    expect(auth.isSeller).toBe(true);
    await auth.register({ name: "x" });
    expect(getToken()).toBe("T2");
    expect(auth.isBuyer).toBe(true);
    expect(auth.loading).toBe(false);
  });

  it("login gagal tetap mengembalikan loading ke false", async () => {
    authApi.login.mockRejectedValue(new Error("salah"));
    const auth = useAuthStore();
    await expect(auth.login("a", "b")).rejects.toThrow("salah");
    expect(auth.loading).toBe(false);
  });

  it("logout membersihkan sesi", async () => {
    authApi.login.mockResolvedValue({ token: "T1", user: buyer });
    const auth = useAuthStore();
    await auth.login("a", "b");
    auth.logout();
    expect(auth.isLoggedIn).toBe(false);
    expect(getToken()).toBeNull();
  });
});