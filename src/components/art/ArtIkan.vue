<template>
  <defs>
    <linearGradient id="g-fish" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" :stop-color="theme.fish[0]" />
      <stop offset="1" :stop-color="theme.fish[1]" />
    </linearGradient>
  </defs>
  <!-- Ilustrasi ikan (warna dari theme.fish) -->
  <g>
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
</template>

<script setup>
defineProps({
  theme: { type: Object, required: true },
});
</script>
