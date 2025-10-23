// @ts-check
import {defineConfig} from 'astro/config';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

import vercel from '@astrojs/vercel';

// import node from '@astrojs/node';

// import vtbot from 'astro-vtbot';

// https://astro.build/config
export default defineConfig({
    prefetch: true,
    integrations: [react(),
        tailwind({
            applyBaseStyles: false,
        }),
        // vtbot(
        //     {
        //         loadingIndicator: true,
        //         autoLint: true,
        //     }
        // ),
    ],
    image: {
        domains: ['wsrv.nl', "phimimg.com"],
    },
    output: "server",
    adapter: vercel(
        {
            webAnalytics: {
                enabled: true,
            },

            isr: {
                // caches all pages on first request and saves for 6 hours
                expiration: 60 * 60 * 6,
                // exclude: ['/'], // Loại trừ trang chủ khỏi ISR
            },
        }
    ),
});
