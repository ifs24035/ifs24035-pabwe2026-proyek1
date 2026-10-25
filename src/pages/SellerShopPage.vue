<template>
  <div v-if="loading" class="py-20 text-center text-stone-500">Memuat toko...</div>
  <div v-else-if="!shop" class="py-20 text-center">
    <p class="text-5xl">🏚️</p>
    <p class="mt-2 font-bold">Toko tidak ditemukan</p>
  </div>
  <div v-else>
    <section class="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span class="flex h-20 w-20 items-center justify-center rounded-2xl bg-ulos-50 text-4xl">🏪</span>
        <div>
          <h1 class="text-2xl font-extrabold">{{ shop.shop_name }}</h1>
          <p class="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
            <MapPin :size="14" /> {{ shop.location || "Toba" }}
            <template v-if="shop.phone"> · <Phone :size="14" /> {{ shop.phone }}</template>
          </p>
          <p class="mt-2 max-w-2xl text-stone-700">{{ shop.description }}</p>
        </div>
      </div>
    </section>

    <h2 class="mb-4 mt-8 text-xl font-extrabold">Produk dari toko ini ({{ shop.products.length }})</h2>
    <p v-if="!shop.products.length" class="text-stone-500">Belum ada produk.</p>
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <ProductCard v-for="p in shop.products" :key="p.id" :product="p" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { MapPin, Phone } from "lucide-vue-next";
import ProductCard from "../components/ProductCard.vue";
import { catalogApi } from "../api/catalogApi";

const route = useRoute();
const shop = ref(null);
const loading = ref(true);

async function load() {
  loading.value = true;
  try {
    shop.value = await catalogApi.seller(route.params.id);
  } catch {
    shop.value = null;
  } finally {
    loading.value = false;
  }
}

watch(() => route.params.id, load);
onMounted(load);
</script>