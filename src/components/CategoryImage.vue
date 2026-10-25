<template>
  <div class="relative overflow-hidden">
    <img
      v-if="!failed"
      :src="`/categories/${slug}.jpg`"
      :alt="name"
      loading="lazy"
      class="absolute inset-0 h-full w-full object-cover"
      @error="failed = true"
    />
    <ProductArt v-else :category="slug" :icon="icon" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import ProductArt from "./ProductArt.vue";

defineProps({
  slug: { type: String, required: true },
  name: { type: String, default: "" },
  icon: { type: String, default: "" },
});

// Jika foto belum ada di public/categories, tampilkan ilustrasi sebagai cadangan
const failed = ref(false);
</script>