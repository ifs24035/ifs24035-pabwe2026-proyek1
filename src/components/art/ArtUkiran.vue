<template>
  <defs>
    <linearGradient id="g-wood" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#a8703a" />
      <stop offset="1" stop-color="#6f4220" />
    </linearGradient>
  </defs>
  <!-- Ilustrasi ukiran gorga -->
  <g>
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
</template>
