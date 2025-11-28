import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNavigation, MyRecipeCard, FlashMessage, PageHeader } from '../../components'
import { recipesService } from '../../services/api'
import { formatErrorMessage } from '../../utils/errors'
import { transformRecipeFromAPI } from '../../utils'
import { getUserRecipesCache, setUserRecipesCache, clearUserRecipesCache } from '../../utils/storage'
import { routes } from '../../config/routes'

/**
 * Page MyRecipes - Affiche les recettes créées par l'utilisateur
 */
function MyRecipes() {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [flashMessage, setFlashMessage] = useState(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  // Charger les recettes de l'utilisateur (mode: 'author')
  useEffect(() => {
    loadUserRecipes(true)
  }, [])

  const loadUserRecipes = async (reset = false) => {
    try {
      setIsLoading(true)
      setError(null)

      // Vérifier le cache si on reset (première page)
      if (reset) {
        const cachedData = getUserRecipesCache()
        if (cachedData && cachedData.recipes && cachedData.recipes.length > 0) {
          const transformedRecipes = cachedData.recipes.map((recipe) =>
            transformRecipeFromAPI(recipe, false)
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
          
          // Charger en arrière-plan pour mettre à jour le cache
          loadUserRecipesFromAPI(true)
          return
        }
      }

      // Charger depuis l'API
      await loadUserRecipesFromAPI(reset)
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

  const loadUserRecipesFromAPI = async (reset = false) => {
    try {
      const currentOffset = reset ? 0 : offset
      // Utiliser mode: 'author' pour récupérer les recettes dont le client est l'auteur
      const data = await recipesService.getUserRecipes({
        quantity: 10,
        offset: currentOffset,
      })

      // Sauvegarder dans le cache si on reset (première page)
      if (reset && data.recipes) {
        setUserRecipesCache({ recipes: data.recipes })
      }

      // Transformer les recettes au format attendu
      const transformedRecipes = (data.recipes || []).map((recipe) =>
        transformRecipeFromAPI(recipe, false) // Les recettes de l'auteur ne sont pas forcément en favoris
      )

      // Trier par date de création décroissante (plus récentes en premier)
      const sortedRecipes = transformedRecipes.sort((a, b) => {
        const dateA = a.date || a.id || 0
        const dateB = b.date || b.id || 0
        return dateB - dateA
      })

      if (reset) {
        setRecipes(sortedRecipes)
        setOffset(10)
      } else {
        // Éviter les doublons
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

  const handleDelete = async (recipeId) => {
    try {
      // Appel API pour supprimer la recette (seul l'auteur peut supprimer)
      await recipesService.deleteRecipe(recipeId)

      // Supprimer la recette de la liste
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeId))

      setFlashMessage({
        message: 'Recette supprimée avec succès!',
        type: 'success',
      })

      // Invalider les caches pour forcer le rechargement
      clearUserRecipesCache()
      clearCommunityRecipesCache()

      // Émettre un événement pour mettre à jour le compteur dans le profil
      window.dispatchEvent(new CustomEvent('recipeDeleted'))
    } catch (error) {
      const errorMessage = formatErrorMessage(error)
      setFlashMessage({
        message: errorMessage,
        type: 'error',
      })
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
                  onClick={() => navigate(routes.PROFILE)}
                  className="flex items-center justify-center size-10 text-text-light dark:text-text-dark hover:opacity-70 transition-opacity"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex-1">
                  <p className="text-text-light dark:text-text-dark tracking-light text-xl font-bold leading-tight">
                    Mes Recettes
                  </p>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium">
                    Vos recettes créées
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content: Recipe List */}
          <main className="flex-1 px-4 py-4 space-y-3 pb-28">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Chargement de vos recettes...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  {error}
                </p>
                <button
                  onClick={() => loadUserRecipes(true)}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Réessayer
                </button>
              </div>
            ) : recipes.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                <span className="material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  restaurant_menu
                </span>
                <p className="text-lg font-bold text-text-light dark:text-text-dark">
                  Aucune recette créée
                </p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
                  Commencez à créer des recettes avec l'IA
                </p>
                <button
                  onClick={() => navigate(routes.RECIPES)}
                  className="mt-6 py-3 px-6 rounded-xl text-center font-semibold bg-primary text-white hover:opacity-90 transition-opacity"
                >
                  Créer une recette
                </button>
              </div>
            ) : (
              recipes.map((recipe) => (
                <MyRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onDelete={handleDelete}
                />
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default MyRecipes

