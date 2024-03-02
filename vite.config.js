import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  base: "",
  root: "",
  envPrefix: "RECORD_MANAGER_",
  plugins: [react()],
  build: {
    sourcemap: true,
    emptyOutDir: true,
  },
  define: {
    "process.env": process.env, // workaround for parse-link-header library that depends on 2 vars defined in `process.env`, see https://github.com/thlorenz/parse-link-header/issues/31
  }
});
