// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://saambaat.github.io',
  base: '/fansign',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
