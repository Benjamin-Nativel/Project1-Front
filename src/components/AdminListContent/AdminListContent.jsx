import { useState, useMemo } from 'react'
import PageHeader from '../PageHeader'
import ConfirmDialog from '../ConfirmDialog'

/**
 * Composant ItemImage - Affiche l'image d'un item avec fallback sur emoji
 */
function ItemImage({ imgUrl, emoji, alt }) {
  const [imageError, setImageError] = useState(false)
  
  if (!imgUrl || imageError) {
    return (
      <span className="text-4xl">
        {emoji || '📦'}
      </span>
    )
  }
  
  return (
    <img
      src={imgUrl}
      alt={alt || 'Item'}
      className="w-full h-full object-cover"
      onError={() => setImageError(true)}
    />
  )
}

/**
 * Composant AdminListContent - Composant générique pour la gestion admin (ingrédients, catégories, etc.)
 * @param {Object} props
 * @param {Array} props.items - Tableau d'items
 * @param {Function} props.onCreateItem - Fonction appelée lors de la création d'un item
 * @param {Function} props.onUpdateItem - Fonction appelée lors de la mise à jour d'un item
 * @param {Function} props.onDeleteItem - Fonction appelée lors de la suppression d'un item
 * @param {boolean} props.isLoading - État de chargement
 * @param {string} props.error - Message d'erreur
 * @param {Function} props.onRetry - Fonction pour réessayer le chargement
 * @param {string} props.title - Titre de la page
 * @param {string} props.backPath - Chemin de retour
 * @param {string} props.searchPlaceholder - Placeholder pour la recherche
 * @param {string} props.emptyMessage - Message quand la liste est vide
 * @param {string} props.emptySearchMessage - Message quand la recherche ne retourne rien
 * @param {string} props.loadingMessage - Message de chargement
 * @param {string} props.deleteConfirmMessage - Message de confirmation de suppression
 * @param {string} props.createButtonLabel - Label du bouton de création
 * @param {React.Component} props.FormSheet - Composant du formulaire (bottom sheet)
 * @param {Function} props.renderItem - Fonction pour rendre un item personnalisé (optionnel)
 */
function AdminListContent({
  items = [],
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
  isLoading = false,
  error = null,
  onRetry,
  title,
  backPath = '/profil',
  searchPlaceholder = 'Rechercher...',
  emptyMessage = 'Aucun élément',
  emptySearchMessage = 'Aucun résultat trouvé',
  loadingMessage = 'Chargement...',
  deleteConfirmMessage = 'Êtes-vous sûr de vouloir supprimer cet élément ?',
  createButtonLabel = 'Créer',
  FormSheet,
  renderItem
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, itemId: null })

  // Filtrer les items par recherche
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items
    
    const query = searchQuery.toLowerCase().trim()
    return items.filter(item => {
      const itemName = item?.name || ''
      const itemId = item?.id?.toString() || ''
      return itemName.toLowerCase().includes(query) || itemId.includes(query)
    })
  }, [items, searchQuery])

  const handleCreateClick = () => {
    setEditingItem(null)
    setIsSheetOpen(true)
  }

  const handleEditClick = (item) => {
    setEditingItem(item)
    setIsSheetOpen(true)
  }

  const handleDeleteClick = (itemId) => {
    setDeleteDialog({ isOpen: true, itemId })
  }

  const handleDeleteConfirm = async () => {
    if (deleteDialog.itemId) {
      await onDeleteItem?.(deleteDialog.itemId)
      setDeleteDialog({ isOpen: false, itemId: null })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, itemId: null })
  }

  const handleSheetClose = () => {
    setIsSheetOpen(false)
    setEditingItem(null)
  }

  const handleSheetSubmit = async (formData) => {
    if (editingItem) {
      await onUpdateItem?.(editingItem.id, formData)
    } else {
      await onCreateItem?.(formData)
    }
    handleSheetClose()
  }

  // Fonction par défaut pour rendre un item
  const defaultRenderItem = (item) => (
    <div
      key={item.id}
      className="item-card flex items-center gap-4 bg-surface-light dark:bg-surface-dark p-4 min-h-[72px] justify-between rounded-xl shadow-soft dark:shadow-none"
      data-name={item.name?.toLowerCase() || ''}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center justify-center rounded-lg bg-background-light dark:bg-background-dark shrink-0 size-14 overflow-hidden">
          <ItemImage
            imgUrl={item.imgUrl}
            emoji={item.emoji || '📦'}
            alt={item.name || 'Item'}
          />
        </div>
        <div className="flex flex-col justify-center flex-1">
          <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal line-clamp-1">
            {item.name || 'Élément sans nom'}
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
  )

  const renderItemFunction = renderItem || defaultRenderItem

  return (
    <div className="relative mx-auto flex h-auto min-h-screen w-full max-w-md md:max-w-2xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[90rem] flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      {/* Sticky Header */}
      <PageHeader title={title} backPath={backPath} />

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
                placeholder={searchPlaceholder}
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
        {isLoading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              {loadingMessage}
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
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity"
              >
                Réessayer
              </button>
            )}
          </div>
        )}

        {/* Liste vide */}
        {!isLoading && !error && filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <span className="material-symbols-outlined text-6xl text-text-secondary-light dark:text-text-secondary-dark mb-4">
              inventory_2
            </span>
            <p className="text-lg font-bold text-text-light dark:text-text-dark">
              {searchQuery ? emptySearchMessage : emptyMessage}
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
              {searchQuery
                ? 'Essayez de modifier votre recherche'
                : `Appuyez sur le bouton '+' pour créer votre premier élément !`}
            </p>
          </div>
        )}

        {/* Liste d'items */}
        {!isLoading && !error && filteredItems.length > 0 && (
          <div className="space-y-3 md:space-y-4">
            {filteredItems.map((item) => renderItemFunction(item, handleEditClick, handleDeleteClick))}
          </div>
        )}
      </main>

      {/* Floating Action Button - Caché quand le formulaire est ouvert */}
      {!isSheetOpen && (
        <button
          onClick={handleCreateClick}
          className="fixed lg:hidden bottom-28 right-4 md:bottom-6 md:right-6 z-[90] flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-primary text-white shadow-fab cursor-pointer hover:opacity-90 transition-opacity"
          aria-label={createButtonLabel}
        >
          <span
            className="material-symbols-outlined text-4xl"
            style={{ fontVariationSettings: "'wght' 500" }}
          >
            add
          </span>
        </button>
      )}

      {/* Floating Action Button - Desktop - Caché quand le formulaire est ouvert */}
      {!isSheetOpen && (
        <button
          onClick={handleCreateClick}
          className="hidden lg:flex absolute bottom-24 right-4 xl:right-8 z-40 h-16 w-16 xl:h-20 xl:w-20 items-center justify-center rounded-2xl bg-primary text-white shadow-fab cursor-pointer hover:opacity-90 transition-opacity"
          aria-label={createButtonLabel}
        >
          <span
            className="material-symbols-outlined text-4xl"
            style={{ fontVariationSettings: "'wght' 500" }}
          >
            add
          </span>
        </button>
      )}

      {/* Bottom Sheet for Create/Edit */}
      {FormSheet && (
        <FormSheet
          isOpen={isSheetOpen}
          onClose={handleSheetClose}
          onSubmit={handleSheetSubmit}
          editingItem={editingItem}
          isLoading={isLoading}
        />
      )}

      {/* Confirm Dialog for Delete */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirmation de suppression"
        message={deleteConfirmMessage}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        confirmButtonType="destructive"
      />
    </div>
  )
}

export default AdminListContent

