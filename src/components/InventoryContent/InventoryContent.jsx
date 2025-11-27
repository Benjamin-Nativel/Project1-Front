import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

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
      alt={alt || 'Ingrédient'}
      className="w-full h-full object-cover"
      onError={() => setImageError(true)}
    />
  )
}

/**
 * Composant InventoryContent - Contenu de la page d'inventaire (Mobile First)
 * @param {Object} props
 * @param {Array} props.items - Tableau d'items de l'inventaire
 * @param {Array} props.categories - Tableau des catégories depuis l'API
 * @param {Function} props.onItemUpdate - Fonction appelée lors de la mise à jour d'un item
 * @param {Function} props.onAddItem - Fonction appelée pour ajouter un item
 * @param {boolean} props.isLoading - État de chargement
 * @param {boolean} props.isLoadingCategories - État de chargement des catégories
 * @param {string} props.error - Message d'erreur
 * @param {Function} props.onRetry - Fonction pour réessayer le chargement
 * @param {boolean} props.showAddButton - Afficher le bouton d'ajout (masqué pour les admins)
 */
function InventoryContent({ 
  items = [], 
  categories = [],
  onItemUpdate,
  onAddItem,
  isLoading = false,
  isLoadingCategories = false,
  error = null,
  onRetry,
  showAddButton = true
}) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tout')
  const [displayLimit, setDisplayLimit] = useState(12) // Afficher 12 items par défaut
  const ITEMS_PER_PAGE = 12

  // Préparer les catégories avec "Tout" en premier
  const displayCategories = useMemo(() => {
    const allCategories = [{ id: 0, name: 'Tout' }]
    if (Array.isArray(categories) && categories.length > 0) {
      // Ajouter les catégories de l'API
      allCategories.push(...categories)
    } else {
      // Catégories par défaut si l'API n'a pas encore chargé
      allCategories.push(
        { id: 1, name: 'Frais' },
        { id: 2, name: 'Congelé' },
        { id: 3, name: 'Épicerie' }
      )
    }
    return allCategories
  }, [categories])

  // Filtrer les items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Vérifier que item.name existe avant d'appeler toLowerCase()
      const itemName = item?.name || ''
      const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'Tout' || (item?.category || '') === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [items, searchQuery, selectedCategory])

  // Limiter l'affichage pour ne pas surcharger visuellement
  const displayedItems = filteredItems.slice(0, displayLimit)
  const hasMoreItems = filteredItems.length > displayLimit

  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + ITEMS_PER_PAGE)
  }

  // Réinitialiser la limite d'affichage quand la recherche ou la catégorie change
  const handleSearchChange = (value) => {
    setSearchQuery(value)
    setDisplayLimit(ITEMS_PER_PAGE)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setDisplayLimit(ITEMS_PER_PAGE)
  }

  const handleQuantityChange = (itemId, change) => {
    const item = items.find(i => i.id === itemId)
    if (item) {
      const newQuantity = Math.max(0, item.quantity + change)
      onItemUpdate?.(itemId, { ...item, quantity: newQuantity })
    }
  }

  return (
    <div className="relative mx-auto flex h-auto min-h-screen w-full max-w-md md:max-w-2xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[90rem] flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex flex-col gap-3 p-4 md:p-6 lg:p-4 lg:pl-6 xl:pl-8 pb-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-text-light dark:text-text-dark tracking-light text-[28px] md:text-3xl lg:text-4xl font-bold leading-tight">
              Mes Ingrédients
            </p>
            {/* Floating Action Button - Desktop only */}
            {showAddButton && (
              <button
                onClick={() => {
                  onAddItem?.()
                  navigate('/ajouter-item')
                }}
                className="hidden lg:flex h-16 w-16 xl:h-20 xl:w-20 items-center justify-center rounded-2xl bg-primary text-white shadow-fab cursor-pointer hover:opacity-90 transition-opacity"
              >
                <span
                  className="material-symbols-outlined text-4xl"
                  style={{ fontVariationSettings: "'wght' 500" }}
                >
                  add
                </span>
              </button>
            )}
          </div>
          
          {/* SearchBar */}
          <label className="flex flex-col min-w-40 h-14 md:w-full lg:w-auto lg:max-w-md xl:max-w-lg">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-soft dark:shadow-none">
              <div className="text-text-secondary-light dark:text-text-secondary-dark flex bg-surface-light dark:bg-surface-dark items-center justify-center pl-4 rounded-l-xl border-r-0">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                type="text"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-surface-light dark:bg-surface-dark h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark px-4 pl-2 text-base font-normal leading-normal"
                placeholder="Rechercher des bananes, du lait, ..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </label>
        </div>

        {/* Chips */}
        <div className="flex gap-3 px-4 md:px-6 lg:px-0 lg:pl-6 xl:pl-8 pb-4 overflow-x-auto">
          {displayCategories.map((category) => {
            const categoryName = typeof category === 'string' ? category : category.name
            const categoryId = typeof category === 'object' ? category.id : category
            
            return (
              <button
                key={categoryId}
                onClick={() => handleCategoryChange(categoryName)}
                disabled={isLoadingCategories}
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl pl-4 pr-4 cursor-pointer transition-colors ${
                  selectedCategory === categoryName
                    ? 'bg-primary'
                    : 'bg-surface-light dark:bg-surface-dark shadow-soft dark:shadow-none'
                } ${isLoadingCategories ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <p
                  className={`text-sm font-medium leading-normal ${
                    selectedCategory === categoryName
                      ? 'text-white'
                      : 'text-text-light dark:text-text-dark'
                  }`}
                >
                  {categoryName}
                </p>
              </button>
            )
          })}
        </div>
      </header>

      {/* Main Content: Item List */}
      <main className="flex-1 px-4 md:px-6 lg:px-0 lg:pl-6 xl:pl-8 py-2 md:py-4 lg:py-6 space-y-3 md:space-y-4 pb-24 md:pb-32">
        {/* État de chargement */}
        {isLoading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Chargement de l'inventaire...
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
              {searchQuery || selectedCategory !== 'Tout' 
                ? 'Aucun résultat trouvé' 
                : 'Votre inventaire est vide'}
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
              {searchQuery || selectedCategory !== 'Tout'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Appuyez sur le bouton \'+\' pour ajouter votre premier article !'}
            </p>
          </div>
        )}

        {/* Liste d'items */}
        {!isLoading && !error && displayedItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
              {displayedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-surface-light dark:bg-surface-dark p-4 md:p-5 lg:p-6 min-h-[72px] md:min-h-[80px] justify-between rounded-xl shadow-soft dark:shadow-none"
              >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-lg bg-background-light dark:bg-background-dark shrink-0 size-14 overflow-hidden">
                  <ItemImage
                    imgUrl={item.imgUrl}
                    emoji={item.emoji || '📦'}
                    alt={item?.name || 'Ingrédient'}
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal line-clamp-1">
                    {item?.name || 'Ingrédient sans nom'}
                  </p>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal mt-1">
                    {item?.category || 'Autre'}
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item.id, -1)}
                  className="flex items-center justify-center size-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-text-light dark:text-text-dark hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">remove</span>
                </button>
                <span className="text-text-light dark:text-text-dark text-base font-semibold min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item.id, 1)}
                  className="flex items-center justify-center size-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-text-light dark:text-text-dark hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
              </div>
              ))}
            </div>
            
            {/* Bouton "Charger plus" si il y a plus d'items */}
            {hasMoreItems && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 rounded-xl bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark font-medium shadow-soft dark:shadow-none hover:opacity-90 transition-opacity"
                >
                  Charger plus ({filteredItems.length - displayLimit} restants)
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Action Button - Mobile/Tablet only */}
      {showAddButton && (
        <button
          onClick={() => {
            onAddItem?.()
            navigate('/ajouter-item')
          }}
          className="fixed lg:hidden bottom-28 right-4 md:bottom-6 md:right-6 z-[90] flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-primary text-white shadow-fab cursor-pointer hover:opacity-90 transition-opacity"
        >
          <span
            className="material-symbols-outlined text-4xl"
            style={{ fontVariationSettings: "'wght' 500" }}
          >
            add
          </span>
        </button>
      )}
    </div>
  )
}

export default InventoryContent

