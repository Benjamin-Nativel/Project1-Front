import { useState, useEffect } from 'react'
import ProfileCard from '../ProfileCard'
import { inventoryService, recipesService } from '../../services/api'

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
      
      // Charger le nombre d'items dans l'inventaire
      const inventoryItems = await inventoryService.getItems()
      const itemsWithQuantity = inventoryItems.filter(item => item.quantity > 0)
      setInventoryCount(itemsWithQuantity.length)

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

  return (
    <div className="w-full px-4 space-y-4">
      <ProfileCard
        icon="inventory_2"
        title="Mon Inventaire"
        description={
          <span>
            <span className="text-primary font-semibold">{isLoading ? '...' : inventoryCount}</span>
            {' '}items dans votre inventaire
          </span>
        }
        path="/inventaire"
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

