<template>
  <div class="grid min-h-screen lg:grid-cols-2">
    <!-- Panel ilustrasi (desktop) -->
    <aside
      class="bg-ulos-pattern relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-ulos-900 via-ulos-700 to-ulos-600 p-12 text-white lg:flex"
    >
      <RouterLink to="/" class="flex items-center" aria-label="LapoTa - beranda">
        <AppLogo size="lg" tone="light" />
      </RouterLink>

      <div>
        <div class="relative mb-10 h-56">
          <div class="absolute left-0 top-4 w-44 -rotate-6 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/80">
            <PhotoWithFallback src="/hero/kopi.jpg" alt="Kopi Arabika" art="Kopi" class="aspect-[4/3]" />
          </div>
          <div class="absolute left-36 top-0 w-48 rotate-3 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/80">
            <PhotoWithFallback src="/hero/ulos.jpg" alt="Ulos Tenun Tangan" art="Ulos" class="aspect-[4/3]" />
          </div>
          <div class="absolute left-12 top-28 w-40 -rotate-2 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/80">
            <PhotoWithFallback src="/hero/madu.jpg" alt="Madu Hutan" art="Madu" class="aspect-[4/3]" />
          </div>
        </div>
        <h2 class="font-display text-4xl font-bold leading-tight">
          Horas! Selamat datang di <span class="text-gold-300">warung kita</span>.
        </h2>
        <p class="mt-3 max-w-md text-white/80">
          Belanja kopi, ulos, ikan danau, dan hasil bumi asli Toba, langsung dari petani dan UMKM.
        </p>
      </div>
      <p class="text-sm text-white/80">Proyek PABWE · Institut Teknologi Del</p>
    </aside>

    <!-- Formulir -->
    <main class="flex flex-col justify-center bg-cream px-4 py-10 sm:px-8">
      <h1 class="sr-only">{{ route.name === 'register' ? 'Daftar akun LapoTa' : 'Masuk ke LapoTa' }}</h1>
      <div class="mx-auto w-full max-w-md">
        <RouterLink to="/" class="mb-6 flex justify-center lg:hidden" aria-label="LapoTa - beranda">
          <AppLogo size="xl" />
        </RouterLink>

        <div class="rounded-3xl border border-stone-100 bg-white p-6 shadow-xl shadow-stone-200/60 sm:p-8">
          <div class="mb-6 flex rounded-2xl bg-stone-100 p-1">
            <RouterLink
              to="/auth/login"
              class="flex-1 rounded-xl py-2 text-center text-sm font-semibold"
              :class="route.name === 'login' ? 'bg-white text-ulos-700 shadow-xs' : 'text-stone-600'"
            >
              Masuk
            </RouterLink>
            <RouterLink
              to="/auth/register"
              class="flex-1 rounded-xl py-2 text-center text-sm font-semibold"
              :class="route.name === 'register' ? 'bg-white text-ulos-700 shadow-xs' : 'text-stone-600'"
            >
              Daftar
            </RouterLink>
          </div>
          <RouterView />
        </div>
        <RouterLink to="/" class="mt-5 block text-center text-sm text-stone-600 hover:text-ulos-700">
          ← Kembali ke beranda
        </RouterLink>
      </div>
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import PhotoWithFallback from "../components/PhotoWithFallback.vue";
import AppLogo from "../components/AppLogo.vue";

const route = useRoute();
</script>