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
}


