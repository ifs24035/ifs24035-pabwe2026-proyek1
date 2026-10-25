<template>
  <section>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm font-semibold text-ulos-600">Dashboard Penjual</p>
        <h1 class="text-2xl font-extrabold">{{ auth.user.seller?.shop_name }}</h1>
      </div>
      <nav class="flex gap-1 rounded-2xl bg-stone-100 p-1">
        <RouterLink
          v-for="t in tabs"
          :key="t.to"
          :to="t.to"
          class="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-stone-600"
          exact-active-class="!bg-white !text-ulos-700 shadow-xs"
        >
          <component :is="t.icon" :size="16" /> {{ t.label }}
        </RouterLink>
      </nav>
    </div>
    <RouterView />
  </section>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
import { LayoutDashboard, Boxes, ClipboardList } from "lucide-vue-next";
import { useAuthStore } from "../stores/authStore";

const auth = useAuthStore();
const tabs = [
  { to: "/penjual", label: "Ringkasan", icon: LayoutDashboard },
  { to: "/penjual/produk", label: "Produk", icon: Boxes },
  { to: "/penjual/pesanan", label: "Pesanan", icon: ClipboardList },
];
</script>