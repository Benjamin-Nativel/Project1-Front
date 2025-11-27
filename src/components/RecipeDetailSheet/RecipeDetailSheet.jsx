import { useState, useEffect } from 'react'

/**
 * Composant RecipeDetailSheet - Bottom sheet pour afficher les détails d'une recette
 * @param {Object} props
 * @param {Object} props.recipe - Données de la recette à afficher
 * @param {boolean} props.isOpen - État d'ouverture du sheet
 * @param {Function} props.onClose - Fonction appelée pour fermer le sheet
 * @param {Function} props.onToggleFavorite - Fonction appelée pour ajouter/retirer des favoris
 * @param {Function} props.onShare - Fonction appelée pour partager la recette
 */
function RecipeDetailSheet({
  recipe,
  isOpen,
  onClose,
  onToggleFavorite,
  onShare,
}) {
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    if (recipe) {
      setIsFavorited(recipe.isFavorited || false)
    }
  }, [recipe])

  if (!recipe) return null

  const handleToggleFavorite = () => {
    const newFavoritedState = !isFavorited
    setIsFavorited(newFavoritedState)
    onToggleFavorite?.(recipe.id, newFavoritedState)
  }

  const handleShare = () => {
    onShare?.(recipe)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.()
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end pointer-events-none transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={handleBackdropClick}
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      ></div>

      {/* Sheet Content */}
      <div
        className={`relative w-full max-w-md mx-auto bg-background-light dark:bg-background-dark rounded-t-2xl transform transition-transform max-h-[90vh] overflow-y-auto pointer-events-auto ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-300 dark:bg-slate-600 mt-3 mb-4"></div>

        {/* Recipe Details Content */}
        <div className="px-4 pb-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-text-light dark:text-text-dark font-semibold text-base">
                {recipe.author?.name || 'Utilisateur'}
              </p>
              {recipe.author?.timeAgo && (
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs mt-0.5">
                  {recipe.author.timeAgo}
                </p>
              )}
            </div>
          </div>

          {/* Recipe Title and Description */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
              {recipe.name || recipe.recipe_name}
            </h2>
            {recipe.description && (
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                {recipe.description}
              </p>
            )}
          </div>

          {/* Recipe Info */}
          <div className="grid grid-cols-2 gap-3">
            {recipe.preparation_time_minutes && (
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-3 text-center shadow-soft dark:shadow-none">
                <span className="material-symbols-outlined text-primary text-2xl block mb-1">
                  schedule
                </span>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                  Temps
                </p>
                <p className="text-text-light dark:text-text-dark font-semibold text-sm">
                  {recipe.preparation_time_minutes} min
                </p>
              </div>
            )}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-3 text-center shadow-soft dark:shadow-none">
              <span className="material-symbols-outlined text-primary text-2xl block mb-1">
                favorite
              </span>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                Favoris
              </p>
              <p className="text-text-light dark:text-text-dark font-semibold text-sm">
                {recipe.favoritesCount || 0}
              </p>
            </div>
          </div>

          {/* Ingredients Section */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                Ingrédients
              </h3>
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-soft dark:shadow-none">
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="material-symbols-outlined text-primary text-base mr-3 mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span className="text-text-light dark:text-text-dark text-sm">
                        {typeof ingredient === 'string'
                          ? ingredient
                          : ingredient.name || ingredient}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Steps Section */}
          {recipe.steps && recipe.steps.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                Instructions
              </h3>
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-soft dark:shadow-none space-y-4">
                <ol className="space-y-4">
                  {recipe.steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 flex items-center justify-center size-8 bg-primary text-white font-bold text-sm rounded-full mr-3 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-text-light dark:text-text-dark text-sm leading-relaxed">
                        {typeof step === 'string' ? step : step.instruction || step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleToggleFavorite}
              className={`w-full py-4 px-4 rounded-xl text-center font-bold text-lg shadow-fab flex items-center justify-center gap-2 transition-colors ${
                isFavorited
                  ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                  : 'bg-primary text-white hover:opacity-90'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                favorite
              </span>
              {isFavorited ? 'Retiré des favoris' : 'Ajouter aux favoris'}
            </button>
            <button
              onClick={handleShare}
              className="w-full py-3 px-4 rounded-xl text-center font-semibold bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark shadow-soft dark:shadow-none hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined align-middle mr-2">
                share
              </span>
              Partager cette recette
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailSheet

