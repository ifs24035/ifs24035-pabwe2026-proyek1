<template>
  <div>
    <h1 class="text-2xl font-extrabold">Pesanan Saya</h1>

    <div v-if="loading" class="py-16 text-center text-stone-500">Memuat pesanan...</div>
    <div v-else-if="!orders.length" class="py-20 text-center">
      <p class="text-6xl">📦</p>
      <p class="mt-3 text-lg font-bold">Belum ada pesanan</p>
      <RouterLink to="/produk" class="text-sm font-semibold text-ulos-600">Mulai belanja →</RouterLink>
    </div>
    <div v-else class="mt-5 space-y-4">
      <article v-for="o in orders" :key="o.id" class="rounded-2xl border border-stone-200 bg-white">
        <header class="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 px-5 py-3">
          <div>
            <p class="font-bold">Pesanan #{{ o.id }} · {{ o.shop_name }}</p>
            <p class="text-xs text-stone-500">{{ formatDate(o.created_at) }}</p>
          </div>
          <StatusBadge :status="o.status" />
        </header>
        <ul class="divide-y divide-stone-100 px-5">
          <li v-for="it in o.items" :key="it.id" class="flex justify-between gap-3 py-2.5 text-sm">
            <span>{{ it.product_name }} <span class="text-stone-500">× {{ it.quantity }}</span></span>
            <span class="font-semibold">{{ formatRupiah(it.price * it.quantity) }}</span>
          </li>
        </ul>
        <footer class="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 px-5 py-3">
          <p class="text-sm text-stone-500">Kirim ke: {{ o.address }}</p>
          <div class="flex items-center gap-3">
            <p class="font-extrabold text-ulos-700">{{ formatRupiah(o.total) }}</p>
            <button
              v-if="o.status === 'pending'"
              type="button"
              class="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
              @click="cancel(o)"
            >
              Batalkan
            </button>
          </div>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import StatusBadge from "../components/StatusBadge.vue";
import { orderApi } from "../api/orderApi";
import {
  formatDate,
  formatRupiah,
  showConfirmDialog,
  showErrorDialog,
} from "../helpers/toolsHelper";

const orders = ref([]);
const loading = ref(true);

async function load() {
  try {
    orders.value = await orderApi.mine();
  } catch (e) {
    showErrorDialog(e.message);
  } finally {
    loading.value = false;
  }
}

async function cancel(order) {
  const result = await showConfirmDialog(`Batalkan pesanan #${order.id}?`);
  if (!result.isConfirmed) return;
  try {
    const updated = await orderApi.cancel(order.id);
    Object.assign(order, updated);
  } catch (e) {
    showErrorDialog(e.message);
  }
}

onMounted(load);
</script>