import { useEffect, useState } from 'react'
import { BottomNavigation, ProfileHeader, UserProfileContent, AdminProfileContent } from '../../components'
import { useApp } from '../../contexts/AppContext'
import { getUser, getToken, setUser as setUserStorage } from '../../utils/storage'

/**
 * Page Profile - Page de profil de l'utilisateur
 * Affiche un contenu différent selon le rôle (admin ou user)
 */
function Profile() {
  const { user, setUser } = useApp()

  // Charger les données utilisateur au montage si elles ne sont pas dans le contexte
  useEffect(() => {
    // Si l'utilisateur n'est pas dans le contexte, essayer de le charger depuis le localStorage
    if (!user) {
      const storedUser = getUser()
      if (storedUser) {
        setUser(storedUser)
      } else {
        // Si pas d'utilisateur stocké mais qu'on a un token, créer un utilisateur minimal
        // pour éviter la déconnexion (le token est valide, le ProtectedRoute l'a vérifié)
        const token = getToken()
        if (token) {
          // Créer un utilisateur minimal avec les données du token si possible
          // Sinon, utiliser des valeurs par défaut
          const minimalUser = {
            email: 'utilisateur@example.com',
            name: 'Utilisateur',
            role: 'user'
          }
          setUser(minimalUser)
        }
      }
    }
  }, [user, setUser])

  // Si pas d'utilisateur mais qu'on a un token, afficher un état de chargement
  // plutôt que de rediriger (le ProtectedRoute gère déjà l'authentification)
  if (!user) {
    const token = getToken()
    if (token) {
      // On a un token mais pas d'utilisateur dans le contexte, attendre un peu
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

  const isAdmin = user.role === 'admin' || user.role === 'ADMIN'

  // Mode développement : basculer entre admin et user
  const toggleDevMode = () => {
    const newRole = isAdmin ? 'user' : 'admin'
    const updatedUser = { ...user, role: newRole }
    setUser(updatedUser)
    setUserStorage(updatedUser)
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

