/**
 * Composant CommunityRecipeCard - Carte de recette partagée dans la communauté
 * @param {Object} props
 * @param {Object} props.recipe - Données de la recette
 * @param {Function} props.onViewRecipe - Fonction appelée pour voir les détails
 * @param {Function} props.onToggleFavorite - Fonction appelée pour ajouter/retirer des favoris
 */
function CommunityRecipeCard({ recipe, onViewRecipe, onToggleFavorite }) {
  const {
    id,
    name,
    description,
    author,
    createdAt,
    image,
    ingredients = [],
    isFavorited = false,
  } = recipe

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    onToggleFavorite?.(id, !isFavorited)
  }

  const handleViewRecipe = () => {
    onViewRecipe?.(recipe)
  }

  // Afficher seulement les 3 premiers ingrédients + compteur
  const mainIngredients = ingredients.slice(0, 3)
  const remainingCount = Math.max(0, ingredients.length - 3)

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft dark:shadow-none overflow-hidden">
      {/* Profile Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <div className="flex-1">
          <p className="text-text-light dark:text-text-dark font-semibold text-base">
            {author?.name || 'Utilisateur'}
          </p>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs mt-0.5">
            {createdAt || 'Récemment'}
          </p>
        </div>
      </div>

      {/* Recipe Image (optional) */}
      {image ? (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <span className="material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark">
            restaurant_menu
          </span>
        </div>
      )}

      {/* Recipe Content */}
      <div className="p-4 space-y-4">
        {/* Recipe Title and Favorite Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-text-light dark:text-text-dark">
              {name}
            </h3>
            {description && (
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={handleFavoriteClick}
            className={`favorite-btn flex items-center justify-center size-10 rounded-full transition-colors shrink-0 ${
              isFavorited
                ? 'bg-red-100 dark:bg-red-900/30 text-destructive hover:bg-red-200 dark:hover:bg-red-900/50'
                : 'bg-slate-100 dark:bg-slate-800 text-text-secondary-light dark:text-text-secondary-dark hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Ingredients Preview */}
        {mainIngredients.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-text-light dark:text-text-dark mb-2">
              Ingrédients principaux
            </h4>
            <div className="flex flex-wrap gap-2">
              {mainIngredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                >
                  {typeof ingredient === 'string' ? ingredient : ingredient.name || ingredient}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  +{remainingCount} autre{remainingCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        )}

        {/* View Recipe Button */}
        <button
          onClick={handleViewRecipe}
          className="w-full py-3 px-4 rounded-xl text-center font-semibold bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
        >
          Voir la recette complète
        </button>
      </div>
    </div>
  )
}

export default CommunityRecipeCard

