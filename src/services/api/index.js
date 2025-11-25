/**
 * Point d'entrée centralisé pour tous les services API
 */

export { default as authService } from './auth'
export { default as inventoryService } from './inventory'
export { default as recipesService } from './recipes'

// Export par défaut de tous les services
import authService from './auth'
import inventoryService from './inventory'
import recipesService from './recipes'

const api = {
  auth: authService,
  inventory: inventoryService,
  recipes: recipesService,
}

export default api


