import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // Expose to the network
    port: 5173,      // Default port
    hmr: {
      host: 'ventrues.invenro.site', // Use your domain name here
      port: 443,                     // Use 443 for HTTPS or 80 for HTTP
    },
  },
});
