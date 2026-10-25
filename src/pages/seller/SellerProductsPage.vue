<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-extrabold">Produk Saya ({{ products.length }})</h2>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-xl bg-ulos-600 px-4 py-2 text-sm font-semibold text-white hover:bg-ulos-700"
        @click="openForm()"
      >
        <Plus :size="16" /> Tambah Produk
      </button>
    </div>

    <div v-if="loading" class="py-16 text-center text-stone-500">Memuat produk...</div>
    <p v-else-if="!products.length" class="py-16 text-center text-stone-500">
      Belum ada produk. Tambahkan produk pertamamu!
    </p>
    <div v-else class="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
      <table class="w-full min-w-[640px] text-left text-sm">
        <thead class="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
          <tr>
            <th class="px-4 py-3">Produk</th>
            <th class="px-4 py-3">Kategori</th>
            <th class="px-4 py-3">Harga</th>
            <th class="px-4 py-3">Stok</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100">
          <tr v-for="p in products" :key="p.id">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <ProductImage :image="p.image" :icon="p.category_icon" class="h-11 w-11 shrink-0 rounded-lg" />
                <span class="font-semibold">{{ p.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3">{{ p.category_name }}</td>
            <td class="px-4 py-3">{{ formatRupiah(p.price) }}</td>
            <td class="px-4 py-3" :class="p.stock <= 5 ? 'font-bold text-red-600' : ''">
              {{ p.stock }} {{ p.unit }}
            </td>
            <td class="px-4 py-3">
              <span
                class="rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'"
              >
                {{ p.is_active ? "Aktif" : "Nonaktif" }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <button type="button" class="rounded-lg p-2 text-stone-500 hover:bg-stone-100" @click="openForm(p)">
                <Pencil :size="16" />
              </button>
              <button type="button" class="rounded-lg p-2 text-red-500 hover:bg-red-50" @click="remove(p)">
                <Trash2 :size="16" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal form -->
    <div
      v-if="showForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @mousedown.self="showForm = false"
    >
      <form
        class="max-h-[92vh] w-full max-w-lg space-y-3 overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
        @submit.prevent="save"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-extrabold">{{ editing ? "Ubah Produk" : "Tambah Produk" }}</h3>
          <button type="button" class="rounded-lg p-1.5 hover:bg-stone-100" @click="showForm = false">
            <X :size="18" />
          </button>
        </div>

        <div>
          <label class="mb-1 block text-xs font-bold uppercase text-stone-600">Nama produk</label>
          <input v-model="form.name" required minlength="3" class="field" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="mb-1 block text-xs font-bold uppercase text-stone-600">Kategori</label>
            <select v-model="form.category_id" required class="field">
              <option value="" disabled>Pilih...</option>
              <option v-for="c in catalog.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-bold uppercase text-stone-600">Satuan</label>
            <input v-model="form.unit" required placeholder="kg, bungkus, lembar" class="field" />
          </div>
          <div>
            <label class="mb-1 block text-xs font-bold uppercase text-stone-600">Harga (Rp)</label>
            <input v-model.number="form.price" type="number" min="0" required class="field" />
          </div>
          <div>
            <label class="mb-1 block text-xs font-bold uppercase text-stone-600">Stok</label>
            <input v-model.number="form.stock" type="number" min="0" required class="field" />
          </div>
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase text-stone-600">Deskripsi</label>
          <textarea v-model="form.description" rows="3" class="field" />
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold uppercase text-stone-600">
            Foto produk (JPG/PNG/WEBP, maks 2 MB)
          </label>
          <input type="file" accept="image/jpeg,image/png,image/webp" class="text-sm" @change="onFile" />
        </div>
        <label v-if="editing" class="flex items-center gap-2 text-sm">
          <input v-model="form.is_active" type="checkbox" /> Produk aktif (tampil di katalog)
        </label>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="rounded-xl border border-stone-200 px-4 py-2 text-sm font-semibold" @click="showForm = false">
            Batal
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="rounded-xl bg-ulos-600 px-5 py-2 text-sm font-semibold text-white hover:bg-ulos-700 disabled:opacity-60"
          >
            {{ saving ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { Pencil, Plus, Trash2, X } from "lucide-vue-next";
import ProductImage from "../../components/ProductImage.vue";
import { catalogApi } from "../../api/catalogApi";
import { useCatalogStore } from "../../stores/catalogStore";
import {
  formatRupiah,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
} from "../../helpers/toolsHelper";

const catalog = useCatalogStore();
const products = ref([]);
const loading = ref(true);
const showForm = ref(false);
const saving = ref(false);
const editing = ref(null);
const file = ref(null);

const emptyForm = () => ({
  name: "",
  category_id: "",
  unit: "pcs",
  price: 0,
  stock: 0,
  description: "",
  is_active: true,
});
const form = reactive(emptyForm());

async function load() {
  try {
    products.value = await catalogApi.myProducts();
  } catch (e) {
    showErrorDialog(e.message);
  } finally {
    loading.value = false;
  }
}

function openForm(product = null) {
  editing.value = product;
  file.value = null;
  Object.assign(
    form,
    product
      ? {
          name: product.name,
          category_id: product.category_id,
          unit: product.unit,
          price: product.price,
          stock: product.stock,
          description: product.description,
          is_active: !!product.is_active,
        }
      : emptyForm()
  );
  showForm.value = true;
}

function onFile(e) {
  file.value = e.target.files?.[0] || null;
}

async function save() {
  const body = new FormData();
  body.append("name", form.name);
  body.append("category_id", form.category_id);
  body.append("unit", form.unit);
  body.append("price", form.price);
  body.append("stock", form.stock);
  body.append("description", form.description);
  if (editing.value) body.append("is_active", form.is_active ? "true" : "false");
  if (file.value) body.append("image", file.value);

  saving.value = true;
  try {
    const res = editing.value
      ? await catalogApi.updateProduct(editing.value.id, body)
      : await catalogApi.createProduct(body);
    showForm.value = false;
    await load();
    showSuccessDialog(res.message);
  } catch (e) {
    showErrorDialog(e.message);
  } finally {
    saving.value = false;
  }
}

async function remove(product) {
  const r = await showConfirmDialog(`Hapus produk "${product.name}"?`);
  if (!r.isConfirmed) return;
  try {
    const res = await catalogApi.deleteProduct(product.id);
    await load();
    showSuccessDialog(res.message);
  } catch (e) {
    showErrorDialog(e.message);
  }
}

onMounted(() => {
  catalog.loadCategories().catch(() => {});
  load();
});
</script>

<style scoped>
@reference "../../index.css";
.field {
  @apply w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-ulos-600 focus:outline-none focus:ring-2 focus:ring-ulos-600/20;
}
</style>