import { useState, useEffect } from 'react'
import { BottomNavigation, AdminListContent, FlashMessage, UserFormSheet } from '../../components'
import { usersService } from '../../services/api/users'
import { formatErrorMessage } from '../../utils/errors'
import { getAdminUsersCache, setAdminUsersCache } from '../../utils/storage'

/**
 * Page Admin - Gestion des Utilisateurs
 * Permet aux administrateurs de créer, modifier et supprimer des utilisateurs
 */
function AdminUsers() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [flashMessage, setFlashMessage] = useState(null)

  // Charger les données au montage du composant
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    // Vérifier le cache localStorage d'abord
    const cachedData = getAdminUsersCache()
    if (cachedData) {
      setUsers(cachedData)
      setIsLoading(false)
      // Charger en arrière-plan pour mettre à jour le cache
      loadUsersInBackground()
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // Récupérer tous les utilisateurs (pour admin)
      const data = await usersService.getAllUsers()
      
      // Mettre à jour le cache
      setAdminUsersCache(data)
      
      setUsers(data)
    } catch (error) {
      const errorMessage = formatErrorMessage(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les utilisateurs en arrière-plan pour mettre à jour le cache
  const loadUsersInBackground = async () => {
    try {
      const data = await usersService.getAllUsers()
      setAdminUsersCache(data)
      setUsers(data)
    } catch (error) {
      console.error('Erreur lors du chargement en arrière-plan des utilisateurs admin:', error)
    }
  }

  const handleCreateUser = async (userData) => {
    try {
      setIsLoading(true)
      setFlashMessage(null)
      
      const response = await usersService.createUser(userData)
      
      setFlashMessage({
        message: `Utilisateur "${response.user?.email || userData.email}" créé avec succès!`,
        type: 'success'
      })
      
      // Recharger la liste et mettre à jour le cache
      const updatedData = await usersService.getAllUsers()
      setAdminUsersCache(updatedData)
      setUsers(updatedData)
    } catch (error) {
      const errorMessage = formatErrorMessage(error)
      setFlashMessage({
        message: errorMessage,
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateUser = async (userId, userData) => {
    try {
      setIsLoading(true)
      setFlashMessage(null)
      
      const response = await usersService.updateUser(userId, userData)
      
      setFlashMessage({
        message: `Utilisateur "${response.user?.email || userData.email}" modifié avec succès!`,
        type: 'success'
      })
      
      // Recharger la liste et mettre à jour le cache
      const updatedData = await usersService.getAllUsers()
      setAdminUsersCache(updatedData)
      setUsers(updatedData)
    } catch (error) {
      const errorMessage = formatErrorMessage(error)
      setFlashMessage({
        message: errorMessage,
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      setIsLoading(true)
      setFlashMessage(null)
      
      await usersService.deleteUser(userId)
      
      setFlashMessage({
        message: 'Utilisateur supprimé avec succès!',
        type: 'success'
      })
      
      // Recharger la liste et mettre à jour le cache
      const updatedData = await usersService.getAllUsers()
      setAdminUsersCache(updatedData)
      setUsers(updatedData)
    } catch (error) {
      const errorMessage = formatErrorMessage(error)
      setFlashMessage({
        message: errorMessage,
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark flex md:flex-row relative overflow-x-hidden">
      {flashMessage && (
        <FlashMessage
          message={flashMessage.message}
          type={flashMessage.type}
          onClose={() => setFlashMessage(null)}
        />
      )}
      <BottomNavigation />
      <div className="flex-1 md:ml-20 lg:ml-24 overflow-x-hidden">
        <AdminListContent
          items={users}
          onCreateItem={handleCreateUser}
          onUpdateItem={handleUpdateUser}
          onDeleteItem={handleDeleteUser}
          isLoading={isLoading}
          error={error}
          onRetry={loadUsers}
          title="Gestion des Utilisateurs"
          backPath="/profil"
          searchPlaceholder="Rechercher un utilisateur..."
          emptyMessage="Aucun utilisateur"
          emptySearchMessage="Aucun résultat trouvé"
          loadingMessage="Chargement des utilisateurs..."
          deleteConfirmMessage="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
          createButtonLabel="Créer un utilisateur"
          FormSheet={UserFormSheet}
          renderItem={(item, handleEditClick, handleDeleteClick) => (
            <div
              key={item.id}
              className="item-card flex items-center gap-4 bg-surface-light dark:bg-surface-dark p-4 min-h-[72px] justify-between rounded-xl shadow-soft dark:shadow-none"
              data-name={item.email?.toLowerCase() || ''}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="text-4xl flex items-center justify-center rounded-lg bg-background-light dark:bg-background-dark shrink-0 size-14">
                  <span className="material-symbols-outlined text-2xl">person</span>
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal line-clamp-1">
                    {item.email || 'Utilisateur sans email'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">
                      ID: {item.id}
                    </p>
                    {item.name && (
                      <>
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">•</span>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">
                          {item.name}
                        </p>
                      </>
                    )}
                    {item.roles?.includes('ROLE_ADMIN') && (
                      <>
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">•</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          Admin
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => handleEditClick(item)}
                  className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  aria-label="Modifier"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(item.id)}
                  className="flex items-center justify-center size-10 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  aria-label="Supprimer"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default AdminUsers

