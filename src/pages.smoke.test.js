import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) } }));

const { product, order } = vi.hoisted(() => ({
  product: {
    id: 1, name: "Kopi Arabika Sidikalang", description: "Kopi enak", price: 55000, stock: 4, unit: "bungkus",
    image: "", is_active: 1, seller_id: 1, category_id: 1, shop_name: "Toko Kopi", seller_location: "Balige",
    category_name: "Kopi & Rempah", category_slug: "kopi-rempah", category_icon: "☕",
  },
  order: {
    id: 1, status: "pending", total: 55000, address: "Jl. Contoh No. 1", note: "", created_at: "2026-10-22 08:00:00",
    buyer_name: "Pembeli Demo", shop_name: "Toko Kopi",
    items: [{ id: 1, product_id: 1, product_name: "Kopi Arabika Sidikalang", price: 55000, quantity: 1 }],
  },
}));

vi.mock("./api/catalogApi", () => ({
  catalogApi: {
    categories: vi.fn().mockResolvedValue([{ id: 1, name: "Kopi & Rempah", slug: "kopi-rempah", icon: "☕", product_count: 1 }]),
    products: vi.fn().mockResolvedValue({ items: [product], pagination: { page: 1, limit: 12, total: 1, total_pages: 1 } }),
    product: vi.fn().mockResolvedValue(product),
    seller: vi.fn().mockResolvedValue({ id: 1, shop_name: "Toko Kopi", description: "Deskripsi", location: "Balige", phone: "0812", products: [product] }),
    sellers: vi.fn().mockResolvedValue([{ id: 1, shop_name: "Toko Kopi", description: "Deskripsi", location: "Balige", product_count: 1 }]),
    myProducts: vi.fn().mockResolvedValue([product]),
    createProduct: vi.fn().mockResolvedValue({ message: "ok" }),
    updateProduct: vi.fn().mockResolvedValue({ message: "ok" }),
    deleteProduct: vi.fn().mockResolvedValue({ message: "ok" }),
  },
}));
vi.mock("./api/orderApi", () => ({
  orderApi: {
    checkout: vi.fn().mockResolvedValue([order]),
    mine: vi.fn(async () => [structuredClone(order)]),
    cancel: vi.fn().mockResolvedValue({ ...order, status: "dibatalkan" }),
    sellerOrders: vi.fn(async () => [structuredClone(order)]),
    sellerStats: vi.fn().mockResolvedValue({ products: { total: 1, low_stock: 1 }, orders: { total: 1, pending: 1, revenue: 1000 } }),
    updateStatus: vi.fn().mockResolvedValue({ ...order, status: "diproses" }),
  },
}));
vi.mock("./api/authApi", () => ({
  authApi: {
    login: vi.fn().mockResolvedValue({ token: "T", user: { id: 1, name: "Pembeli", role: "buyer" } }),
    register: vi.fn().mockResolvedValue({ token: "T", user: { id: 1, name: "Baru", role: "buyer" } }),
    me: vi.fn(),
  },
}));

import { orderApi } from "./api/orderApi";
import { catalogApi } from "./api/catalogApi";
import { authApi } from "./api/authApi";
import { useAuthStore } from "./stores/authStore";
import { useCartStore } from "./stores/cartStore";

import HomePage from "./pages/HomePage.vue";
import ProductsPage from "./pages/ProductsPage.vue";
import ProductDetailPage from "./pages/ProductDetailPage.vue";
import SellerShopPage from "./pages/SellerShopPage.vue";
import CartPage from "./pages/CartPage.vue";
import OrdersPage from "./pages/OrdersPage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";
import LoginPage from "./pages/auth/LoginPage.vue";
import RegisterPage from "./pages/auth/RegisterPage.vue";
import SellerDashboardPage from "./pages/seller/SellerDashboardPage.vue";
import SellerProductsPage from "./pages/seller/SellerProductsPage.vue";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage.vue";
import App from "./App.vue";
import NavbarComponent from "./components/NavbarComponent.vue";
import MainLayout from "./layouts/MainLayout.vue";
import AuthLayout from "./layouts/AuthLayout.vue";
import SellerLayout from "./layouts/SellerLayout.vue";

const buyer = { id: 1, name: "Pembeli Demo", email: "p@x.id", role: "buyer" };
const seller = { id: 2, name: "Penjual Demo", email: "s@x.id", role: "seller", seller: { id: 1, shop_name: "Toko Kopi" } };

let pinia;
let router;

async function render(component, { path = "/", user = null, cart = false } = {}) {
  pinia = createPinia();
  setActivePinia(pinia);
  const auth = useAuthStore();
  auth.user = user;
  auth.initialized = true;
  if (cart) useCartStore().add(product, 2);
  const any = { template: "<div />" };
  router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", name: "home", component: any },
      { path: "/produk", name: "products", component: any },
      { path: "/produk/:id", name: "product-detail", component: any },
      { path: "/toko/:id", component: any },
      { path: "/keranjang", component: any },
      { path: "/pesanan", component: any },
      { path: "/penjual", component: any },
      { path: "/penjual/pesanan", component: any },
      { path: "/penjual/produk", component: any },
      { path: "/auth/login", name: "login", component: any },
      { path: "/auth/register", name: "register", component: any },
    ],
  });
  await router.push(path);
  await router.isReady();
  const wrapper = mount(component, { global: { plugins: [pinia, router] } });
  await flushPromises();
  return wrapper;
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("halaman publik", () => {
  it("Beranda menampilkan kategori, produk, dan toko", async () => {
    const w = await render(HomePage);
    expect(w.text()).toContain("Produk Terbaru");
    expect(w.text()).toContain("Kopi Arabika Sidikalang");
    expect(w.text()).toContain("Toko Kopi");
    await w.find("form").trigger("submit");
    await flushPromises();
    expect(router.currentRoute.value.name).toBe("products");
  });

  it("Produk menampilkan daftar dan bisa direset saat kosong", async () => {
    const w = await render(ProductsPage, { path: "/produk" });
    expect(w.text()).toContain("Semua Produk");
    expect(w.text()).toContain("Kopi Arabika Sidikalang");
    const chips = w.findAll("button").filter((b) => b.text().includes("Kopi & Rempah"));
    await chips[0].trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.query.category).toBe("kopi-rempah");
  });

  it("Detail produk menampilkan info dan menambah ke keranjang", async () => {
    const w = await render(ProductDetailPage, { path: "/produk/1" });
    expect(w.text()).toContain("Deskripsi Produk");
    const add = w.findAll("button").find((b) => b.text().includes("Tambah ke Keranjang"));
    await add.trigger("click");
    expect(useCartStore().count).toBe(1);
  });

  it("Detail produk untuk penjual tidak menampilkan tombol beli", async () => {
    const w = await render(ProductDetailPage, { path: "/produk/1", user: seller });
    expect(w.text()).toContain("Anda masuk sebagai penjual");
  });

  it("Halaman toko dan 404 tampil", async () => {
    expect((await render(SellerShopPage, { path: "/toko/1" })).text()).toContain("Toko Kopi");
    expect((await render(NotFoundPage)).text()).toContain("404");
  });
});

describe("keranjang & pesanan pembeli", () => {
  it("Keranjang kosong menampilkan ajakan belanja", async () => {
    expect((await render(CartPage, { path: "/keranjang" })).text()).toContain("masih kosong");
  });

  it("Tamu yang checkout diarahkan ke login", async () => {
    const w = await render(CartPage, { path: "/keranjang", cart: true });
    await w.find("form").trigger("submit");
    await flushPromises();
    expect(router.currentRoute.value.name).toBe("login");
  });

  it("Pembeli berhasil membuat pesanan dan keranjang dikosongkan", async () => {
    const w = await render(CartPage, { path: "/keranjang", user: buyer, cart: true });
    await w.find("textarea").setValue("Jl. Sisingamangaraja No. 1");
    await w.find("form").trigger("submit");
    await flushPromises();
    expect(orderApi.checkout).toHaveBeenCalledTimes(1);
    expect(useCartStore().count).toBe(0);
  });

  it("Pesanan Saya menampilkan pesanan dan bisa membatalkan", async () => {
    const w = await render(OrdersPage, { path: "/pesanan", user: buyer });
    expect(w.text()).toContain("Pesanan #1");
    const cancel = w.findAll("button").find((b) => b.text().includes("Batalkan"));
    await cancel.trigger("click");
    await flushPromises();
    expect(orderApi.cancel).toHaveBeenCalledWith(1);
  });
});

describe("autentikasi", () => {
  it("Login memanggil API lalu berpindah halaman", async () => {
    const w = await render(LoginPage, { path: "/auth/login" });
    await w.find('[data-testid="login-email"]').setValue("p@x.id");
    await w.find('[data-testid="login-password"]').setValue("password123");
    await w.find("form").trigger("submit");
    await flushPromises();
    expect(authApi.login).toHaveBeenCalledWith("p@x.id", "password123");
    expect(router.currentRoute.value.path).toBe("/");
  });

  it("Daftar sebagai penjual mengirim data toko", async () => {
    const w = await render(RegisterPage, { path: "/auth/register" });
    const seller = w.findAll("button").find((b) => b.text().includes("Penjual"));
    await seller.trigger("click");
    const inputs = w.findAll("input");
    for (const [i, v] of ["Budi Santoso", "budi@x.id", "rahasia1", "Toko Budi"].entries()) await inputs[i].setValue(v);
    await w.find("form").trigger("submit");
    await flushPromises();
    expect(authApi.register).toHaveBeenCalledWith(expect.objectContaining({ role: "seller", shop_name: "Toko Budi" }));
  });
});

describe("area penjual", () => {
  it("Dashboard menampilkan ringkasan dan pesanan terbaru", async () => {
    const w = await render(SellerDashboardPage, { path: "/penjual", user: seller });
    expect(w.text()).toContain("Pesanan Terbaru");
    expect(w.text()).toContain("Total Produk");
  });

  it("Produk penjual menampilkan tabel, membuka formulir, dan menghapus", async () => {
    const w = await render(SellerProductsPage, { path: "/penjual/produk", user: seller });
    expect(w.text()).toContain("Produk Saya");
    await w.findAll("button").find((b) => b.text().includes("Tambah Produk")).trigger("click");
    expect(w.text()).toContain("Foto produk");
    await w.find("form").find("button").trigger("click");
    const del = w.findAll("tbody button")[1];
    await del.trigger("click");
    await flushPromises();
    expect(catalogApi.deleteProduct).toHaveBeenCalledWith(1);
  });

  it("Pesanan penjual bisa diproses dan difilter", async () => {
    const w = await render(SellerOrdersPage, { path: "/penjual/pesanan", user: seller });
    await w.findAll("button").find((b) => b.text().includes("Proses pesanan")).trigger("click");
    await flushPromises();
    expect(orderApi.updateStatus).toHaveBeenCalledWith(1, "diproses");
    await w.findAll("button").find((b) => b.text() === "Selesai").trigger("click");
    expect(w.text()).toContain("Tidak ada pesanan");
  });
});

describe("layout", () => {
  it("MainLayout menampilkan navbar dan footer setelah sesi siap", async () => {
    const w = await render(MainLayout, { user: buyer });
    expect(w.text()).toContain("Pesanan Saya");
    expect(w.text()).toContain("Buka toko di LapoTa");
  });

  it("MainLayout untuk penjual menampilkan menu dashboard", async () => {
    const w = await render(MainLayout, { user: seller });
    expect(w.text()).toContain("Dashboard Toko");
  });

  it("AuthLayout dan SellerLayout tampil", async () => {
    expect((await render(AuthLayout, { path: "/auth/login" })).text()).toContain("Masuk");
    expect((await render(SellerLayout, { path: "/penjual", user: seller })).text()).toContain("Dashboard Penjual");
  });
});

describe("navbar & aplikasi", () => {
  it("Navbar tamu menampilkan tombol masuk/daftar dan mencari produk", async () => {
    const w = await render(NavbarComponent);
    expect(w.text()).toContain("Masuk");
    expect(w.text()).toContain("Daftar");
    await w.find("input").setValue("ulos");
    await w.find("form").trigger("submit");
    await flushPromises();
    expect(router.currentRoute.value.query.search).toBe("ulos");
  });

  it("Navbar pembeli: menu akun bisa dibuka dan keluar", async () => {
    const w = await render(NavbarComponent, { user: buyer, cart: true });
    const avatar = w.findAll("button").find((b) => b.text().includes("Pembeli Demo"));
    await avatar.trigger("click");
    expect(w.text()).toContain("Keluar");
    await w.findAll("button").find((b) => b.text().includes("Keluar")).trigger("click");
    await flushPromises();
    expect(useAuthStore().isLoggedIn).toBe(false);
  });

  it("Navbar penjual menampilkan menu dashboard", async () => {
    const w = await render(NavbarComponent, { user: seller });
    expect(w.text()).toContain("Dashboard Toko");
  });

  it("App merender RouterView", async () => {
    const w = await render(App);
    expect(w.exists()).toBe(true);
  });
});

describe("halaman produk: kondisi khusus", () => {
  it("menampilkan pesan kosong dan tombol reset", async () => {
    catalogApi.products.mockResolvedValueOnce({ items: [], pagination: { page: 1, limit: 12, total: 0, total_pages: 1 } });
    const w = await render(ProductsPage, { path: "/produk?search=zzz" });
    expect(w.text()).toContain("Produk tidak ditemukan");
    await w.findAll("button").find((b) => b.text().includes("Reset pencarian")).trigger("click");
    await flushPromises();
    expect(catalogApi.products).toHaveBeenCalled();
  });

  it("menampilkan penomoran halaman bila produk banyak", async () => {
    catalogApi.products.mockResolvedValueOnce({ items: [product], pagination: { page: 1, limit: 12, total: 20, total_pages: 2 } });
    const w = await render(ProductsPage, { path: "/produk" });
    expect(w.text()).toContain("Halaman 1 / 2");
    await w.findAll("button").find((b) => b.text().includes("Berikutnya")).trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.query.page).toBe("2");
  });
});

describe("Produk penjual: simpan data", () => {
  it("menambah produk baru lewat formulir", async () => {
    const w = await render(SellerProductsPage, { path: "/penjual/produk", user: seller });
    await w.findAll("button").find((b) => b.text().includes("Tambah Produk")).trigger("click");
    await w.find("form input").setValue("Teh Herbal Toba");
    await w.find("form select").setValue(1);
    await w.find("form").trigger("submit");
    await flushPromises();
    expect(catalogApi.createProduct).toHaveBeenCalledTimes(1);
  });

  it("mengubah produk yang sudah ada", async () => {
    const w = await render(SellerProductsPage, { path: "/penjual/produk", user: seller });
    await w.findAll("tbody button")[0].trigger("click");
    await w.find("form").trigger("submit");
    await flushPromises();
    expect(catalogApi.updateProduct).toHaveBeenCalledWith(1, expect.any(FormData));
  });
});