<template>
  <div>
    <h1 class="text-2xl font-extrabold">Keranjang Belanja</h1>

    <div v-if="!cart.items.length" class="py-20 text-center">
      <p class="text-6xl">🛒</p>
      <p class="mt-3 text-lg font-bold">Keranjangmu masih kosong</p>
      <RouterLink
        to="/produk"
        class="mt-4 inline-block rounded-xl bg-ulos-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ulos-700"
      >
        Mulai belanja
      </RouterLink>
    </div>

    <div v-else class="mt-5 grid gap-6 lg:grid-cols-3">
      <div class="space-y-5 lg:col-span-2">
        <section
          v-for="group in cart.groups"
          :key="group.seller_id"
          class="rounded-2xl border border-stone-200 bg-white"
        >
          <header class="flex items-center gap-2 border-b border-stone-100 px-4 py-3 font-bold">
            <Store :size="17" class="text-ulos-600" /> {{ group.shop_name }}
          </header>
          <ul class="divide-y divide-stone-100">
            <li v-for="item in group.items" :key="item.product_id" class="flex gap-3 p-4">
              <ProductImage
                :image="item.image"
                :icon="item.category_icon"
                :alt="item.name"
                class="h-20 w-20 shrink-0 rounded-xl"
              />
              <div class="min-w-0 flex-1">
                <RouterLink :to="`/produk/${item.product_id}`" class="line-clamp-2 font-bold hover:text-ulos-700">
                  {{ item.name }}
                </RouterLink>
                <p class="text-sm text-stone-500">{{ formatRupiah(item.price) }} / {{ item.unit }}</p>
                <div class="mt-2 flex items-center justify-between">
                  <div class="flex items-center rounded-lg border border-stone-200">
                    <button
                      type="button"
                      class="px-2.5 py-1.5"
                      :disabled="item.quantity <= 1"
                      @click="cart.setQuantity(item.product_id, item.quantity - 1)"
                    >
                      <Minus :size="14" />
                    </button>
                    <span class="w-8 text-center text-sm font-bold">{{ item.quantity }}</span>
                    <button
                      type="button"
                      class="px-2.5 py-1.5"
                      :disabled="item.quantity >= item.stock"
                      @click="cart.setQuantity(item.product_id, item.quantity + 1)"
                    >
                      <Plus :size="14" />
                    </button>
                  </div>
                  <p class="font-extrabold text-ulos-700">{{ formatRupiah(item.price * item.quantity) }}</p>
                </div>
              </div>
              <button
                type="button"
                class="self-start rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600"
                aria-label="Hapus"
                @click="cart.remove(item.product_id)"
              >
                <Trash2 :size="17" />
              </button>
            </li>
          </ul>
        </section>
      </div>

      <aside class="h-fit rounded-2xl border border-stone-200 bg-white p-5 lg:sticky lg:top-24">
        <h2 class="text-lg font-extrabold">Ringkasan Pesanan</h2>
        <dl class="mt-3 space-y-1 text-sm">
          <div class="flex justify-between">
            <dt class="text-stone-500">Total item</dt>
            <dd class="font-semibold">{{ cart.count }}</dd>
          </div>
          <div class="flex justify-between text-base">
            <dt class="font-bold">Total</dt>
            <dd class="font-extrabold text-ulos-700">{{ formatRupiah(cart.total) }}</dd>
          </div>
        </dl>

        <form class="mt-4 space-y-3" @submit.prevent="checkout">
          <div>
            <label class="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-600">
              Alamat pengiriman
            </label>
            <textarea
              v-model="address"
              rows="3"
              required
              placeholder="Jl. ..., Kota, Kode pos"
              class="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-ulos-600 focus:outline-none focus:ring-2 focus:ring-ulos-600/20"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-600">
              Catatan (opsional)
            </label>
            <input
              v-model="note"
              type="text"
              placeholder="Contoh: kopi digiling halus"
              class="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-ulos-600 focus:outline-none focus:ring-2 focus:ring-ulos-600/20"
            />
          </div>
          <p v-if="cart.groups.length > 1" class="rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
            Pesananmu akan dipecah menjadi {{ cart.groups.length }} pesanan, satu untuk tiap toko.
          </p>
          <p class="text-xs text-stone-500">Pembayaran dilakukan langsung dengan penjual (COD / transfer manual).</p>
          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-xl bg-ulos-600 py-3 text-sm font-semibold text-white shadow-md shadow-ulos-600/25 hover:bg-ulos-700 disabled:opacity-60"
          >
            {{ loading ? "Memproses..." : auth.isLoggedIn ? "Buat Pesanan" : "Masuk untuk Memesan" }}
          </button>
        </form>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { Minus, Plus, Store, Trash2 } from "lucide-vue-next";
import ProductImage from "../components/ProductImage.vue";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import { orderApi } from "../api/orderApi";
import { formatRupiah, showErrorDialog, showSuccessDialog } from "../helpers/toolsHelper";

const router = useRouter();
const cart = useCartStore();
const auth = useAuthStore();

const address = ref("");
const note = ref("");
const loading = ref(false);

async function checkout() {
  if (!auth.isLoggedIn) {
    return router.push({ name: "login", query: { redirect: "/keranjang" } });
  }
  if (auth.isSeller) {
    return showErrorDialog("Akun penjual tidak dapat membuat pesanan. Gunakan akun pembeli.");
  }
  loading.value = true;
  try {
    await orderApi.checkout({
      items: cart.items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
      address: address.value,
      note: note.value,
    });
    cart.clear();
    await showSuccessDialog("Pesanan berhasil dibuat. Pantau statusnya di halaman Pesanan Saya.");
    router.push("/pesanan");
  } catch (e) {
    showErrorDialog(e.message);
  } finally {
    loading.value = false;
  }
}
</script>