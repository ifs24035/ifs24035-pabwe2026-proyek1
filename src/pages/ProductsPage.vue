<template>
  <div>
    <div class="flex flex-col gap-1">
      <h1 class="section-title">Semua Produk</h1>
      <p class="text-sm text-stone-500">Temukan hasil bumi dan produk UMKM khas Toba.</p>
    </div>

    <!-- Pencarian & urutan -->
    <div class="mt-5 flex flex-col gap-3 sm:flex-row">
      <div class="relative flex-1">
        <Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          v-model="search"
          type="search"
          placeholder="Cari produk atau toko..."
          class="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-3 text-sm focus:border-ulos-600 focus:outline-none focus:ring-4 focus:ring-ulos-600/10"
        />
      </div>
      <select
        v-model="sort"
        class="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm focus:border-ulos-600 focus:outline-none sm:w-52"
      >
        <option value="newest">Urutkan: Terbaru</option>
        <option value="price_asc">Harga termurah</option>
        <option value="price_desc">Harga termahal</option>
        <option value="name">Nama A-Z</option>
      </select>
    </div>

    <!-- Kategori -->
    <div class="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
      <button
        type="button"
        class="shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition"
        :class="!category ? 'border-ulos-600 bg-ulos-600 text-white' : 'border-stone-200 bg-white text-stone-600 hover:border-ulos-500'"
        @click="category = ''"
      >
        Semua
      </button>
      <button
        v-for="c in catalog.categories"
        :key="c.id"
        type="button"
        class="shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition"
        :class="category === c.slug ? 'border-ulos-600 bg-ulos-600 text-white' : 'border-stone-200 bg-white text-stone-600 hover:border-ulos-500'"
        @click="category = c.slug"
      >
        {{ c.icon }} {{ c.name }}
      </button>
    </div>

    <div v-if="loading" class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="n in 8" :key="n" class="skeleton h-72" />
    </div>

    <div v-else-if="!items.length" class="py-16 text-center">
      <p class="text-5xl">🔍</p>
      <p class="mt-2 text-lg font-bold">Produk tidak ditemukan</p>
      <p class="text-sm text-stone-500">Coba kata kunci atau kategori yang lain.</p>
      <button type="button" class="btn-outline mt-4" @click="resetFilters">Reset pencarian</button>
    </div>

    <template v-else>
      <p class="mt-4 text-sm text-stone-500">
        Menampilkan <b class="text-stone-800">{{ pagination.total }}</b> produk
      </p>
      <div class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="p in items" :key="p.id" :product="p" />
      </div>

      <div v-if="pagination.total_pages > 1" class="mt-8 flex items-center justify-center gap-3">
        <button type="button" :disabled="page <= 1" class="btn-outline" @click="page--">← Sebelumnya</button>
        <span class="text-sm text-stone-600">Halaman {{ page }} / {{ pagination.total_pages }}</span>
        <button type="button" :disabled="page >= pagination.total_pages" class="btn-outline" @click="page++">
          Berikutnya →
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Search } from "lucide-vue-next";
import ProductCard from "../components/ProductCard.vue";
import { useCatalogStore } from "../stores/catalogStore";
import { catalogApi } from "../api/catalogApi";
import { showErrorDialog } from "../helpers/toolsHelper";

const route = useRoute();
const router = useRouter();
const catalog = useCatalogStore();

const search = ref(String(route.query.search || ""));
const category = ref(String(route.query.category || ""));
const sort = ref(String(route.query.sort || "newest"));
const page = ref(Number(route.query.page) || 1);

const items = ref([]);
const pagination = ref({ total: 0, total_pages: 1 });
const loading = ref(true);

async function load() {
  loading.value = true;
  try {
    const data = await catalogApi.products({
      search: search.value || undefined,
      category: category.value || undefined,
      sort: sort.value,
      page: page.value,
      limit: 12,
    });
    items.value = data.items;
    pagination.value = data.pagination;
  } catch (e) {
    showErrorDialog(e.message);
  } finally {
    loading.value = false;
  }
}

function syncQuery() {
  const query = {};
  if (search.value) query.search = search.value;
  if (category.value) query.category = category.value;
  if (sort.value !== "newest") query.sort = sort.value;
  if (page.value > 1) query.page = page.value;
  router.replace({ query });
}

function resetFilters() {
  search.value = "";
  category.value = "";
  sort.value = "newest";
}

let timer;
watch(search, () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    page.value = 1;
    syncQuery();
    load();
  }, 350);
});
watch([category, sort], () => {
  page.value = 1;
  syncQuery();
  load();
});
watch(page, () => {
  syncQuery();
  load();
});

// Navigasi dari beranda/navbar saat halaman ini sudah terbuka
watch(
  () => route.query,
  (q) => {
    const s = String(q.search || "");
    const c = String(q.category || "");
    if (s !== search.value) search.value = s;
    if (c !== category.value) category.value = c;
  }
);

onMounted(() => {
  catalog.loadCategories().catch(() => {});
  load();
});
onBeforeUnmount(() => clearTimeout(timer));
</script>