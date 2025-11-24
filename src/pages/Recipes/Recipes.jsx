import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RecipePrompt, BottomNavigation } from '../../components'

/**
 * Page de recettes
 * Composant principal de la page de recettes
 */
function Recipes() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateRecipe = async (ingredients) => {
    setIsLoading(true)
    console.log('Génération de recette avec les ingrédients:', ingredients)
    
    // TODO: Remplacer par un appel API réel
    // const response = await api.generateRecipe(ingredients)
    
    // Simuler une requête API avec des données de recette
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Données de recette simulées (à remplacer par la réponse de l'API)
      const generatedRecipe = {
        title: 'Poulet crémeux et riz au brocoli',
        description: 'Un repas simple, délicieux et complet utilisant vos ingrédients.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
        ingredients: [
          '2 poitrines de poulet désossées et sans peau, coupées en dés',
          '1 tasse de riz blanc',
          '1 tête de brocoli, coupée en fleurettes',
          '1 tasse de crème épaisse',
          '1/2 tasse de parmesan râpé',
          '2 gousses d\'ail, hachées',
          'Sel et poivre au goût'
        ],
        instructions: [
          'Cuire le riz selon les instructions de l\'emballage. Pendant la cuisson, assaisonner le poulet coupé en dés avec du sel et du poivre.',
          'Dans une grande poêle, cuire le poulet à feu moyen-élevé jusqu\'à ce qu\'il soit doré et cuit. Retirer et réserver.',
          'Dans la même poêle, faire revenir l\'ail haché pendant environ 30 secondes. Ajouter les fleurettes de brocoli et cuire jusqu\'à ce qu\'elles soient tendres-croustillantes.',
          'Réduire le feu à doux, verser la crème épaisse et porter à ébullition. Incorporer le parmesan jusqu\'à ce qu\'il soit fondu et que la sauce ait légèrement épaissi.',
          'Remettre le poulet dans la poêle. Ajouter le riz cuit et mélanger le tout jusqu\'à ce que tout soit bien combiné et chauffé. Assaisonner avec du sel et du poivre supplémentaires si nécessaire. Servir immédiatement.'
        ]
      }
      
      console.log('Recette générée avec succès')
      
      // Naviguer vers la page de résultat avec les données de la recette
      navigate('/resultat-recette', { state: { recipe: generatedRecipe } })
    } catch (error) {
      console.error('Erreur lors de la génération:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark flex md:flex-row">
      <BottomNavigation />
      <div className="flex-1 md:ml-20 lg:ml-24">
        <RecipePrompt onSubmit={handleGenerateRecipe} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default Recipes

