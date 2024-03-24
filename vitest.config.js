import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  {
    ...viteConfig,
  },
  defineConfig({
    test: {
      open: true,
      environment: "jsdom",
      globals: true,
      setupFiles: ["./tests/setup.js"],
      pool: "vmForks", // Pool used to run tests in.
      poolOptions: {
        vmForks: {
          singleFork: true,
        },
      },
      server: {
        deps: {
          inline: ["@kbss-cvut/s-forms"],
        },
      },
      // Vitest  "deps.inline" is deprecated. If you rely on vite-node directly, use "server.deps.inline" instead. Otherwise, consider using "deps.optimizer.web.include"
    },
  }),
);
