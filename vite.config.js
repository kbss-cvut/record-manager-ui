import simpleHtmlPlugin from "vite-plugin-simple-html";
import { defineConfig, loadEnv } from "vite";
import pluginReact from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: "",
    root: "src",
    build: {
      // Relative to the root
      outDir: "../dist",
    },
    server: {
      port: 3000,
    },
    plugins: [
      pluginReact(),
      simpleHtmlPlugin({
        inject: {
          data: {
            title:
              import.meta.env === "production"
                ? "Record manager"
                : "Dev record manager",
          },
        },
      }),
    ],
    define: {
      "process.env.PARSE_LINK_HEADER_MAXLEN": JSON.stringify(
        env.PARSE_LINK_HEADER_MAXLEN
      ),
      "process.env.PARSE_LINK_HEADER_THROW_ON_MAXLEN_EXCEEDED": JSON.stringify(
        env.PARSE_LINK_HEADER_THROW_ON_MAXLEN_EXCEEDED
      ),
      "import.meta.env.RECORD_MANAGER_API_URL": JSON.stringify(env.VITE_RECORD_MANAGER_API_URL),
      "import.meta.env.RECORD_MANAGER_APP_TITLE": JSON.stringify(env.VITE_RECORD_MANAGER_APP_TITLE),
      "import.meta.env.RECORD_MANAGER_DEV_SERVER_PORT": JSON.stringify(env.VITE_RECORD_MANAGER_DEV_SERVER_PORT),
      "import.meta.env.RECORD_MANAGER_PROD_SERVER_PORT": JSON.stringify(env.VITE_RECORD_MANAGER_PROD_SERVER_PORT),
      "import.meta.env.RECORD_MANAGER_LANGUAGE": JSON.stringify(env.VITE_RECORD_MANAGER_LANGUAGE),
      "import.meta.env.RECORD_MANAGER_NAVIGATOR_LANGUAGE": JSON.stringify(env.VITE_RECORD_MANAGER_NAVIGATOR_LANGUAGE),
      "import.meta.env.RECORD_MANAGER_BASENAME": JSON.stringify(env.VITE_RECORD_MANAGER_BASENAME),
      "import.meta.env.RECORD_MANAGER_EXTENSIONS": JSON.stringify(env.VITE_RECORD_MANAGER_EXTENSIONS),
      "import.meta.env.RECORD_MANAGER_AUTHENTICATION": JSON.stringify(env.VITE_RECORD_MANAGER_AUTHENTICATION),
      "import.meta.env.RECORD_MANAGER_AUTH_SERVER_URL": JSON.stringify(env.VITE_RECORD_MANAGER_AUTH_SERVER_URL),
      "import.meta.env.RECORD_MANAGER_AUTH_CLIENT_ID": JSON.stringify(env.VITE_RECORD_MANAGER_AUTH_CLIENT_ID)
    },
  };
});
