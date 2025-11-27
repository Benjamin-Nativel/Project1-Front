/**
 * Gestion des erreurs API personnalisées
 */

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export class NetworkError extends Error {
  constructor(message = 'Erreur de connexion réseau') {
    super(message)
    this.name = 'NetworkError'
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Non autorisé') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Ressource non trouvée') {
    super(message)
    this.name = 'NotFoundError'
  }
}

/**
 * Formater un message d'erreur pour l'affichage utilisateur
 * @param {Error} error - Erreur à formater
 * @returns {string} - Message formaté
 */
export const formatErrorMessage = (error) => {
  if (error.response) {
    const { status, data } = error.response
    
    // Messages personnalisés selon le code de statut
    switch (status) {
      case 400:
        // Gérer les différents formats de réponse Symfony
        if (data.message) {
          return data.message
        }
        if (data.error) {
          return data.error
        }
        // Gérer les détails de validation
        if (data.details && Array.isArray(data.details)) {
          return data.details.join(', ')
        }
        return 'Données invalides'
      case 409:
        // Conflit - ressource déjà existante (email, catégorie, etc.)
        if (data.message) {
          return data.message
        }
        if (data.error) {
          return data.error
        }
        return 'Cette ressource existe déjà'
      case 401:
        // Gérer les messages spécifiques de l'API Symfony
        if (data.message === 'Invalid credentials.') {
          return 'Identifiants incorrects. Vérifiez votre email et mot de passe.'
        }
        if (data.message) {
          return data.message
        }
        return 'Session expirée. Veuillez vous reconnecter.'
      case 403:
        return 'Accès interdit'
      case 404:
        return 'Ressource non trouvée'
      case 422:
        return data.message || 'Erreur de validation'
      case 500:
        return 'Erreur serveur. Veuillez réessayer plus tard.'
      default:
        // Gérer les différents formats de réponse
        if (data.message) {
          return data.message
        }
        if (data.error) {
          return data.error
        }
        return 'Une erreur est survenue'
    }
  }
  
  if (error.request) {
    return 'Impossible de contacter le serveur. Vérifiez votre connexion.'
  }
  
  return error.message || 'Une erreur inattendue est survenue'
}



