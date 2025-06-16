import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      exclude: [
        ...configDefaults.exclude,
        'e2e/**',
        'src/types/**',
        'playwright.config.ts',
        'env.d.ts',
      ],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        exclude: [
          ...configDefaults.exclude,
          'e2e/**',
          'src/types/**',
          'playwright.config.ts',
          'env.d.ts',
          'src/main.ts',
          'src/router',
        ],
      },
    },
  }),
);
