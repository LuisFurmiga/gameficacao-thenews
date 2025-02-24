// frontend/vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Carregar variáveis do arquivo .env
dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.VITE_PORT) || 3000,
    open: true,
  },
  define: {
    'process.env': process.env,
  },
});



