import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    experimentalStudio: true,
    experimentalRunAllSpecs: true,
    baseUrl: 'http://localhost:4200',
  },
});
