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
        service: {
            entrypoint: '@astrojs/vercel/image-service'
        }
    },
    output: "server",
    adapter: vercel(
        {
            webAnalytics: {
                enabled: true,
            },
            // Enable edge middleware for better performance
            edgeMiddleware: true,
            // Optimize ISR caching - longer cache for better performance
            isr: {
                // caches all pages on first request and saves for 12 hours
                expiration: 60 * 60 * 12,

                // exclude: ['/'], // Loại trừ trang chủ khỏi ISR
            },
            // Enable Vercel Image Optimization API
            imageService: true,
            imagesConfig: {
                sizes: [320, 640, 960, 1280, 1920],
                formats: ['image/webp', 'image/avif'],
                minimumCacheTTL: 86400, // 24 hours
            },
            // Extend function timeout for API calls
            maxDuration: 30,
        }
    ),
});