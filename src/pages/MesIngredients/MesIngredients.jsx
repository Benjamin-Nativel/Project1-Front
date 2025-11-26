import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { BottomNavigation, InventoryContent, FlashMessage } from '../../components'
import { inventoryService } from '../../services/api'
import { formatErrorMessage } from '../../utils/errors'
import { getClientItemsCache, setClientItemsCache } from '../../utils/storage'
import { useCategories } from '../../hooks'
import { useApp } from '../../contexts/AppContext'

/**
 * Page Mes Ingrédients
 * Affiche uniquement les ingrédients créés par l'utilisateur (client_items)
 * Réutilise le composant InventoryContent
 */
function MesIngredients() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [flashMessage, setFlashMessage] = useState(null)
  const location = useLocation()
  const { categories, isLoading: isLoadingCategories } = useCategories()
  const { user } = useApp()
  
  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.role === 'admin' || user?.role === 'ADMIN'
  const showAddButton = !isAdmin

  // Récupérer le message flash depuis le state de navigation
  useEffect(() => {
    if (location.state?.message) {
      setFlashMessage({
        message: location.state.message,
        type: 'success'
      })
      // Nettoyer le state pour éviter de réafficher le message au rechargement
      window.history.replaceState({}, document.title)
    }
  }, [location])

  // Charger les données au montage du composant
  useEffect(() => {
    loadClientItems()
  }, [])

  const loadClientItems = async () => {
    // Vérifier le cache localStorage d'abord
    const cachedData = getClientItemsCache()
    if (cachedData) {
      setItems(cachedData)
      setIsLoading(false)
      // Charger en arrière-plan pour mettre à jour le cache
      loadClientItemsInBackground()
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // Charger uniquement les items créés par l'utilisateur (client_items)
      const data = await inventoryService.getClientItems()
      
      // Mettre à jour le cache
      setClientItemsCache(data)
      
      setItems(data)
    } catch (error) {
      const errorMessage = formatErrorMessage(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les client_items en arrière-plan pour mettre à jour le cache
  const loadClientItemsInBackground = async () => {
    try {
      const data = await inventoryService.getClientItems()
      setClientItemsCache(data)
      setItems(data)
    } catch (error) {
      console.error('Erreur lors du chargement en arrière-plan des client_items:', error)
    }
  }

  const handleItemUpdate = async (itemId, updatedItem) => {
    const oldItem = items.find(item => item.id === itemId)
    if (!oldItem) return

    const quantityChange = updatedItem.quantity - oldItem.quantity
    
    // Mise à jour optimiste de l'UI
    const updatedItems = items.map(item => 
      item.id === itemId ? updatedItem : item
    )
    setItems(updatedItems)

    // Mettre à jour sur le serveur
    try {
      if (quantityChange > 0) {
        // Ajouter de la quantité
        await inventoryService.addItem({ itemId, quantity: quantityChange })
      } else if (quantityChange < 0) {
        // Retirer de la quantité
        await inventoryService.removeQuantity(itemId, Math.abs(quantityChange))
      }
      // Recharger les données après la mise à jour
      const updatedData = await inventoryService.getClientItems()
      setClientItemsCache(updatedData)
      setItems(updatedData)
    } catch (error) {
      // Recharger les données en cas d'erreur
      loadClientItems()
    }
  }

  const handleAddItem = () => {
    // La navigation est gérée dans InventoryContent
  }

  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark flex md:flex-row relative overflow-x-hidden">
      {flashMessage && (
        <FlashMessage
          message={flashMessage.message}
          type={flashMessage.type}
          onClose={() => setFlashMessage(null)}
        />
      )}
      <BottomNavigation />
      <div className="flex-1 md:ml-20 lg:ml-24 overflow-x-hidden">
        <InventoryContent
          items={items}
          categories={categories}
          onItemUpdate={handleItemUpdate}
          onAddItem={handleAddItem}
          isLoading={isLoading}
          isLoadingCategories={isLoadingCategories}
          error={error}
          onRetry={loadClientItems}
          showAddButton={showAddButton}
        />
      </div>
    </div>
  )
}

export default MesIngredients

