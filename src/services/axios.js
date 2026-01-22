import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'
import { getToken, removeToken } from '../utils/storage'

/**
 * Instance axios configurée pour l'application
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes (300 secondes) - nécessaire pour l'analyse de documents avec IA et audio
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
    
    // Si c'est un FormData, ne pas définir le Content-Type
    // Le navigateur le définira automatiquement avec le boundary approprié
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
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
        console.error('Erreur serveur:', {
          status,
          message: data?.message || data?.error || 'Une erreur est survenue sur le serveur',
          data: data,
          url: error.config?.url,
          method: error.config?.method
        })
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


