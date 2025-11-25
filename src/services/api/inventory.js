import axiosInstance from '../axios'

/**
 * Service API pour la gestion de l'inventaire
 */
export const inventoryService = {
  /**
   * Récupérer tous les items de l'inventaire
   * @param {Object} filters - { category, search }
   * @returns {Promise<Array>} - Liste des items
   */
  getItems: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/inventory', {
        params: filters,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Récupérer un item par son ID
   * @param {string|number} itemId - ID de l'item
   * @returns {Promise<Object>} - Item
   */
  getItem: async (itemId) => {
    try {
      const response = await axiosInstance.get(`/inventory/${itemId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Ajouter un nouvel item à l'inventaire
   * @param {Object} itemData - { name, quantity, category, emoji }
   * @returns {Promise<Object>} - Item créé
   */
  addItem: async (itemData) => {
    try {
      const response = await axiosInstance.post('/inventory', itemData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Mettre à jour un item
   * @param {string|number} itemId - ID de l'item
   * @param {Object} itemData - Données à mettre à jour
   * @returns {Promise<Object>} - Item mis à jour
   */
  updateItem: async (itemId, itemData) => {
    try {
      const response = await axiosInstance.put(`/inventory/${itemId}`, itemData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Supprimer un item
   * @param {string|number} itemId - ID de l'item
   * @returns {Promise<void>}
   */
  deleteItem: async (itemId) => {
    try {
      await axiosInstance.delete(`/inventory/${itemId}`)
    } catch (error) {
      throw error
    }
  },

  /**
   * Mettre à jour la quantité d'un item
   * @param {string|number} itemId - ID de l'item
   * @param {number} quantity - Nouvelle quantité
   * @returns {Promise<Object>} - Item mis à jour
   */
  updateQuantity: async (itemId, quantity) => {
    try {
      const response = await axiosInstance.patch(`/inventory/${itemId}/quantity`, {
        quantity,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default inventoryService


