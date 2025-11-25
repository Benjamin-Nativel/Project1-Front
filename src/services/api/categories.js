import axiosInstance from '../axios'

/**
 * Service API pour la gestion des catégories
 */
export const categoriesService = {
  /**
   * Récupérer toutes les catégories
   * @returns {Promise<Array>} - Liste des catégories
   */
  getCategories: async () => {
    try {
      console.log('🔍 [Categories API] Début de la requête getCategories')
      console.log('🌐 [Categories API] URL de base:', axiosInstance.defaults.baseURL)
      console.log('🔗 [Categories API] URL complète:', `${axiosInstance.defaults.baseURL}/api/categories`)
      
      const response = await axiosInstance.get('/api/categories')
      
      console.log('✅ [Categories API] Réponse reçue:')
      console.log('   Status:', response.status)
      console.log('   Data complète:', response.data)
      console.log('   Categories:', response.data.categories)
      console.log('   Count:', response.data.count)
      
      // Retourner le tableau de catégories
      return Array.isArray(response.data.categories) ? response.data.categories : []
    } catch (error) {
      console.error('❌ [Categories API] Erreur lors de la requête:')
      console.error('   Type d\'erreur:', error.constructor.name)
      console.error('   Message:', error.message)
      
      if (error.response) {
        console.error('   Status:', error.response.status)
        console.error('   Status Text:', error.response.statusText)
        console.error('   Data:', error.response.data)
        console.error('   URL:', error.config?.url)
        console.error('   Base URL:', error.config?.baseURL)
        console.error('   URL complète:', `${error.config?.baseURL}${error.config?.url}`)
      } else if (error.request) {
        console.error('   Aucune réponse reçue du serveur')
        console.error('   Request:', error.request)
        console.error('   URL:', error.config?.url)
        console.error('   Base URL:', error.config?.baseURL)
      } else {
        console.error('   Erreur de configuration:', error.message)
      }
      
      throw error
    }
  },
}

export default categoriesService

