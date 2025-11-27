import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNavigation, MyRecipeCard, FlashMessage, PageHeader } from '../../components'
import { recipesService } from '../../services/api'
import { formatErrorMessage } from '../../utils/errors'
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

  // Charger les recettes de l'utilisateur
  useEffect(() => {
    loadUserRecipes()
  }, [])

  const loadUserRecipes = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // TODO: Remplacer par l'appel API réel quand l'endpoint sera disponible
      // const data = await recipesService.getUserRecipes()
      
      // Données mockées pour le moment (basées sur la maquette)
      const mockRecipes = [
        {
          id: 1,
          recipe_name: 'Creamy Chicken & Broccoli Rice',
          name: 'Creamy Chicken & Broccoli Rice',
          created_at: '2024-01-15',
          preparation_time_minutes: 30,
          ingredients: [
            '2 poitrines de poulet désossées et sans peau, coupées en dés',
            '1 tasse de riz blanc',
            '1 tête de brocoli, coupée en fleurettes',
            '1 tasse de crème épaisse',
            '1/2 tasse de parmesan râpé',
            '2 gousses d\'ail, hachées',
            'Sel et poivre au goût',
          ],
          steps: [
            "Cuire le riz selon les instructions sur l'emballage. Pendant qu'il cuit, assaisonner le poulet coupé en dés avec du sel et du poivre.",
            "Dans une grande poêle, cuire le poulet à feu moyen-élevé jusqu'à ce qu'il soit doré et cuit. Retirer et réserver.",
            "Dans la même poêle, faire revenir l'ail haché pendant environ 30 secondes. Ajouter les fleurettes de brocoli et cuire jusqu'à ce qu'elles soient tendres mais encore croquantes.",
            "Réduire le feu à doux, verser la crème épaisse et porter à ébullition. Incorporer le parmesan jusqu'à ce qu'il soit fondu et que la sauce ait légèrement épaissi.",
            "Remettre le poulet dans la poêle. Ajouter le riz cuit et mélanger le tout jusqu'à ce que tout soit bien combiné et chaud. Assaisonner avec du sel et du poivre supplémentaires si nécessaire. Servir immédiatement.",
          ],
        },
        {
          id: 2,
          recipe_name: 'Salade de Quinoa aux Légumes',
          name: 'Salade de Quinoa aux Légumes',
          created_at: '2024-01-12',
          preparation_time_minutes: 20,
          ingredients: [
            '1 tasse de quinoa',
            '2 tomates, coupées en dés',
            '1 concombre, coupé en dés',
            '1 poivron rouge, coupé en dés',
            '1/4 tasse d\'huile d\'olive',
            '2 cuillères à soupe de vinaigre de cidre',
            'Sel et poivre au goût',
          ],
          steps: [
            "Cuire le quinoa selon les instructions sur l'emballage. Laisser refroidir.",
            "Couper tous les légumes en dés de taille uniforme.",
            "Mélanger l'huile d'olive et le vinaigre dans un petit bol pour faire la vinaigrette.",
            "Dans un grand saladier, mélanger le quinoa refroidi avec tous les légumes.",
            "Verser la vinaigrette sur la salade et mélanger délicatement. Assaisonner avec du sel et du poivre. Servir frais.",
          ],
        },
        {
          id: 3,
          recipe_name: 'Lasagnes Maison',
          name: 'Lasagnes Maison',
          created_at: '2024-01-10',
          preparation_time_minutes: 60,
          ingredients: [
            '12 feuilles de pâtes à lasagnes',
            '500g de viande hachée',
            '400g de sauce tomate',
            '300g de fromage râpé',
            '200g de béchamel',
            '1 oignon, haché',
            '2 gousses d\'ail, hachées',
            'Sel, poivre, origan',
          ],
          steps: [
            "Préchauffer le four à 180°C. Faire revenir l'oignon et l'ail dans une poêle.",
            "Ajouter la viande hachée et cuire jusqu'à ce qu'elle soit bien dorée. Ajouter la sauce tomate et les épices.",
            "Dans un plat à gratin, alterner les couches : pâtes, viande, fromage, béchamel. Répéter jusqu'à épuisement des ingrédients.",
            "Terminer par une couche de fromage. Enfourner pendant 45 minutes.",
            "Laisser reposer 10 minutes avant de servir.",
          ],
        },
      ]

      setRecipes(mockRecipes)
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

  const handleDelete = async (recipeId) => {
    try {
      // TODO: Appel API pour supprimer la recette
      // await recipesService.deleteRecipe(recipeId)

      // Supprimer la recette de la liste avec animation
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeId))

      setFlashMessage({
        message: 'Recette désenregistrée avec succès!',
        type: 'success',
      })

      // Optionnel: Émettre un événement pour mettre à jour le compteur dans le profil
      // window.dispatchEvent(new CustomEvent('recipeDeleted'))
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
                  onClick={loadUserRecipes}
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

