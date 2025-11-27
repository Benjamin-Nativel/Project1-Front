import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddItemForm, BottomNavigation, FlashMessage } from '../../components'
import { itemsService } from '../../services/api/items'
import { formatErrorMessage } from '../../utils/errors'
import { getInventoryCache, setInventoryCache } from '../../utils/storage'
import { getItemImageUrl } from '../../utils/constants'

/**
 * Page d'ajout d'item
 * Composant principal de la page d'ajout d'item
 */
function AddItem() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [flashMessage, setFlashMessage] = useState(null)

  const handleSubmit = async (itemData) => {
    try {
      setIsLoading(true)
      setFlashMessage(null)
      
      // Appeler l'API pour créer l'item
      const response = await itemsService.createItem(itemData)
      
      // Transformer la réponse de l'API en format compatible avec le cache
      // Le format attendu par le cache est: { id, name, category, emoji, img, imgUrl, quantity }
      // D'après la doc API, la réponse contient: { message, item: { id, name, category (string), img } }
      if (response.item) {
        const newItem = {
          id: response.item.id,
          name: response.item.name,
          category: response.item.category || 'Autre', // La réponse contient déjà le nom de la catégorie (string)
          emoji: '📦', // Emoji par défaut (utilisé comme fallback si pas d'image)
          img: response.item.img || null, // Nom du fichier image (ex: "apples-647df8a.jpg")
          imgUrl: getItemImageUrl(response.item.img), // URL complète de l'image ou null
          quantity: 0 // Nouvel item créé, quantité initiale à 0 (pas encore dans l'inventaire)
        }
        
        // Récupérer le cache actuel (PRÉSERVER TOUTE LA LISTE EXISTANTE)
        const cachedItems = getInventoryCache() || []
        console.log('📦 Cache actuel:', cachedItems.length, 'items')
        
        // Vérifier si l'item existe déjà dans le cache
        const existingItemIndex = cachedItems.findIndex(item => item.id === newItem.id)
        
        let updatedItems
        if (existingItemIndex >= 0) {
          // Si l'item existe déjà, le mettre à jour tout en préservant sa quantité actuelle
          updatedItems = [...cachedItems]
          // Préserver la quantité existante si elle existe, sinon mettre 0
          newItem.quantity = cachedItems[existingItemIndex].quantity !== undefined 
            ? cachedItems[existingItemIndex].quantity 
            : 0
          updatedItems[existingItemIndex] = newItem
          console.log('🔄 Item mis à jour dans le cache (quantité préservée):', newItem)
        } else {
          // Si l'item n'existe pas, l'ajouter à la liste existante (PRÉSERVER TOUTE LA LISTE)
          updatedItems = [...cachedItems, newItem]
          console.log('✅ Nouvel item ajouté au cache (liste existante préservée):', newItem)
        }
        
        // Trier par quantité (décroissant) comme dans inventoryService.getItems
        // Les items avec quantity 0 seront en fin de liste
        updatedItems.sort((a, b) => b.quantity - a.quantity)
        
        // Mettre à jour le cache avec la liste complète (tous les items précédents + le nouvel item)
        setInventoryCache(updatedItems)
        console.log('💾 Cache mis à jour:', updatedItems.length, 'items au total')
      }
      
      // Afficher un message de succès
      setFlashMessage({
        message: response.message || 'Ingrédient créé avec succès !',
        type: 'success'
      })
      
      // Naviguer vers l'inventaire après un court délai
      setTimeout(() => {
        navigate('/inventaire', {
          state: {
            message: 'Ingrédient créé avec succès !'
          }
        })
      }, 1500)
    } catch (error) {
      const errorMessage = formatErrorMessage(error)
      setFlashMessage({
        message: errorMessage || 'Une erreur est survenue lors de la création de l\'ingrédient',
        type: 'error'
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark flex md:flex-row">
      {flashMessage && (
        <FlashMessage
          message={flashMessage.message}
          type={flashMessage.type}
          onClose={() => setFlashMessage(null)}
        />
      )}
      <BottomNavigation />
      <div className="flex-1 md:ml-20 lg:ml-24">
        <AddItemForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default AddItem

