import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'favicon.svg',
                'icons.svg'
            ],
            manifest: {
                name: 'Procopio Company',
                short_name: 'Procopio',
                description: 'Sistema Integral de Gestión Agrícola',
                theme_color: '#166534',
                background_color: '#ecfdf5',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/procopio_company/',
                scope: '/procopio_company/',
                icons: [
                    {
                        src: '/procopio_company/favicon.svg',
                        sizes: '192x192',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    },
                    {
                        src: '/procopio_company/icons.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],
    base: '/procopio_company'
});