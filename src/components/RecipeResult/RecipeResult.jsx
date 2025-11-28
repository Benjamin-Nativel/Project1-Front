import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../PageHeader'
import FlashMessage from '../FlashMessage'
import { recipesService } from '../../services/api'
import { formatErrorMessage } from '../../utils/errors'
import { clearCommunityRecipesCache, clearUserRecipesCache } from '../../utils/storage'
import { routes } from '../../config/routes'

/**
 * Composant RecipeResult - Affichage du résultat de la génération de recette (Mobile First)
 * @param {Object} props
 * @param {Object} props.recipe - Objet contenant les données de la recette
 * @param {Function} props.onGenerateAnother - Fonction appelée pour générer une autre recette
 */
function RecipeResult({ recipe, onGenerateAnother }) {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [recipeId, setRecipeId] = useState(null) // ID de la recette sauvegardée
  const [flashMessage, setFlashMessage] = useState(null)

  // Si aucune recette n'est fournie, afficher un message
  if (!recipe) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
        <PageHeader title="Recette" backPath="/recipes" />
        <main className="flex-1 mx-auto w-full max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center">
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Aucune recette à afficher. Veuillez générer une recette d'abord.
            </p>
            <button
              onClick={() => navigate('/recipes')}
              className="mt-4 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity"
            >
              Générer une recette
            </button>
          </div>
        </main>
      </div>
    )
  }

  // Vérifier que les données sont bien reçues (pour débogage)
  console.log('Données reçues dans RecipeResult:', recipe)
  
  // Utiliser les données de l'API
  // Convertir matching_score en nombre si c'est une chaîne
  const parseMatchingScore = (score) => {
    if (score === null || score === undefined) return null
    const numScore = typeof score === 'string' ? parseFloat(score) : score
    return isNaN(numScore) ? null : numScore
  }

  // Adapter les données selon la nouvelle structure API (name, matching, preparation_time, description)
  const recipeData = {
    title: recipe.name || recipe.recipe_name || 'Recette',
    description: recipe.description,
    matching_score: parseMatchingScore(recipe.matching || recipe.matching_score),
    preparation_time_minutes: recipe.preparation_time || recipe.preparation_time_minutes || 0,
    ingredients: recipe.ingredients || [],
    steps: recipe.steps || [],
    cache_key: recipe.cache_key, // Pour la sauvegarde
  }
  
  // Vérifier que toutes les données importantes sont présentes
  console.log('Données formatées pour affichage:', recipeData)
  console.log('Matching score brut:', recipe.matching_score)
  console.log('Matching score parsé:', recipeData.matching_score)

  // Fonction pour déterminer la couleur du score selon sa valeur
  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-500'
    if (score >= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  // Fonction pour déterminer la couleur de la barre de progression
  const getProgressBarColor = (score) => {
    if (score >= 75) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  // Fonction pour obtenir la couleur du badge
  const getBadgeColor = (score) => {
    if (score >= 75) return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
    if (score >= 50) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
    return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
  }

  // Fonction pour obtenir le label du score
  const getScoreLabel = (score) => {
    if (score >= 75) return 'Excellent'
    if (score >= 50) return 'Bon'
    return 'Faible'
  }

  const handleGenerateAnother = () => {
    onGenerateAnother?.()
    navigate('/recipes')
  }

  const handleToggleFavorite = async () => {
    // Si la recette n'est pas encore sauvegardée, la sauvegarder
    if (!recipeId && recipeData.cache_key) {
      await handleSaveRecipe()
      return
    }

    // Si la recette est déjà sauvegardée, ajouter/retirer des favoris
    if (recipeId) {
      try {
        setIsSaving(true)
        setFlashMessage(null)

        await recipesService.toggleFavorite(recipeId, !isFavorited)
        
        setIsFavorited(!isFavorited)
        setFlashMessage({
          message: !isFavorited
            ? 'Recette ajoutée aux favoris!'
            : 'Recette retirée des favoris!',
          type: 'success',
        })
      } catch (error) {
        const errorMessage = formatErrorMessage(error)
        setFlashMessage({
          message: errorMessage,
          type: 'error',
        })
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleSaveRecipe = async () => {
    if (!recipeData.cache_key) {
      setFlashMessage({
        message: 'Impossible de sauvegarder : clé de cache manquante',
        type: 'error',
      })
      return
    }

    // Vérifier le format de la clé de cache (doit commencer par "recipe_")
    if (!recipeData.cache_key.startsWith('recipe_')) {
      setFlashMessage({
        message: 'Format de clé de cache invalide',
        type: 'error',
      })
      return
    }

    try {
      setIsSaving(true)
      setFlashMessage(null)

      // Appel à l'API pour sauvegarder la recette
      const response = await recipesService.saveRecipe(recipeData.cache_key)
      
      // La réponse contient { message: string, recipe_id: number }
      // La recette est automatiquement ajoutée aux favoris lors de la sauvegarde
      // Elle est également visible dans la communauté (mode 'all')
      setRecipeId(response.recipe_id)
      setIsFavorited(true)
      setFlashMessage({
        message: 'Recette sauvegardée avec succès ! Elle est maintenant visible dans la communauté et a été ajoutée à vos favoris.',
        type: 'success',
      })

      // Invalider les caches pour forcer le rechargement
      clearCommunityRecipesCache()
      clearUserRecipesCache()

      // Émettre un événement pour mettre à jour le compteur dans le profil
      window.dispatchEvent(new CustomEvent('recipeCreated'))
    } catch (error) {
      // Gérer les erreurs spécifiques selon le code de statut
      let errorMessage = formatErrorMessage(error)
      
      // Messages d'erreur plus spécifiques selon le type d'erreur
      if (error.response) {
        const status = error.response.status
        const data = error.response.data
        
        if (status === 404) {
          errorMessage = 'Le cache a expiré (1 heure). Veuillez régénérer la recette.'
        } else if (status === 400) {
          // Erreur de validation ou cache_key invalide
          if (data?.message?.includes('Invalid cache key')) {
            errorMessage = 'Clé de cache invalide. Veuillez régénérer la recette.'
          } else if (data?.message?.includes('Missing required field')) {
            errorMessage = 'Données de recette incomplètes. Veuillez régénérer la recette.'
          } else {
            errorMessage = data?.message || errorMessage
          }
        } else if (status === 403) {
          errorMessage = 'Vous devez être un client pour sauvegarder une recette.'
        } else if (status === 401) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.'
        }
      }
      
      setFlashMessage({
        message: errorMessage,
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      {flashMessage && (
        <FlashMessage
          message={flashMessage.message}
          type={flashMessage.type}
          onClose={() => setFlashMessage(null)}
        />
      )}
      
      {/* Header */}
      <PageHeader title="Recipe Generator" backPath="/recipes" />

      {/* Main Content */}
      <main className="flex-1 pb-28">
        {/* Title and Description */}
        <div className="p-4">
          <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">
            {recipeData.title}
          </h1>
          {recipeData.description && (
            <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
              {recipeData.description}
            </p>
          )}
        </div>

        {/* Matching Score Visual Indicator */}
        {recipeData.matching_score !== null && recipeData.matching_score !== undefined && (
          <div className="p-4">
            <div className="p-4 md:p-5 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-soft dark:shadow-soft-dark">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-primary">percent</span>
                  <span className="text-sm md:text-base font-medium text-text-light dark:text-text-dark">
                    Score de correspondance
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg md:text-xl font-bold ${getScoreColor(recipeData.matching_score)}`}>
                    {recipeData.matching_score}%
                  </span>
                  <span className={`text-xs md:text-sm font-medium px-2 py-1 rounded-full ${getBadgeColor(recipeData.matching_score)}`}>
                    {getScoreLabel(recipeData.matching_score)}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressBarColor(recipeData.matching_score)} transition-all duration-1000 ease-out rounded-full`}
                  style={{ width: `${Math.min(Math.max(recipeData.matching_score, 0), 100)}%` }}
                />
              </div>
              
              {/* Score Description */}
              <p className="mt-2 text-xs md:text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Cette recette correspond à {recipeData.matching_score}% de vos ingrédients disponibles
              </p>
            </div>
          </div>
        )}

        {/* Ingredients and Instructions */}
        <div className="p-4 space-y-6">
          {/* Ingredients Section */}
          <div>
            <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-3">
              Ingredients
            </h2>
            <ul className="space-y-2 text-text-secondary-light dark:text-text-secondary-dark">
              {recipeData.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="material-symbols-outlined text-primary text-base mr-2 mt-0.5">
                    check_circle
                  </span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions Section */}
          <div>
            <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-3">
              Instructions
            </h2>
            <ol className="space-y-4 text-text-light dark:text-text-dark">
              {recipeData.steps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center size-6 bg-primary text-white font-bold text-sm rounded-full mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-3">
          {recipeData.cache_key && (
            <button
              onClick={handleToggleFavorite}
              disabled={isSaving}
              className={`w-full py-4 px-4 rounded-xl text-center font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
                isFavorited
                  ? 'bg-destructive/10 hover:bg-destructive/20 text-destructive'
                  : 'bg-primary/10 hover:bg-primary/20 text-primary'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                favorite
              </span>
              {isSaving
                ? 'Sauvegarde en cours...'
                : isFavorited
                ? 'Retiré des favoris'
                : 'Mettre en favoris'}
            </button>
          )}

          <button
            onClick={handleGenerateAnother}
            className="w-full py-4 px-4 rounded-xl text-center font-bold bg-primary text-white text-lg hover:opacity-90 transition-opacity"
          >
            Générer une nouvelle recette
          </button>
        </div>
      </main>
    </div>
  )
}

export default RecipeResult




