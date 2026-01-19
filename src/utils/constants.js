/**
 * Constantes de l'application
 */
export const APP_NAME = 'Project1 Front'
export const APP_VERSION = '0.0.0'

// Configuration API
// En développement, utilise une URL vide pour passer par le proxy Vite
// En production, utilise l'URL du backend ou la variable d'environnement
// Si VITE_API_BASE_URL est défini, il sera utilisé (priorité)
// Sinon, en développement on utilise '' (proxy Vite), en production 'http://localhost:8000'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? '' : 'http://localhost:8000')

// Log pour debug (uniquement en développement)
if (import.meta.env.DEV) {
  console.log('🔧 Configuration API:', {
    API_BASE_URL,
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    viteApiBaseUrl: import.meta.env.VITE_API_BASE_URL
  })
}

/**
 * Construit l'URL complète d'une image d'item
 * @param {string|null|undefined} imageName - Nom du fichier image (ex: "apples-647df8a.jpg")
 * @returns {string|null} URL complète de l'image ou null si pas d'image
 */
export const getItemImageUrl = (imageName) => {
  if (!imageName) return null
  // Les images sont stockées dans public/uploads/items/
  return `${API_BASE_URL}/uploads/items/${imageName}`
}