<template>
  <div class="relative overflow-hidden">
    <img
      v-if="!failed"
      :src="src"
      :alt="alt"
      loading="lazy"
      class="absolute inset-0 h-full w-full object-cover"
      @error="failed = true"
    />
    <ProductArt v-else :name="art" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import ProductArt from "./ProductArt.vue";

defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: "" },
  art: { type: String, default: "" }, // nama untuk ilustrasi cadangan bila foto belum ada
});

const failed = ref(false);
</script>