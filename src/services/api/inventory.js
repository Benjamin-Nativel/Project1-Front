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
      console.log('🔍 [Inventory API] Début de la requête getItems')
      console.log('📋 [Inventory API] Filtres:', filters)
      console.log('🌐 [Inventory API] URL de base:', axiosInstance.defaults.baseURL)
      console.log('🔗 [Inventory API] URL complète:', `${axiosInstance.defaults.baseURL}/api/inventories`)
      
      const response = await axiosInstance.get('/api/inventories', {
        params: filters,
      })
      
      console.log('✅ [Inventory API] Réponse reçue:')
      console.log('   Status:', response.status)
      console.log('   Headers:', response.headers)
      console.log('   Data complète:', response.data)
      console.log('   Type de data:', typeof response.data)
      console.log('   Items:', response.data.items)
      console.log('   Inventory:', response.data.inventory)
      
      // Transformer les données pour correspondre au format attendu par le frontend
      const { items, inventory } = response.data
      
      // Créer un map pour les quantités par item_id
      const quantityMap = new Map()
      if (Array.isArray(inventory)) {
        inventory.forEach(inv => {
          quantityMap.set(inv.item_id, inv.quantity)
        })
      }
      
      // Combiner les items avec leurs quantités
      const formattedItems = Array.isArray(items) ? items.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category?.name || 'Autre',
        emoji: item.img ? `📦` : '📦', // Utiliser l'image si disponible, sinon emoji par défaut
        quantity: quantityMap.get(item.id) || 0
      })) : []
      
      // Trier par quantité (décroissant : les items avec le plus de quantité en premier)
      formattedItems.sort((a, b) => b.quantity - a.quantity)
      
      console.log('📦 [Inventory API] Items formatés (triés par quantité):', formattedItems)
      console.log('   Nombre d\'items:', formattedItems.length)
      
      return formattedItems
    } catch (error) {
      console.error('❌ [Inventory API] Erreur lors de la requête:')
      console.error('   Type d\'erreur:', error.constructor.name)
      console.error('   Message:', error.message)
      
      if (error.response) {
        // La requête a été faite et le serveur a répondu avec un code d'erreur
        console.error('   Status:', error.response.status)
        console.error('   Status Text:', error.response.statusText)
        console.error('   Headers:', error.response.headers)
        console.error('   Data:', error.response.data)
        console.error('   URL:', error.config?.url)
        console.error('   Base URL:', error.config?.baseURL)
        console.error('   URL complète:', `${error.config?.baseURL}${error.config?.url}`)
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        console.error('   Aucune réponse reçue du serveur')
        console.error('   Request:', error.request)
        console.error('   URL:', error.config?.url)
        console.error('   Base URL:', error.config?.baseURL)
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error('   Erreur de configuration:', error.message)
      }
      
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
   * Ajouter un item à l'inventaire
   * @param {Object} itemData - { itemId, quantity }
   * @returns {Promise<Object>} - Inventory créé ou mis à jour
   */
  addItem: async (itemData) => {
    try {
      console.log('➕ [Inventory API] Ajout d\'item:', itemData)
      const response = await axiosInstance.post('/api/inventories/add', {
        itemId: itemData.itemId || itemData.id,
        quantity: itemData.quantity
      })
      console.log('✅ [Inventory API] Item ajouté:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ [Inventory API] Erreur lors de l\'ajout:', error)
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
   * Retirer une quantité d'un item de l'inventaire
   * @param {string|number} itemId - ID de l'item
   * @param {number} quantity - Quantité à retirer
   * @returns {Promise<Object>} - Inventory mis à jour
   */
  removeQuantity: async (itemId, quantity) => {
    try {
      console.log('➖ [Inventory API] Retrait de quantité:', { itemId, quantity })
      const response = await axiosInstance.post('/api/inventories/remove', {
        itemId,
        quantity
      })
      console.log('✅ [Inventory API] Quantité retirée:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ [Inventory API] Erreur lors du retrait:', error)
      throw error
    }
  },
}

export default inventoryService


