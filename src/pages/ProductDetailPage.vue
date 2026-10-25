<template>
  <div v-if="loading" class="grid gap-8 md:grid-cols-2">
    <div class="skeleton aspect-square" />
    <div class="space-y-4">
      <div class="skeleton h-6 w-1/3" /><div class="skeleton h-10 w-3/4" /><div class="skeleton h-24" />
    </div>
  </div>
  <div v-else-if="!product" class="py-20 text-center">
    <p class="text-5xl">😕</p>
    <p class="mt-2 text-lg font-bold">Produk tidak ditemukan</p>
    <RouterLink to="/produk" class="text-sm font-semibold text-ulos-600">← Kembali ke produk</RouterLink>
  </div>
  <div v-else>
    <!-- Remah roti -->
    <nav class="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-stone-600">
      <RouterLink to="/" class="hover:text-ulos-700">Beranda</RouterLink> <ChevronRight :size="14" />
      <RouterLink to="/produk" class="hover:text-ulos-700">Produk</RouterLink> <ChevronRight :size="14" />
      <RouterLink :to="{ name: 'products', query: { category: product.category_slug } }" class="hover:text-ulos-700">
        {{ product.category_name }}
      </RouterLink>
    </nav>

    <div class="grid gap-8 md:grid-cols-2">
      <ProductImage
        :image="product.image"
        :icon="product.category_icon"
        :category="product.category_slug"
        :alt="product.name"
        class="aspect-square rounded-3xl shadow-lg ring-1 ring-stone-200"
      />

      <div>
        <span class="rounded-full bg-ulos-50 px-3 py-1 text-xs font-bold text-ulos-700">
          {{ product.category_icon }} {{ product.category_name }}
        </span>
        <h1 class="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{{ product.name }}</h1>

        <RouterLink
          :to="`/toko/${product.seller_id}`"
          class="mt-4 flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 transition hover:border-ulos-500"
        >
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-ulos-50 text-xl">🏪</span>
          <div class="min-w-0">
            <p class="truncate text-sm font-bold">{{ product.shop_name }}</p>
            <p class="flex items-center gap-1 text-xs text-stone-600">
              <MapPin :size="12" /> {{ product.seller_location || "Toba" }}
            </p>
          </div>
          <ChevronRight :size="18" class="ml-auto text-stone-600" />
        </RouterLink>

        <div class="mt-5 rounded-2xl bg-gold-100/60 p-4">
          <p class="text-3xl font-extrabold text-ulos-700">{{ formatRupiah(product.price) }}</p>
          <p class="text-sm text-stone-600">per {{ product.unit }}</p>
        </div>

        <p
          class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold"
          :class="product.stock > 0 ? 'text-emerald-600' : 'text-red-600'"
        >
          <span class="h-2 w-2 rounded-full" :class="product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'" />
          {{ product.stock > 0 ? `Stok tersedia: ${product.stock} ${product.unit}` : "Stok habis" }}
        </p>

        <div v-if="!auth.isSeller" class="mt-5 flex flex-wrap items-center gap-3">
          <div class="flex items-center rounded-xl border border-stone-300 bg-white">
            <button type="button" class="px-3.5 py-3 disabled:opacity-40" :disabled="quantity <= 1" @click="quantity--">
              <Minus :size="16" />
            </button>
            <span class="w-10 text-center font-bold">{{ quantity }}</span>
            <button
              type="button"
              class="px-3.5 py-3 disabled:opacity-40"
              :disabled="quantity >= product.stock"
              @click="quantity++"
            >
              <Plus :size="16" />
            </button>
          </div>
          <button type="button" :disabled="product.stock < 1" class="btn-primary flex-1 !py-3 sm:flex-none sm:px-8" @click="addToCart">
            <ShoppingCart :size="18" /> Tambah ke Keranjang
          </button>
        </div>
        <p v-else class="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          Anda masuk sebagai penjual. Gunakan akun pembeli untuk berbelanja.
        </p>

        <ul class="mt-6 grid gap-2 text-sm text-stone-600">
          <li class="flex items-center gap-2"><ShieldCheck :size="16" class="text-emerald-600" /> Langsung dari penjual lokal Toba</li>
          <li class="flex items-center gap-2"><Truck :size="16" class="text-emerald-600" /> Pengiriman diatur oleh penjual</li>
          <li class="flex items-center gap-2"><HandCoins :size="16" class="text-emerald-600" /> Pembayaran langsung ke penjual</li>
        </ul>
      </div>
    </div>

    <section class="mt-10 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <h2 class="text-lg font-extrabold">Deskripsi Produk</h2>
      <p class="mt-2 whitespace-pre-line leading-relaxed text-stone-700">
        {{ product.description || "Belum ada deskripsi produk." }}
      </p>
    </section>

    <section v-if="related.length" class="mt-12">
      <h2 class="section-title mb-5">Produk Lain dari {{ product.shop_name }}</h2>
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="p in related" :key="p.id" :product="p" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { ChevronRight, HandCoins, MapPin, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from "lucide-vue-next";
import ProductImage from "../components/ProductImage.vue";
import ProductCard from "../components/ProductCard.vue";
import { catalogApi } from "../api/catalogApi";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import { formatRupiah } from "../helpers/toolsHelper";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();
const cart = useCartStore();
const auth = useAuthStore();

const product = ref(null);
const related = ref([]);
const loading = ref(true);
const quantity = ref(1);

async function load() {
  loading.value = true;
  quantity.value = 1;
  related.value = [];
  try {
    product.value = await catalogApi.product(route.params.id);
    catalogApi
      .products({ seller: product.value.seller_id, limit: 5 })
      .then((d) => (related.value = d.items.filter((p) => p.id !== product.value.id).slice(0, 4)))
      .catch(() => {});
  } catch {
    product.value = null;
  } finally {
    loading.value = false;
  }
}

function addToCart() {
  cart.add(product.value, quantity.value);
  Swal.fire({
    icon: "success",
    title: "Masuk keranjang",
    text: `${product.value.name} ditambahkan ke keranjang.`,
    showCancelButton: true,
    confirmButtonText: "Lihat keranjang",
    cancelButtonText: "Lanjut belanja",
    confirmButtonColor: "#a82225",
  }).then((r) => {
    if (r.isConfirmed) router.push("/keranjang");
  });
}

watch(() => route.params.id, load);
onMounted(load);
</script>