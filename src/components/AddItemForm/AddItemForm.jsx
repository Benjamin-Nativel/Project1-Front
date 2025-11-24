import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../PageHeader'

/**
 * Composant AddItemForm - Formulaire d'ajout d'item (Mobile First)
 * @param {Object} props
 * @param {Function} props.onSubmit - Fonction appelée lors de la soumission du formulaire
 * @param {boolean} props.isLoading - État de chargement
 */
function AddItemForm({ onSubmit, isLoading = false }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    category: 'Frais',
    emoji: '📦'
  })
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState(null)

  const categories = ['Frais', 'Épicerie', 'Congelé', 'Boissons']

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

  const handleEmojiClick = () => {
    // TODO: Implémenter un sélecteur d'emoji ou de photo
    const emojis = ['🍎', '🥛', '🍗', '🍞', '🥚', '🧀', '🥕', '🥑', '🍌', '🍊', '🥖', '🧈']
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
    setFormData(prev => ({ ...prev, emoji: randomEmoji }))
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de l\'article est requis'
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = 'La quantité est requise'
    } else if (isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'La quantité doit être un nombre positif'
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
      const itemData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        id: Date.now() // ID temporaire, sera remplacé par le backend
      }
      onSubmit?.(itemData)
      navigate('/inventaire')
    }
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      {/* Header - Collé à la sidebar */}
      <PageHeader title="Ajouter un article" backPath="/inventaire" />

      {/* Main Content - Centré */}
      <main className="flex-1 mx-auto w-full max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl px-4 md:px-6 lg:px-8 py-2 md:py-4 lg:py-6 space-y-6 md:space-y-8 pb-28 md:pb-32">
        {/* Photo/Emoji Section */}
        <div className="flex flex-col items-center justify-center pt-4">
          <button
            type="button"
            onClick={handleEmojiClick}
            className="flex items-center justify-center size-28 rounded-2xl bg-slate-200 dark:bg-slate-700 text-text-secondary-light dark:text-text-secondary-dark hover:opacity-80 transition-opacity"
          >
            <span className="text-6xl">{formData.emoji}</span>
          </button>
          <p className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Ajouter une photo ou un emoji
          </p>
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

          {/* Quantity */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2"
            >
              Quantité
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              className={`form-input w-full rounded-xl border-2 transition-colors bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 h-14 ${
                errors.quantity
                  ? 'border-destructive'
                  : focusedField === 'quantity'
                    ? 'border-primary'
                    : 'border-slate-300 dark:border-slate-600'
              }`}
              placeholder="ex: 5"
              value={formData.quantity}
              onChange={handleChange}
              onFocus={() => setFocusedField('quantity')}
              onBlur={() => setFocusedField(null)}
              disabled={isLoading}
            />
            {errors.quantity && (
              <span className="text-sm text-destructive mt-1 block">{errors.quantity}</span>
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
              disabled={isLoading}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-sm text-destructive mt-1 block">{errors.category}</span>
            )}
          </div>

          {/* Submit Button */}
          <div className="fixed md:absolute bottom-24 md:bottom-6 left-0 right-0 px-4 md:px-0 max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 rounded-xl text-center font-bold bg-primary text-white text-lg disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {isLoading ? 'Ajout...' : 'Ajouter à l\'inventaire'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default AddItemForm

