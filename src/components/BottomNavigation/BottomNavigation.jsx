import { Link, useLocation, useNavigate } from 'react-router-dom'
import { removeToken } from '../../utils/storage'

/**
 * Composant BottomNavigation - Barre de navigation en bas (Mobile First)
 * @param {Object} props
 * @param {Array} props.items - Tableau d'objets avec { path, icon, label, isActive }
 */
function BottomNavigation({ items = [] }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    removeToken()
    navigate('/', { replace: true })
  }

  const defaultItems = [
    {
      path: '/inventaire',
      icon: 'inventory_2',
      label: 'Inventaire',
      isActive: location.pathname === '/inventaire'
    },
    {
      path: '/recipes',
      icon: 'restaurant_menu',
      label: 'Recette',
      isActive: location.pathname === '/recipes'
    }
  ]

  const navigationItems = items.length > 0 ? items : defaultItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:left-0 md:top-0 md:right-auto md:bottom-auto z-[9999] mx-auto max-w-md md:max-w-full border-t md:border-t-0 md:border-r border-slate-200/50 dark:border-slate-700/50 bg-surface-light dark:bg-surface-dark backdrop-blur-md md:w-20 lg:w-24 md:h-screen md:flex md:flex-col md:justify-start md:pt-8 shadow-lg md:shadow-none transform-gpu">
      <div className="flex md:flex-col h-20 md:h-auto md:w-full items-center justify-around md:justify-start md:gap-6 px-4 md:px-0">
        {navigationItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              item.isActive || location.pathname === item.path
                ? 'text-primary'
                : 'text-text-secondary-light dark:text-text-secondary-dark'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: item.isActive || location.pathname === item.path
                  ? "'FILL' 1"
                  : "'FILL' 0"
              }}
            >
              {item.icon}
            </span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default BottomNavigation

