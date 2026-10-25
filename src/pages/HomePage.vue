<template>
  <div class="space-y-14">
    <!-- Hero -->
    <section
      class="bg-ulos-pattern relative overflow-hidden rounded-3xl bg-linear-to-br from-ulos-900 via-ulos-700 to-ulos-600 px-6 py-10 text-white sm:px-12 sm:py-14"
    >
      <div class="grid items-center gap-8 lg:grid-cols-2">
        <div class="animate-fade-up">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <Sprout :size="14" /> Horas! Dari Tanah Batak untuk kita semua
          </span>
          <h1 class="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Warung digital khas Toba, <span class="text-gold-300">milik kita bersama.</span>
          </h1>
          <p class="mt-4 max-w-lg text-base text-white/85 sm:text-lg">
            Belanja kopi, ikan danau, ulos, dan hasil bumi langsung dari petani dan UMKM Tanah Batak.
          </p>

          <form class="mt-6 flex max-w-lg gap-2" @submit.prevent="search">
            <div class="relative flex-1">
              <Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600" />
              <input
                v-model="keyword"
                type="search"
                placeholder="Cari kopi, ulos, ikan mas..."
                class="w-full rounded-xl border-0 bg-white py-3 pl-10 pr-3 text-sm font-medium text-stone-900 shadow-lg placeholder:text-stone-600 focus:outline-none focus:ring-4 focus:ring-gold-300/50"
              />
            </div>
            <button type="submit" class="rounded-xl bg-gold-400 px-5 py-3 text-sm font-bold text-stone-900 shadow-lg hover:bg-gold-300">
              Cari
            </button>
          </form>

          <div class="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span class="text-white/70">Populer:</span>
            <RouterLink
              v-for="q in popular"
              :key="q"
              :to="{ name: 'products', query: { search: q } }"
              class="rounded-full bg-white/15 px-3 py-1 font-medium hover:bg-white/25"
            >
              {{ q }}
            </RouterLink>
          </div>
        </div>

        <!-- Kolase ilustrasi -->
        <div class="relative mx-auto hidden h-96 w-full max-w-md lg:block">
          <div class="absolute left-0 top-2 w-52 -rotate-6 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/80">
            <PhotoWithFallback src="/hero/kopi.jpg" alt="Kopi Arabika" art="Kopi" class="aspect-[4/3]" />
            <p class="bg-white px-3 py-1.5 text-xs font-bold text-stone-800">Kopi Arabika</p>
          </div>
          <div class="absolute right-0 top-14 w-52 rotate-4 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/80">
            <PhotoWithFallback src="/hero/ulos.jpg" alt="Ulos Tenun Tangan" art="Ulos" class="aspect-[4/3]" />
            <p class="bg-white px-3 py-1.5 text-xs font-bold text-stone-800">Ulos Tenun Tangan</p>
          </div>
          <div class="absolute bottom-0 left-8 w-52 -rotate-2 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/80">
            <PhotoWithFallback src="/hero/madu.jpg" alt="Madu Hutan" art="Madu" class="aspect-[4/3]" />
            <p class="bg-white px-3 py-1.5 text-xs font-bold text-stone-800">Madu Hutan</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Keunggulan -->
    <section class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div
        v-for="b in benefits"
        :key="b.title"
        class="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5"
      >
        <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-gold-500">
          <component :is="b.icon" :size="22" />
        </span>
        <p class="mt-3 font-bold">{{ b.title }}</p>
        <p class="mt-1 text-sm leading-relaxed text-stone-600">{{ b.text }}</p>
      </div>
    </section>

    <!-- Kategori -->
    <section>
      <div class="mb-5">
        <h2 class="section-title">Jelajahi Kategori</h2>
        <p class="text-sm text-stone-600">Pilih sesuai yang kamu cari.</p>
      </div>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <RouterLink
          v-for="c in catalog.categories"
          :key="c.id"
          :to="{ name: 'products', query: { category: c.slug } }"
          class="group relative block overflow-hidden rounded-2xl shadow-xs ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="relative aspect-[4/3] transition duration-500 group-hover:scale-105">
          <CategoryImage :slug="c.slug" :name="c.name" :icon="c.icon" class="aspect-[4/3] transition duration-500 group-hover:scale-105"/>
          </div>
          <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-stone-900/85 via-stone-900/40 to-transparent p-3 pt-10 text-white">
            <p class="text-sm font-bold leading-tight">{{ c.name }}</p>
            <p class="text-xs text-white/75">{{ c.product_count }} produk</p>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- Produk terbaru -->
    <section>
      <div class="mb-5 flex items-end justify-between">
        <div>
          <h2 class="section-title">Produk Terbaru</h2>
          <p class="text-sm text-stone-600">Baru ditambahkan oleh para penjual.</p>
        </div>
        <RouterLink to="/produk" class="text-sm font-semibold text-ulos-600 hover:underline">
          Lihat semua →
        </RouterLink>
      </div>
      <div v-if="loading" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="n in 4" :key="n" class="skeleton h-72" />
      </div>
      <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="p in latest" :key="p.id" :product="p" />
      </div>
    </section>

    <!-- Cara belanja -->
    <section class="rounded-3xl bg-gold-100/60 px-6 py-10 sm:px-10">
      <h2 class="section-title text-center">Belanja di LapoTa Itu Mudah</h2>
      <div class="mt-8 grid gap-6 md:grid-cols-3">
        <div v-for="(s, i) in steps" :key="s.title" class="text-center">
          <span
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ulos-600 font-display text-xl font-bold text-white shadow-lg shadow-ulos-600/30"
          >
            {{ i + 1 }}
          </span>
          <p class="mt-3 font-bold">{{ s.title }}</p>
          <p class="mx-auto mt-1 max-w-xs text-sm text-stone-600">{{ s.text }}</p>
        </div>
      </div>
    </section>

    <!-- Penjual -->
    <section v-if="sellers.length">
      <div class="mb-5">
        <h2 class="section-title">Toko &amp; Mitra UMKM</h2>
        <p class="text-sm text-stone-600">Kenali pelaku usaha di balik produk-produk ini.</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="s in sellers"
          :key="s.id"
          :to="`/toko/${s.id}`"
          class="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ulos-50 text-2xl">🏪</span>
          <div class="min-w-0">
            <p class="truncate font-bold">{{ s.shop_name }}</p>
            <p class="flex items-center gap-1 text-xs text-stone-600">
              <MapPin :size="12" /> {{ s.location || "Toba" }} · {{ s.product_count }} produk
            </p>
            <p class="mt-1 line-clamp-2 text-sm text-stone-600">{{ s.description }}</p>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- Ajakan jadi penjual -->
    <section
      v-if="!auth.isSeller"
      class="bg-ulos-pattern flex flex-col items-start justify-between gap-5 rounded-3xl bg-stone-900 px-6 py-8 text-white sm:flex-row sm:items-center sm:px-10"
    >
      <div>
        <h2 class="font-display text-2xl font-bold sm:text-3xl">Punya usaha atau hasil bumi?</h2>
        <p class="mt-1 text-stone-300">Buka toko di LapoTa secara gratis dan jangkau lebih banyak pembeli.</p>
      </div>
      <RouterLink
        to="/auth/register"
        class="shrink-0 rounded-xl bg-gold-400 px-6 py-3 text-sm font-bold text-stone-900 hover:bg-gold-300"
      >
        Buka toko sekarang
      </RouterLink>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { MapPin, Search, Sprout, BadgeCheck, HandCoins, HeartHandshake } from "lucide-vue-next";
import ProductCard from "../components/ProductCard.vue";
import PhotoWithFallback from "../components/PhotoWithFallback.vue";
import CategoryImage from "../components/CategoryImage.vue";
import { useCatalogStore } from "../stores/catalogStore";
import { useAuthStore } from "../stores/authStore";
import { catalogApi } from "../api/catalogApi";
import { showErrorDialog } from "../helpers/toolsHelper";

const router = useRouter();
const catalog = useCatalogStore();
const auth = useAuthStore();

const keyword = ref("");
const latest = ref([]);
const sellers = ref([]);
const loading = ref(true);

const popular = ["Kopi", "Ulos", "Ikan Mas", "Madu"];
const benefits = [
  { icon: Sprout, title: "Langsung dari sumbernya", text: "Dibeli dari petani dan UMKM Toba, bukan perantara." },
  { icon: BadgeCheck, title: "Khas & asli Toba", text: "Kopi, ulos, ikan danau, dan hasil bumi pilihan." },
  { icon: HandCoins, title: "Bayar ke penjual", text: "Tanpa pembayaran online, atur langsung dengan penjual." },
  { icon: HeartHandshake, title: "Dukung ekonomi lokal", text: "Setiap pembelian membantu pelaku usaha daerah." },
];
const steps = [
  { title: "Pilih produk", text: "Cari dan tambahkan produk favoritmu ke keranjang." },
  { title: "Buat pesanan", text: "Isi alamat pengiriman, lalu konfirmasi pesananmu." },
  { title: "Pantau statusnya", text: "Penjual memproses pesanan, kamu bisa melihat statusnya." },
];

function search() {
  const q = keyword.value.trim();
  router.push({ name: "products", query: q ? { search: q } : {} });
}

onMounted(async () => {
  try {
    const [products, sellerList] = await Promise.all([
      catalogApi.products({ limit: 8, sort: "newest" }),
      catalogApi.sellers(),
      catalog.loadCategories(),
    ]);
    latest.value = products.items;
    sellers.value = sellerList;
  } catch (e) {
    showErrorDialog(e.message);
  } finally {
    loading.value = false;
  }
});
</script>