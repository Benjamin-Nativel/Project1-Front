/**
 * Gestion du stockage local (localStorage)
 */

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'user_data'

/**
 * Token d'authentification
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Données utilisateur
 */
export const getUser = () => {
  const userData = localStorage.getItem(USER_KEY)
  return userData ? JSON.parse(userData) : null
}

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const removeUser = () => {
  localStorage.removeItem(USER_KEY)
}

/**
 * Nettoyer toutes les données d'authentification
 */
export const clearAuth = () => {
  removeToken()
  removeUser()
  // Nettoyer aussi le cache de l'inventaire et des catégories lors de la déconnexion
  clearInventoryCache()
  clearCategoriesCache()
}

/**
 * Cache de l'inventaire
 */
const INVENTORY_CACHE_KEY = 'inventory_cache'
const INVENTORY_CACHE_TIMESTAMP_KEY = 'inventory_cache_timestamp'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const getInventoryCache = () => {
  const cacheData = localStorage.getItem(INVENTORY_CACHE_KEY)
  const timestamp = localStorage.getItem(INVENTORY_CACHE_TIMESTAMP_KEY)
  
  if (!cacheData || !timestamp) {
    return null
  }
  
  const now = Date.now()
  const cacheAge = now - parseInt(timestamp, 10)
  
  // Vérifier si le cache est encore valide
  if (cacheAge > CACHE_DURATION) {
    clearInventoryCache()
    return null
  }
  
  try {
    return JSON.parse(cacheData)
  } catch (error) {
    clearInventoryCache()
    return null
  }
}

export const setInventoryCache = (data) => {
  try {
    localStorage.setItem(INVENTORY_CACHE_KEY, JSON.stringify(data))
    localStorage.setItem(INVENTORY_CACHE_TIMESTAMP_KEY, Date.now().toString())
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du cache inventaire:', error)
  }
}

export const clearInventoryCache = () => {
  localStorage.removeItem(INVENTORY_CACHE_KEY)
  localStorage.removeItem(INVENTORY_CACHE_TIMESTAMP_KEY)
}

/**
 * Cache des catégories
 */
const CATEGORIES_CACHE_KEY = 'categories_cache'
const CATEGORIES_CACHE_TIMESTAMP_KEY = 'categories_cache_timestamp'
const CATEGORIES_CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

export const getCategoriesCache = () => {
  const cacheData = localStorage.getItem(CATEGORIES_CACHE_KEY)
  const timestamp = localStorage.getItem(CATEGORIES_CACHE_TIMESTAMP_KEY)
  
  if (!cacheData || !timestamp) {
    return null
  }
  
  const now = Date.now()
  const cacheAge = now - parseInt(timestamp, 10)
  
  // Vérifier si le cache est encore valide
  if (cacheAge > CATEGORIES_CACHE_DURATION) {
    clearCategoriesCache()
    return null
  }
  
  try {
    return JSON.parse(cacheData)
  } catch (error) {
    clearCategoriesCache()
    return null
  }
}

export const setCategoriesCache = (data) => {
  try {
    localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(data))
    localStorage.setItem(CATEGORIES_CACHE_TIMESTAMP_KEY, Date.now().toString())
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du cache catégories:', error)
  }
}

export const clearCategoriesCache = () => {
  localStorage.removeItem(CATEGORIES_CACHE_KEY)
  localStorage.removeItem(CATEGORIES_CACHE_TIMESTAMP_KEY)
}


