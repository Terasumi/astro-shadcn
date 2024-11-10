// @ts-check
import {defineConfig} from 'astro/config';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

import vercel from '@astrojs/vercel/serverless';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind({
      applyBaseStyles: false,
  }),],

  image: {
      domains: ['wsrv.nl', "phimimg.com"],
  },

  output: "server",
  adapter: node({
    mode: 'standalone',
  }),
});