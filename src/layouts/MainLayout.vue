<template>
  <div v-if="!auth.initialized" class="flex min-h-screen items-center justify-center">
    <div class="h-10 w-10 animate-spin rounded-full border-4 border-ulos-600 border-t-transparent" />
  </div>
  <div v-else class="flex min-h-screen flex-col pb-16 md:pb-0">
    <NavbarComponent />
    <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <RouterView />
    </main>
    <FooterComponent />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import NavbarComponent from "../components/NavbarComponent.vue";
import FooterComponent from "../components/FooterComponent.vue";
import { useAuthStore } from "../stores/authStore";

const auth = useAuthStore();
</script>