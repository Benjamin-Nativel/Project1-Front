import { useLocation, useNavigate } from 'react-router-dom'
import { RecipeResult, BottomNavigation } from '../../components'

/**
 * Page de résultat de recette
 * Composant principal de la page de résultat de recette
 */
function RecipeResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Récupérer les données de la recette depuis l'état de navigation ou les props
  const recipe = location.state?.recipe || null
  
  // Vérifier que les données sont bien reçues (pour débogage)
  if (recipe) {
    console.log('Données reçues dans RecipeResultPage:', recipe)
  } else {
    console.warn('Aucune donnée de recette trouvée dans location.state')
  }

  const handleGenerateAnother = () => {
    // Navigation vers la page de génération de recette
    navigate('/recipes')
  }

  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark flex md:flex-row">
      <BottomNavigation />
      <div className="flex-1 md:ml-20 lg:ml-24">
        <RecipeResult recipe={recipe} onGenerateAnother={handleGenerateAnother} />
      </div>
    </div>
  )
}

export default RecipeResultPage

