import { useNavigate } from 'react-router-dom'
import PageHeader from '../PageHeader'

/**
 * Composant RecipeResult - Affichage du résultat de la génération de recette (Mobile First)
 * @param {Object} props
 * @param {Object} props.recipe - Objet contenant les données de la recette
 * @param {Function} props.onGenerateAnother - Fonction appelée pour générer une autre recette
 */
function RecipeResult({ recipe, onGenerateAnother }) {
  const navigate = useNavigate()

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

  const recipeData = {
    title: recipe.recipe_name || 'Recette',
    matching_score: parseMatchingScore(recipe.matching_score),
    preparation_time_minutes: recipe.preparation_time_minutes || 0,
    ingredients: recipe.ingredients || [],
    steps: recipe.steps || [],
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

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      {/* Header - Collé à la sidebar */}
      <PageHeader title="Générateur de recettes" backPath="/recipes" />

      {/* Main Content - Centré */}
      <main className="flex-1 mx-auto w-full max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl pb-28 md:pb-32">
        {/* Title and Metadata */}
        <div className="p-4 md:p-6 lg:p-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-light dark:text-text-dark">
            {recipeData.title}
          </h1>
          <div className="flex flex-wrap gap-4 mt-3 md:mt-4">
            {recipeData.preparation_time_minutes > 0 && (
              <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                <span className="material-symbols-outlined text-lg">schedule</span>
                <span className="text-sm md:text-base">{recipeData.preparation_time_minutes} min</span>
              </div>
            )}
          </div>
          
          {/* Matching Score Visual Indicator */}
          {recipeData.matching_score !== null && recipeData.matching_score !== undefined ? (
            <div className="mt-4 md:mt-6 p-4 md:p-5 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-soft dark:shadow-soft-dark">
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
          ) : (
            <div className="mt-4 md:mt-6 p-4 md:p-5 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-soft dark:shadow-soft-dark">
              <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                <span className="material-symbols-outlined text-lg">info</span>
                <span className="text-sm md:text-base">
                  Score de correspondance non disponible
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Ingredients and Instructions */}
        <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Ingredients Section */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-text-light dark:text-text-dark mb-3 md:mb-4">
              Ingrédients
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
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-text-light dark:text-text-dark mb-3 md:mb-4">
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

        {/* Generate Another Recipe Button */}
        <div className="p-4 md:p-6 lg:p-8">
          <button
            onClick={handleGenerateAnother}
            className="w-full py-4 px-4 rounded-xl text-center font-bold bg-primary text-white text-lg hover:opacity-90 transition-opacity"
          >
            Générer une autre recette
          </button>
        </div>
      </main>
    </div>
  )
}

export default RecipeResult

