<template>
  <form class="space-y-4" @submit.prevent="submit">
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="r in roles"
        :key="r.value"
        type="button"
        class="rounded-xl border-2 p-3 text-left transition"
        :class="role === r.value ? 'border-ulos-600 bg-ulos-50' : 'border-stone-200 hover:border-stone-300'"
        @click="role = r.value"
      >
        <span class="text-xl">{{ r.icon }}</span>
        <p class="text-sm font-bold">{{ r.label }}</p>
        <p class="text-xs text-stone-600">{{ r.desc }}</p>
      </button>
    </div>

    <FormField
      v-for="f in fields"
      :key="f.key"
      v-model="form[f.key]"
      :label="f.label"
      :type="f.type"
      :required="f.required"
      :placeholder="f.placeholder"
    />

    <template v-if="role === 'seller'">
      <FormField
        v-for="f in sellerFields"
        :key="f.key"
        v-model="form[f.key]"
        :label="f.label"
        type="text"
        :required="f.required"
        :placeholder="f.placeholder"
      />
    </template>

    <button
      type="submit"
      :disabled="auth.loading"
      class="btn-primary w-full"
    >
      {{ auth.loading ? "Mendaftarkan..." : "Daftar Sekarang" }}
    </button>
  </form>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import FormField from "../../components/FormField.vue";
import { useAuthStore } from "../../stores/authStore";
import { showErrorDialog, showSuccessDialog } from "../../helpers/toolsHelper";

const auth = useAuthStore();
const router = useRouter();

const role = ref("buyer");
const roles = [
  { value: "buyer", icon: "🛍️", label: "Pembeli", desc: "Belanja produk khas Toba" },
  { value: "seller", icon: "🏪", label: "Penjual", desc: "Buka toko UMKM-mu" },
];
const fields = [
  { key: "name", label: "Nama lengkap", type: "text", required: true, placeholder: "Nama kamu" },
  { key: "email", label: "Email", type: "email", required: true, placeholder: "nama@email.com" },
  { key: "password", label: "Kata sandi", type: "password", required: true, placeholder: "Minimal 6 karakter" },
];
const sellerFields = [
  { key: "shop_name", label: "Nama toko", required: true, placeholder: "Contoh: Kopi Sipirok Horas" },
  { key: "location", label: "Lokasi", required: false, placeholder: "Contoh: Balige, Toba" },
  { key: "phone", label: "No. HP / WhatsApp", required: false, placeholder: "08xxxxxxxxxx" },
];

const form = reactive({ name: "", email: "", password: "", shop_name: "", location: "", phone: "" });

const payload = computed(() => {
  const base = { name: form.name, email: form.email, password: form.password, role: role.value };
  if (role.value === "seller") {
    base.shop_name = form.shop_name;
    if (form.location) base.location = form.location;
    if (form.phone) base.phone = form.phone;
  }
  return base;
});

async function submit() {
  try {
    const user = await auth.register(payload.value);
    await showSuccessDialog(`Selamat datang di LapoTa, ${user.name}!`);
    router.push(user.role === "seller" ? "/penjual" : "/");
  } catch (e) {
    showErrorDialog(e.message);
  }
}
</script>