/**
 * Constantes de l'application
 */
export const APP_NAME = 'Project1 Front'
export const APP_VERSION = '0.0.0'

// Configuration API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

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