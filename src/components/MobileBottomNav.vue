<template>
  <!-- Navigasi bawah (khusus ponsel) -->
  <nav
    class="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
  >
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-stone-600"
      :active-class="item.exact ? '' : '!text-ulos-700'"
      exact-active-class="!text-ulos-700"
    >
      <component :is="item.icon" :size="22" />
      {{ item.label }}
      <span
        v-if="item.badge"
        class="absolute right-[28%] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ulos-600 px-1 text-[10px] font-bold text-white"
      >
        {{ item.badge }}
      </span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { ClipboardList, House, LayoutDashboard, LogIn, Package, ShoppingCart, Store } from "lucide-vue-next";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";

const auth = useAuthStore();
const cart = useCartStore();

// Menu berbeda untuk penjual, pembeli, dan tamu
const items = computed(() => {
  const home = { to: "/", label: "Beranda", icon: House, exact: true };
  const shop = { to: "/produk", label: "Produk", icon: Store };
  if (auth.isSeller) {
    return [
      home,
      shop,
      { to: "/penjual", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { to: "/penjual/pesanan", label: "Pesanan", icon: ClipboardList },
    ];
  }
  const cartItem = { to: "/keranjang", label: "Keranjang", icon: ShoppingCart, badge: cart.count };
  return auth.isBuyer
    ? [home, shop, cartItem, { to: "/pesanan", label: "Pesanan", icon: Package }]
    : [home, shop, cartItem, { to: "/auth/login", label: "Masuk", icon: LogIn }];
});
</script>
