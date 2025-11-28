import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 1. This ensures your app finds its files on GitHub Pages
  base: "/DI_Management/", 
  
  build: {
    // 2. Increase the warning limit to silence the warning
    chunkSizeWarningLimit: 1000,
    
    // 3. Split the code into smaller files (Vendor vs App)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})