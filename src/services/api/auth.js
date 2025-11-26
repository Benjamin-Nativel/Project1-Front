import axiosInstance from '../axios'
import { setToken, setUser, clearAuth } from '../../utils/storage'

/**
 * Service API pour l'authentification
 */
export const authService = {
  /**
   * Connexion d'un utilisateur
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} - { token }
   */
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/user/login', credentials)
      const { token } = response.data
      
      // Stocker le token
      if (token) {
        setToken(token)
      }
      
      return { token }
    } catch (error) {
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
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout')
    } catch (error) {
      // Même en cas d'erreur, on nettoie le localStorage
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
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


