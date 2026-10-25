import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../helpers/apiHelper", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

import http from "../helpers/apiHelper";
import { authApi } from "./authApi";
import { catalogApi } from "./catalogApi";
import { orderApi } from "./orderApi";

beforeEach(() => {
  vi.clearAllMocks();
  for (const m of ["get", "post", "put", "patch", "delete"]) {
    http[m].mockResolvedValue({ data: { data: "HASIL", user: "U" } });
  }
});

describe("authApi", () => {
  it("register, login, dan me memanggil endpoint yang benar", async () => {
    expect(await authApi.register({ a: 1 })).toBe("HASIL");
    expect(http.post).toHaveBeenCalledWith("/auth/register", { a: 1 });
    expect(await authApi.login("a@b.c", "pw")).toBe("HASIL");
    expect(http.post).toHaveBeenCalledWith("/auth/login", { email: "a@b.c", password: "pw" });
    http.get.mockResolvedValue({ data: { data: { user: "ME" } } });
    expect(await authApi.me()).toBe("ME");
  });
});

describe("catalogApi", () => {
  it("memanggil endpoint publik", async () => {
    await catalogApi.categories();
    await catalogApi.products({ page: 2 });
    await catalogApi.product(5);
    await catalogApi.seller(2);
    await catalogApi.sellers();
    expect(http.get).toHaveBeenCalledWith("/categories");
    expect(http.get).toHaveBeenCalledWith("/products", { params: { page: 2 } });
    expect(http.get).toHaveBeenCalledWith("/products/5");
    expect(http.get).toHaveBeenCalledWith("/sellers/2");
    expect(http.get).toHaveBeenCalledWith("/sellers");
  });

  it("memanggil endpoint area penjual", async () => {
    http.post.mockResolvedValue({ data: { ok: 1 } });
    http.put.mockResolvedValue({ data: { ok: 2 } });
    http.delete.mockResolvedValue({ data: { ok: 3 } });
    await catalogApi.myProducts();
    expect(await catalogApi.createProduct("FD")).toEqual({ ok: 1 });
    expect(await catalogApi.updateProduct(9, "FD")).toEqual({ ok: 2 });
    expect(await catalogApi.deleteProduct(9)).toEqual({ ok: 3 });
    expect(http.get).toHaveBeenCalledWith("/seller/products");
    expect(http.put).toHaveBeenCalledWith("/seller/products/9", "FD");
    expect(http.delete).toHaveBeenCalledWith("/seller/products/9");
  });
});

describe("orderApi", () => {
  it("memanggil endpoint pesanan", async () => {
    await orderApi.checkout({ items: [] });
    await orderApi.mine();
    await orderApi.cancel(3);
    await orderApi.sellerOrders();
    await orderApi.sellerStats();
    await orderApi.updateStatus(3, "diproses");
    expect(http.post).toHaveBeenCalledWith("/orders", { items: [] });
    expect(http.get).toHaveBeenCalledWith("/orders/mine");
    expect(http.patch).toHaveBeenCalledWith("/orders/3/cancel");
    expect(http.get).toHaveBeenCalledWith("/seller/orders");
    expect(http.get).toHaveBeenCalledWith("/seller/stats");
    expect(http.patch).toHaveBeenCalledWith("/orders/3/status", { status: "diproses" });
  });
});