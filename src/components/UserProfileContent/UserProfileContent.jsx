import { useState, useEffect } from 'react'
import ProfileCard from '../ProfileCard'
import { inventoryService, recipesService } from '../../services/api'
import { getClientItemsCache, setClientItemsCache } from '../../utils/storage'

/**
 * Composant UserProfileContent - Contenu de la page de profil pour les utilisateurs
 * Affiche les cartes "Mon Inventaire" et "Mes Recettes" avec les statistiques
 */
function UserProfileContent() {
  const [inventoryCount, setInventoryCount] = useState(0)
  const [recipesCount, setRecipesCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      
      // Vérifier le cache localStorage d'abord
      const cachedData = getClientItemsCache()
      if (cachedData) {
        setInventoryCount(cachedData.length)
        setIsLoading(false)
        // Charger en arrière-plan pour mettre à jour le cache
        loadClientItemsInBackground()
        return
      }
      
      // Charger les items créés par l'utilisateur (client_items uniquement)
      // getClientItems() retourne tous les items dans client_items (même ceux avec quantité 0)
      const clientItems = await inventoryService.getClientItems()
      // Mettre à jour le cache
      setClientItemsCache(clientItems)
      // Compter tous les ingrédients créés par l'utilisateur
      setInventoryCount(clientItems.length)

      // Charger le nombre de recettes (si l'API le supporte)
      try {
        const recipes = await recipesService.getRecipes()
        setRecipesCount(Array.isArray(recipes) ? recipes.length : 0)
      } catch (error) {
        // Si l'API n'est pas disponible, on met 0
        console.warn('Impossible de charger les recettes:', error)
        setRecipesCount(0)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les client_items en arrière-plan pour mettre à jour le cache
  const loadClientItemsInBackground = async () => {
    try {
      const clientItems = await inventoryService.getClientItems()
      setClientItemsCache(clientItems)
      setInventoryCount(clientItems.length)
    } catch (error) {
      console.error('Erreur lors du chargement en arrière-plan des client_items:', error)
    }
  }

  return (
    <div className="w-full px-4 space-y-4">
      <ProfileCard
        icon="inventory_2"
        title="Mes Ingrédients"
        description={
          <span>
            <span className="text-primary font-semibold">{isLoading ? '...' : inventoryCount}</span>
            {' '}ingrédients créés
          </span>
        }
        path="/mes-ingredients"
      />
      <ProfileCard
        icon="restaurant_menu"
        title="Mes Recettes"
        description={
          <span>
            <span className="text-primary font-semibold">{isLoading ? '...' : recipesCount}</span>
            {' '}recettes générées
          </span>
        }
        path="/recipes"
      />
    </div>
  )
}

export default UserProfileContent

