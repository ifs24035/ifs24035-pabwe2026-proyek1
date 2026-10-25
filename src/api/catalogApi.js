import http from "../helpers/apiHelper";

export const catalogApi = {
  categories: () => http.get("/categories").then((r) => r.data.data),
  products: (params) => http.get("/products", { params }).then((r) => r.data.data),
  product: (id) => http.get(`/products/${id}`).then((r) => r.data.data),
  seller: (id) => http.get(`/sellers/${id}`).then((r) => r.data.data),
  sellers: () => http.get("/sellers").then((r) => r.data.data),

  // area penjual
  myProducts: () => http.get("/seller/products").then((r) => r.data.data),
  createProduct: (formData) => http.post("/seller/products", formData).then((r) => r.data),
  updateProduct: (id, formData) => http.put(`/seller/products/${id}`, formData).then((r) => r.data),
  deleteProduct: (id) => http.delete(`/seller/products/${id}`).then((r) => r.data),
};