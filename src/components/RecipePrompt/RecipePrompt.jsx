import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../PageHeader'

/**
 * Composant RecipePrompt - Formulaire de génération de recette (Mobile First)
 * @param {Object} props
 * @param {Function} props.onSubmit - Fonction appelée lors de la soumission du formulaire
 * @param {boolean} props.isLoading - État de chargement
 */
function RecipePrompt({ onSubmit, isLoading = false }) {
  const navigate = useNavigate()
  const [ingredients, setIngredients] = useState('')
  const [focusedField, setFocusedField] = useState(null)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const value = e.target.value
    setIngredients(value)
    // Effacer l'erreur si le champ est modifié
    if (errors.ingredients) {
      setErrors(prev => ({ ...prev, ingredients: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!ingredients.trim()) {
      newErrors.ingredients = 'Veuillez entrer au moins un ingrédient'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validate()) {
      onSubmit?.(ingredients.trim())
    }
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      {/* Header - Collé à la sidebar */}
      <PageHeader title="Générateur de recettes" backPath="/inventaire" />

      {/* Main Content - Centré */}
      <main className="flex-1 mx-auto w-full max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl px-4 md:px-6 lg:px-8 py-2 md:py-4 lg:py-6 flex flex-col pb-28 md:pb-32">
        {/* Centered Section */}
          <div className="flex-1 flex flex-col justify-center text-center">
          <span className="material-symbols-outlined text-7xl md:text-8xl lg:text-9xl text-primary mx-auto">
            restaurant_menu
          </span>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-light dark:text-text-dark mt-4 md:mt-6">
            Que voulez-vous cuisiner ?
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2 md:mt-3 text-base md:text-lg">
            Dites-nous quels ingrédients vous avez, et nous vous suggérerons une recette.
          </p>
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="recipe-prompt"
                className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2"
              >
                Ingrédients
              </label>
              <textarea
                id="recipe-prompt"
                name="ingredients"
                className={`form-textarea w-full rounded-xl border-2 transition-colors bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 min-h-28 md:min-h-32 lg:min-h-36 resize-none ${
                  errors.ingredients
                    ? 'border-destructive'
                    : focusedField === 'ingredients'
                      ? 'border-primary'
                      : 'border-slate-300 dark:border-slate-600'
                }`}
                placeholder="ex: poitrine de poulet, riz, brocoli..."
                value={ingredients}
                onChange={handleChange}
                onFocus={() => setFocusedField('ingredients')}
                onBlur={() => setFocusedField(null)}
                disabled={isLoading}
              />
              {errors.ingredients && (
                <span className="text-sm text-destructive mt-1 block">{errors.ingredients}</span>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-auto pt-6">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-4 px-4 rounded-xl text-center font-bold bg-primary text-white text-lg disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {isLoading ? 'Génération...' : 'Générer une recette'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default RecipePrompt

