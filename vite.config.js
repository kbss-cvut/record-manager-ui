/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import eslintPlugin from "vite-plugin-eslint";
import { resolve } from "path";
import { readFileSync } from "fs";

dotenv.config();

function loadEnv(mode) {
  const envPath = resolve(process.cwd(), `.env.${mode}`);
  const envContent = readFileSync(envPath, "utf-8");
  const env = dotenv.parse(envContent);
  return env;
}

export default ({ mode }) => {
  const env = loadEnv(mode);

  return defineConfig({
    base: env.RECORD_MANAGER_BASENAME,
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
          // TODO: workaround for dangerous use of eval method that should be solved in SForms library issue https://github.com/kbss-cvut/s-forms/issues/283
          const isFromKbssCvutPackageWarning =
            warning.code === "EVAL" && warning.message.includes("node_modules/store/plugins/lib/json2.js");
          // TODO: Rollup Pure Annotation warning should be resolved by https://github.com/kbss-cvut/s-forms/issues/282
          const isRollupPureAnnotationWarning =
            warning.code === "INVALID_ANNOTATION" && warning.message.includes("*#__PURE__*");
          if (isFromKbssCvutPackageWarning || isRollupPureAnnotationWarning) {
            return;
          }
          defaultHandler(warning);
        },
      },
      cssMinify: false, // TODO: workaround for CSS syntax error from SForms library that should be resolved by https://github.com/kbss-cvut/s-forms/issues/283
    },
    define: {
      "process.env": process.env, // workaround for parse-link-header library that depends on 2 vars defined in `process.env`, see https://github.com/thlorenz/parse-link-header/issues/31
    },
    resolve: {
      alias: {
        querystring: "querystring-es3", // workaround for parse-link-header library that replaces nodejs builtin module with the module adapted for browser
        url: "url-parse", // workaround for parse-link-header library that replaces nodejs builtin module with the module adapted for browser
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./tests/setup.js"],
      server: {
        deps: {
          inline: ["@kbss-cvut/s-forms"],
        },
      },
    },
  });
};
