import { useState, useEffect, useMemo } from 'react'
import { getAdminCategoriesCache } from '../../utils/storage'

/**
 * Composant CategoryFormSheet - Bottom sheet pour créer/modifier une catégorie
 * @param {Object} props
 * @param {boolean} props.isOpen - État d'ouverture du sheet
 * @param {Function} props.onClose - Fonction appelée lors de la fermeture
 * @param {Function} props.onSubmit - Fonction appelée lors de la soumission
 * @param {Object} props.editingItem - Catégorie en cours d'édition (null si création)
 * @param {boolean} props.isLoading - État de chargement
 */
function CategoryFormSheet({
  isOpen,
  onClose,
  onSubmit,
  editingItem = null,
  isLoading = false
}) {
  const [formData, setFormData] = useState({
    name: ''
  })
  const [errors, setErrors] = useState({})

  // Récupérer les catégories du cache pour vérifier l'unicité
  const existingCategories = useMemo(() => {
    const cachedCategories = getAdminCategoriesCache()
    return Array.isArray(cachedCategories) ? cachedCategories : []
  }, [isOpen]) // Recharger quand le sheet s'ouvre

  // Vérifier si la catégorie existe déjà (insensible à la casse)
  const categoryExists = useMemo(() => {
    if (!formData.name.trim()) {
      // Ne pas vérifier si le champ est vide
      return false
    }
    
    const trimmedName = formData.name.trim().toLowerCase()
    
    // En mode modification, exclure la catégorie en cours d'édition
    if (editingItem) {
      return existingCategories.some(
        category => 
          category.id !== editingItem.id && 
          category.name?.toLowerCase() === trimmedName
      )
    }
    
    // En mode création, vérifier contre toutes les catégories
    return existingCategories.some(
      category => category.name?.toLowerCase() === trimmedName
    )
  }, [formData.name, existingCategories, editingItem])

  // Mettre à jour le formulaire quand editingItem change
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || ''
      })
    } else {
      setFormData({
        name: ''
      })
    }
    setErrors({})
  }, [editingItem, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Mettre à jour l'erreur de duplication en temps réel
  useEffect(() => {
    if (categoryExists) {
      setErrors(prev => ({
        ...prev,
        name: 'Une catégorie avec ce nom existe déjà'
      }))
    } else {
      // Effacer l'erreur de duplication si la catégorie n'existe plus
      setErrors(prev => {
        if (prev.name === 'Une catégorie avec ce nom existe déjà') {
          const newErrors = { ...prev }
          delete newErrors.name
          return newErrors
        }
        return prev
      })
    }
  }, [categoryExists])

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la catégorie est requis'
    } else if (categoryExists) {
      newErrors.name = 'Une catégorie avec ce nom existe déjà'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Le bouton est cliquable si :
  // - Le nom n'est pas vide
  // - La catégorie n'existe pas déjà (en excluant celle en cours d'édition en mode modification)
  // - On n'est pas en train de charger
  const isFormValid = formData.name.trim() && !categoryExists
  const isSubmitDisabled = isLoading || !isFormValid
  // Le bouton est grisé si la catégorie existe déjà (mais reste visible)
  const isButtonGrayed = categoryExists && formData.name.trim()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validate()) {
      onSubmit?.({
        name: formData.name.trim()
      })
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end pointer-events-none transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 bottom-sheet-backdrop transition-opacity duration-300"
        onClick={onClose}
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
      ></div>

      {/* Sheet Content */}
      <div
        className={`relative w-full max-w-md mx-auto bg-background-light dark:bg-background-dark rounded-t-2xl bottom-sheet pointer-events-auto max-h-[90vh] flex flex-col transition-transform duration-300 mb-20 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ zIndex: 100 }}
      >
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-2">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-300 dark:bg-slate-600 mb-4"></div>
          
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-6 text-center">
            {editingItem ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6" id="category-form">
            {/* Name */}
            <div>
              <label
                className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1"
                htmlFor="category-name"
              >
                Nom de la catégorie
              </label>
              <input
                className={`form-input w-full rounded-xl border-2 transition-colors bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 h-14 ${
                  errors.name
                    ? 'border-destructive'
                    : 'border-slate-300 dark:border-slate-600 focus:border-primary'
                }`}
                id="category-name"
                name="name"
                type="text"
                placeholder="Ex: Fruits"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              {errors.name && (
                <span className="text-sm text-destructive mt-1 block">{errors.name}</span>
              )}
            </div>
          </form>
        </div>

        {/* Fixed Action Buttons - Toujours visible en bas */}
        <div className="p-4 pt-2 border-t border-slate-200 dark:border-slate-700 flex-shrink-0 bg-background-light dark:bg-background-dark rounded-b-2xl">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="py-3 px-4 rounded-xl text-center font-bold bg-slate-200 dark:bg-slate-700 text-text-light dark:text-text-dark hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="submit"
              form="category-form"
              disabled={isSubmitDisabled}
              className={`py-3 px-4 rounded-xl text-center font-bold transition-all ${
                isButtonGrayed
                  ? 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                  : isSubmitDisabled
                  ? 'bg-primary text-white opacity-50 cursor-not-allowed'
                  : 'bg-primary text-white hover:opacity-90 active:scale-95'
              }`}
              title={isButtonGrayed ? 'Cette catégorie existe déjà' : ''}
            >
              {isLoading ? 'Validation...' : 'Valider'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryFormSheet

