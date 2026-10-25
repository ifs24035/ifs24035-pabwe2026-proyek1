import http from "../helpers/apiHelper";

export const authApi = {
  register: (payload) => http.post("/auth/register", payload).then((r) => r.data.data),
  login: (email, password) =>
    http.post("/auth/login", { email, password }).then((r) => r.data.data),
  me: () => http.get("/auth/me").then((r) => r.data.data.user),
};