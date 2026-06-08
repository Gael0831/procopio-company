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
                        src: '/procopio_company/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/procopio_company/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    base: '/procopio_company/',
    build: {
        outDir: 'dist/procopio_company',
        emptyOutDir: true
    }
});