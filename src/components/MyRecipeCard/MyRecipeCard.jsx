import { useNavigate } from 'react-router-dom'

/**
 * Composant MyRecipeCard - Carte de recette créée par l'utilisateur
 * @param {Object} props
 * @param {Object} props.recipe - Données de la recette
 * @param {Function} props.onDelete - Fonction appelée pour supprimer la recette
 */
function MyRecipeCard({ recipe, onDelete }) {
  const navigate = useNavigate()

  const {
    id,
    recipe_name,
    name,
    created_at,
    createdAt,
    preparation_time_minutes,
    preparation_time,
    ingredients = [],
  } = recipe

  const recipeName = name || recipe_name || 'Recette sans nom'
  const recipeDate = created_at || createdAt || 'Date inconnue'
  const prepTime = preparation_time_minutes || preparation_time || 0
  const ingredientsCount = Array.isArray(ingredients) ? ingredients.length : 0

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue'
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString
      
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch (error) {
      return dateString
    }
  }

  const handleViewRecipe = () => {
    // Naviguer vers la page de résultat de recette avec les données
    navigate('/resultat-recette', { state: { recipe } })
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm('Êtes-vous sûr de vouloir désenregistrer cette recette ? Cette action est irréversible.')) {
      onDelete?.(id)
    }
  }

  return (
    <div
      className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft dark:shadow-none overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
      onClick={handleViewRecipe}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
              {recipeName}
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">
              Créée le {formatDate(recipeDate)}
            </p>
            <div className="flex items-center gap-4 mt-2">
              {prepTime > 0 && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-sm">
                    schedule
                  </span>
                  <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                    {prepTime} min
                  </span>
                </div>
              )}
              {ingredientsCount > 0 && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-sm">
                    restaurant_menu
                  </span>
                  <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                    {ingredientsCount} ingrédient{ingredientsCount > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center size-10 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors shrink-0"
            title="Désenregistrer cette recette"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyRecipeCard

