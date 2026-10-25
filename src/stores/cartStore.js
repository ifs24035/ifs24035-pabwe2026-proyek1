import { defineStore } from "pinia";

const CART_KEY = "lapota_cart";

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const useCartStore = defineStore("cart", {
  state: () => ({ items: loadCart() }),
  getters: {
    count: (state) => state.items.reduce((n, i) => n + i.quantity, 0),
    total: (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    // Kelompokkan per toko agar pembeli tahu pesanan dipecah per penjual
    groups: (state) => {
      const map = new Map();
      for (const item of state.items) {
        if (!map.has(item.seller_id)) {
          map.set(item.seller_id, { seller_id: item.seller_id, shop_name: item.shop_name, items: [] });
        }
        map.get(item.seller_id).items.push(item);
      }
      return [...map.values()];
    },
  },
  actions: {
    persist() {
      localStorage.setItem(CART_KEY, JSON.stringify(this.items));
    },
    add(product, quantity = 1) {
      const existing = this.items.find((i) => i.product_id === product.id);
      const next = (existing?.quantity || 0) + quantity;
      const quantityFinal = Math.min(next, product.stock);
      if (existing) {
        existing.quantity = quantityFinal;
        existing.stock = product.stock;
      } else {
        this.items.push({
          product_id: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          stock: product.stock,
          image: product.image,
          category_icon: product.category_icon,
          seller_id: product.seller_id,
          shop_name: product.shop_name,
          quantity: quantityFinal,
        });
      }
      this.persist();
    },
    setQuantity(productId, quantity) {
      const item = this.items.find((i) => i.product_id === productId);
      if (!item) return;
      item.quantity = Math.max(1, Math.min(Number(quantity) || 1, item.stock));
      this.persist();
    },
    remove(productId) {
      this.items = this.items.filter((i) => i.product_id !== productId);
      this.persist();
    },
    clear() {
      this.items = [];
      this.persist();
    },
  },
});