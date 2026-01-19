import { useState, useEffect, useRef } from 'react'
import { useCategories } from '../../hooks'

/**
 * Composant IngredientFormSheet - Bottom sheet pour créer/modifier un ingrédient
 * @param {Object} props
 * @param {boolean} props.isOpen - État d'ouverture du sheet
 * @param {Function} props.onClose - Fonction appelée lors de la fermeture
 * @param {Function} props.onSubmit - Fonction appelée lors de la soumission
 * @param {Object} props.editingItem - Item en cours d'édition (null si création)
 * @param {boolean} props.isLoading - État de chargement
 */
function IngredientFormSheet({
  isOpen,
  onClose,
  onSubmit,
  editingItem = null,
  isLoading = false
}) {
  const { categories } = useCategories()
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})

  // Définir la catégorie par défaut une fois que les catégories sont chargées
  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      const firstCategory = typeof categories[0] === 'string' 
        ? categories[0] 
        : (categories[0].id || categories[0].name)
      setFormData(prev => ({ ...prev, category: firstCategory }))
    }
  }, [categories, formData.category])

  // Nettoyer l'URL de prévisualisation lors du démontage
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  // Mettre à jour le formulaire quand editingItem change
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        category: editingItem.categoryId || editingItem.category || '',
        image: null // Ne pas précharger l'image existante, l'utilisateur peut en ajouter une nouvelle
      })
      setImagePreview(null)
    } else {
      // Réinitialiser avec la première catégorie si disponible
      const defaultCategory = categories.length > 0
        ? (typeof categories[0] === 'string' 
          ? categories[0] 
          : (categories[0].id || categories[0].name))
        : ''
      setFormData({
        name: '',
        category: defaultCategory,
        image: null
      })
      setImagePreview(null)
    }
    setErrors({})
    // Réinitialiser les file inputs
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = ''
    }
  }, [editingItem, isOpen, categories])

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier la taille (2 Mo max)
    const maxSize = 2 * 1024 * 1024 // 2 Mo en octets
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        image: 'L\'image ne doit pas dépasser 2 Mo'
      }))
      return
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        image: 'Format d\'image invalide. Formats acceptés: JPG, PNG, GIF, WEBP'
      }))
      return
    }

    // Créer une prévisualisation
    const preview = URL.createObjectURL(file)
    setImagePreview(preview)
    setFormData(prev => ({
      ...prev,
      image: file
    }))
    
    // Effacer l'erreur
    if (errors.image) {
      setErrors(prev => ({
        ...prev,
        image: ''
      }))
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleCameraClick = () => {
    cameraInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
    setFormData(prev => ({
      ...prev,
      image: null
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = ''
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de l\'ingrédient est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validate()) {
      // Préparer les données pour l'API
      // L'API attend: { name, category }
      let categoryValue = formData.category
      
      // Si la valeur est un nombre (ID), on la convertit en number
      // Sinon, on garde le string (nom de catégorie)
      const categoryAsNumber = Number(formData.category)
      if (!isNaN(categoryAsNumber) && formData.category !== '' && String(categoryAsNumber) === String(formData.category)) {
        categoryValue = categoryAsNumber
      }
      
      onSubmit?.({
        name: formData.name.trim(),
        category: categoryValue,
        image: formData.image || undefined
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
          {editingItem ? 'Modifier l\'Ingrédient' : 'Nouvel Ingrédient'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Section */}
          <div className="flex flex-col items-center justify-center">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/jpeg,image/jpg,image/png"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="size-28 rounded-2xl object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 flex items-center justify-center size-8 rounded-full bg-destructive text-white hover:opacity-80 transition-opacity"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="flex items-center justify-center size-28 rounded-2xl bg-slate-200 dark:bg-slate-700 text-text-secondary-light dark:text-text-secondary-dark hover:opacity-80 transition-opacity"
                >
                  <span className="material-symbols-outlined text-5xl">add_photo_alternate</span>
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-text-light dark:text-text-dark hover:opacity-80 transition-opacity text-sm"
                  >
                    <span className="material-symbols-outlined text-lg">photo_library</span>
                    Galerie
                  </button>
                  <button
                    type="button"
                    onClick={handleCameraClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:opacity-80 transition-opacity text-sm"
                  >
                    <span className="material-symbols-outlined text-lg">camera_alt</span>
                    Caméra
                  </button>
                </div>
              </div>
            )}
            <p className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {imagePreview ? 'Cliquez pour changer la photo' : 'Ajouter une photo (optionnel)'}
            </p>
            {errors.image && (
              <span className="text-sm text-destructive mt-1">{errors.image}</span>
            )}
          </div>

          {/* Name */}
          <div>
            <label
              className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1"
              htmlFor="ingredient-name"
            >
              Nom de l'ingrédient
            </label>
            <input
              className={`form-input w-full rounded-xl border-2 transition-colors bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 h-14 ${
                errors.name
                  ? 'border-destructive'
                  : 'border-slate-300 dark:border-slate-600 focus:border-primary'
              }`}
              id="ingredient-name"
              name="name"
              type="text"
              placeholder="Ex: Pomme"
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

export default IngredientFormSheet

