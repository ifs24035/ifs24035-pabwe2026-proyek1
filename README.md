# ifs24035-pabwe2026-proyek1

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
