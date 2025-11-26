import axiosInstance from '../axios'

/**
 * Service API pour la gestion des utilisateurs (admin)
 */
export const usersService = {
  /**
   * Récupérer tous les utilisateurs (pour admin)
   * @returns {Promise<Array>} - Liste de tous les utilisateurs
   */
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get('/api/users')
      return Array.isArray(response.data.users) ? response.data.users : []
    } catch (error) {
      throw error
    }
  },

  /**
   * Créer un nouvel utilisateur
   * @param {Object} userData - { email, password, name?, roles? }
   * @returns {Promise<Object>} - Utilisateur créé
   */
  createUser: async (userData) => {
    try {
      const response = await axiosInstance.post('/api/users', {
        email: userData.email.trim(),
        password: userData.password,
        name: userData.name?.trim() || undefined,
        roles: userData.roles || ['ROLE_USER']
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Mettre à jour un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @param {Object} userData - { email?, password?, name?, roles? }
   * @returns {Promise<Object>} - Utilisateur mis à jour
   */
  updateUser: async (userId, userData) => {
    try {
      const updateData = {}
      if (userData.email) updateData.email = userData.email.trim()
      if (userData.password) updateData.password = userData.password
      if (userData.name !== undefined) updateData.name = userData.name?.trim() || null
      if (userData.roles) updateData.roles = userData.roles

      const response = await axiosInstance.put(`/api/users/${userId}`, updateData)
      return response.data
    } catch (error) {
      // Si l'endpoint PUT n'existe pas, essayer POST
      if (error.response?.status === 404 || error.response?.status === 405) {
        const updateData = {}
        if (userData.email) updateData.email = userData.email.trim()
        if (userData.password) updateData.password = userData.password
        if (userData.name !== undefined) updateData.name = userData.name?.trim() || null
        if (userData.roles) updateData.roles = userData.roles

        const response = await axiosInstance.post(`/api/users/update/${userId}`, updateData)
        return response.data
      }
      throw error
    }
  },

  /**
   * Supprimer un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<void>}
   */
  deleteUser: async (userId) => {
    try {
      await axiosInstance.delete(`/api/users/${userId}`)
    } catch (error) {
      throw error
    }
  },
}

export default usersService

