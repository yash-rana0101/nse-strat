// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.stratai.live',
  integrations: [
    react(),
    mdx(),
    sitemap({
      // /pricing is hidden until launch (see SHOW_PRICING in
      // src/constants/launch.ts). Remove that check when pricing returns.
      filter: (page) =>
        !page.includes('/_download') && !page.endsWith('/pricing'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  output: 'static',

  trailingSlash: 'never',

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});
