<template>
  <article
    class="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/10"
  >
    <RouterLink :to="`/produk/${product.id}`" class="relative block overflow-hidden">
      <ProductImage
        :image="product.image"
        :icon="product.category_icon"
        :category="product.category_slug"
        :alt="product.name"
        class="aspect-[4/3] transition duration-500 group-hover:scale-105"
      />
      <span
        class="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ulos-700 shadow-xs backdrop-blur"
      >
        {{ product.category_name }}
      </span>
      <span
        v-if="product.stock < 1"
        class="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white"
      >
        Stok habis
      </span>
      <span
        v-else-if="product.stock <= 5"
        class="absolute right-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white"
      >
        Sisa {{ product.stock }}
      </span>
    </RouterLink>

    <div class="flex flex-1 flex-col p-4">
      <RouterLink
        :to="`/produk/${product.id}`"
        class="line-clamp-2 min-h-[2.75rem] font-bold leading-snug text-stone-900 hover:text-ulos-700"
      >
        {{ product.name }}
      </RouterLink>
      <RouterLink
        :to="`/toko/${product.seller_id}`"
        class="mt-1.5 flex items-center gap-1.5 text-xs text-stone-600 hover:text-ulos-700"
      >
        <Store :size="13" />
        <span class="truncate">{{ product.shop_name }}</span>
        <span v-if="product.seller_location" class="shrink-0 text-stone-600">
          · {{ product.seller_location }}
        </span>
      </RouterLink>

      <div class="mt-auto flex items-end justify-between gap-2 pt-4">
        <div>
          <p class="text-lg font-extrabold leading-none text-ulos-700">
            {{ formatRupiah(product.price) }}
          </p>
          <p class="mt-1 text-xs text-stone-600">per {{ product.unit }}</p>
        </div>
        <button
          v-if="!auth.isSeller"
          type="button"
          :disabled="product.stock < 1"
          class="inline-flex items-center gap-1.5 rounded-xl bg-ulos-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-ulos-600/25 transition hover:bg-ulos-700 active:scale-95 disabled:bg-stone-300 disabled:shadow-none"
          @click="addToCart"
        >
          <ShoppingCart :size="16" /> Tambah
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { ShoppingCart, Store } from "lucide-vue-next";
import ProductImage from "./ProductImage.vue";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import { formatRupiah } from "../helpers/toolsHelper";
import Swal from "sweetalert2";

const props = defineProps({ product: { type: Object, required: true } });
const cart = useCartStore();
const auth = useAuthStore();

function addToCart() {
  cart.add(props.product, 1);
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "Masuk keranjang",
    showConfirmButton: false,
    timer: 1400,
  });
}
</script>