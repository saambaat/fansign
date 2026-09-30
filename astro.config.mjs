// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const site = 'https://saambaat.github.io';
const base = '/ssszzip';
const homeUrl = new URL(`${base}/`, site).href;
/** @param {string} url */
const withoutTrailingSlash = (url) => (url === homeUrl ? url.slice(0, -1) : url);

export default defineConfig({
  site,
  base,
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
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ko: 'ko', zh: 'zh' },
      },
      filter: (page) => !page.includes('/search'),
      serialize: (item) => ({
        ...item,
        url: withoutTrailingSlash(item.url),
        links: item.links?.map((link) => ({ ...link, url: withoutTrailingSlash(link.url) })),
      }),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
