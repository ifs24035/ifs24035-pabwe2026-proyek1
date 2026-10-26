<template>
  <svg
    viewBox="0 0 200 150"
    preserveAspectRatio="xMidYMid slice"
    class="absolute inset-0 h-full w-full"
    :role="name ? 'img' : 'presentation'"
    :aria-label="name || undefined"
    :aria-hidden="name ? undefined : 'true'"
  >
    <defs>
      <linearGradient :id="`bg-${kind}`" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" :stop-color="theme.bg[0]" />
        <stop offset="1" :stop-color="theme.bg[1]" />
      </linearGradient>
      <pattern id="pt-ulos" width="18" height="18" patternUnits="userSpaceOnUse">
        <path d="M9 2 L16 9 L9 16 L2 9Z" fill="none" stroke="#000" stroke-width="0.8" />
      </pattern>
    </defs>

    <rect width="200" height="150" :fill="`url(#bg-${kind})`" />
    <rect width="200" height="150" fill="url(#pt-ulos)" opacity="0.06" />
    <circle cx="100" cy="76" r="54" fill="#fff" opacity="0.38" />
    <ellipse cx="100" cy="128" rx="46" ry="5" fill="#000" opacity="0.12" />

    <component :is="artComponent" v-bind="artProps" />
  </svg>
</template>

<script setup>
import { computed } from "vue";
import { resolveArtKind, resolveArtTheme } from "../helpers/productArtHelper";
import ArtKopi from "./art/ArtKopi.vue";
import ArtIkan from "./art/ArtIkan.vue";
import ArtUlos from "./art/ArtUlos.vue";
import ArtMadu from "./art/ArtMadu.vue";
import ArtBawang from "./art/ArtBawang.vue";
import ArtJahe from "./art/ArtJahe.vue";
import ArtRempah from "./art/ArtRempah.vue";
import ArtUkiran from "./art/ArtUkiran.vue";
import ArtKeranjang from "./art/ArtKeranjang.vue";

const props = defineProps({
  name: { type: String, default: "" },
  category: { type: String, default: "" },
  icon: { type: String, default: "" },
});

// Jenis ilustrasi -> komponen yang menggambarnya
const ART_COMPONENTS = {
  kopi: ArtKopi,
  ikan: ArtIkan,
  ulos: ArtUlos,
  selendang: ArtUlos,
  madu: ArtMadu,
  bawang: ArtBawang,
  jahe: ArtJahe,
  rempah: ArtRempah,
  ukiran: ArtUkiran,
  keranjang: ArtKeranjang,
};

const kind = computed(() => resolveArtKind(props.name, props.category, props.icon));
const theme = computed(() => resolveArtTheme(kind.value, props.name));
const artComponent = computed(() => ART_COMPONENTS[kind.value]);

// Hanya ilustrasi berwarna dinamis yang menerima props (ulos juga butuh kind untuk kemiringan kain)
const artProps = computed(() => {
  if (kind.value === "ikan") return { theme: theme.value };
  if (kind.value === "ulos" || kind.value === "selendang") return { kind: kind.value, theme: theme.value };
  return {};
});
</script>
