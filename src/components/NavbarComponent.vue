<template>
  <header class="sticky top-0 z-40 bg-white/95 shadow-xs backdrop-blur">
    <div class="ulos-stripe" />
    <div class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex shrink-0 items-center" aria-label="LapoTa - beranda">
        <AppLogo size="md" />
      </RouterLink>

      <form class="relative mx-auto hidden max-w-xl flex-1 md:block" @submit.prevent="search">
        <Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          v-model="keyword"
          type="search"
          placeholder="Cari kopi, ulos, ikan mas, madu..."
          class="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-4 text-sm transition focus:border-ulos-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-ulos-600/10"
        />
      </form>

      <nav class="hidden items-center gap-1 lg:flex">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="rounded-lg px-3 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100 hover:text-stone-900"
          exact-active-class="!text-ulos-700 bg-ulos-50"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="ml-auto flex items-center gap-1.5 md:ml-0">
        <RouterLink
          v-if="!auth.isSeller"
          to="/keranjang"
          class="relative hidden rounded-xl p-2.5 text-stone-700 hover:bg-stone-100 md:block"
          aria-label="Keranjang"
        >
          <ShoppingCart :size="22" />
          <span
            v-if="cart.count"
            class="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ulos-600 px-1 text-[11px] font-bold text-white"
          >
            {{ cart.count }}
          </span>
        </RouterLink>

        <div v-if="auth.isLoggedIn" ref="menuRef" class="relative">
          <button
            type="button"
            class="flex items-center gap-2 rounded-full border border-stone-200 py-1 pl-1 pr-3 hover:bg-stone-50"
            @click="open = !open"
          >
            <span
              class="flex h-8 w-8 items-center justify-center rounded-full bg-ulos-600 text-sm font-bold text-white"
            >
              {{ auth.user.name.charAt(0).toUpperCase() }}
            </span>
            <span class="hidden max-w-28 truncate text-sm font-semibold sm:block">
              {{ auth.user.name }}
            </span>
            <ChevronDown :size="16" class="text-stone-400" />
          </button>
          <div
            v-if="open"
            class="absolute right-0 mt-2 w-60 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-stone-900/5"
          >
            <div class="px-3 py-2">
              <p class="truncate text-sm font-semibold">{{ auth.user.name }}</p>
              <p class="truncate text-xs text-stone-500">{{ auth.user.email }}</p>
              <p class="mt-1 text-xs font-semibold text-ulos-600">
                {{ auth.isSeller ? auth.user.seller?.shop_name : "Pembeli" }}
              </p>
            </div>
            <RouterLink
              v-if="auth.isSeller"
              to="/penjual"
              class="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-stone-100"
              @click="open = false"
            >
              <LayoutDashboard :size="17" /> Dashboard Toko
            </RouterLink>
            <RouterLink
              v-else
              to="/pesanan"
              class="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-stone-100"
              @click="open = false"
            >
              <Package :size="17" /> Pesanan Saya
            </RouterLink>
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              @click="logout"
            >
              <LogOut :size="17" /> Keluar
            </button>
          </div>
        </div>
        <template v-else>
          <RouterLink
            to="/auth/login"
            class="rounded-xl px-3.5 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100"
          >
            Masuk
          </RouterLink>
          <RouterLink
            to="/auth/register"
            class="hidden rounded-xl bg-ulos-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-ulos-600/25 hover:bg-ulos-700 sm:block"
          >
            Daftar
          </RouterLink>
        </template>
      </div>
    </div>

    <!-- Pencarian untuk layar kecil -->
    <form class="relative px-4 pb-3 md:hidden" @submit.prevent="search">
      <Search :size="18" class="absolute left-7 top-[calc(50%-6px)] -translate-y-1/2 text-stone-400" />
      <input
        v-model="keyword"
        type="search"
        placeholder="Cari produk khas Toba..."
        class="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-4 text-sm focus:border-ulos-500 focus:bg-white focus:outline-none"
      />
    </form>
  </header>

  <!-- Navigasi bawah (khusus ponsel) -->
  <nav
    class="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
  >
    <RouterLink
      v-for="item in mobileItems"
      :key="item.to"
      :to="item.to"
      class="relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-stone-500"
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import {
  ShoppingCart,
  ChevronDown,
  LogOut,
  Package,
  LayoutDashboard,
  Search,
  House,
  Store,
  LogIn,
  ClipboardList,
} from "lucide-vue-next";
import AppLogo from "./AppLogo.vue";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";

const auth = useAuthStore();
const cart = useCartStore();
const router = useRouter();

const open = ref(false);
const menuRef = ref(null);
const keyword = ref("");

const links = computed(() => {
  const base = [
    { to: "/", label: "Beranda" },
    { to: "/produk", label: "Produk" },
  ];
  if (auth.isBuyer) base.push({ to: "/pesanan", label: "Pesanan Saya" });
  if (auth.isSeller) base.push({ to: "/penjual", label: "Dashboard Toko" });
  return base;
});

const mobileItems = computed(() => {
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

function search() {
  const q = keyword.value.trim();
  router.push({ name: "products", query: q ? { search: q } : {} });
}

function onClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) open.value = false;
}

onMounted(() => document.addEventListener("mousedown", onClickOutside));
onBeforeUnmount(() => document.removeEventListener("mousedown", onClickOutside));

function logout() {
  open.value = false;
  auth.logout();
  router.push("/");
}
</script>