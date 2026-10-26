import { describe, it, expect, beforeEach, vi } from "vitest";
import { getToken, setToken } from "./tokenStorage";

describe("tokenStorage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("menyimpan, membaca, lalu menghapus token", () => {
    setToken("abc123");
    expect(getToken()).toBe("abc123");
    setToken("");
    expect(getToken()).toBeNull();
  });

  it("tidak melempar error saat penyimpanan browser tidak tersedia", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("akses ditolak");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("akses ditolak");
    });
    expect(getToken()).toBeNull();
    expect(() => setToken("abc123")).not.toThrow();
  });
});
