import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCartStore } from "./cartStore";

const product = { id: 1, name: "Kopi", price: 50000, stock: 5, unit: "bungkus", seller_id: 1, shop_name: "Toko A" };

describe("cartStore", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it("menambah produk dan menghitung total", () => {
    const cart = useCartStore();
    cart.add(product, 2);
    cart.add(product, 1);
    expect(cart.count).toBe(3);
    expect(cart.total).toBe(150000);
  });

  it("tidak melebihi stok", () => {
    const cart = useCartStore();
    cart.add(product, 99);
    expect(cart.items[0].quantity).toBe(5);
    cart.setQuantity(1, 100);
    expect(cart.items[0].quantity).toBe(5);
  });

  it("mengelompokkan per toko, menghapus, dan mengosongkan", () => {
    const cart = useCartStore();
    cart.add(product);
    cart.add({ ...product, id: 2, seller_id: 2, shop_name: "Toko B" });
    expect(cart.groups).toHaveLength(2);
    cart.remove(1);
    expect(cart.items).toHaveLength(1);
    cart.clear();
    expect(cart.count).toBe(0);
  });
});