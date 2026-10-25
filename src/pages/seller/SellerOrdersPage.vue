<template>
  <div>
    <div class="mb-4 flex flex-wrap gap-2">
      <button
        v-for="f in filters"
        :key="f.value"
        type="button"
        class="rounded-full px-4 py-1.5 text-sm font-semibold"
        :class="filter === f.value ? 'bg-ulos-600 text-white' : 'bg-white text-stone-600 border border-stone-200'"
        @click="filter = f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <div v-if="loading" class="py-16 text-center text-stone-500">Memuat pesanan...</div>
    <p v-else-if="!shown.length" class="py-16 text-center text-stone-500">Tidak ada pesanan.</p>
    <div v-else class="space-y-4">
      <article v-for="o in shown" :key="o.id" class="rounded-2xl border border-stone-200 bg-white">
        <header class="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 px-5 py-3">
          <div>
            <p class="font-bold">Pesanan #{{ o.id }} · {{ o.buyer_name }}</p>
            <p class="text-xs text-stone-500">{{ formatDate(o.created_at) }}</p>
          </div>
          <StatusBadge :status="o.status" />
        </header>
        <ul class="divide-y divide-stone-100 px-5">
          <li v-for="it in o.items" :key="it.id" class="flex justify-between py-2.5 text-sm">
            <span>{{ it.product_name }} <span class="text-stone-500">× {{ it.quantity }}</span></span>
            <span class="font-semibold">{{ formatRupiah(it.price * it.quantity) }}</span>
          </li>
        </ul>
        <footer class="space-y-3 border-t border-stone-100 px-5 py-3">
          <p class="text-sm text-stone-600">
            <b>Alamat:</b> {{ o.address }}<span v-if="o.note"> · <b>Catatan:</b> {{ o.note }}</span>
          </p>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="font-extrabold text-ulos-700">{{ formatRupiah(o.total) }}</p>
            <div class="flex gap-2">
              <button
                v-for="next in NEXT[o.status] || []"
                :key="next"
                type="button"
                class="rounded-lg px-3 py-1.5 text-xs font-semibold"
                :class="next === 'dibatalkan' ? 'border border-red-200 text-red-600 hover:bg-red-50' : 'bg-ulos-600 text-white hover:bg-ulos-700'"
                @click="changeStatus(o, next)"
              >
                {{ LABEL[next] }}
              </button>
            </div>
          </div>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import StatusBadge from "../../components/StatusBadge.vue";
import { orderApi } from "../../api/orderApi";
import {
  formatDate,
  formatRupiah,
  showConfirmDialog,
  showErrorDialog,
} from "../../helpers/toolsHelper";

const NEXT = {
  pending: ["diproses", "dibatalkan"],
  diproses: ["dikirim", "dibatalkan"],
  dikirim: ["selesai"],
};
const LABEL = {
  diproses: "Proses pesanan",
  dikirim: "Tandai dikirim",
  selesai: "Tandai selesai",
  dibatalkan: "Batalkan",
};
const filters = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "diproses", label: "Diproses" },
  { value: "dikirim", label: "Dikirim" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

const orders = ref([]);
const loading = ref(true);
const filter = ref("all");

const shown = computed(() =>
  filter.value === "all" ? orders.value : orders.value.filter((o) => o.status === filter.value)
);

async function load() {
  try {
    orders.value = await orderApi.sellerOrders();
  } catch (e) {
    showErrorDialog(e.message);
  } finally {
    loading.value = false;
  }
}

async function changeStatus(order, status) {
  if (status === "dibatalkan") {
    const r = await showConfirmDialog(`Batalkan pesanan #${order.id}? Stok akan dikembalikan.`);
    if (!r.isConfirmed) return;
  }
  try {
    const updated = await orderApi.updateStatus(order.id, status);
    Object.assign(order, updated);
  } catch (e) {
    showErrorDialog(e.message);
  }
}

onMounted(load);
</script>