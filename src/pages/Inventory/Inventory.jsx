import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { BottomNavigation, InventoryContent, FlashMessage } from '../../components'
import { inventoryService } from '../../services/api'
import { formatErrorMessage } from '../../utils/errors'
import { getInventoryCache, setInventoryCache } from '../../utils/storage'
import { useCategories } from '../../hooks'

/**
 * Page d'inventaire
 * Composant principal de la page d'inventaire
 */
function Inventory() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [flashMessage, setFlashMessage] = useState(null)
  const location = useLocation()
  const { categories, isLoading: isLoadingCategories } = useCategories()

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
    loadInventory()
  }, [])

  const loadInventory = async () => {
    // Vérifier le cache localStorage d'abord
    const cachedData = getInventoryCache()
    if (cachedData) {
      setItems(cachedData)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const data = await inventoryService.getItems()
      
      // Mettre à jour le cache localStorage
      setInventoryCache(data)
      
      setItems(data)
    } catch (error) {
      const errorMessage = formatErrorMessage(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
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
    
    // Mettre à jour le cache localStorage
    setInventoryCache(updatedItems)

    // Mettre à jour sur le serveur
    try {
      if (quantityChange > 0) {
        // Ajouter de la quantité
        await inventoryService.addItem({ itemId, quantity: quantityChange })
      } else if (quantityChange < 0) {
        // Retirer de la quantité
        await inventoryService.removeQuantity(itemId, Math.abs(quantityChange))
      }
    } catch (error) {
      // Recharger les données en cas d'erreur
      loadInventory()
    }
  }

  const handleAddItem = () => {
    // La navigation est gérée dans InventoryContent
  }

  const handleNewItem = async (newItem) => {
    try {
      // Ajouter l'item via l'API
      const createdItem = await inventoryService.addItem(newItem)
      
      // Mettre à jour l'état local et le cache localStorage
      const updatedItems = [...items, createdItem]
      setItems(updatedItems)
      setInventoryCache(updatedItems)
    } catch (error) {
      // Recharger les données en cas d'erreur
      loadInventory()
    }
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
          onRetry={loadInventory}
        />
      </div>
    </div>
  )
}

export default Inventory

