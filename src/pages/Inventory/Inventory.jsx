import { useState, useEffect } from 'react'
import { BottomNavigation, InventoryContent } from '../../components'
import { inventoryService, categoriesService } from '../../services/api'
import { formatErrorMessage } from '../../utils/errors'

// Cache simple en mémoire pour les données de l'inventaire
let inventoryCache = null
let cacheTimestamp = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Cache pour les catégories
let categoriesCache = null
let categoriesCacheTimestamp = null
const CATEGORIES_CACHE_DURATION = 10 * 60 * 1000 // 10 minutes (catégories changent moins souvent)

/**
 * Page d'inventaire
 * Composant principal de la page d'inventaire
 */
function Inventory() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [error, setError] = useState(null)

  // Charger les données au montage du composant
  useEffect(() => {
    loadInventory()
    loadCategories()
  }, [])

  const loadInventory = async () => {
    console.log('🚀 [Inventory] Début du chargement de l\'inventaire')
    
    // Vérifier le cache d'abord
    const now = Date.now()
    if (inventoryCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('💾 [Inventory] Utilisation du cache (âge:', Math.round((now - cacheTimestamp) / 1000), 'secondes)')
      console.log('📦 [Inventory] Données du cache:', inventoryCache)
      setItems(inventoryCache)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      console.log('📡 [Inventory] Appel de l\'API...')
      const data = await inventoryService.getItems()
      
      console.log('✅ [Inventory] Données reçues de l\'API:')
      console.log('   Type:', typeof data)
      console.log('   Est un array?', Array.isArray(data))
      console.log('   Nombre d\'éléments:', Array.isArray(data) ? data.length : 'N/A')
      console.log('   Contenu:', data)
      
      // Mettre à jour le cache
      inventoryCache = data
      cacheTimestamp = now
      
      setItems(data)
      console.log('✅ [Inventory] Inventaire chargé avec succès')
    } catch (error) {
      console.error('❌ [Inventory] Erreur lors du chargement de l\'inventaire:', error)
      console.error('   Détails complets:', {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config
      })
      const errorMessage = formatErrorMessage(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
      console.log('🏁 [Inventory] Fin du chargement (isLoading: false)')
    }
  }

  const loadCategories = async () => {
    console.log('🚀 [Categories] Début du chargement des catégories')
    
    // Vérifier le cache d'abord
    const now = Date.now()
    if (categoriesCache && categoriesCacheTimestamp && (now - categoriesCacheTimestamp) < CATEGORIES_CACHE_DURATION) {
      console.log('💾 [Categories] Utilisation du cache (âge:', Math.round((now - categoriesCacheTimestamp) / 1000), 'secondes)')
      console.log('📦 [Categories] Catégories du cache:', categoriesCache)
      setCategories(categoriesCache)
      setIsLoadingCategories(false)
      return
    }

    try {
      setIsLoadingCategories(true)
      
      console.log('📡 [Categories] Appel de l\'API...')
      const data = await categoriesService.getCategories()
      
      console.log('✅ [Categories] Catégories reçues de l\'API:')
      console.log('   Nombre de catégories:', data.length)
      console.log('   Contenu:', data)
      
      // Mettre à jour le cache
      categoriesCache = data
      categoriesCacheTimestamp = now
      
      setCategories(data)
      console.log('✅ [Categories] Catégories chargées avec succès')
    } catch (error) {
      console.error('❌ [Categories] Erreur lors du chargement des catégories:', error)
      // En cas d'erreur, utiliser des catégories par défaut
      const defaultCategories = [
        { id: 0, name: 'Tout' },
        { id: 1, name: 'Frais' },
        { id: 2, name: 'Congelé' },
        { id: 3, name: 'Épicerie' }
      ]
      setCategories(defaultCategories)
      console.log('⚠️ [Categories] Utilisation des catégories par défaut')
    } finally {
      setIsLoadingCategories(false)
      console.log('🏁 [Categories] Fin du chargement (isLoadingCategories: false)')
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
    
    // Mettre à jour le cache
    inventoryCache = updatedItems
    cacheTimestamp = Date.now()

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
      console.error('Erreur lors de la mise à jour:', error)
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
      
      // Mettre à jour l'état local et le cache
      const updatedItems = [...items, createdItem]
      setItems(updatedItems)
      inventoryCache = updatedItems
      cacheTimestamp = Date.now()
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error)
      // Recharger les données en cas d'erreur
      loadInventory()
    }
  }

  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark flex md:flex-row relative overflow-x-hidden">
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

