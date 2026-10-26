<template>
  <defs>
    <clipPath id="clip-cloth"><rect x="45" y="40" width="110" height="74" /></clipPath>
  </defs>
  <!-- Ilustrasi ulos & selendang (warna dari theme.cloth) -->
  <g :transform="`rotate(${kind === 'ulos' ? -6 : 7} 100 78)`">
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
</template>

<script setup>
defineProps({
  kind: { type: String, default: "ulos" }, // ulos | selendang (menentukan kemiringan kain)
  theme: { type: Object, required: true },
});
</script>
