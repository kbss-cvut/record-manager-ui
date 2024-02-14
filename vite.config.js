import simpleHtmlPlugin from "vite-plugin-simple-html";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  build: {
    // Relative to the root
    outDir: "../dist",
  },
  plugins: [
    simpleHtmlPlugin({
      inject: {
        data: {
          title:
            import.meta.env === "production" ? "Production site" : `My site [${import.meta.env.toUpperCase()}]`,
        },
      },
    }),
  ],
});
