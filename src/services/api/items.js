import axiosInstance from '../axios'

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
      
      // Debug: Vérifier le contenu du FormData
      console.log('=== FormData Debug ===')
      console.log('Data JSON:', dataString)
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, value.name, `(${value.size} bytes, ${value.type})`)
        } else {
          console.log(`${key}:`, value, `(type: ${typeof value})`)
        }
      }
      console.log('=====================')
      
      // Faire la requête avec FormData
      // IMPORTANT: Ne pas définir manuellement le Content-Type
      // Le navigateur doit le définir automatiquement avec le boundary approprié
      // L'intercepteur axios supprimera le Content-Type par défaut si c'est un FormData
      const response = await axiosInstance.post('/api/items/add', formData)
      
      return response.data
    } catch (error) {
      // Debug: Afficher les détails de l'erreur
      if (error.response) {
        console.error('=== API Error ===')
        console.error('Status:', error.response.status)
        console.error('Data:', error.response.data)
        console.error('Headers:', error.response.headers)
        console.error('================')
      } else if (error.request) {
        console.error('Request error:', error.request)
      } else {
        console.error('Error:', error.message)
      }
      throw error
    }
  },
}

export default itemsService

