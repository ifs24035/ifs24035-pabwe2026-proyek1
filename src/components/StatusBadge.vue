<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
    :class="meta.class"
  >
    {{ meta.label }}
  </span>
</template>

<script setup>
import { computed } from "vue";
import { ORDER_STATUS } from "../helpers/toolsHelper";

const props = defineProps({ status: { type: String, required: true } });
const meta = computed(
  () => ORDER_STATUS[props.status] || { label: props.status, class: "bg-stone-100 text-stone-700" }
);
</script>