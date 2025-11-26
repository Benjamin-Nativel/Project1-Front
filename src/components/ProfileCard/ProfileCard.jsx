import { useNavigate } from 'react-router-dom'

/**
 * Composant ProfileCard - Carte cliquable pour la page de profil
 * @param {Object} props
 * @param {string} props.icon - Nom de l'icône Material Symbols
 * @param {string} props.title - Titre de la carte
 * @param {string|React.ReactNode} props.description - Description de la carte
 * @param {string} props.path - Chemin de navigation (optionnel)
 * @param {Function} props.onClick - Fonction appelée au clic (optionnel)
 */
function ProfileCard({ icon, title, description, path, onClick }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (path) {
      navigate(path)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
    >
      <div className="flex-shrink-0 w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">
          {icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
          {title}
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {description}
        </div>
      </div>
      <div className="flex-shrink-0">
        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">
          chevron_right
        </span>
      </div>
    </div>
  )
}

export default ProfileCard

