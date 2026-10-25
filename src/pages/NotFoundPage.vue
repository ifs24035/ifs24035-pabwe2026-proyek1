<template>
  <div class="flex min-h-screen items-center justify-center bg-stone-50 p-6">
    <div class="max-w-md text-center">
      <p class="text-7xl font-black text-ulos-600">404</p>
      <h1 class="mt-3 text-2xl font-extrabold">Halaman Tidak Ditemukan</h1>
      <p class="mt-2 text-stone-600">Halaman yang kamu cari tidak tersedia atau sudah dipindahkan.</p>
      <div class="mt-6 flex justify-center gap-3">
        <button
          type="button"
          class="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold"
          @click="router.go(-1)"
        >
          Kembali
        </button>
        <RouterLink
          to="/"
          class="rounded-xl bg-ulos-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ulos-700"
        >
          Ke Beranda
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();
</script>