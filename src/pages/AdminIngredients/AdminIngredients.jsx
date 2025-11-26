import { useState, useEffect } from 'react'
import { BottomNavigation, AdminListContent, FlashMessage, IngredientFormSheet } from '../../components'
import { itemsService } from '../../services/api/items'
import { formatErrorMessage } from '../../utils/errors'
import { getAdminItemsCache, setAdminItemsCache } from '../../utils/storage'

/**
 * Page Admin - Gestion des Ingrédients
 * Permet aux administrateurs de créer, modifier et supprimer des ingrédients
 */
function AdminIngredients() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [flashMessage, setFlashMessage] = useState(null)

  // Charger les données au montage du composant
  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    // Vérifier le cache localStorage d'abord
    const cachedData = getAdminItemsCache()
    if (cachedData) {
      setItems(cachedData)
      setIsLoading(false)
      // Charger en arrière-plan pour mettre à jour le cache
      loadItemsInBackground()
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // Récupérer tous les items (pour admin)
      const data = await itemsService.getAllItems()
      
      // Mettre à jour le cache
      setAdminItemsCache(data)
      
      setItems(data)
    } catch (error) {
      const errorMessage = formatErrorMessage(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les items en arrière-plan pour mettre à jour le cache
  const loadItemsInBackground = async () => {
    try {
      const data = await itemsService.getAllItems()
      setAdminItemsCache(data)
      setItems(data)
    } catch (error) {
      console.error('Erreur lors du chargement en arrière-plan des items admin:', error)
    }
  }

  const handleCreateItem = async (itemData) => {
    try {
      setIsLoading(true)
      setFlashMessage(null)
      
      // L'API attend { name, category, image? }
      const itemToCreate = {
        name: itemData.name,
        category: itemData.category || 1, // Catégorie par défaut si non fournie
        image: itemData.image // Image optionnelle
      }
      
      const response = await itemsService.createItem(itemToCreate)
      
      setFlashMessage({
        message: `Ingrédient "${response.item.name}" créé avec succès!`,
        type: 'success'
      })
      
      // Recharger la liste et mettre à jour le cache
      const updatedData = await itemsService.getAllItems()
      setAdminItemsCache(updatedData)
      setItems(updatedData)
    } catch (error) {
      const errorMessage = formatErrorMessage(error)
      setFlashMessage({
        message: errorMessage,
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateItem = async (itemId, itemData) => {
    try {
      setIsLoading(true)
      setFlashMessage(null)
      
      // L'API attend { name, category, image? }
      const itemToUpdate = {
        name: itemData.name,
        category: itemData.category || 1, // Catégorie par défaut si non fournie
        image: itemData.image // Image optionnelle (peut être undefined si non modifiée)
      }
      
      const response = await itemsService.updateItem(itemId, itemToUpdate)
      
      setFlashMessage({
        message: `Ingrédient "${response.item?.name || itemData.name}" modifié avec succès!`,
        type: 'success'
      })
      
      // Recharger la liste et mettre à jour le cache
      const updatedData = await itemsService.getAllItems()
      setAdminItemsCache(updatedData)
      setItems(updatedData)
    } catch (error) {
      const errorMessage = formatErrorMessage(error)
      setFlashMessage({
        message: errorMessage,
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteItem = async (itemId) => {
    try {
      setIsLoading(true)
      setFlashMessage(null)
      
      await itemsService.deleteItem(itemId)
      
      setFlashMessage({
        message: 'Ingrédient supprimé avec succès!',
        type: 'success'
      })
      
      // Recharger la liste et mettre à jour le cache
      const updatedData = await itemsService.getAllItems()
      setAdminItemsCache(updatedData)
      setItems(updatedData)
    } catch (error) {
      const errorMessage = formatErrorMessage(error)
      setFlashMessage({
        message: errorMessage,
        type: 'error'
      })
    } finally {
      setIsLoading(false)
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
        <AdminListContent
          items={items}
          onCreateItem={handleCreateItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          isLoading={isLoading}
          error={error}
          onRetry={loadItems}
          title="Gestion des Ingrédients"
          backPath="/profil"
          searchPlaceholder="Rechercher un ingrédient..."
          emptyMessage="Aucun ingrédient"
          emptySearchMessage="Aucun résultat trouvé"
          loadingMessage="Chargement des ingrédients..."
          deleteConfirmMessage="Êtes-vous sûr de vouloir supprimer cet ingrédient ?"
          createButtonLabel="Créer un ingrédient"
          FormSheet={IngredientFormSheet}
        />
      </div>
    </div>
  )
}

export default AdminIngredients

