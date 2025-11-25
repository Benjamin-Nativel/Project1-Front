import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'
import { getToken, removeToken } from '../utils/storage'

/**
 * Instance axios configurée pour l'application
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 secondes
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Intercepteur de requête : ajoute le token d'authentification
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Intercepteur de réponse : gère les erreurs globales
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Gestion des erreurs HTTP
    if (error.response) {
      const { status, data } = error.response
      
      // Erreur 401 : Non autorisé - déconnexion
      if (status === 401) {
        removeToken()
        // Rediriger vers la page de connexion si on n'y est pas déjà
        if (window.location.pathname !== '/connexion') {
          window.location.href = '/connexion'
        }
      }
      
      // Erreur 403 : Accès interdit
      if (status === 403) {
        console.error('Accès interdit:', data.message || 'Vous n\'avez pas les permissions nécessaires')
      }
      
      // Erreur 404 : Ressource non trouvée
      if (status === 404) {
        console.error('Ressource non trouvée:', data.message || 'La ressource demandée n\'existe pas')
      }
      
      // Erreur 500 : Erreur serveur
      if (status >= 500) {
        console.error('Erreur serveur:', data.message || 'Une erreur est survenue sur le serveur')
      }
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Erreur réseau:', 'Impossible de contacter le serveur')
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur de configuration:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default axiosInstance


