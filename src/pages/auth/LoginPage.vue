<template>
  <form class="space-y-4" @submit.prevent="submit">
    <div>
      <label for="username" class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-600">Email</label>
      <div class="relative">
        <Mail :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600" />
        <input
          id="username"
          name="username"
          v-model="email"
          type="email"
          autocomplete="username"
          required
          placeholder="nama@email.com"
          data-testid="login-email"
          class="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-3 text-sm focus:border-ulos-600 focus:outline-none focus:ring-2 focus:ring-ulos-600/20"
        />
      </div>
    </div>
    <div>
      <label for="password" class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-600">Kata sandi</label>
      <div class="relative">
        <Lock :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600" />
        <input
          id="password"
          name="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          placeholder="••••••••"
          data-testid="login-password"
          class="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-3 text-sm focus:border-ulos-600 focus:outline-none focus:ring-2 focus:ring-ulos-600/20"
        />
      </div>
    </div>
    <button
      id="btn-submit"
      type="submit"
      :disabled="auth.loading"
      data-testid="login-submit"
      class="w-full rounded-xl bg-ulos-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-ulos-600/25 hover:bg-ulos-700 disabled:opacity-60"
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