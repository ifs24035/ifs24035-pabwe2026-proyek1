import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import process from "process";

// Sisipkan CSS entry langsung ke index.html agar tidak ada request CSS yang memblokir render
function inlineEntryCss() {
  return {
    name: "inline-entry-css",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const bundle = ctx && ctx.bundle;
        if (!bundle) return html;
        return html.replace(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g, (tag, href) => {
          const asset = bundle[href.replace(/^\//, "")];
          if (!asset || asset.type !== "asset") return tag;
          const css = typeof asset.source === "string" ? asset.source : new TextDecoder().decode(asset.source);
          return `<style>${css}</style>`;
        });
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [vue(), tailwindcss(), inlineEntryCss()],
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