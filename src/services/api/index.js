/**
 * Point d'entrée centralisé pour tous les services API
 */

export { default as authService } from './auth'
export { default as inventoryService } from './inventory'
export { default as recipesService } from './recipes'
export { default as categoriesService } from './categories'
export { default as itemsService } from './items'
export { default as clientService } from './client'

// Export par défaut de tous les services
import authService from './auth'
import inventoryService from './inventory'
import recipesService from './recipes'
import categoriesService from './categories'
import itemsService from './items'
import clientService from './client'

const api = {
  auth: authService,
  inventory: inventoryService,
  recipes: recipesService,
  categories: categoriesService,
  items: itemsService,
  client: clientService,
}

export default api


