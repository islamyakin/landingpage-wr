import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  appType: "mpa",
  build: {
    rollupOptions: {
      input: {
        home: "index.html",
        harga: "harga.html",
        simulasi: "simulasi.html",
      },
    },
  },
  test: {
    // The QueueDemo tests target pure derived-value math, so no DOM is needed.
    environment: "node",
  },
});
