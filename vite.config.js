import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico'],

            // --- MANIFEST (Identité de l'app) ---
            // Je laisse cette partie car elle est obligatoire pour l'installation
            manifest: {
                name: 'RecipGen',
                short_name: 'GenCipe',
                description: 'Générez des recettes intelligentes avec vos ingrédients',
                theme_color: '#10b981',
                background_color: '#f8fafc',
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    {
                        src: '/icon/64x64.png',
                        sizes: '64x64',
                        type: 'image/png'
                    },
                    {
                        src: '/icon/144x144.png',
                        sizes: '144x144',
                        type: 'image/png'
                    },
                    {
                        src: '/icon/192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/icon/512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ]
            },

            // --- MODE DEV ---
            devOptions: {
                enabled: true,
                type: 'module',
            }
        })
    ],
    server: {
        host: '0.0.0.0', // Permet les connexions depuis n'importe quelle interface réseau (nécessaire pour ngrok)
        port: 5173,
        strictPort: true,
        allowedHosts: true, // Autorise tous les hôtes (nécessaire pour ngrok)
        proxy: {
            // Proxy pour toutes les routes backend (API, auth, uploads, etc.)
            // Redirige toutes les requêtes vers le backend Symfony sur le port 8000
            '^/(api|user|auth|uploads)': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false
            }
        }
    }
})