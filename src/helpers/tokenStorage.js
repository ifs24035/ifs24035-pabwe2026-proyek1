// Satu-satunya tempat yang tahu di mana token login disimpan.
// Bila nanti pindah ke strategi lain (mis. cookie httpOnly dari backend), cukup ubah berkas ini.
const TOKEN_KEY = "lapota_token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null; // penyimpanan tidak tersedia (mis. mode privat yang ketat)
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // diabaikan: sesi hanya berlaku selama halaman terbuka
  }
}
