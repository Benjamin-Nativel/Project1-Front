/**
 * Service API - Point d'entrée principal
 * 
 * Ce fichier est conservé pour la compatibilité avec le code existant.
 * Pour les nouveaux appels API, utilisez les services spécialisés :
 * - import { authService } from './api/auth'
 * - import { inventoryService } from './api/inventory'
 * - import { recipesService } from './api/recipes'
 * 
 * Ou utilisez l'export centralisé :
 * - import api from './api'
 * - api.auth.login(...)
 * - api.inventory.getItems(...)
 * - api.recipes.generateRecipe(...)
 */

// Import direct depuis index.js pour éviter la dépendance circulaire
import api from './api/index'
import authService from './api/auth'
import inventoryService from './api/inventory'
import recipesService from './api/recipes'
import categoriesService from './api/categories'
import clientService from './api/client'
import usersService from './api/users'

export default api
export { authService, inventoryService, recipesService, categoriesService, clientService, usersService }
