import axiosInstance from '../axios'
import { setToken, setUser, clearAuth } from '../../utils/storage'

/**
 * Service API pour l'authentification
 */
export const authService = {
  /**
   * Connexion d'un utilisateur
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} - { token, user }
   */
  login: async (credentials) => {
    try {
      console.log('Tentative de connexion:', { email: credentials.email, url: '/user/login' })
      const response = await axiosInstance.post('/user/login', credentials)
      const { token, user } = response.data
      
      // Stocker le token
      if (token) {
        setToken(token)
      }
      
      // Stocker les données utilisateur si disponibles
      if (user) {
        setUser(user)
      }
      
      return { token, user }
    } catch (error) {
      // Log détaillé pour le débogage
      if (error.response) {
        console.error('Erreur de connexion (détails):', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        })
      } else if (error.request) {
        console.error('Erreur réseau - aucune réponse du serveur:', error.request)
      } else {
        console.error('Erreur de configuration:', error.message)
      }
      // Laisser formatErrorMessage gérer le formatage des erreurs
      throw error
    }
  },

  /**
   * Inscription d'un nouvel utilisateur (création d'un client)
   * @param {Object} userData - { email, password, name }
   * @returns {Promise<Object>} - { message, client }
   */
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/user/create', userData)
      const { message, client } = response.data
      
      // Stocker les données utilisateur si disponibles
      if (client) {
        setUser(client)
      }
      
      return { message, client }
    } catch (error) {
      // Laisser formatErrorMessage gérer le formatage des erreurs
      throw error
    }
  },

  /**
   * Déconnexion de l'utilisateur
   * Supprime le token JWT du localStorage et nettoie toutes les données d'authentification
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      // Tenter de notifier le serveur de la déconnexion (optionnel)
      await axiosInstance.post('/auth/logout')
    } catch (error) {
      // Même si l'appel API échoue, on continue à nettoyer localement
      console.error('Erreur lors de la déconnexion côté serveur:', error)
    } finally {
      // Toujours supprimer le token JWT et nettoyer toutes les données d'authentification
      clearAuth()
    }
  },

  /**
   * Vérifier le token actuel
   * @returns {Promise<Object>} - { user }
   */
  verifyToken: async () => {
    try {
      const response = await axiosInstance.get('/auth/verify')
      const { user } = response.data
      
      if (user) {
        setUser(user)
      }
      
      return { user }
    } catch (error) {
      clearAuth()
      throw error
    }
  },

  /**
   * Rafraîchir le token
   * @returns {Promise<Object>} - { token }
   */
  refreshToken: async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh')
      const { token } = response.data
      
      if (token) {
        setToken(token)
      }
      
      return { token }
    } catch (error) {
      clearAuth()
      throw error
    }
  },
}

export default authService


