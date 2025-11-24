import { useNavigate } from 'react-router-dom'

/**
 * Composant PageHeader - En-tête de page avec flèche de retour et titre (Mobile First)
 * @param {Object} props
 * @param {string} props.title - Titre de la page
 * @param {string} props.backPath - Chemin de navigation pour le bouton retour (optionnel)
 * @param {Function} props.onBack - Fonction appelée lors du clic sur le bouton retour (optionnel)
 */
function PageHeader({ title, backPath, onBack }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backPath) {
      navigate(backPath)
    } else {
      navigate(-1) // Navigation par défaut vers la page précédente
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 p-4 md:p-0 md:pl-2 lg:p-0 lg:pl-1 xl:pl-1 pb-3 md:pb-4 lg:pb-4">
        <button
          onClick={handleBack}
          className="flex items-center justify-center size-10 text-text-light dark:text-text-dark hover:opacity-70 transition-opacity"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <p className="text-text-light dark:text-text-dark tracking-light text-xl md:text-2xl font-bold leading-tight">
          {title}
        </p>
      </div>
    </header>
  )
}

export default PageHeader

