import { useState, useEffect } from 'react'
import { BottomNavigation, CommunityHeader, CommunityRecipeCard, RecipeDetailSheet, FlashMessage } from '../../components'
import { recipesService } from '../../services/api'
import { formatErrorMessage } from '../../utils/errors'
import { transformRecipeFromAPI } from '../../utils'
import { getCommunityRecipesCache, setCommunityRecipesCache, clearCommunityRecipesCache, clearFavoriteRecipesCache } from '../../utils/storage'

/**
 * Page Communauté - Affiche les recettes partagées par la communauté
 */
function Community() {
  const [recipes, setRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [flashMessage, setFlashMessage] = useState(null)
  const [favoritedIds, setFavoritedIds] = useState(new Set()) // État local des favoris
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  // Charger les favoris puis les recettes
  useEffect(() => {
    const loadData = async () => {
      const favoriteIds = await loadFavoritesStatus()
      await loadCommunityRecipes(true, favoriteIds)
    }
    loadData()
  }, [])

  const loadFavoritesStatus = async () => {
    try {
      // Charger les favoris pour savoir quelles recettes sont déjà en favoris
      const favoritesData = await recipesService.getFavorites({ quantity: 100 })
      const favoriteIds = new Set(favoritesData.recipes?.map((r) => r.id) || [])
      setFavoritedIds(favoriteIds)
      return favoriteIds
    } catch (error) {
      // Ignorer les erreurs silencieusement - on peut continuer sans cette info
      console.warn('Impossible de charger les favoris:', error)
      return new Set()
    }
  }

  const loadCommunityRecipes = async (reset = false, favoriteIdsSet = null) => {
    try {
      setIsLoading(true)
      setError(null)

      // Vérifier le cache si on reset (première page)
      if (reset) {
        const cachedData = getCommunityRecipesCache()
        if (cachedData && cachedData.recipes && Array.isArray(cachedData.recipes) && cachedData.recipes.length > 0) {
          const idsToCheck = favoriteIdsSet || favoritedIds
          const transformedRecipes = cachedData.recipes.map((recipe) =>
            transformRecipeFromAPI(recipe, idsToCheck.has(recipe.id))
          )
          
          // Trier par date décroissante
          const sortedRecipes = transformedRecipes.sort((a, b) => {
            const dateA = a.date || a.id || 0
            const dateB = b.date || b.id || 0
            return dateB - dateA
          })
          
          setRecipes(sortedRecipes)
          setOffset(10)
          setIsLoading(false)
          
          // Charger en arrière-plan pour mettre à jour le cache (sans bloquer l'UI)
          loadCommunityRecipesFromAPI(true, favoriteIdsSet).catch((err) => {
            console.warn('Erreur lors du chargement en arrière-plan:', err)
          })
          return
        }
      }

      // Charger depuis l'API
      await loadCommunityRecipesFromAPI(reset, favoriteIdsSet)
    } catch (error) {
      const errorMessage = formatErrorMessage(error)
      setError(errorMessage)
      setFlashMessage({
        message: errorMessage,
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadCommunityRecipesFromAPI = async (reset = false, favoriteIdsSet = null) => {
    try {
      const currentOffset = reset ? 0 : offset
      const data = await recipesService.getCommunityRecipes({
        quantity: 10,
        offset: currentOffset,
      })

      // Sauvegarder dans le cache si on reset (première page)
      // Sauvegarder les recettes brutes de l'API (avant transformation)
      if (reset && data && data.recipes && Array.isArray(data.recipes) && data.recipes.length > 0) {
        try {
          setCommunityRecipesCache({ recipes: data.recipes })
        } catch (cacheError) {
          console.error('Erreur lors de la sauvegarde du cache:', cacheError)
        }
      }

      // Utiliser les IDs de favoris passés en paramètre ou l'état actuel
      const idsToCheck = favoriteIdsSet || favoritedIds
      const transformedRecipes = (data.recipes || []).map((recipe) =>
        transformRecipeFromAPI(recipe, idsToCheck.has(recipe.id))
      )

      // Trier les recettes par date de création décroissante (plus récentes en premier)
      // Si pas de date, utiliser l'ID comme fallback (les IDs plus élevés sont généralement plus récents)
      const sortedRecipes = transformedRecipes.sort((a, b) => {
        const dateA = a.date || a.id || 0
        const dateB = b.date || b.id || 0
        return dateB - dateA // Décroissant : plus récentes en premier
      })

      if (reset) {
        setRecipes(sortedRecipes)
        setOffset(10)
      } else {
        // Pour la pagination, fusionner et re-trier toutes les recettes
        // Éviter les doublons en filtrant par ID
        const existingIds = new Set(recipes.map((r) => r.id))
        const newRecipes = sortedRecipes.filter((r) => !existingIds.has(r.id))
        const allRecipes = [...recipes, ...newRecipes].sort((a, b) => {
          const dateA = a.date || a.id || 0
          const dateB = b.date || b.id || 0
          return dateB - dateA
        })
        setRecipes(allRecipes)
        setOffset((prev) => prev + sortedRecipes.length)
      }

      // Vérifier s'il y a plus de recettes à charger
      setHasMore(transformedRecipes.length === 10)
    } catch (error) {
      throw error
    }
  }

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe)
    setIsSheetOpen(true)
  }

  const handleCloseSheet = () => {
    setIsSheetOpen(false)
    // Garder selectedRecipe pour permettre la réouverture rapide
  }

  const handleToggleFavorite = async (recipeId, isFavorited) => {
    try {
      // Appel API pour ajouter/retirer des favoris
      await recipesService.toggleFavorite(recipeId, isFavorited)

      // Mettre à jour l'état local des favoris
      setFavoritedIds((prev) => {
        const newSet = new Set(prev)
        if (isFavorited) {
          newSet.add(recipeId)
        } else {
          newSet.delete(recipeId)
        }
        return newSet
      })

      // Mettre à jour l'état local des recettes
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.id === recipeId
            ? { ...recipe, isFavorited }
            : recipe
        )
      )

      // Mettre à jour la recette sélectionnée si elle est ouverte
      if (selectedRecipe && selectedRecipe.id === recipeId) {
        setSelectedRecipe((prev) => ({
          ...prev,
          isFavorited,
        }))
      }

      setFlashMessage({
        message: isFavorited
          ? 'Recette ajoutée aux favoris!'
          : 'Recette retirée des favoris!',
        type: 'success',
      })

      // Ne pas invalider le cache de la communauté car le statut favoris est géré localement
      // Invalider seulement le cache des favoris pour forcer le rechargement de la page favoris
      clearFavoriteRecipesCache()
    } catch (error) {
      const errorMessage = formatErrorMessage(error)
      setFlashMessage({
        message: errorMessage,
        type: 'error',
      })
    }
  }

  const handleShare = async (recipe) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.name || recipe.recipe_name,
          text: recipe.description || '',
          url: window.location.href,
        })
      } else {
        // Fallback: copier le lien dans le presse-papiers
        await navigator.clipboard.writeText(window.location.href)
        setFlashMessage({
          message: 'Lien de la recette copié dans le presse-papiers !',
          type: 'success',
        })
      }
    } catch (error) {
      // L'utilisateur a annulé le partage ou une erreur s'est produite
      if (error.name !== 'AbortError') {
        console.error('Erreur lors du partage:', error)
      }
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
        <div className="relative mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
          <CommunityHeader />

          {/* Main Content: Recipe Feed */}
          <main className="flex-1 px-4 py-4 space-y-4 pb-28">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Chargement des recettes...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  {error}
                </p>
                <button
                  onClick={loadCommunityRecipes}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Réessayer
                </button>
              </div>
            ) : recipes.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Aucune recette partagée pour le moment.
                </p>
              </div>
            ) : (
              recipes.map((recipe) => (
                <CommunityRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onViewRecipe={handleViewRecipe}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))
            )}
          </main>
        </div>
      </div>

      {/* Recipe Detail Sheet */}
      <RecipeDetailSheet
        recipe={selectedRecipe}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        onToggleFavorite={handleToggleFavorite}
        onShare={handleShare}
      />
    </div>
  )
}

export default Community

