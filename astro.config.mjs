// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://saambaat.github.io',
  base: '/ssszip',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  i18n: {
    locales: ['en', 'ko', 'zh'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
