import { useNavigate } from 'react-router-dom'
import { routes } from '../../config/routes'

/**
 * Composant CommunityHeader - En-tête de la page Communauté avec bouton favoris
 * @param {Object} props
 */
function CommunityHeader() {
  const navigate = useNavigate()

  const handleFavoritesClick = () => {
    navigate(routes.FAVORITES)
  }

  return (
    <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="flex flex-col gap-3 p-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-text-light dark:text-text-dark tracking-light text-[28px] font-bold leading-tight">
              Communauté
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium">
              Découvrez les recettes partagées par la communauté
            </p>
          </div>
          <button
            onClick={handleFavoritesClick}
            className="flex items-center justify-center size-12 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors shrink-0"
            title="Mes recettes favorites"
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default CommunityHeader

