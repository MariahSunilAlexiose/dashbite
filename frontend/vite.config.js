import path from "path"

import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@icons": path.resolve(__dirname, "./src/assets/icons"),
      "@img": path.resolve(__dirname, "./src/assets/images"),
      "@cmp": path.resolve(__dirname, "./src/components"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@providers": path.resolve(__dirname, "./src/providers"),
      "@sections": path.resolve(__dirname, "./src/sections"),
      "@pages": path.resolve(__dirname, "./src/pages"),
    },
  },
})
