import { useState, useEffect } from 'react'

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

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la catégorie est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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
        className={`relative w-full max-w-md mx-auto bg-background-light dark:bg-background-dark rounded-t-2xl p-4 bottom-sheet pointer-events-auto max-h-[90vh] overflow-y-auto transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-300 dark:bg-slate-600 mb-4"></div>
        
        <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-6 text-center">
          {editingItem ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
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
              disabled={isLoading}
              className="py-3 px-4 rounded-xl text-center font-bold bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryFormSheet

