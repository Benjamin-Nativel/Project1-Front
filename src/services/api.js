import { API_BASE_URL } from '../utils/constants'

/**
 * Service API pour les appels HTTP
 * Exemple d'implémentation d'un service API
 */

/**
 * Fonction utilitaire pour faire des requêtes API
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erreur API:', error)
    throw error
  }
}

/**
 * Exemples de méthodes API
 */
export const apiService = {
  get: (endpoint) => fetchAPI(endpoint, { method: 'GET' }),
  post: (endpoint, data) => fetchAPI(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  put: (endpoint, data) => fetchAPI(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  delete: (endpoint) => fetchAPI(endpoint, { method: 'DELETE' }),
}

export default apiService
