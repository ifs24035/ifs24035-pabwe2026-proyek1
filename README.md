# ifs24035-pabwe2026-proyek1-fe

Frontend LapoTa (Vue 3 + Vite + Pinia + Vue Router + Tailwind CSS 4).

## Menjalankan lokal
```bash
cp .env.example .env     # isi VITE_API_URL (lokal: http://localhost:5000)
npm install
npm run dev              # http://localhost:3000
npm run test:coverage
npm run build
```

## Deploy (Vercel)
Framework Vite, build `npm run build`, output `dist`.
Environment Variable: `VITE_API_URL` = URL deploy backend (tanpa slash di akhir).

## Struktur kode

```
src/
  api/          pemanggil endpoint (authApi, catalogApi, orderApi)
  components/   komponen UI kecil dan dapat dipakai ulang
    art/        ilustrasi produk per jenis (ArtKopi, ArtIkan, ...)
  helpers/      fungsi murni dan utilitas (apiHelper, tokenStorage, productArtHelper, toolsHelper)
  layouts/      kerangka halaman (Main, Auth, Seller)
  pages/        satu berkas per halaman (dimuat lazy oleh router)
  stores/       state Pinia (auth, cart, catalog)
```

Komponen yang dipecah agar tiap berkas fokus pada satu tugas:
`FormField` (label + kontrol formulir, dipakai Login, Register, Keranjang, Produk Penjual),
`NavbarComponent` yang terdiri atas `NavbarSearch`, `NavbarUserMenu`, dan `MobileBottomNav`,
serta `ProductArt` yang memilih salah satu komponen di `components/art/` lewat `productArtHelper`.

## Keamanan: penyimpanan token

Token login disimpan di `localStorage` lewat satu modul, `helpers/tokenStorage.js`.
Alasan tidak memakai cookie httpOnly saat ini: frontend dan backend berada di dua domain
`*.vercel.app` yang berbeda, sehingga cookie harus berstatus lintas-situs (`SameSite=None; Secure`)
dan sering diblokir peramban (pemblokiran cookie pihak ketiga), serta butuh perlindungan CSRF di backend.
Risiko XSS yang membuat `localStorage` rawan dikurangi dengan: tidak ada `v-html`/`innerHTML` (Vue
melakukan escape otomatis), token berumur terbatas (`JWT_EXPIRES_IN`), dan header keamanan di `vercel.json`.
Bila backend dan frontend kelak berbagi domain induk, cukup ganti isi `tokenStorage.js` dan interceptor
di `apiHelper.js` (mengirim `withCredentials`) tanpa menyentuh bagian lain.
