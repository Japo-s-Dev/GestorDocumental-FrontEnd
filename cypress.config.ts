import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200', // Cambia el puerto si es necesario
    setupNodeEvents(on, config) {
      // Implementa otros eventos si es necesario
    },
  },
});
