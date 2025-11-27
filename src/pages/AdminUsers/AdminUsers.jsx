import { useState, useEffect, useMemo } from 'react'
import { BottomNavigation, PageHeader, ConfirmDialog, FlashMessage } from '../../components'
import { usersService } from '../../services/api/users'
import { formatErrorMessage } from '../../utils/errors'
import { getAdminUsersCache, setAdminUsersCache } from '../../utils/storage'

/**
 * Page Admin - Gestion des Utilisateurs
 * Permet aux administrateurs de lister et supprimer des utilisateurs
 * Note: La création/modification n'est pas disponible via l'admin (les utilisateurs s'inscrivent eux-mêmes)
 */
function AdminUsers() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [flashMessage, setFlashMessage] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, userId: null })

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
      // GET /api/admin/user retourne { users: [...], count: ... }
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

  const handleDeleteUser = async (userId) => {
    try {
      setIsLoading(true)
      setFlashMessage(null)
      
      // DELETE /api/admin/user/delete/{id}
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

  const handleDeleteClick = (userId) => {
    setDeleteDialog({ isOpen: true, userId })
  }

  const handleDeleteConfirm = async () => {
    if (deleteDialog.userId) {
      await handleDeleteUser(deleteDialog.userId)
      setDeleteDialog({ isOpen: false, userId: null })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, userId: null })
  }

  // Filtrer les utilisateurs par recherche (email, nom, ID)
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users
    
    const query = searchQuery.toLowerCase().trim()
    return users.filter(user => {
      const email = user?.email || ''
      const name = user?.name || ''
      const id = user?.id?.toString() || ''
      const type = user?.type || ''
      
      return (
        email.toLowerCase().includes(query) ||
        name.toLowerCase().includes(query) ||
        id.includes(query) ||
        type.toLowerCase().includes(query)
      )
    })
  }, [users, searchQuery])

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
        <div className="relative mx-auto flex h-auto min-h-screen w-full max-w-md md:max-w-2xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[90rem] flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
          {/* Sticky Header */}
          <PageHeader title="Gestion des Utilisateurs" backPath="/profil" />

          <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
            <div className="flex flex-col gap-3 p-4 md:p-6 lg:p-4 lg:pl-6 xl:pl-8 pb-3">
              {/* SearchBar */}
              <label className="flex flex-col min-w-40 h-14 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-soft dark:shadow-none">
                  <div className="text-text-secondary-light dark:text-text-secondary-dark flex bg-surface-light dark:bg-surface-dark items-center justify-center pl-4 rounded-l-xl border-r-0">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    type="text"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-surface-light dark:bg-surface-dark h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark px-4 pl-2 text-base font-normal leading-normal"
                    placeholder="Rechercher un utilisateur (email, nom, ID)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </label>
            </div>
          </header>

          {/* Main Content: List */}
          <main className="flex-1 px-4 md:px-6 lg:px-0 lg:pl-6 xl:pl-8 py-4 md:py-6 space-y-3 md:space-y-4 pb-28 md:pb-32">
            {/* État de chargement */}
            {isLoading && users.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Chargement des utilisateurs...
                </p>
              </div>
            )}

            {/* Message d'erreur */}
            {error && !isLoading && (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                <span className="material-symbols-outlined text-6xl text-destructive mb-4">
                  error
                </span>
                <p className="text-lg font-bold text-text-light dark:text-text-dark mb-2">
                  Erreur de chargement
                </p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  {error}
                </p>
                <button
                  onClick={loadUsers}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Réessayer
                </button>
              </div>
            )}

            {/* Liste vide */}
            {!isLoading && !error && filteredUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                <span className="material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  people
                </span>
                <p className="text-lg font-bold text-text-light dark:text-text-dark">
                  {searchQuery ? 'Aucun résultat trouvé' : 'Aucun utilisateur'}
                </p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
                  {searchQuery
                    ? 'Essayez de modifier votre recherche'
                    : 'Il n\'y a pas encore d\'utilisateurs dans le système'}
                </p>
              </div>
            )}

            {/* Liste d'utilisateurs */}
            {!isLoading && !error && filteredUsers.length > 0 && (
              <div className="space-y-3 md:space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="item-card flex items-center gap-4 bg-surface-light dark:bg-surface-dark p-4 min-h-[72px] justify-between rounded-xl shadow-soft dark:shadow-none"
                    data-name={user.email?.toLowerCase() || ''}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-4xl flex items-center justify-center rounded-lg bg-background-light dark:bg-background-dark shrink-0 size-14">
                        <span className="material-symbols-outlined text-2xl">person</span>
                      </div>
                      <div className="flex flex-col justify-center flex-1">
                        <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal line-clamp-1">
                          {user.email || 'Utilisateur sans email'}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">
                            ID: {user.id}
                          </p>
                          {user.name && (
                            <>
                              <span className="text-text-secondary-light dark:text-text-secondary-dark">•</span>
                              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">
                                {user.name}
                              </p>
                            </>
                          )}
                          {user.type && (
                            <>
                              <span className="text-text-secondary-light dark:text-text-secondary-dark">•</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-text-secondary-light dark:text-text-secondary-dark font-medium capitalize">
                                {user.type}
                              </span>
                            </>
                          )}
                          {user.roles?.includes('ROLE_ADMIN') && (
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
                        onClick={() => handleDeleteClick(user.id)}
                        className="flex items-center justify-center size-10 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        aria-label="Supprimer"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Confirm Dialog for Delete */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirmation de suppression"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        confirmButtonType="destructive"
      />
    </div>
  )
}

export default AdminUsers

