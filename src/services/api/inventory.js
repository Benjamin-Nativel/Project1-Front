import axiosInstance from '../axios'
import { getItemImageUrl } from '../../utils/constants'

/**
 * Service API pour la gestion de l'inventaire
 */
export const inventoryService = {
  /**
   * Récupérer tous les items de l'inventaire (tous les ingrédients + inventaire)
   * @param {Object} filters - { category, search }
   * @returns {Promise<Array>} - Liste de tous les items avec leurs quantités
   */
  getItems: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/api/inventories', {
        params: filters,
      })
      
      // Transformer les données pour correspondre au format attendu par le frontend
      // Utiliser tous les items (pas seulement client_items)
      const { items, inventory } = response.data
      
      // Créer un map pour les quantités par item_id
      const quantityMap = new Map()
      if (Array.isArray(inventory)) {
        inventory.forEach(inv => {
          quantityMap.set(inv.item_id, inv.quantity)
        })
      }
      
      // Combiner tous les items avec leurs quantités
      const formattedItems = Array.isArray(items) ? items.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category?.name || 'Autre',
        emoji: '📦', // Emoji par défaut (utilisé comme fallback si pas d'image)
        img: item.img || null, // Nom du fichier image (ex: "apples-647df8a.jpg")
        imgUrl: getItemImageUrl(item.img), // URL complète de l'image ou null
        quantity: quantityMap.get(item.id) || 0
      })) : []
      
      // Trier par quantité (décroissant : les items avec le plus de quantité en premier)
      formattedItems.sort((a, b) => b.quantity - a.quantity)
      
      return formattedItems
    } catch (error) {
      throw error
    }
  },

  /**
   * Récupérer uniquement les items créés par l'utilisateur (client_items)
   * client_items est un tableau d'IDs qui correspond aux items de la liste d'origine
   * @param {Object} filters - { category, search }
   * @returns {Promise<Array>} - Liste des items créés par l'utilisateur avec leurs quantités
   */
  getClientItems: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/api/inventories', {
        params: filters,
      })
      
      // Transformer les données pour correspondre au format attendu par le frontend
      // client_items est un tableau d'IDs, pas un tableau d'objets complets
      const { items, client_items, inventory } = response.data
      
      // Créer un Set pour une recherche rapide des IDs de client_items
      const clientItemsIds = new Set()
      if (Array.isArray(client_items)) {
        client_items.forEach(id => {
          clientItemsIds.add(id)
        })
      }
      
      // Créer un map pour les quantités par item_id
      const quantityMap = new Map()
      if (Array.isArray(inventory)) {
        inventory.forEach(inv => {
          quantityMap.set(inv.item_id, inv.quantity)
        })
      }
      
      // Filtrer les items pour ne garder que ceux dont l'ID est dans client_items
      // Retourner tous les items dans client_items (même ceux avec quantité 0)
      const formattedItems = Array.isArray(items) 
        ? items
            .filter(item => clientItemsIds.has(item.id))
            .map(item => ({
              id: item.id,
              name: item.name,
              category: item.category?.name || 'Autre',
              emoji: '📦', // Emoji par défaut (utilisé comme fallback si pas d'image)
              img: item.img || null, // Nom du fichier image (ex: "apples-647df8a.jpg")
              imgUrl: getItemImageUrl(item.img), // URL complète de l'image ou null
              quantity: quantityMap.get(item.id) || 0
            }))
        : []
      
      // Trier par quantité (décroissant : les items avec le plus de quantité en premier)
      formattedItems.sort((a, b) => b.quantity - a.quantity)
      
      return formattedItems
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
   * Ajouter un item à l'inventaire
   * @param {Object} itemData - { itemId, quantity }
   * @returns {Promise<Object>} - Inventory créé ou mis à jour
   */
  addItem: async (itemData) => {
    try {
      const response = await axiosInstance.post('/api/inventories/add', {
        itemId: itemData.itemId || itemData.id,
        quantity: itemData.quantity
      })
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
   * Retirer une quantité d'un item de l'inventaire
   * @param {string|number} itemId - ID de l'item
   * @param {number} quantity - Quantité à retirer
   * @returns {Promise<Object>} - Inventory mis à jour
   */
  removeQuantity: async (itemId, quantity) => {
    try {
      const response = await axiosInstance.post('/api/inventories/remove', {
        itemId,
        quantity
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Analyser un document (image ou PDF) pour extraire des ingrédients
   * @param {File} document - Fichier image ou PDF à analyser
   * @returns {Promise<Object>} - { ingredients: Array } Liste des ingrédients détectés
   */
  analyzeDocument: async (document) => {
    try {
      const formData = new FormData()
      formData.append('document', document)
      
      // Timeout de 5 minutes pour tous les types de fichiers
      // Les fichiers audio et les images complexes peuvent nécessiter beaucoup de temps pour l'analyse
      const timeout = 300000 // 5 minutes (300 secondes) pour tous les fichiers
      
      console.log('📤 Envoi du document pour analyse:', {
        fileName: document.name,
        fileSize: document.size,
        fileType: document.type,
        url: '/api/inventories/add-by-doc',
        timeout: `${timeout / 1000}s`
      })
      
      // Ne pas définir Content-Type manuellement - axios le fait automatiquement pour FormData
      // avec le boundary approprié
      // Augmenter le timeout spécifiquement pour cette requête
      const response = await axiosInstance.post('/api/inventories/add-by-doc', formData, {
        timeout: timeout
      })
      console.log('✅ Réponse reçue:', response.data)
      return response.data
    } catch (error) {
      // Log détaillé de l'erreur pour debug
      const errorDetails = {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fileType: document?.type,
        fileName: document?.name,
        code: error.code
      }
      console.error('❌ Erreur lors de l\'analyse du document:', errorDetails)
      
      // Détecter les erreurs de timeout
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        error.isTimeout = true
        error.apiMessage = 'Le traitement prend trop de temps. Le serveur a dépassé la limite de temps d\'exécution. Veuillez réessayer avec un enregistrement plus court ou contacter le support.'
      } else if (error.response?.status === 500) {
        // Vérifier si c'est une erreur de timeout côté serveur
        const errorData = error.response?.data
        const errorString = typeof errorData === 'string' ? errorData : JSON.stringify(errorData)
        if (errorString.includes('Maximum execution time') || errorString.includes('timeout')) {
          error.isTimeout = true
          error.apiMessage = 'Le traitement de l\'audio prend trop de temps. Le serveur a dépassé la limite de 30 secondes. Veuillez réessayer avec un enregistrement plus court ou contacter le support pour augmenter la limite côté serveur.'
        } else if (error.response?.data?.message) {
          error.apiMessage = error.response.data.message
        }
      } else if (error.response?.data?.message) {
        error.apiMessage = error.response.data.message
      }
      
      throw error
    }
  },
}

export default inventoryService


