import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import process from "process";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [vue(), tailwindcss()],
    server: { port: Number(env.APP_PORT) || 3000 },
    preview: { port: Number(env.APP_PORT) || 3000 },
    test: {
      globals: true,
      environment: "jsdom",
      coverage: {
        provider: "v8",
        reporter: ["text", "html", "lcov", "json-summary"],
        include: ["src/**/*.{js,vue}"],
        exclude: ["src/main.js", "src/**/*.test.js"],
        thresholds: { statements: 85, branches: 75, functions: 80, lines: 85 },
      },
    },
  };
});