import axiosInstance from '../axios'

/**
 * Service API pour la gestion des utilisateurs (admin)
 * Basé sur la documentation API: /api/admin/user
 */
export const usersService = {
  /**
   * Récupérer tous les utilisateurs (pour admin)
   * GET /api/admin/user
   * @returns {Promise<Array>} - Liste de tous les utilisateurs avec { id, email, roles, type, name? }
   */
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get('/api/admin/user')
      // La réponse contient { users: [...], count: ... }
      return Array.isArray(response.data.users) ? response.data.users : []
    } catch (error) {
      throw error
    }
  },

  /**
   * Supprimer un utilisateur (admin uniquement)
   * DELETE /api/admin/user/delete/{id}
   * @param {number} userId - ID de l'utilisateur à supprimer
   * @returns {Promise<Object>} - Réponse avec { message }
   */
  deleteUser: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/api/admin/user/delete/${userId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default usersService

