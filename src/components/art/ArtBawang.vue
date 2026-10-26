<template>
  <defs>
    <linearGradient id="g-onion" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#d9568f" />
      <stop offset="1" stop-color="#8a2457" />
    </linearGradient>
  </defs>
  <!-- Ilustrasi bawang batak -->
  <g>
    <g v-for="b in onions" :key="b.x" :transform="`translate(${b.x} ${b.y}) scale(${b.s})`">
      <path d="M0 -30 Q4 -22 8 -16 Q28 -8 26 12 Q22 30 0 30 Q-22 30 -26 12 Q-28 -8 -8 -16 Q-4 -22 0 -30 Z" fill="url(#g-onion)" />
      <path d="M-8 -12 Q-16 6 -6 24 M8 -12 Q16 6 6 24 M0 -14 Q-2 8 0 26" stroke="#fff" stroke-opacity="0.35" stroke-width="2" fill="none" />
      <path d="M0 -30 Q-3 -38 1 -42" stroke="#8a2457" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M-5 30 l-3 6 M0 30 v7 M5 30 l3 6" stroke="#e8c9a0" stroke-width="1.8" stroke-linecap="round" />
    </g>
  </g>
</template>

<script setup>
import { ONIONS as onions } from "../../helpers/productArtHelper";
</script>
