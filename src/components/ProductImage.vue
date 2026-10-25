<template>
  <div class="relative overflow-hidden bg-stone-100">
    <img
      v-if="src && !failed"
      :src="src"
      :alt="alt"
      loading="lazy"
      class="absolute inset-0 h-full w-full object-cover"
      @error="failed = true"
    />
    <ProductArt v-else :name="alt" :icon="icon" :category="category" />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import ProductArt from "./ProductArt.vue";
import { imageUrl } from "../helpers/toolsHelper";

const props = defineProps({
  image: { type: String, default: "" },
  icon: { type: String, default: "" },
  alt: { type: String, default: "" },
  category: { type: String, default: "" },
});

const failed = ref(false);
const src = computed(() => imageUrl(props.image));
</script>