import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./stores/authStore";

import MainLayout from "./layouts/MainLayout.vue";
import AuthLayout from "./layouts/AuthLayout.vue";
import SellerLayout from "./layouts/SellerLayout.vue";

export const routes = [
  {
    path: "/auth",
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      { path: "login", name: "login", component: () => import("./pages/auth/LoginPage.vue") },
      { path: "register", name: "register", component: () => import("./pages/auth/RegisterPage.vue") },
    ],
  },
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", name: "home", component: () => import("./pages/HomePage.vue") },
      { path: "produk", name: "products", component: () => import("./pages/ProductsPage.vue") },
      { path: "produk/:id", name: "product-detail", component: () => import("./pages/ProductDetailPage.vue") },
      { path: "toko/:id", name: "shop", component: () => import("./pages/SellerShopPage.vue") },
      { path: "keranjang", name: "cart", component: () => import("./pages/CartPage.vue") },
      {
        path: "pesanan",
        name: "orders",
        component: () => import("./pages/OrdersPage.vue"),
        meta: { requiresAuth: true, role: "buyer" },
      },
      {
        path: "penjual",
        component: SellerLayout,
        meta: { requiresAuth: true, role: "seller" },
        children: [
          { path: "", name: "seller-dashboard", component: () => import("./pages/seller/SellerDashboardPage.vue") },
          { path: "produk", name: "seller-products", component: () => import("./pages/seller/SellerProductsPage.vue") },
          { path: "pesanan", name: "seller-orders", component: () => import("./pages/seller/SellerOrdersPage.vue") },
        ],
      },
    ],
  },
  { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("./pages/NotFoundPage.vue") },
];

export function createAppRouter(history = createWebHistory()) {
  const router = createRouter({
    history,
    routes,
    scrollBehavior: () => ({ top: 0 }),
  });

  router.beforeEach(async (to) => {
    const auth = useAuthStore();
    await auth.init();

    const needsAuth = to.matched.some((r) => r.meta.requiresAuth);
    const role = to.matched.find((r) => r.meta.role)?.meta.role;

    if (needsAuth && !auth.isLoggedIn) {
      return { name: "login", query: { redirect: to.fullPath } };
    }
    if (role && auth.user?.role !== role) {
      return { name: "home" };
    }
    if (to.matched.some((r) => r.meta.guestOnly) && auth.isLoggedIn) {
      return { name: auth.isSeller ? "seller-dashboard" : "home" };
    }
    return true;
  });

  return router;
}

export default createAppRouter();