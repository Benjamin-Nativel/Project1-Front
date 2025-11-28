import axiosInstance from '../axios'

/**
 * Service API pour la gestion des recettes
 */
export const recipesService = {
  /**
   * Générer une recette à partir d'un prompt et de l'inventaire disponible
   * @param {string} prompt - La demande de l'utilisateur pour la recette (ex: "Donne-moi une recette simple", "Je veux un dessert")
   * @returns {Promise<Object>} - Recette générée avec { name, description, matching, preparation_time, ingredients, steps, cache_key }
   */
  generateRecipe: async (prompt) => {
    try {
      const response = await axiosInstance.post('/api/recipe/generate', {
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
   * Sauvegarder une recette générée précédemment via generateRecipe
   * @param {string} cacheKey - La clé de cache obtenue depuis la réponse de generateRecipe (format: recipe_<uuid>)
   * @returns {Promise<Object>} - { message: string, recipe_id: number }
   */
  saveRecipe: async (cacheKey) => {
    try {
      const response = await axiosInstance.post('/api/recipe/save', {
        cache_key: cacheKey,
      })
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
      await axiosInstance.delete(`/api/recipe/${recipeId}`)
    } catch (error) {
      throw error
    }
  },

  /**
   * Récupérer une liste paginée de recettes
   * @param {Object} params - { quantity: number, offset?: number, mode?: 'all' | 'favorite' | 'author' }
   * @returns {Promise<Object>} - { recipes: Array }
   */
  getRecipes: async (params = {}) => {
    try {
      const { quantity = 10, offset = 0, mode = 'all' } = params
      const response = await axiosInstance.post('/api/recipe/get', {
        quantity,
        offset,
        mode,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Récupérer les recettes partagées par la communauté (mode: 'all')
   * @param {Object} params - { quantity?: number, offset?: number }
   * @returns {Promise<Object>} - { recipes: Array }
   */
  getCommunityRecipes: async (params = {}) => {
    try {
      return await recipesService.getRecipes({ ...params, mode: 'all' })
    } catch (error) {
      throw error
    }
  },

  /**
   * Récupérer les recettes créées par l'utilisateur (mode: 'author')
   * @param {Object} params - { quantity?: number, offset?: number }
   * @returns {Promise<Object>} - { recipes: Array }
   */
  getUserRecipes: async (params = {}) => {
    try {
      return await recipesService.getRecipes({ ...params, mode: 'author' })
    } catch (error) {
      throw error
    }
  },

  /**
   * Récupérer les recettes favorites de l'utilisateur (mode: 'favorite')
   * @param {Object} params - { quantity?: number, offset?: number }
   * @returns {Promise<Object>} - { recipes: Array }
   */
  getFavorites: async (params = {}) => {
    try {
      return await recipesService.getRecipes({ ...params, mode: 'favorite' })
    } catch (error) {
      throw error
    }
  },

  /**
   * Ajouter une recette aux favoris
   * @param {string|number} recipeId - ID de la recette
   * @returns {Promise<Object>} - { message: string }
   */
  addFavorite: async (recipeId) => {
    try {
      const response = await axiosInstance.get(`/api/recipe/favorite/add/${recipeId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Retirer une recette des favoris
   * @param {string|number} recipeId - ID de la recette
   * @returns {Promise<Object>} - { message: string }
   */
  removeFavorite: async (recipeId) => {
    try {
      const response = await axiosInstance.get(`/api/recipe/favorite/remove/${recipeId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Ajouter/retirer une recette des favoris
   * @param {string|number} recipeId - ID de la recette
   * @param {boolean} isFavorited - État favori souhaité (true = ajouter, false = retirer)
   * @returns {Promise<Object>} - Résultat de l'opération
   */
  toggleFavorite: async (recipeId, isFavorited) => {
    try {
      if (isFavorited) {
        return await recipesService.addFavorite(recipeId)
      } else {
        return await recipesService.removeFavorite(recipeId)
      }
    } catch (error) {
      throw error
    }
  },
}

export default recipesService


