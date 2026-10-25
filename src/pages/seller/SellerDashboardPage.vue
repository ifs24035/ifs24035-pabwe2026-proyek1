<template>
  <div v-if="loading" class="py-16 text-center text-stone-600">Memuat ringkasan...</div>
  <div v-else class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="c in cards" :key="c.label" class="rounded-2xl border border-stone-200 bg-white p-5">
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-stone-600">{{ c.label }}</p>
          <component :is="c.icon" :size="20" class="text-ulos-600" />
        </div>
        <p class="mt-2 text-2xl font-extrabold">{{ c.value }}</p>
        <p v-if="c.hint" class="text-xs" :class="c.alert ? 'text-red-600' : 'text-stone-600'">{{ c.hint }}</p>
      </div>
    </div>

    <section class="rounded-2xl border border-stone-200 bg-white">
      <header class="flex items-center justify-between border-b border-stone-100 px-5 py-3">
        <h2 class="font-extrabold">Pesanan Terbaru</h2>
        <RouterLink to="/penjual/pesanan" class="text-sm font-semibold text-ulos-600">Kelola →</RouterLink>
      </header>
      <p v-if="!recent.length" class="p-6 text-center text-sm text-stone-600">Belum ada pesanan masuk.</p>
      <ul v-else class="divide-y divide-stone-100">
        <li v-for="o in recent" :key="o.id" class="flex items-center justify-between gap-3 px-5 py-3 text-sm">
          <div>
            <p class="font-bold">#{{ o.id }} · {{ o.buyer_name }}</p>
            <p class="text-xs text-stone-600">{{ formatDate(o.created_at) }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-semibold">{{ formatRupiah(o.total) }}</span>
            <StatusBadge :status="o.status" />
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { Boxes, ClipboardList, Hourglass, Wallet } from "lucide-vue-next";
import StatusBadge from "../../components/StatusBadge.vue";
import { orderApi } from "../../api/orderApi";
import { formatDate, formatRupiah, showErrorDialog } from "../../helpers/toolsHelper";

const stats = ref(null);
const recent = ref([]);
const loading = ref(true);

const cards = computed(() => {
  const s = stats.value;
  if (!s) return [];
  return [
    { label: "Total Produk", value: s.products.total, icon: Boxes, hint: `${s.products.low_stock} produk stok menipis`, alert: s.products.low_stock > 0 },
    { label: "Total Pesanan", value: s.orders.total, icon: ClipboardList },
    { label: "Menunggu Diproses", value: s.orders.pending, icon: Hourglass, hint: s.orders.pending ? "Segera proses pesanan" : "", alert: s.orders.pending > 0 },
    { label: "Pendapatan (Selesai)", value: formatRupiah(s.orders.revenue), icon: Wallet },
  ];
});

onMounted(async () => {
  try {
    const [st, orders] = await Promise.all([orderApi.sellerStats(), orderApi.sellerOrders()]);
    stats.value = st;
    recent.value = orders.slice(0, 5);
  } catch (e) {
    showErrorDialog(e.message);
  } finally {
    loading.value = false;
  }
});
</script>