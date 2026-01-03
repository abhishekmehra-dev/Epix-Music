import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Use '.' instead of process.cwd() to resolve the environment directory without relying on global process types
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    define: {
      // This allows the app to use process.env.API_KEY in the browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    server: {
      port: 3000,
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});