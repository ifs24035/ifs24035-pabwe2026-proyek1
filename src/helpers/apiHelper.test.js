import { describe, it, expect, beforeEach, afterEach } from "vitest";
import http, { getToken, setToken } from "./apiHelper";

const originalAdapter = http.defaults.adapter;

const ok = (config, data = {}) => ({ data, status: 200, statusText: "OK", headers: {}, config });

describe("apiHelper", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    http.defaults.adapter = originalAdapter;
  });

  it("menyimpan dan menghapus token", () => {
    setToken("abc");
    expect(getToken()).toBe("abc");
    setToken("");
    expect(getToken()).toBeNull();
  });

  it("menempelkan token ke header Authorization", async () => {
    setToken("abc");
    http.defaults.adapter = async (config) => ok(config, { auth: config.headers.Authorization });
    const res = await http.get("/x");
    expect(res.data.auth).toBe("Bearer abc");
  });

  it("tidak menempelkan header bila belum login", async () => {
    http.defaults.adapter = async (config) => ok(config, { auth: config.headers.Authorization ?? null });
    const res = await http.get("/x");
    expect(res.data.auth).toBeNull();
  });

  it("mengubah error API menjadi Error berisi pesan dan daftar field", async () => {
    http.defaults.adapter = async (config) => {
      const err = new Error("gagal");
      err.config = config;
      err.response = {
        status: 400,
        data: { message: "Data tidak valid", errors: [{ message: "Email salah" }, { message: "Nama pendek" }] },
      };
      throw err;
    };
    await expect(http.get("/x")).rejects.toMatchObject({
      message: "Data tidak valid: Email salah, Nama pendek",
      status: 400,
    });
  });

  it("memberi pesan bawaan saat server tidak terjangkau", async () => {
    http.defaults.adapter = async (config) => {
      const err = new Error("Network Error");
      err.config = config;
      throw err;
    };
    await expect(http.get("/x")).rejects.toMatchObject({ message: "Tidak dapat terhubung ke server" });
  });
});