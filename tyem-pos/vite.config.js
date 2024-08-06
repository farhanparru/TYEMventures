import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // Expose to the network
    port: 5173,      // Default port
    hmr: {
      host: 'ventrues.invenro.site', // Set the correct host for HMR
      port: 443,                     // Use port 443 if your site is served over HTTPS
      protocol: 'wss',               // Use WebSocket Secure (wss) if your site uses HTTPS
    },
  },
});