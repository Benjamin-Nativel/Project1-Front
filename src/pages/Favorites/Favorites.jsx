import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNavigation, CommunityRecipeCard, RecipeDetailSheet, FlashMessage, PageHeader } from '../../components'
import { recipesService } from '../../services/api'
import { formatErrorMessage } from '../../utils/errors'
import { transformRecipeFromAPI } from '../../utils'
import { getFavoriteRecipesCache, setFavoriteRecipesCache, clearFavoriteRecipesCache, clearCommunityRecipesCache } from '../../utils/storage'
import { routes } from '../../config/routes'

/**
 * Page Favorites - Affiche les recettes favorites de l'utilisateur
 */
function Favorites() {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [flashMessage, setFlashMessage] = useState(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  // Charger les recettes favorites
  useEffect(() => {
    loadFavorites(true)
  }, [])

  const loadFavorites = async (reset = false) => {
    try {
      setIsLoading(true)
      setError(null)

      // Vérifier le cache si on reset (première page)
      if (reset) {
        const cachedData = getFavoriteRecipesCache()
        if (cachedData && cachedData.recipes && cachedData.recipes.length > 0) {
          const transformedRecipes = cachedData.recipes.map((recipe) =>
            transformRecipeFromAPI(recipe, true)
          )
          
          setRecipes(transformedRecipes)
          setOffset(10)
          setIsLoading(false)
          
          // Charger en arrière-plan pour mettre à jour le cache
          loadFavoritesFromAPI(true)
          return
        }
      }

      // Charger depuis l'API
      await loadFavoritesFromAPI(reset)
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

  const loadFavoritesFromAPI = async (reset = false) => {
    try {
      const currentOffset = reset ? 0 : offset
      const data = await recipesService.getFavorites({
        quantity: 10,
        offset: currentOffset,
      })

      // Sauvegarder dans le cache si on reset (première page)
      if (reset && data.recipes) {
        setFavoriteRecipesCache({ recipes: data.recipes })
      }

      // Toutes les recettes dans les favoris sont forcément en favoris
      const transformedRecipes = (data.recipes || []).map((recipe) =>
        transformRecipeFromAPI(recipe, true)
      )

      if (reset) {
        setRecipes(transformedRecipes)
        setOffset(10)
      } else {
        setRecipes((prev) => [...prev, ...transformedRecipes])
        setOffset((prev) => prev + transformedRecipes.length)
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
  }

  const handleToggleFavorite = async (recipeId, isFavorited) => {
    try {
      // Appel API pour ajouter/retirer des favoris
      await recipesService.toggleFavorite(recipeId, isFavorited)

      // Si on retire des favoris, supprimer la carte de la liste
      if (!isFavorited) {
        setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeId))
        
        // Fermer le sheet si la recette ouverte est celle qui est retirée
        if (selectedRecipe && selectedRecipe.id === recipeId) {
          setIsSheetOpen(false)
        }

        setFlashMessage({
          message: 'Recette retirée des favoris!',
          type: 'success',
        })

        // Invalider les caches pour forcer le rechargement
        clearFavoriteRecipesCache()
        clearCommunityRecipesCache()
      } else {
        // Mettre à jour l'état local (normalement ne devrait pas arriver sur la page favoris)
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
          message: 'Recette ajoutée aux favoris!',
          type: 'success',
        })
      }
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
          {/* Header avec bouton retour */}
          <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
            <div className="flex flex-col gap-3 p-4 pb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(routes.COMMUNITY)}
                  className="flex items-center justify-center size-10 text-text-light dark:text-text-dark hover:opacity-70 transition-opacity"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex-1">
                  <p className="text-text-light dark:text-text-dark tracking-light text-xl font-bold leading-tight">
                    Mes Recettes Favorites
                  </p>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium">
                    Toutes vos recettes sauvegardées
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content: Favorite Recipes */}
          <main className="flex-1 px-4 py-4 space-y-4 pb-28">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Chargement de vos favoris...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  {error}
                </p>
                <button
                  onClick={() => loadFavorites(true)}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Réessayer
                </button>
              </div>
            ) : recipes.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                <span className="material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  favorite
                </span>
                <p className="text-lg font-bold text-text-light dark:text-text-dark">
                  Aucune recette favorite
                </p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
                  Commencez à ajouter des recettes à vos favoris depuis la communauté
                </p>
                <button
                  onClick={() => navigate(routes.COMMUNITY)}
                  className="mt-6 py-3 px-6 rounded-xl text-center font-semibold bg-primary text-white hover:opacity-90 transition-opacity"
                >
                  Découvrir la communauté
                </button>
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

export default Favorites

