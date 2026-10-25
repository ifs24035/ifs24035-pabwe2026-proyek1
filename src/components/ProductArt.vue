<template>
  <svg
    viewBox="0 0 200 150"
    preserveAspectRatio="xMidYMid slice"
    class="absolute inset-0 h-full w-full"
    role="img"
    :aria-label="name"
  >
    <defs>
      <linearGradient :id="`bg-${kind}`" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" :stop-color="theme.bg[0]" />
        <stop offset="1" :stop-color="theme.bg[1]" />
      </linearGradient>
      <linearGradient id="g-honey" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fcd34d" />
        <stop offset="1" stop-color="#d97706" />
      </linearGradient>
      <linearGradient id="g-fish" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" :stop-color="theme.fish[0]" />
        <stop offset="1" :stop-color="theme.fish[1]" />
      </linearGradient>
      <linearGradient id="g-onion" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#d9568f" />
        <stop offset="1" stop-color="#8a2457" />
      </linearGradient>
      <linearGradient id="g-wood" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#a8703a" />
        <stop offset="1" stop-color="#6f4220" />
      </linearGradient>
      <clipPath id="clip-cloth"><rect x="45" y="40" width="110" height="74" /></clipPath>
      <pattern id="pt-ulos" width="18" height="18" patternUnits="userSpaceOnUse">
        <path d="M9 2 L16 9 L9 16 L2 9Z" fill="none" stroke="#000" stroke-width="0.8" />
      </pattern>
    </defs>

    <rect width="200" height="150" :fill="`url(#bg-${kind})`" />
    <rect width="200" height="150" fill="url(#pt-ulos)" opacity="0.06" />
    <circle cx="100" cy="76" r="54" fill="#fff" opacity="0.38" />
    <ellipse cx="100" cy="128" rx="46" ry="5" fill="#000" opacity="0.12" />

    <!-- KOPI -->
    <g v-if="kind === 'kopi'">
      <path d="M71 42 L129 42 L135 118 Q135 125 128 125 L72 125 Q65 125 65 118 Z" fill="#6b3f26" />
      <rect x="70" y="32" width="60" height="13" rx="3" fill="#4a2a18" />
      <path d="M70 38 h60" stroke="#8a5a3a" stroke-width="1.5" stroke-dasharray="3 3" />
      <rect x="77" y="60" width="46" height="46" rx="7" fill="#fff3e0" />
      <g transform="rotate(-25 100 80)">
        <ellipse cx="100" cy="80" rx="11" ry="16" fill="#5b3420" />
        <path d="M100 65 Q106 80 100 95" stroke="#fff3e0" stroke-width="2" fill="none" />
      </g>
      <rect x="86" y="98" width="28" height="3" rx="1.5" fill="#c89b6d" />
      <g fill="#5b3420">
        <ellipse cx="48" cy="126" rx="7" ry="4.5" transform="rotate(-20 48 126)" />
        <ellipse cx="154" cy="122" rx="7" ry="4.5" transform="rotate(25 154 122)" />
        <ellipse cx="143" cy="132" rx="7" ry="4.5" transform="rotate(-10 143 132)" />
      </g>
    </g>

    <!-- IKAN -->
    <g v-else-if="kind === 'ikan'">
      <path d="M0 112 Q25 104 50 112 T100 112 T150 112 T200 112 V150 H0Z" fill="#fff" opacity="0.35" />
      <path d="M62 78 L36 54 Q46 78 36 102 Z" :fill="theme.fish[2]" />
      <path d="M84 54 Q106 34 128 56 Z" :fill="theme.fish[2]" />
      <path d="M96 100 Q108 118 122 100 Z" :fill="theme.fish[2]" />
      <ellipse cx="106" cy="78" rx="46" ry="26" fill="url(#g-fish)" />
      <path d="M122 60 Q114 78 122 96" stroke="#000" stroke-opacity="0.18" stroke-width="2.5" fill="none" />
      <g stroke="#fff" stroke-opacity="0.45" stroke-width="1.6" fill="none">
        <path d="M78 72 q5 4 0 8" /><path d="M90 66 q5 4 0 8" /><path d="M90 82 q5 4 0 8" />
        <path d="M102 72 q5 4 0 8" /><path d="M102 88 q4 3 0 6" />
      </g>
      <circle cx="136" cy="72" r="5.5" fill="#fff" />
      <circle cx="137.5" cy="72" r="2.8" fill="#1c1917" />
      <g fill="#fff" opacity="0.7">
        <circle cx="160" cy="58" r="3.5" /><circle cx="168" cy="46" r="2.5" /><circle cx="156" cy="42" r="2" />
      </g>
    </g>

    <!-- ULOS / SELENDANG -->
    <g v-else-if="kind === 'ulos' || kind === 'selendang'" :transform="`rotate(${kind === 'ulos' ? -6 : 7} 100 78)`">
      <rect x="45" y="40" width="110" height="74" rx="3" :fill="theme.cloth[0]" />
      <rect x="45" y="40" width="110" height="9" :fill="theme.cloth[1]" />
      <rect x="45" y="51" width="110" height="2" fill="#fff" />
      <path clip-path="url(#clip-cloth)" d="M45 70 l7 -9 7 9 7 -9 7 9 7 -9 7 9 7 -9 7 9 7 -9 7 9 7 -9 7 9 7 -9 7 9 7 -9 7 9 7 -9 7 9" :stroke="theme.cloth[2]" stroke-width="3" fill="none" />
      <g fill="#fff" opacity="0.85">
        <polygon v-for="i in 7" :key="i" :points="`${55 + (i - 1) * 14},88 ${62 + (i - 1) * 14},81 ${69 + (i - 1) * 14},88 ${62 + (i - 1) * 14},95`" />
      </g>
      <rect x="45" y="99" width="110" height="2" fill="#fff" />
      <rect x="45" y="103" width="110" height="11" :fill="theme.cloth[1]" />
      <path v-for="i in 19" :key="`f${i}`" :d="`M${47 + (i - 1) * 6} 114 v9`" stroke="#e6c99b" stroke-width="2" />
      <path v-for="i in 19" :key="`t${i}`" :d="`M${47 + (i - 1) * 6} 40 v-7`" stroke="#e6c99b" stroke-width="2" />
    </g>

    <!-- MADU -->
    <g v-else-if="kind === 'madu'">
      <rect x="74" y="40" width="52" height="15" rx="4" fill="#7c4a2d" />
      <path d="M72 55 H128 Q131 55 131 60 V110 Q131 124 117 124 H83 Q69 124 69 110 V60 Q69 55 72 55 Z" fill="url(#g-honey)" />
      <path d="M78 62 v46" stroke="#fff" stroke-opacity="0.45" stroke-width="4" stroke-linecap="round" />
      <rect x="79" y="72" width="42" height="32" rx="6" fill="#fffbeb" />
      <g fill="#f59e0b" stroke="#b45309" stroke-width="1">
        <polygon points="92,80 97,77 102,80 102,86 97,89 92,86" />
        <polygon points="102,86 107,83 112,86 112,92 107,95 102,92" />
        <polygon points="92,92 97,89 102,92 102,98 97,101 92,98" />
      </g>
      <path d="M84 55 q0 15 5 15 q5 0 5 -15" fill="#d97706" />
      <g transform="translate(152 46) rotate(-15)">
        <ellipse cx="-4" cy="-8" rx="6" ry="4" fill="#fff" opacity="0.8" />
        <ellipse cx="5" cy="-8" rx="6" ry="4" fill="#fff" opacity="0.8" />
        <ellipse cx="0" cy="0" rx="9" ry="6" fill="#fbbf24" />
        <path d="M-3 -5 v10 M3 -5 v10" stroke="#1c1917" stroke-width="2.2" />
      </g>
    </g>

    <!-- BAWANG -->
    <g v-else-if="kind === 'bawang'">
      <g v-for="b in onions" :key="b.x" :transform="`translate(${b.x} ${b.y}) scale(${b.s})`">
        <path d="M0 -30 Q4 -22 8 -16 Q28 -8 26 12 Q22 30 0 30 Q-22 30 -26 12 Q-28 -8 -8 -16 Q-4 -22 0 -30 Z" fill="url(#g-onion)" />
        <path d="M-8 -12 Q-16 6 -6 24 M8 -12 Q16 6 6 24 M0 -14 Q-2 8 0 26" stroke="#fff" stroke-opacity="0.35" stroke-width="2" fill="none" />
        <path d="M0 -30 Q-3 -38 1 -42" stroke="#8a2457" stroke-width="3" fill="none" stroke-linecap="round" />
        <path d="M-5 30 l-3 6 M0 30 v7 M5 30 l3 6" stroke="#e8c9a0" stroke-width="1.8" stroke-linecap="round" />
      </g>
    </g>

    <!-- JAHE -->
    <g v-else-if="kind === 'jahe'">
      <path d="M52 96 Q46 80 64 76 Q70 58 92 64 Q108 50 128 62 Q152 60 150 80 Q160 94 142 102 Q120 110 100 102 Q80 110 52 96 Z" fill="#c98a4b" />
      <ellipse cx="62" cy="86" rx="14" ry="12" fill="#d59a5c" />
      <ellipse cx="146" cy="86" rx="11" ry="11" fill="#f6d58b" />
      <ellipse cx="146" cy="86" rx="6" ry="6" fill="#efc15f" />
      <g stroke="#a8672d" stroke-width="2" fill="none" stroke-linecap="round">
        <path d="M80 72 q6 8 0 18" /><path d="M100 68 q6 10 0 22" /><path d="M120 70 q6 10 0 20" />
      </g>
      <g fill="#7bb661">
        <path d="M92 62 q-6 -16 6 -24 q8 12 -6 24 Z" /><path d="M126 60 q10 -12 22 -8 q-4 14 -22 8 Z" />
      </g>
    </g>

    <!-- REMPAH / ANDALIMAN -->
    <g v-else-if="kind === 'rempah'">
      <path d="M56 84 Q100 78 144 84 Q142 120 100 122 Q58 120 56 84 Z" fill="#7c4a2d" />
      <ellipse cx="100" cy="84" rx="44" ry="9" fill="#4a2a18" />
      <g v-for="(c, i) in peppers" :key="i">
        <circle :cx="c.x" :cy="c.y" r="4.6" :fill="i % 3 === 0 ? '#4d7a3a' : '#35552a'" />
        <circle :cx="c.x - 1.3" :cy="c.y - 1.4" r="1.2" fill="#fff" opacity="0.4" />
      </g>
      <g fill="#6aa84f">
        <path d="M144 62 q14 -14 26 -6 q-6 14 -26 6 Z" /><path d="M54 66 q-12 -14 -24 -8 q4 14 24 8 Z" />
      </g>
    </g>

    <!-- UKIRAN GORGA -->
    <g v-else-if="kind === 'ukiran'">
      <circle cx="100" cy="36" r="9" fill="none" stroke="#9ca3af" stroke-width="3" />
      <path d="M100 45 v8" stroke="#9ca3af" stroke-width="3" />
      <path d="M68 56 Q100 44 132 56 L136 100 Q100 124 64 100 Z" fill="url(#g-wood)" />
      <path d="M74 62 Q100 52 126 62 L129 98 Q100 117 71 98 Z" fill="none" stroke="#e8c28a" stroke-width="1.6" />
      <g fill="none" stroke="#f0cf9b" stroke-width="2.4" stroke-linecap="round">
        <path d="M100 74 m-14 0 a14 14 0 1 1 14 14 a8 8 0 1 1 -8 -8" />
        <path d="M100 74 m14 0 a14 14 0 1 0 -14 14" opacity="0" />
        <path d="M80 98 q20 10 40 0" />
      </g>
      <circle cx="100" cy="80" r="3" fill="#f0cf9b" />
    </g>

    <!-- KERANJANG (umum) -->
    <g v-else>
      <path d="M62 66 Q100 20 138 66" stroke="#9a6a35" stroke-width="5" fill="none" stroke-linecap="round" />
      <path d="M58 70 H142 L132 118 Q130 124 124 124 H76 Q70 124 68 118 Z" fill="#c58a4a" />
      <g stroke="#9a6a35" stroke-width="2" fill="none">
        <path d="M62 84 H138 M65 98 H135 M68 112 H132" /><path d="M80 70 v54 M100 70 v54 M120 70 v54" />
      </g>
      <circle cx="84" cy="62" r="11" fill="#dc2626" /><circle cx="104" cy="58" r="11" fill="#f59e0b" />
      <circle cx="122" cy="63" r="10" fill="#65a30d" />
    </g>
  </svg>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: { type: String, default: "" },
  category: { type: String, default: "" },
  icon: { type: String, default: "" },
});

// Cadangan: tebak jenis gambar dari ikon kategori (dipakai keranjang & tabel penjual)
const BY_ICON = {
  "☕": "kopi",
  "🐟": "ikan",
  "🧵": "ulos",
  "🍯": "madu",
  "🌽": "bawang",
  "🪵": "ukiran",
};

const BY_CATEGORY = {
  "kopi-rempah": "kopi",
  "ikan-hasil-danau": "ikan",
  "tenun-ulos": "ulos",
  "pangan-olahan": "madu",
  "hasil-bumi": "bawang",
  "kerajinan-tangan": "ukiran",
};

const KEYWORDS = [
  ["jahe", "jahe"],
  ["andaliman", "rempah"],
  ["merica", "rempah"],
  ["lada", "rempah"],
  ["rempah", "rempah"],
  ["kopi", "kopi"],
  ["madu", "madu"],
  ["bawang", "bawang"],
  ["selendang", "selendang"],
  ["ulos", "ulos"],
  ["tenun", "ulos"],
  ["ikan", "ikan"],
  ["gorga", "ukiran"],
  ["ukir", "ukiran"],
];

const kind = computed(() => {
  const n = props.name.toLowerCase();
  const hit = KEYWORDS.find(([k]) => n.includes(k));
  return hit ? hit[1] : BY_CATEGORY[props.category] || BY_ICON[props.icon] || "keranjang";
});

const THEMES = {
  kopi: { bg: ["#fde9cf", "#f3c38a"] },
  ikan: { bg: ["#d4f1fb", "#8fd3ec"], fish: ["#fbbf24", "#ea580c", "#f97316"] },
  ulos: { bg: ["#fff1e0", "#f1d3a4"], cloth: ["#8a1b1e", "#1c1917", "#d99a2b"] },
  selendang: { bg: ["#f6efe3", "#e6d2b0"], cloth: ["#1c1917", "#a82225", "#f2b84b"] },
  madu: { bg: ["#fff5cf", "#fcd979"] },
  bawang: { bg: ["#fbe6ef", "#f1bdd3"] },
  jahe: { bg: ["#ffeedb", "#f7c99a"] },
  rempah: { bg: ["#e9f4de", "#c4e0a8"] },
  ukiran: { bg: ["#f3e6d3", "#d9b98c"] },
  keranjang: { bg: ["#fff6e6", "#f3d9a8"] },
};

const FISH_SILVER = ["#e2e8f0", "#64748b", "#94a3b8"];

const theme = computed(() => {
  const t = THEMES[kind.value] || THEMES.keranjang;
  if (kind.value === "ikan" && !props.name.toLowerCase().includes("mas")) {
    return { ...t, fish: FISH_SILVER };
  }
  return { fish: ["#fbbf24", "#ea580c", "#f97316"], cloth: ["#8a1b1e", "#1c1917", "#d99a2b"], ...t };
});

// Tumpukan butir andaliman berbentuk gundukan
const peppers = [];
for (let r = 0; r < 4; r++) {
  const n = 9 - r * 2;
  for (let k = 0; k < n; k++) {
    peppers.push({ x: 100 + (k - (n - 1) / 2) * 9.2, y: 82 - r * 7.5 });
  }
}

const onions = [
  { x: 101, y: 70, s: 1.0 },
  { x: 72, y: 96, s: 0.95 },
  { x: 130, y: 97, s: 0.9 },
];
</script>