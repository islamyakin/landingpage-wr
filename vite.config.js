import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // The QueueDemo tests target pure derived-value math, so no DOM is needed.
    environment: "node",
  },
});
