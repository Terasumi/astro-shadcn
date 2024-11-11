// @ts-check
import {defineConfig} from 'astro/config';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

import vercel from '@astrojs/vercel/serverless';

import node from '@astrojs/node';

import vtbot from 'astro-vtbot';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind({
      applyBaseStyles: false,
  }), vtbot(
      {
          loadingIndicator: true
      }
  )],

  image: {
      domains: ['wsrv.nl', "phimimg.com"],
  },

  output: "server",
  adapter: vercel(),
});