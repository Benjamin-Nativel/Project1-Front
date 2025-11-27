import { useState, useEffect } from 'react'
import { BottomNavigation, CommunityHeader, CommunityRecipeCard, RecipeDetailSheet, FlashMessage } from '../../components'
import { recipesService } from '../../services/api'
import { formatErrorMessage } from '../../utils/errors'

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

  // Charger les recettes de la communauté
  useEffect(() => {
    loadCommunityRecipes()
  }, [])

  const loadCommunityRecipes = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // TODO: Remplacer par l'appel API réel quand l'endpoint sera disponible
      // const data = await recipesService.getCommunityRecipes()
      
      // Données mockées pour le moment (basées sur la maquette)
      const mockRecipes = [
        {
          id: 1,
          name: 'Creamy Chicken & Broccoli Rice',
          description: 'Une recette simple et délicieuse avec vos ingrédients',
          author: {
            name: 'Jean Dupont',
            timeAgo: 'Il y a 2 heures',
          },
          createdAt: 'Il y a 2 heures',
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
          isFavorited: false,
          favoritesCount: 12,
        },
        {
          id: 2,
          name: 'Salade de Quinoa aux Légumes',
          description: 'Une salade fraîche et équilibrée, parfaite pour l\'été',
          author: {
            name: 'Marie Martin',
            timeAgo: 'Il y a 5 heures',
          },
          createdAt: 'Il y a 5 heures',
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
          isFavorited: true,
          favoritesCount: 8,
        },
        {
          id: 3,
          name: 'Lasagnes Maison',
          description: 'Une recette traditionnelle de lasagnes au fromage et à la viande',
          author: {
            name: 'Pierre Bernard',
            timeAgo: 'Il y a 1 jour',
          },
          createdAt: 'Il y a 1 jour',
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
          isFavorited: false,
          favoritesCount: 25,
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
      // TODO: Appel API pour ajouter/retirer des favoris
      // await recipesService.toggleFavorite(recipeId, isFavorited)

      // Mettre à jour l'état local
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.id === recipeId
            ? { ...recipe, isFavorited, favoritesCount: isFavorited ? (recipe.favoritesCount || 0) + 1 : Math.max(0, (recipe.favoritesCount || 1) - 1) }
            : recipe
        )
      )

      // Mettre à jour la recette sélectionnée si elle est ouverte
      if (selectedRecipe && selectedRecipe.id === recipeId) {
        setSelectedRecipe((prev) => ({
          ...prev,
          isFavorited,
          favoritesCount: isFavorited ? (prev.favoritesCount || 0) + 1 : Math.max(0, (prev.favoritesCount || 1) - 1),
        }))
      }

      setFlashMessage({
        message: isFavorited
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

