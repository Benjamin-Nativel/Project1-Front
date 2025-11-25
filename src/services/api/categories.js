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
      const response = await axiosInstance.get('/api/categories')
      
      // Retourner le tableau de catégories
      return Array.isArray(response.data.categories) ? response.data.categories : []
    } catch (error) {
      throw error
    }
  },
}

export default categoriesService

