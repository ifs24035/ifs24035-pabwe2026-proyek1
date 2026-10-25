<template>
  <span class="inline-flex items-center gap-2.5">
    <img
      :src="src"
      :alt="LOGO_HAS_TEXT ? 'LapoTa' : ''"
      :width="sizes[size].px"
      :height="sizes[size].px"
      fetchpriority="high"
      decoding="async"
      class="w-auto object-contain"
      :class="sizes[size].img"
    />
    <span
      v-if="!LOGO_HAS_TEXT"
      class="font-display font-bold tracking-tight"
      :class="[sizes[size].text, tone === 'light' ? 'text-white' : 'text-ulos-700']"
    >
      LapoTa
    </span>
  </span>
</template>

<script setup>
import { computed } from "vue";

// ====== UBAH BAGIAN INI SAJA UNTUK MEMASANG LOGO BARU ======
const LOGO_SRC = "/logo.webp"; // logo untuk latar terang (navbar)
const LOGO_SRC_LIGHT = "/logo.webp"; // logo untuk latar gelap (footer & panel merah); boleh sama
const LOGO_HAS_TEXT = false; // true jika gambar logo sudah memuat tulisan "LapoTa"
// ============================================================

const props = defineProps({
  size: { type: String, default: "md" }, // sm | md | lg | xl
  tone: { type: String, default: "dark" }, // dark = latar terang, light = latar gelap
});

const sizes = {
  sm: { img: "h-7", px: 28, text: "text-xl" },
  md: { img: "h-9", px: 36, text: "text-2xl" },
  lg: { img: "h-11", px: 44, text: "text-3xl" },
  xl: { img: "h-16", px: 64, text: "text-3xl" },
};

const src = computed(() => (props.tone === "light" ? LOGO_SRC_LIGHT : LOGO_SRC));
</script>