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
