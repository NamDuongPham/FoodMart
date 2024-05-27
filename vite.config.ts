import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
const SRC_DIR = path.resolve(__dirname, "./src");
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": SRC_DIR,
    },
  },
});
