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
      cache: false,
    }),
  ],
  build: {
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      onwarn: (warning, defaultHandler) => {
        // TODO: remove isFromKbssCvutPackageWarning and solve the root cause, see https://github.com/kbss-cvut/record-manager-ui/issues/113
        const isFromKbssCvutPackageWarning =
          warning.code === "EVAL" && warning.message.includes("node_modules/store/plugins/lib/json2.js");
        const isRollupPureAnnotationWarning =
          warning.code === "INVALID_ANNOTATION" && warning.message.includes("*#__PURE__*");
        if (isFromKbssCvutPackageWarning || isRollupPureAnnotationWarning) {
          return;
        }
        defaultHandler(warning);
      },
    },
    cssMinify: false,
  },
  define: {
    "process.env": process.env, // workaround for parse-link-header library that depends on 2 vars defined in `process.env`, see https://github.com/thlorenz/parse-link-header/issues/31
  },
  resolve: {
    alias: {
      querystring: "querystring-es3",
      url: "url-parse",
    },
  },
});
