// Logika murni untuk ProductArt: memilih jenis ilustrasi dan warna temanya.

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

// Urutan penting: kata yang lebih spesifik diperiksa lebih dulu
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

const FISH_GOLD = ["#fbbf24", "#ea580c", "#f97316"];
const FISH_SILVER = ["#e2e8f0", "#64748b", "#94a3b8"];
const CLOTH_DEFAULT = ["#8a1b1e", "#1c1917", "#d99a2b"];

/** Tentukan jenis ilustrasi dari nama produk, lalu kategori, lalu ikon. */
export function resolveArtKind(name = "", category = "", icon = "") {
  const n = name.toLowerCase();
  const hit = KEYWORDS.find(([keyword]) => n.includes(keyword));
  return hit ? hit[1] : BY_CATEGORY[category] || BY_ICON[icon] || "keranjang";
}

/** Warna tema untuk satu jenis ilustrasi; ikan selain ikan mas berwarna perak. */
export function resolveArtTheme(kind, name = "") {
  const theme = THEMES[kind] || THEMES.keranjang;
  if (kind === "ikan" && !name.toLowerCase().includes("mas")) {
    return { ...theme, fish: FISH_SILVER };
  }
  return { fish: FISH_GOLD, cloth: CLOTH_DEFAULT, ...theme };
}

// Tumpukan butir andaliman berbentuk gundukan
export const PEPPERS = (() => {
  const result = [];
  for (let row = 0; row < 4; row++) {
    const count = 9 - row * 2;
    for (let k = 0; k < count; k++) {
      result.push({ x: 100 + (k - (count - 1) / 2) * 9.2, y: 82 - row * 7.5 });
    }
  }
  return result;
})();

export const ONIONS = [
  { x: 101, y: 70, s: 1.0 },
  { x: 72, y: 96, s: 0.95 },
  { x: 130, y: 97, s: 0.9 },
];
