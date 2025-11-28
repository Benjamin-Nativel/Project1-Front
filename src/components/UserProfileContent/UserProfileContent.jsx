import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ProfileCard from '../ProfileCard'
import { inventoryService, recipesService } from '../../services/api'
import { getClientItemsCache, setClientItemsCache } from '../../utils/storage'

/**
 * Composant UserProfileContent - Contenu de la page de profil pour les utilisateurs
 * Affiche les cartes "Mon Inventaire" et "Mes Recettes" avec les statistiques
 */
function UserProfileContent() {
  const location = useLocation()
  const [inventoryCount, setInventoryCount] = useState(0)
  const [recipesCount, setRecipesCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()

    // Écouter les événements de création/suppression de recette pour mettre à jour le compteur
    const handleRecipeChange = () => {
      loadStats()
    }

    window.addEventListener('recipeCreated', handleRecipeChange)
    window.addEventListener('recipeDeleted', handleRecipeChange)

    return () => {
      window.removeEventListener('recipeCreated', handleRecipeChange)
      window.removeEventListener('recipeDeleted', handleRecipeChange)
    }
  }, [location.pathname]) // Recharger quand on revient sur la page profil

  const loadStats = async () => {
    try {
      setIsLoading(true)
      
      // Charger les items et les recettes en parallèle
      const [clientItemsResult, recipesResult] = await Promise.allSettled([
        // Charger les items créés par l'utilisateur (client_items uniquement)
        (async () => {
          // Vérifier le cache localStorage d'abord
          const cachedData = getClientItemsCache()
          if (cachedData) {
            setInventoryCount(cachedData.length)
            // Charger en arrière-plan pour mettre à jour le cache
            loadClientItemsInBackground()
            return cachedData
          }
          
          const clientItems = await inventoryService.getClientItems()
          // Mettre à jour le cache
          setClientItemsCache(clientItems)
          // Compter tous les ingrédients créés par l'utilisateur
          setInventoryCount(clientItems.length)
          return clientItems
        })(),
        // Charger le nombre de recettes créées par l'utilisateur (mode: 'author')
        recipesService.getUserRecipes({ quantity: 100 })
      ])

      // Traiter le résultat des recettes
      if (recipesResult.status === 'fulfilled') {
        const recipesData = recipesResult.value
        setRecipesCount(Array.isArray(recipesData.recipes) ? recipesData.recipes.length : 0)
      } else {
        // Si l'API n'est pas disponible, on met 0
        console.warn('Impossible de charger les recettes:', recipesResult.reason)
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
        path="/mes-recettes"
      />
    </div>
  )
}

export default UserProfileContent

