<template>
  <span class="inline-flex items-center gap-2.5">
    <img
      :src="LOGO_SRC"
      :srcset="LOGO_SRCSET"
      :sizes="`${sizes[size].px}px`"
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
// ====== UBAH BAGIAN INI SAJA UNTUK MEMASANG LOGO BARU ======
const LOGO_SRC = "/logo-64.webp";
const LOGO_SRCSET = "/logo-64.webp 64w, /logo-128.webp 128w";
const LOGO_HAS_TEXT = false; // true jika gambar logo sudah memuat tulisan "LapoTa"
// ============================================================

defineProps({
  size: { type: String, default: "md" }, // sm | md | lg | xl
  tone: { type: String, default: "dark" }, // dark = latar terang, light = latar gelap
});

const sizes = {
  sm: { img: "h-7", px: 28, text: "text-xl" },
  md: { img: "h-9", px: 36, text: "text-2xl" },
  lg: { img: "h-11", px: 44, text: "text-3xl" },
  xl: { img: "h-16", px: 64, text: "text-3xl" },
};

</script>