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

  // Données par défaut si aucune recette n'est fournie
  const defaultRecipe = {
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

  const recipeData = recipe || defaultRecipe

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
        {/* Title and Description */}
        <div className="p-4 md:p-6 lg:p-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-light dark:text-text-dark">
            {recipeData.title}
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1 md:mt-2 text-base md:text-lg">
            {recipeData.description}
          </p>
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
              {recipeData.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center size-6 bg-primary text-white font-bold text-sm rounded-full mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    {instruction}
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

