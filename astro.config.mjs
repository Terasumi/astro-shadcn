// @ts-check
import {defineConfig} from 'astro/config';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

import vercel from '@astrojs/vercel';

// import node from '@astrojs/node';

// import vtbot from 'astro-vtbot';

// https://astro.build/config
export default defineConfig({
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'hover'
    },
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
        // Enable Vercel Image Optimization
    },
    output: "server",
    adapter: vercel(
        {
            webAnalytics: {
                enabled: false,
            },
            // Enable edge middleware for better performance
            edgeMiddleware: false,
            // Optimize ISR caching - longer cache for better performance
            isr: {
                // caches all pages on first request and saves for 12 hours
                expiration: 60 * 60 * 12,
            },
            // Enable Vercel Image Optimization API
            imageService: false,
            // Extend function timeout for API calls
            maxDuration: 30,
        }
    ),
});