/**
 * Fonctions utilitaires
 * Export centralisé des fonctions utilitaires
 */

// Exemple de fonction utilitaire
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

// Exemple de fonction de validation
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Formate un timestamp en "Il y a X heures/jours"
 * @param {number} timestamp - Timestamp Unix en secondes
 * @returns {string} - Texte formaté (ex: "Il y a 2 heures")
 */
export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Récemment'
  
  const now = Math.floor(Date.now() / 1000) // Timestamp actuel en secondes
  const diff = now - timestamp // Différence en secondes
  
  if (diff < 60) {
    return 'Il y a moins d\'une minute'
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60)
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600)
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
  } else {
    const days = Math.floor(diff / 86400)
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`
  }
}

/**
 * Transforme une recette de l'API au format attendu par les composants
 * @param {Object} apiRecipe - Recette au format API
 * @param {boolean} isFavorited - Si la recette est en favoris (optionnel, défaut: false)
 * @returns {Object} - Recette au format composant
 */
export const transformRecipeFromAPI = (apiRecipe, isFavorited = false) => {
  return {
    id: apiRecipe.id,
    name: apiRecipe.name,
    description: apiRecipe.description,
    preparation_time_minutes: apiRecipe.preparation_time,
    ingredients: apiRecipe.ingredients || [],
    steps: apiRecipe.steps || [],
    image: apiRecipe.image || null,
    author: {
      id: apiRecipe.author?.id,
      name: apiRecipe.author?.name || 'Utilisateur',
      timeAgo: formatTimeAgo(apiRecipe.date),
    },
    createdAt: formatTimeAgo(apiRecipe.date),
    isFavorited,
    favoritesCount: 0, // L'API ne fournit pas cette info, on met 0 par défaut
    matching: apiRecipe.matching,
    date: apiRecipe.date,
  }
}