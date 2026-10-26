<template>
  <header class="sticky top-0 z-40 bg-white/95 shadow-xs backdrop-blur">
    <div class="ulos-stripe" />
    <div class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex shrink-0 items-center" aria-label="LapoTa - beranda">
        <AppLogo size="md" />
      </RouterLink>

      <NavbarSearch v-model="keyword" variant="desktop" @search="search" />

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

        <NavbarUserMenu v-if="auth.isLoggedIn" />
        <template v-else>
          <RouterLink to="/auth/login" class="rounded-xl px-3.5 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100">
            Masuk
          </RouterLink>
          <RouterLink to="/auth/register" class="btn-primary hidden sm:inline-flex">Daftar</RouterLink>
        </template>
      </div>
    </div>

    <NavbarSearch v-model="keyword" variant="mobile" @search="search" />
  </header>

  <MobileBottomNav />
</template>

<script setup>
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { ShoppingCart } from "lucide-vue-next";
import AppLogo from "./AppLogo.vue";
import MobileBottomNav from "./MobileBottomNav.vue";
import NavbarSearch from "./NavbarSearch.vue";
import NavbarUserMenu from "./NavbarUserMenu.vue";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";

const auth = useAuthStore();
const cart = useCartStore();
const router = useRouter();

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

function search() {
  const q = keyword.value.trim();
  router.push({ name: "products", query: q ? { search: q } : {} });
}
</script>
