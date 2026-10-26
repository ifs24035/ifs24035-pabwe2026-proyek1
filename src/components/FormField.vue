<template>
  <div>
    <label :for="fieldId" class="form-label">{{ label }}</label>
    <div class="relative">
      <slot name="icon" />
      <textarea v-if="as === 'textarea'" v-bind="$attrs" :id="fieldId" v-model="model" :class="controlClass()" />
      <select v-else-if="as === 'select'" v-bind="$attrs" :id="fieldId" v-model="model" :class="controlClass()">
        <slot />
      </select>
      <input v-else v-bind="$attrs" :id="fieldId" v-model="model" :class="controlClass()" />
    </div>
  </div>
</template>

<script setup>
// Kolom formulir lengkap: label + kontrol (input / textarea / select) dengan gaya seragam.
// Atribut lain (type, required, placeholder, data-testid, ...) diteruskan ke kontrolnya.
import { computed, useId, useSlots } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  label: { type: String, required: true },
  as: { type: String, default: "input" }, // input | textarea | select
  id: { type: String, default: "" },
});

const slots = useSlots();

const [model, modifiers] = defineModel({
  // mendukung v-model.number seperti pada elemen bawaan
  set: (value) => (modifiers.number && value !== "" && !Number.isNaN(Number(value)) ? Number(value) : value),
});

const generatedId = useId();
const fieldId = computed(() => props.id || generatedId);

// Bila ada ikon di kiri, beri ruang lebih
function controlClass() {
  return ["form-control", slots.icon ? "pl-10 pr-3" : "px-3.5"];
}
</script>
