import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../PageHeader'
import { useCategories } from '../../hooks'

/**
 * Composant AddItemForm - Formulaire d'ajout d'item (Mobile First)
 * @param {Object} props
 * @param {Function} props.onSubmit - Fonction appelée lors de la soumission du formulaire
 * @param {boolean} props.isLoading - État de chargement
 */
function AddItemForm({ onSubmit, isLoading = false }) {
  const navigate = useNavigate()
  const { categories, isLoading: isLoadingCategories } = useCategories()
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState(null)

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
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de l\'article est requis'
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validate()) {
      // Préparer les données pour l'API
      // La catégorie peut être un ID (number) ou un nom (string)
      // Le select retourne toujours une string, donc on doit vérifier si c'est un nombre
      let categoryValue = formData.category
      
      // Si la valeur est un nombre (ID), on la convertit en number
      // Sinon, on garde le string (nom de catégorie)
      const categoryAsNumber = Number(formData.category)
      if (!isNaN(categoryAsNumber) && formData.category !== '' && String(categoryAsNumber) === String(formData.category)) {
        categoryValue = categoryAsNumber
      }
      
      console.log('Submitting item data:', {
        name: formData.name.trim(),
        category: categoryValue,
        categoryType: typeof categoryValue,
        hasImage: !!formData.image
      })
      
      const itemData = {
        name: formData.name.trim(),
        category: categoryValue,
        image: formData.image
      }
      
      onSubmit?.(itemData)
    }
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      {/* Header - Collé à la sidebar */}
      <PageHeader title="Créer un ingrédient" backPath="/inventaire" />

      {/* Main Content - Centré */}
      <main className="flex-1 mx-auto w-full max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl px-4 md:px-6 lg:px-8 py-2 md:py-4 lg:py-6 space-y-6 md:space-y-8 pb-28 md:pb-32">
        {/* Photo Section */}
        <div className="flex flex-col items-center justify-center pt-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
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
            <button
              type="button"
              onClick={handleImageClick}
              className="flex items-center justify-center size-28 rounded-2xl bg-slate-200 dark:bg-slate-700 text-text-secondary-light dark:text-text-secondary-dark hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-5xl">add_photo_alternate</span>
            </button>
          )}
          <p className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {imagePreview ? 'Cliquez pour changer la photo' : 'Ajouter une photo (optionnel)'}
          </p>
          {errors.image && (
            <span className="text-sm text-destructive mt-1">{errors.image}</span>
          )}
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div>
            <label
              htmlFor="item-name"
              className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2"
            >
              Nom de l'article
            </label>
            <input
              type="text"
              id="item-name"
              name="name"
              className={`form-input w-full rounded-xl border-2 transition-colors bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 h-14 ${
                errors.name
                  ? 'border-destructive'
                  : focusedField === 'name'
                    ? 'border-primary'
                    : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder="ex: Pommes"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              disabled={isLoading}
            />
            {errors.name && (
              <span className="text-sm text-destructive mt-1 block">{errors.name}</span>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2"
            >
              Catégorie
            </label>
            <select
              id="category"
              name="category"
              className={`form-select w-full rounded-xl border-2 transition-colors bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 h-14 ${
                errors.category
                  ? 'border-destructive'
                  : focusedField === 'category'
                    ? 'border-primary'
                    : 'border-slate-300 dark:border-slate-600'
              }`}
              value={formData.category}
              onChange={handleChange}
              onFocus={() => setFocusedField('category')}
              onBlur={() => setFocusedField(null)}
              disabled={isLoading || isLoadingCategories}
            >
              {isLoadingCategories ? (
                <option value="">Chargement des catégories...</option>
              ) : (
                categories.map((category) => {
                  const categoryName = typeof category === 'string' ? category : category.name
                  // Utiliser l'ID si disponible, sinon le nom
                  const categoryValue = typeof category === 'object' && category.id 
                    ? category.id 
                    : categoryName
                  const categoryKey = typeof category === 'object' && category.id 
                    ? category.id 
                    : categoryName
                  return (
                    <option key={categoryKey} value={categoryValue}>
                      {categoryName}
                    </option>
                  )
                })
              )}
            </select>
            {errors.category && (
              <span className="text-sm text-destructive mt-1 block">{errors.category}</span>
            )}
          </div>

          {/* Submit Button */}
          <div className="fixed md:absolute bottom-24 md:bottom-6 left-0 right-0 px-4 md:px-0 max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto">
            <button
              type="submit"
              disabled={isLoading || isLoadingCategories || categories.length === 0}
              className="w-full py-4 px-4 rounded-xl text-center font-bold bg-primary text-white text-lg disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {isLoading ? 'Création...' : 'Créer l\'ingrédient'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default AddItemForm

