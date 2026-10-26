<template>
  <div ref="menuRef" class="relative">
    <button
      type="button"
      class="flex items-center gap-2 rounded-full border border-stone-200 py-1 pl-1 pr-3 hover:bg-stone-50"
      @click="open = !open"
    >
      <span class="flex h-8 w-8 items-center justify-center rounded-full bg-ulos-600 text-sm font-bold text-white">
        {{ auth.user.name.charAt(0).toUpperCase() }}
      </span>
      <span class="hidden max-w-28 truncate text-sm font-semibold sm:block">
        {{ auth.user.name }}
      </span>
      <ChevronDown :size="16" class="text-stone-600" />
    </button>
    <div v-if="open" class="absolute right-0 mt-2 w-60 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-stone-900/5">
      <div class="px-3 py-2">
        <p class="truncate text-sm font-semibold">{{ auth.user.name }}</p>
        <p class="truncate text-xs text-stone-600">{{ auth.user.email }}</p>
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
</template>

<script setup>
// Menu akun di navbar (hanya dirender saat sudah login); menutup sendiri bila klik di luar
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { ChevronDown, LayoutDashboard, LogOut, Package } from "lucide-vue-next";
import { useAuthStore } from "../stores/authStore";

const auth = useAuthStore();
const router = useRouter();

const open = ref(false);
const menuRef = ref(null);

function onClickOutside(event) {
  if (menuRef.value && !menuRef.value.contains(event.target)) open.value = false;
}

onMounted(() => document.addEventListener("mousedown", onClickOutside));
onBeforeUnmount(() => document.removeEventListener("mousedown", onClickOutside));

function logout() {
  open.value = false;
  auth.logout();
  router.push("/");
}
</script>
