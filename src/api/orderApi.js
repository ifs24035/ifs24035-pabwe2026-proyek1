import http from "../helpers/apiHelper";

export const orderApi = {
  checkout: (payload) => http.post("/orders", payload).then((r) => r.data.data),
  mine: () => http.get("/orders/mine").then((r) => r.data.data),
  cancel: (id) => http.patch(`/orders/${id}/cancel`).then((r) => r.data.data),

  // area penjual
  sellerOrders: () => http.get("/seller/orders").then((r) => r.data.data),
  sellerStats: () => http.get("/seller/stats").then((r) => r.data.data),
  updateStatus: (id, status) =>
    http.patch(`/orders/${id}/status`, { status }).then((r) => r.data.data),
};