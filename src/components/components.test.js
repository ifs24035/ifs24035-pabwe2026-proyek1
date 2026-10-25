import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) } }));

import StatusBadge from "./StatusBadge.vue";
import AppLogo from "./AppLogo.vue";
import ProductArt from "./ProductArt.vue";
import ProductImage from "./ProductImage.vue";
import PhotoWithFallback from "./PhotoWithFallback.vue";
import CategoryImage from "./CategoryImage.vue";
import ProductCard from "./ProductCard.vue";
import FooterComponent from "./FooterComponent.vue";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";

const stubs = { RouterLink: RouterLinkStub };

const product = {
  id: 1,
  name: "Kopi Arabika Sidikalang 250g",
  price: 55000,
  stock: 40,
  unit: "bungkus",
  image: "",
  seller_id: 1,
  shop_name: "Kopi Sipirok Horas",
  seller_location: "Balige, Toba",
  category_name: "Kopi & Rempah",
  category_slug: "kopi-rempah",
  category_icon: "☕",
};

describe("StatusBadge & AppLogo", () => {
  it("menampilkan label status, dan nama status bila tak dikenal", () => {
    expect(mount(StatusBadge, { props: { status: "pending" } }).text()).toBe("Menunggu");
    expect(mount(StatusBadge, { props: { status: "aneh" } }).text()).toBe("aneh");
  });

  it("menampilkan logo dan tulisan LapoTa, dengan warna sesuai latar", () => {
    const dark = mount(AppLogo);
    expect(dark.find("img").exists()).toBe(true);
    expect(dark.text()).toContain("LapoTa");
    expect(dark.find("span span").classes()).toContain("text-ulos-700");
    const light = mount(AppLogo, { props: { tone: "light", size: "lg" } });
    expect(light.find("span span").classes()).toContain("text-white");
  });
});

describe("ProductArt", () => {
  const kindOf = (props) => mount(ProductArt, { props }).html();

  it("memilih ilustrasi dari kata di nama produk", () => {
    expect(kindOf({ name: "Kopi Arabika" })).toContain("bg-kopi");
    expect(kindOf({ name: "Ikan Mas Segar" })).toContain("bg-ikan");
    expect(kindOf({ name: "Selendang Ulos" })).toContain("bg-selendang");
    expect(kindOf({ name: "Ulos Ragidup" })).toContain("bg-ulos");
    expect(kindOf({ name: "Madu Hutan" })).toContain("bg-madu");
    expect(kindOf({ name: "Bawang Batak" })).toContain("bg-bawang");
    expect(kindOf({ name: "Jahe Merah" })).toContain("bg-jahe");
    expect(kindOf({ name: "Andaliman" })).toContain("bg-rempah");
    expect(kindOf({ name: "Ukiran Gorga" })).toContain("bg-ukiran");
  });

  it("ikan selain ikan mas memakai warna perak", () => {
    expect(kindOf({ name: "Ikan Pora-Pora Asin" })).toContain("#e2e8f0");
  });

  it("memakai kategori atau ikon bila nama tidak dikenali, lalu keranjang", () => {
    expect(kindOf({ name: "Produk X", category: "tenun-ulos" })).toContain("bg-ulos");
    expect(kindOf({ name: "Produk X", icon: "🍯" })).toContain("bg-madu");
    expect(kindOf({ name: "Produk X" })).toContain("bg-keranjang");
  });
});

describe("gambar dengan cadangan", () => {
  it("ProductImage: foto tampil, lalu ilustrasi bila gagal dimuat", async () => {
    const w = mount(ProductImage, { props: { image: "a.jpg", alt: "Kopi Arabika" } });
    expect(w.find("img").exists()).toBe(true);
    await w.find("img").trigger("error");
    expect(w.find("img").exists()).toBe(false);
    expect(w.find("svg").exists()).toBe(true);
  });

  it("ProductImage tanpa foto langsung memakai ilustrasi", () => {
    expect(mount(ProductImage, { props: { alt: "Madu" } }).find("svg").exists()).toBe(true);
  });

  it("PhotoWithFallback dan CategoryImage beralih ke ilustrasi saat foto tidak ada", async () => {
    const p = mount(PhotoWithFallback, { props: { src: "/hero/x.jpg", art: "Kopi" } });
    await p.find("img").trigger("error");
    expect(p.find("svg").exists()).toBe(true);
    const c = mount(CategoryImage, { props: { slug: "kopi-rempah", name: "Kopi" } });
    expect(c.find("img").attributes("src")).toBe("/categories/kopi-rempah.jpg");
    await c.find("img").trigger("error");
    expect(c.find("svg").exists()).toBe(true);
  });
});

describe("ProductCard", () => {
  let pinia;
  beforeEach(() => {
    localStorage.clear();
    pinia = createPinia();
    setActivePinia(pinia);
  });
  const render = (p = product) => mount(ProductCard, { props: { product: p }, global: { plugins: [pinia], stubs } });

  it("menampilkan nama, toko, harga, dan menambah ke keranjang", async () => {
    const w = render();
    expect(w.text()).toContain("Kopi Arabika Sidikalang 250g");
    expect(w.text()).toContain("Kopi Sipirok Horas");
    expect(w.text().replace(/\s/g, " ")).toContain("55.000");
    await w.find("button").trigger("click");
    expect(useCartStore().count).toBe(1);
  });

  it("menandai stok menipis dan stok habis", () => {
    expect(render({ ...product, stock: 3 }).text()).toContain("Sisa 3");
    const habis = render({ ...product, stock: 0 });
    expect(habis.text()).toContain("Stok habis");
    expect(habis.find("button").attributes("disabled")).toBeDefined();
  });

  it("penjual tidak melihat tombol tambah", () => {
    useAuthStore().user = { role: "seller" };
    expect(render().find("button").exists()).toBe(false);
  });
});

describe("FooterComponent", () => {
  it("menampilkan tautan utama", () => {
    const w = mount(FooterComponent, { global: { stubs } });
    expect(w.text()).toContain("Buka toko di LapoTa");
  });
});