import { Navigate } from 'react-router-dom'
import { getToken } from '../../utils/storage'

/**
 * Composant ProtectedRoute - Protège les routes nécessitant une authentification
 * @param {Object} props
 * @param {React.ReactNode} props.children - Composant à afficher si l'utilisateur est connecté
 */
function ProtectedRoute({ children }) {
  const token = getToken()

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!token) {
    return <Navigate to="/" replace />
  }

  // Si l'utilisateur est connecté, afficher le composant demandé
  return children
}

export default ProtectedRoute

