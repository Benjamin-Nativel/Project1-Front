import { useEffect, useState } from 'react'
import { BottomNavigation, ProfileHeader, UserProfileContent, AdminProfileContent } from '../../components'
import { useApp } from '../../contexts/AppContext'
import { getUser, getToken } from '../../utils/storage'
import { clientService } from '../../services/api'

/**
 * Page Profile - Page de profil de l'utilisateur
 * Affiche un contenu différent selon le rôle (admin ou user)
 */
function Profile() {
  const { user, setUser } = useApp()
  const [isLoading, setIsLoading] = useState(true)

  // Charger les données utilisateur depuis l'API /api/client
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true)
        // Toujours récupérer les données depuis l'API pour avoir les informations à jour
        const clientData = await clientService.getClientInfo()
        setUser(clientData)
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error)
        // En cas d'erreur, essayer de charger depuis le localStorage comme fallback
        const storedUser = getUser()
        if (storedUser) {
          setUser(storedUser)
        } else {
          // Si pas d'utilisateur stocké mais qu'on a un token, créer un utilisateur minimal
          const token = getToken()
          if (token) {
            const minimalUser = {
              email: 'utilisateur@example.com',
              name: 'Utilisateur',
              role: 'user',
              roles: ['ROLE_USER']
            }
            setUser(minimalUser)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [setUser])

  // Afficher un état de chargement pendant le chargement des données
  if (isLoading || !user) {
    const token = getToken()
    if (token) {
      return (
        <div className="w-full min-h-screen bg-background-light dark:bg-background-dark flex md:flex-row relative overflow-x-hidden">
          <BottomNavigation />
          <div className="flex-1 md:ml-20 lg:ml-24 overflow-x-hidden pb-20 md:pb-0">
            <div className="max-w-md mx-auto p-4">
              <div className="text-center text-gray-600 dark:text-gray-400">Chargement...</div>
            </div>
          </div>
        </div>
      )
    }
    // Pas de token, le ProtectedRoute devrait rediriger
    return null
  }

  // Vérifier si l'utilisateur est admin en vérifiant les rôles
  const isAdmin = user.roles?.includes('ROLE_ADMIN') || user.role === 'admin' || user.role === 'ADMIN'

  // Mode développement : basculer entre admin et user
  const toggleDevMode = () => {
    const newRole = isAdmin ? 'user' : 'admin'
    const newRoles = isAdmin 
      ? user.roles?.filter(r => r !== 'ROLE_ADMIN') || ['ROLE_USER']
      : [...(user.roles || ['ROLE_USER']), 'ROLE_ADMIN']
    
    const updatedUser = { 
      ...user, 
      role: newRole,
      roles: newRoles
    }
    setUser(updatedUser)
  }

  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark flex md:flex-row relative overflow-x-hidden">
      <BottomNavigation />
      <div className="flex-1 md:ml-20 lg:ml-24 overflow-x-hidden pb-20 md:pb-0">
        <div className="max-w-md mx-auto">
          <ProfileHeader />
          
          {/* Bouton de développement pour basculer entre admin et user */}
          {process.env.NODE_ENV === 'development' && (
            <div className="px-4 mt-4 mb-2">
              <button
                onClick={toggleDevMode}
                className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors"
                title="Mode développement : Basculer entre admin et user"
              >
                🔧 Dev: {isAdmin ? 'Passer en mode User' : 'Passer en mode Admin'}
              </button>
            </div>
          )}
          
          <div className="mt-6">
            {isAdmin ? <AdminProfileContent /> : <UserProfileContent />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

