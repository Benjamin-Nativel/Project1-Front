import axiosInstance from '../axios'
import { getItemImageUrl } from '../../utils/constants'

/**
 * Service API pour la gestion des items
 */
export const itemsService = {
  /**
   * Créer un nouvel item personnalisé
   * @param {Object} itemData - { name, category, image? }
   * @param {string} itemData.name - Nom de l'item
   * @param {string|number} itemData.category - ID ou nom de la catégorie
   * @param {File} itemData.image - Fichier image (optionnel)
   * @returns {Promise<Object>} - Item créé
   */
  createItem: async (itemData) => {
    try {
      // Créer un FormData pour multipart/form-data
      const formData = new FormData()
      
      // Préparer les données JSON selon le format attendu par l'API
      // L'API attend: { name: string, category: integer|string }
      const dataJson = {
        name: itemData.name.trim(),
        category: itemData.category
      }
      
      // Vérifier que les données sont valides
      if (!dataJson.name || dataJson.name.trim() === '') {
        throw new Error('Le nom de l\'item est requis')
      }
      if (dataJson.category === undefined || dataJson.category === null || dataJson.category === '') {
        throw new Error('La catégorie est requise')
      }
      
      // Ajouter le champ 'data' comme string JSON
      // IMPORTANT: Le serveur attend exactement le champ 'data' avec une string JSON
      const dataString = JSON.stringify(dataJson)
      formData.append('data', dataString)
      
      // Ajouter l'image si elle existe
      if (itemData.image) {
        formData.append('image', itemData.image)
      }
      
      // Faire la requête avec FormData
      // IMPORTANT: Ne pas définir manuellement le Content-Type
      // Le navigateur doit le définir automatiquement avec le boundary approprié
      // L'intercepteur axios supprimera le Content-Type par défaut si c'est un FormData
      const response = await axiosInstance.post('/api/items/add', formData)
      
      return response.data
    } catch (error) {
      // La gestion des erreurs est faite par l'intercepteur axios
      // On propage simplement l'erreur pour que le composant puisse la gérer
      throw error
    }
  },

  /**
   * Récupérer tous les items (pour admin)
   * @returns {Promise<Array>} - Liste de tous les items
   */
  getAllItems: async () => {
    try {
      // Utiliser l'endpoint inventories qui retourne tous les items
      const response = await axiosInstance.get('/api/inventories')
      const { items } = response.data
      
      // Transformer les données pour correspondre au format attendu
      return Array.isArray(items) ? items.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category?.name || 'Autre',
        emoji: '📦', // Emoji par défaut (utilisé comme fallback si pas d'image)
        img: item.img || null, // Nom du fichier image (ex: "apples-647df8a.jpg")
        imgUrl: getItemImageUrl(item.img) // URL complète de l'image ou null
      })) : []
    } catch (error) {
      throw error
    }
  },

  /**
   * Mettre à jour un item
   * @param {number} itemId - ID de l'item
   * @param {Object} itemData - { name, emoji?, category? }
   * @returns {Promise<Object>} - Item mis à jour
   */
  updateItem: async (itemId, itemData) => {
    try {
      // Créer un FormData similaire à createItem pour gérer l'image
      const formData = new FormData()
      
      const dataJson = {
        name: itemData.name.trim(),
        // Si category est fourni, l'utiliser, sinon utiliser une catégorie par défaut
        category: itemData.category || 1 // Catégorie par défaut
      }
      
      const dataString = JSON.stringify(dataJson)
      formData.append('data', dataString)
      
      // Ajouter l'image si elle existe
      if (itemData.image) {
        formData.append('image', itemData.image)
      }
      
      // Note: L'API pourrait nécessiter un endpoint PUT /api/items/{id}
      // Pour l'instant, on utilise POST /api/items/update/{id} ou similaire
      // Si l'endpoint n'existe pas, on devra l'ajouter côté backend
      const response = await axiosInstance.put(`/api/items/${itemId}`, formData)
      
      return response.data
    } catch (error) {
      // Si l'endpoint PUT n'existe pas, on peut essayer POST
      if (error.response?.status === 404 || error.response?.status === 405) {
        // Fallback: utiliser POST avec update dans le body
        const formData = new FormData()
        const dataJson = {
          name: itemData.name.trim(),
          category: itemData.category || 1
        }
        const dataString = JSON.stringify(dataJson)
        formData.append('data', dataString)
        
        // Ajouter l'image si elle existe
        if (itemData.image) {
          formData.append('image', itemData.image)
        }
        
        const response = await axiosInstance.post(`/api/items/update/${itemId}`, formData)
        return response.data
      }
      throw error
    }
  },

  /**
   * Supprimer un item
   * @param {number} itemId - ID de l'item
   * @returns {Promise<void>}
   */
  deleteItem: async (itemId) => {
    try {
      await axiosInstance.delete(`/api/items/${itemId}`)
    } catch (error) {
      throw error
    }
  },
}

export default itemsService

