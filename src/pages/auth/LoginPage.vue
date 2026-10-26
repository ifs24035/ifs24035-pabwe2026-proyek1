<template>
  <form class="space-y-4" @submit.prevent="submit">
    <FormField
      id="username"
      v-model="email"
      label="Email"
      name="username"
      type="email"
      autocomplete="username"
      required
      placeholder="nama@email.com"
      data-testid="login-email"
    >
      <template #icon>
        <Mail :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600" />
      </template>
    </FormField>
    <FormField
      id="password"
      v-model="password"
      label="Kata sandi"
      name="password"
      type="password"
      autocomplete="current-password"
      required
      placeholder="••••••••"
      data-testid="login-password"
    >
      <template #icon>
        <Lock :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600" />
      </template>
    </FormField>
    <button
      id="btn-submit"
      type="submit"
      :disabled="auth.loading"
      data-testid="login-submit"
      class="btn-primary w-full"
    >
      {{ auth.loading ? "Sedang masuk..." : "Masuk" }}
    </button>
    <p class="rounded-xl bg-stone-50 p-3 text-xs text-stone-600">
      Akun demo (password <b>password123</b>): pembeli@lapota.id · penjual1@lapota.id
    </p>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Mail, Lock } from "lucide-vue-next";
import FormField from "../../components/FormField.vue";
import { useAuthStore } from "../../stores/authStore";
import { showErrorDialog } from "../../helpers/toolsHelper";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const email = ref("");
const password = ref("");

async function submit() {
  try {
    const user = await auth.login(email.value, password.value);
    const redirect = route.query.redirect;
    router.push(
      typeof redirect === "string" && redirect.startsWith("/")
        ? redirect
        : user.role === "seller"
          ? "/penjual"
          : "/"
    );
  } catch (e) {
    showErrorDialog(e.message);
  }
}
</script>