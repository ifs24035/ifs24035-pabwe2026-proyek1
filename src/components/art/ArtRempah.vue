<template>
  <!-- Ilustrasi andaliman / rempah -->
  <g>
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
</template>

<script setup>
import { PEPPERS as peppers } from "../../helpers/productArtHelper";
</script>
