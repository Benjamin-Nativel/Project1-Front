import { useState, useEffect } from 'react'
import { BottomNavigation, AdminListContent, FlashMessage, CategoryFormSheet } from '../../components'
import { categoriesService } from '../../services/api'
import { formatErrorMessage } from '../../utils/errors'
import { getAdminCategoriesCache, setAdminCategoriesCache } from '../../utils/storage'

/**
 * Page Admin - Gestion des Catégories
 * Permet aux administrateurs de créer, modifier et supprimer des catégories
 */
function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [flashMessage, setFlashMessage] = useState(null)

  // Charger les données au montage du composant
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    // Vérifier le cache localStorage d'abord
    const cachedData = getAdminCategoriesCache()
    if (cachedData) {
      setCategories(cachedData)
      setIsLoading(false)
      // Charger en arrière-plan pour mettre à jour le cache
      loadCategoriesInBackground()
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // Récupérer toutes les catégories (pour admin)
      const data = await categoriesService.getAllCategories()
      
      // Mettre à jour le cache
      setAdminCategoriesCache(data)
      
      setCategories(data)
    } catch (error) {
      const errorMessage = formatErrorMessage(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les catégories en arrière-plan pour mettre à jour le cache
  const loadCategoriesInBackground = async () => {
    try {
      const data = await categoriesService.getAllCategories()
      setAdminCategoriesCache(data)
      setCategories(data)
    } catch (error) {
      console.error('Erreur lors du chargement en arrière-plan des catégories admin:', error)
    }
  }

  const handleCreateCategory = async (categoryData) => {
    try {
      setIsLoading(true)
      setFlashMessage(null)
      
      const response = await categoriesService.createCategory(categoryData)
      
      setFlashMessage({
        message: `Catégorie "${response.category?.name || categoryData.name}" créée avec succès!`,
        type: 'success'
      })
      
      // Recharger la liste et mettre à jour le cache
      const updatedData = await categoriesService.getAllCategories()
      setAdminCategoriesCache(updatedData)
      setCategories(updatedData)
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

  const handleUpdateCategory = async (categoryId, categoryData) => {
    try {
      setIsLoading(true)
      setFlashMessage(null)
      
      const response = await categoriesService.updateCategory(categoryId, categoryData)
      
      setFlashMessage({
        message: `Catégorie "${response.category?.name || categoryData.name}" modifiée avec succès!`,
        type: 'success'
      })
      
      // Recharger la liste et mettre à jour le cache
      const updatedData = await categoriesService.getAllCategories()
      setAdminCategoriesCache(updatedData)
      setCategories(updatedData)
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

  const handleDeleteCategory = async (categoryId) => {
    try {
      setIsLoading(true)
      setFlashMessage(null)
      
      await categoriesService.deleteCategory(categoryId)
      
      setFlashMessage({
        message: 'Catégorie supprimée avec succès!',
        type: 'success'
      })
      
      // Recharger la liste et mettre à jour le cache
      const updatedData = await categoriesService.getAllCategories()
      setAdminCategoriesCache(updatedData)
      setCategories(updatedData)
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
          items={categories}
          onCreateItem={handleCreateCategory}
          onUpdateItem={handleUpdateCategory}
          onDeleteItem={handleDeleteCategory}
          isLoading={isLoading}
          error={error}
          onRetry={loadCategories}
          title="Gestion des Catégories"
          backPath="/profil"
          searchPlaceholder="Rechercher une catégorie..."
          emptyMessage="Aucune catégorie"
          emptySearchMessage="Aucun résultat trouvé"
          loadingMessage="Chargement des catégories..."
          deleteConfirmMessage="Êtes-vous sûr de vouloir supprimer cette catégorie ?"
          createButtonLabel="Créer une catégorie"
          FormSheet={CategoryFormSheet}
          renderItem={(item, handleEditClick, handleDeleteClick) => (
            <div
              key={item.id}
              className="item-card flex items-center gap-4 bg-surface-light dark:bg-surface-dark p-4 min-h-[72px] justify-between rounded-xl shadow-soft dark:shadow-none"
              data-name={item.name?.toLowerCase() || ''}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="text-4xl flex items-center justify-center rounded-lg bg-background-light dark:bg-background-dark shrink-0 size-14">
                  <span className="material-symbols-outlined text-2xl">category</span>
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal line-clamp-1">
                    {item.name || 'Catégorie sans nom'}
                  </p>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal mt-1">
                    ID: {item.id}
                  </p>
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

export default AdminCategories

