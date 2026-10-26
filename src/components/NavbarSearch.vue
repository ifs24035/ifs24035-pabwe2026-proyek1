<template>
  <form :class="styles.form" @submit.prevent="emit('search')">
    <Search :size="18" :class="styles.icon" />
    <input
      v-model="keyword"
      type="search"
      aria-label="Cari produk"
      :placeholder="styles.placeholder"
      :class="styles.input"
    />
  </form>
</template>

<script setup>
import { computed } from "vue";
import { Search } from "lucide-vue-next";

const props = defineProps({
  variant: { type: String, default: "desktop" }, // desktop | mobile
});
const emit = defineEmits(["search"]);
const keyword = defineModel({ type: String, default: "" });

const VARIANTS = {
  desktop: {
    form: "relative mx-auto hidden max-w-xl flex-1 md:block",
    icon: "absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600",
    input:
      "w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-4 text-sm transition focus:border-ulos-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-ulos-600/10",
    placeholder: "Cari kopi, ulos, ikan mas, madu...",
  },
  // Pencarian untuk layar kecil
  mobile: {
    form: "relative px-4 pb-3 md:hidden",
    icon: "absolute left-7 top-[calc(50%-6px)] -translate-y-1/2 text-stone-600",
    input:
      "w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-4 text-sm focus:border-ulos-500 focus:bg-white focus:outline-none",
    placeholder: "Cari produk khas Toba...",
  },
};

const styles = computed(() => VARIANTS[props.variant] || VARIANTS.desktop);
</script>
