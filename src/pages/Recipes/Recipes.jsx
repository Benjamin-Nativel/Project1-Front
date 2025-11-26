import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RecipePrompt, BottomNavigation, FlashMessage } from '../../components'
import { recipesService } from '../../services/api'
import { formatErrorMessage } from '../../utils/errors'
import { routes } from '../../config/routes'

/**
 * Page de recettes
 * Composant principal de la page de recettes
 */
function Recipes() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerateRecipe = async (prompt) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Appel à l'API pour générer la recette
      const recipeData = await recipesService.generateRecipe(prompt)
      
      // Vérifier que les données sont bien reçues
      console.log('Données reçues de l\'API:', recipeData)
      
      // Transformer les données de l'API au format attendu par RecipeResult
      // On passe toutes les données de l'API pour ne rien perdre
      const formattedRecipe = {
        recipe_name: recipeData.recipe_name,
        matching_score: recipeData.matching_score !== undefined ? recipeData.matching_score : null,
        preparation_time_minutes: recipeData.preparation_time_minutes,
        ingredients: recipeData.ingredients || [],
        steps: recipeData.steps || [],
        // Passer toutes les autres propriétés de l'API si elles existent
        ...(recipeData.id && { id: recipeData.id }),
        ...(recipeData.category && { category: recipeData.category }),
        ...(recipeData.description && { description: recipeData.description }),
        // Ajouter toutes les autres propriétés non listées
        ...Object.keys(recipeData).reduce((acc, key) => {
          if (!['recipe_name', 'matching_score', 'preparation_time_minutes', 'ingredients', 'steps'].includes(key)) {
            acc[key] = recipeData[key]
          }
          return acc
        }, {})
      }
      
      console.log('Données formatées pour RecipeResult:', formattedRecipe)
      console.log('Matching score dans formattedRecipe:', formattedRecipe.matching_score, 'Type:', typeof formattedRecipe.matching_score)
      
      // Naviguer vers la page de résultat avec les données de la recette
      navigate(routes.RECIPE_RESULT, { state: { recipe: formattedRecipe } })
    } catch (error) {
      console.error('Erreur lors de la génération de la recette:', error)
      const errorMessage = formatErrorMessage(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark flex md:flex-row">
      {error && (
        <FlashMessage
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
      <BottomNavigation />
      <div className="flex-1 md:ml-20 lg:ml-24">
        <RecipePrompt onSubmit={handleGenerateRecipe} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default Recipes

