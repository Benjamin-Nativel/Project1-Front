import axiosInstance from '../axios'
import { setUser } from '../../utils/storage'

/**
 * Service API pour les données du client/profil
 */
export const clientService = {
  /**
   * Obtenir les informations du client connecté
   * Retourne les données selon le type d'utilisateur :
   * - Client : { name, email, roles }
   * - Admin : { email, roles } (pas de name)
   * @returns {Promise<Object>} - { name?, email, roles }
   */
  getClientInfo: async () => {
    try {
      const response = await axiosInstance.get('/api/client')
      const clientData = response.data
      
      // Normaliser les données pour le frontend
      const normalizedUser = {
        email: clientData.email,
        roles: clientData.roles || [],
        // name n'est présent que pour les clients non-admin
        ...(clientData.name && { name: clientData.name }),
      }
      
      // Déterminer le rôle principal pour la compatibilité avec le code existant
      const isAdmin = normalizedUser.roles.includes('ROLE_ADMIN')
      normalizedUser.role = isAdmin ? 'admin' : 'user'
      
      // Stocker les données utilisateur
      setUser(normalizedUser)
      
      return normalizedUser
    } catch (error) {
      // Laisser formatErrorMessage gérer le formatage des erreurs
      throw error
    }
  },
}

export default clientService

