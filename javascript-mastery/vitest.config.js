import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.{problem,solution}.js'],
    globals: true,
    environment: 'node',
    testTimeout: 5000,
    hookTimeout: 5000,
  },
});
