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

  // Utiliser les données de l'API
  const recipeData = {
    title: recipe.recipe_name || 'Recette',
    matching_score: recipe.matching_score || 0,
    preparation_time_minutes: recipe.preparation_time_minutes || 0,
    ingredients: recipe.ingredients || [],
    steps: recipe.steps || [],
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
            {recipeData.matching_score > 0 && (
              <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                <span className="material-symbols-outlined text-lg">star</span>
                <span className="text-sm md:text-base">
                  {recipeData.matching_score}% de correspondance
                </span>
              </div>
            )}
          </div>
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

