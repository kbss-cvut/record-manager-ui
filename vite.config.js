import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import eslintPlugin from "vite-plugin-eslint";

dotenv.config();

export default defineConfig({
  base: "",
  root: "",
  envPrefix: "RECORD_MANAGER_",
  plugins: [
    react(),
    eslintPlugin({
      cache: false, // disable eslint cache to avoid conflicts
    }),
  ],
  build: {
    sourcemap: true,
    emptyOutDir: true,
  },
  define: {
    "process.env": process.env, // workaround for parse-link-header library that depends on 2 vars defined in `process.env`, see https://github.com/thlorenz/parse-link-header/issues/31
  },
});
