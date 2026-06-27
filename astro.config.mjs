import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

const BUILD_DATE = new Date().toISOString();

export default defineConfig({
  site: 'https://inbrowser.sh',
  integrations: [
    preact({ compat: false }),
    tailwind({ applyBaseStyles: false }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(BUILD_DATE),
      serialize(item) {
        // Boost home/index pages, leave tool pages at default
        if (item.url === 'https://inbrowser.sh/') item.priority = 1.0;
        else if (item.url === 'https://inbrowser.sh/tools/') item.priority = 0.9;
        return item;
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    ssr: {
      noExternal: ['lucide-preact'],
    },
  },
});
