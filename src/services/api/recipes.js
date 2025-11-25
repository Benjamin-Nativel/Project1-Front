import axiosInstance from '../axios'

/**
 * Service API pour la gestion des recettes
 */
export const recipesService = {
  /**
   * Générer une recette à partir d'ingrédients
   * @param {string} ingredients - Liste des ingrédients (texte libre)
   * @returns {Promise<Object>} - Recette générée
   */
  generateRecipe: async (ingredients) => {
    try {
      const response = await axiosInstance.post('/recipes/generate', {
        ingredients,
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
}

export default recipesService


