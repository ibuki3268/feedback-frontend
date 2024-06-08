import { vitePlugin as remix, cloudflareDevProxyVitePlugin } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [cloudflareDevProxyVitePlugin(), remix(), tsconfigPaths()],
  define: {
    'process.env': {
      VITE_PASSWORD: JSON.stringify(process.env.VITE_REMIX_PASSWORD),
    },
  },
});
