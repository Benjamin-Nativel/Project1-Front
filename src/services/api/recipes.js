import axiosInstance from '../axios'

/**
 * Service API pour la gestion des recettes
 */
export const recipesService = {
  /**
   * Générer une recette à partir d'un prompt et de l'inventaire disponible
   * @param {string} prompt - La demande de l'utilisateur pour la recette (ex: "Donne-moi une recette simple", "Je veux un dessert")
   * @returns {Promise<Object>} - Recette générée avec { recipe_name, matching_score, preparation_time_minutes, ingredients, steps }
   */
  generateRecipe: async (prompt) => {
    try {
      const response = await axiosInstance.post('/api/generate_recipes', {
        prompt,
      }, {
        timeout: 60000, // 1 minute (60 secondes) - nécessaire car l'appel à Gemini peut prendre du temps
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Récupérer toutes les recettes sauvegardées
   * @param {Object} filters - { search, category }
   * @returns {Promise<Array>} - Liste des recettes
   */
  getRecipes: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/recipes', {
        params: filters,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Récupérer une recette par son ID
   * @param {string|number} recipeId - ID de la recette
   * @returns {Promise<Object>} - Recette
   */
  getRecipe: async (recipeId) => {
    try {
      const response = await axiosInstance.get(`/recipes/${recipeId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Sauvegarder une recette
   * @param {Object} recipeData - Données de la recette
   * @returns {Promise<Object>} - Recette sauvegardée
   */
  saveRecipe: async (recipeData) => {
    try {
      const response = await axiosInstance.post('/recipes', recipeData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Supprimer une recette sauvegardée
   * @param {string|number} recipeId - ID de la recette
   * @returns {Promise<void>}
   */
  deleteRecipe: async (recipeId) => {
    try {
      await axiosInstance.delete(`/recipes/${recipeId}`)
    } catch (error) {
      throw error
    }
  },

  /**
   * Récupérer les recettes partagées par la communauté
   * @returns {Promise<Array>} - Liste des recettes de la communauté
   */
  getCommunityRecipes: async () => {
    try {
      const response = await axiosInstance.get('/recipes/community')
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Récupérer les recettes créées par l'utilisateur
   * @returns {Promise<Array>} - Liste des recettes de l'utilisateur
   */
  getUserRecipes: async () => {
    try {
      const response = await axiosInstance.get('/recipes/user')
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Récupérer les recettes favorites de l'utilisateur
   * @returns {Promise<Array>} - Liste des recettes favorites
   */
  getFavorites: async () => {
    try {
      const response = await axiosInstance.get('/recipes/favorites')
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Ajouter/retirer une recette des favoris
   * @param {string|number} recipeId - ID de la recette
   * @param {boolean} isFavorited - État favori souhaité
   * @returns {Promise<Object>} - Résultat de l'opération
   */
  toggleFavorite: async (recipeId, isFavorited) => {
    try {
      const response = await axiosInstance.post(`/recipes/${recipeId}/favorite`, {
        isFavorited,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default recipesService


