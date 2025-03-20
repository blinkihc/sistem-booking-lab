import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/sistem-booking-lab/', // Tambahkan base URL sesuai nama repository,
  server: {
    port: 3000,
    strictPort: false,
    open: true
  }
})