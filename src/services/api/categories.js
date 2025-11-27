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
   * Créer une nouvelle catégorie (admin uniquement)
   * @param {Object} categoryData - { name }
   * @param {string} categoryData.name - Nom de la catégorie
   * @returns {Promise<Object>} - Catégorie créée avec { message, category: { id, name } }
   */
  createCategory: async (categoryData) => {
    try {
      // Vérifier que les données sont valides
      if (!categoryData.name || categoryData.name.trim() === '') {
        throw new Error('Le nom de la catégorie est requis')
      }
      
      const response = await axiosInstance.post('/api/admin/category/add', {
        name: categoryData.name.trim()
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Mettre à jour une catégorie (admin uniquement)
   * @param {number} categoryId - ID de la catégorie
   * @param {Object} categoryData - { name }
   * @param {string} categoryData.name - Nouveau nom de la catégorie (optionnel)
   * @returns {Promise<Object>} - Catégorie mise à jour avec { message, category: { id, name } }
   */
  updateCategory: async (categoryId, categoryData) => {
    try {
      // Vérifier que les données sont valides si name est fourni
      if (categoryData.name !== undefined && categoryData.name !== null) {
        if (categoryData.name.trim() === '') {
          throw new Error('Le nom de la catégorie ne peut pas être vide')
        }
      }
      
      // L'API utilise PATCH pour la mise à jour
      const response = await axiosInstance.patch(`/api/admin/category/update/${categoryId}`, {
        name: categoryData.name ? categoryData.name.trim() : undefined
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Supprimer une catégorie (admin uniquement)
   * @param {number} categoryId - ID de la catégorie
   * @returns {Promise<Object>} - Réponse avec { message }
   */
  deleteCategory: async (categoryId) => {
    try {
      const response = await axiosInstance.delete(`/api/admin/category/delete/${categoryId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default categoriesService

