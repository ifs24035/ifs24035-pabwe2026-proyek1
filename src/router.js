import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./stores/authStore";

import MainLayout from "./layouts/MainLayout.vue";
import AuthLayout from "./layouts/AuthLayout.vue";
import SellerLayout from "./layouts/SellerLayout.vue";
import HomePage from "./pages/HomePage.vue";
import ProductsPage from "./pages/ProductsPage.vue";
import ProductDetailPage from "./pages/ProductDetailPage.vue";
import SellerShopPage from "./pages/SellerShopPage.vue";
import CartPage from "./pages/CartPage.vue";
import OrdersPage from "./pages/OrdersPage.vue";
import LoginPage from "./pages/auth/LoginPage.vue";
import RegisterPage from "./pages/auth/RegisterPage.vue";
import SellerDashboardPage from "./pages/seller/SellerDashboardPage.vue";
import SellerProductsPage from "./pages/seller/SellerProductsPage.vue";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";

export const routes = [
  {
    path: "/auth",
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      { path: "login", name: "login", component: LoginPage },
      { path: "register", name: "register", component: RegisterPage },
    ],
  },
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", name: "home", component: HomePage },
      { path: "produk", name: "products", component: ProductsPage },
      { path: "produk/:id", name: "product-detail", component: ProductDetailPage },
      { path: "toko/:id", name: "shop", component: SellerShopPage },
      { path: "keranjang", name: "cart", component: CartPage },
      {
        path: "pesanan",
        name: "orders",
        component: OrdersPage,
        meta: { requiresAuth: true, role: "buyer" },
      },
      {
        path: "penjual",
        component: SellerLayout,
        meta: { requiresAuth: true, role: "seller" },
        children: [
          { path: "", name: "seller-dashboard", component: SellerDashboardPage },
          { path: "produk", name: "seller-products", component: SellerProductsPage },
          { path: "pesanan", name: "seller-orders", component: SellerOrdersPage },
        ],
      },
    ],
  },
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFoundPage },
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