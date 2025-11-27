import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/api'
import { useApp } from '../../contexts/AppContext'

/**
 * Composant ProfileHeader - En-tête de la page de profil
 * Affiche le titre, la salutation et le bouton de déconnexion
 */
function ProfileHeader() {
  const navigate = useNavigate()
  const { user, setUser } = useApp()

  const handleLogout = async () => {
    try {
      // Appeler le service de déconnexion qui supprime le token JWT
      await authService.logout()
    } catch (error) {
      // Même en cas d'erreur API, on nettoie le token localement
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      // S'assurer que le token JWT est supprimé et nettoyer l'état
      setUser(null)
      navigate('/', { replace: true })
    }
  }

  // Pour les admins, name n'est pas retourné par l'API, utiliser email
  // Pour les clients, utiliser name si disponible, sinon email
  const userName = user?.name || user?.email || 'Utilisateur'
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.role === 'admin' || user?.role === 'ADMIN'
  const title = isAdmin ? 'Mon Profil Admin' : 'Mon Profil'

  return (
    <header className="w-full px-4 pt-4 pb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bonjour, <span className="text-primary font-medium">{userName}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          
        </button>
      </div>
    </header>
  )
}

export default ProfileHeader

