<template>
  <footer class="mt-16 bg-stone-900 text-stone-300">
    <div class="ulos-stripe" />
    <div class="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <div class="flex items-center gap-2.5">
          <AppLogo size="md" tone="light" />
        </div>
        <p class="mt-3 max-w-xs text-sm leading-relaxed text-stone-400">
          Warung digital kita bersama. Menghubungkan petani dan UMKM Tanah Toba dengan pembeli yang
          mencintai produk asli daerahnya.
        </p>
      </div>

      <div>
        <p class="text-sm font-bold uppercase tracking-wider text-gold-300">Jelajahi</p>
        <ul class="mt-3 space-y-2 text-sm">
          <li><RouterLink to="/produk" class="hover:text-white">Semua produk</RouterLink></li>
          <li>
            <RouterLink :to="{ name: 'products', query: { category: 'kopi-rempah' } }" class="hover:text-white">
              Kopi &amp; rempah
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'products', query: { category: 'tenun-ulos' } }" class="hover:text-white">
              Tenun &amp; ulos
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'products', query: { category: 'ikan-hasil-danau' } }" class="hover:text-white">
              Ikan &amp; hasil danau
            </RouterLink>
          </li>
        </ul>
      </div>

      <div>
        <p class="text-sm font-bold uppercase tracking-wider text-gold-300">Akun</p>
        <ul class="mt-3 space-y-2 text-sm">
          <li><RouterLink to="/auth/login" class="hover:text-white">Masuk</RouterLink></li>
          <li><RouterLink to="/auth/register" class="hover:text-white">Daftar sebagai pembeli</RouterLink></li>
          <li><RouterLink to="/auth/register" class="hover:text-white">Buka toko di LapoTa</RouterLink></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-white/10">
      <p class="mx-auto max-w-7xl px-4 py-4 text-xs text-stone-400 sm:px-6 lg:px-8">
        © 2026 LapoTa · Proyek PABWE · Institut Teknologi Del · Horas! 🌿
      </p>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from "vue-router";
import AppLogo from "./AppLogo.vue";
</script>