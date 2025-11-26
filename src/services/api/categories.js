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

  /**
   * Récupérer toutes les catégories (pour admin)
   * @returns {Promise<Array>} - Liste de toutes les catégories
   */
  getAllCategories: async () => {
    try {
      const response = await axiosInstance.get('/api/categories')
      return Array.isArray(response.data.categories) ? response.data.categories : []
    } catch (error) {
      throw error
    }
  },

  /**
   * Créer une nouvelle catégorie
   * @param {Object} categoryData - { name }
   * @param {string} categoryData.name - Nom de la catégorie
   * @returns {Promise<Object>} - Catégorie créée
   */
  createCategory: async (categoryData) => {
    try {
      const response = await axiosInstance.post('/api/categories', {
        name: categoryData.name.trim()
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Mettre à jour une catégorie
   * @param {number} categoryId - ID de la catégorie
   * @param {Object} categoryData - { name }
   * @returns {Promise<Object>} - Catégorie mise à jour
   */
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await axiosInstance.put(`/api/categories/${categoryId}`, {
        name: categoryData.name.trim()
      })
      return response.data
    } catch (error) {
      // Si l'endpoint PUT n'existe pas, essayer POST
      if (error.response?.status === 404 || error.response?.status === 405) {
        const response = await axiosInstance.post(`/api/categories/update/${categoryId}`, {
          name: categoryData.name.trim()
        })
        return response.data
      }
      throw error
    }
  },

  /**
   * Supprimer une catégorie
   * @param {number} categoryId - ID de la catégorie
   * @returns {Promise<void>}
   */
  deleteCategory: async (categoryId) => {
    try {
      await axiosInstance.delete(`/api/categories/${categoryId}`)
    } catch (error) {
      throw error
    }
  },
}

export default categoriesService

