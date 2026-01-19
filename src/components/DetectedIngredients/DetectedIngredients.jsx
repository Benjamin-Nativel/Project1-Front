import { useState } from 'react'
import PageHeader from '../PageHeader'
import { useCategories } from '../../hooks'

/**
 * Composant DetectedIngredients - Affiche les ingrédients détectés par l'analyse de document
 * @param {Object} props
 * @param {Array} props.ingredients - Liste des ingrédients détectés
 * @param {Function} props.onAdd - Fonction appelée pour ajouter un ingrédient (un seul à la fois)
 * @param {Function} props.onCancel - Fonction appelée pour annuler
 * @param {boolean} props.isLoading - État de chargement global
 */
function DetectedIngredients({ ingredients, onAdd, onCancel, isLoading = false }) {
  const { categories } = useCategories()
  const [editingIngredients, setEditingIngredients] = useState(
    ingredients.map(ing => ({ 
      ...ing, 
      quantity: ing.quantity || 1,
      name: ing.name || '',
      category_id: ing.category_id || null
    }))
  )
  const [addingIndex, setAddingIndex] = useState(null)

  const handleNameChange = (index, newName) => {
    setEditingIngredients(prev => 
      prev.map((ing, i) => 
        i === index ? { ...ing, name: newName } : ing
      )
    )
  }

  const handleCategoryChange = (index, categoryId) => {
    setEditingIngredients(prev => 
      prev.map((ing, i) => 
        i === index ? { ...ing, category_id: categoryId ? Number(categoryId) : null } : ing
      )
    )
  }

  const handleQuantityChange = (index, newQuantity) => {
    const quantity = Math.max(1, parseInt(newQuantity) || 1)
    setEditingIngredients(prev => 
      prev.map((ing, i) => 
        i === index ? { ...ing, quantity } : ing
      )
    )
  }

  const handleRemoveIngredient = (index) => {
    setEditingIngredients(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddIngredient = async (index) => {
    const ingredient = editingIngredients[index]
    
    if (!ingredient.name || ingredient.name.trim() === '') {
      return
    }

    if (!ingredient.category_id) {
      return
    }

    setAddingIndex(index)
    
    try {
      const ingredientToAdd = {
        name: ingredient.name.trim(),
        category_id: ingredient.category_id,
        existing_item_id: ingredient.existing_item_id,
        quantity: ingredient.quantity,
        type: ingredient.type
      }
      
      await onAdd?.(ingredientToAdd)
      
      // Retirer l'ingrédient de la liste après ajout réussi
      setEditingIngredients(prev => prev.filter((_, i) => i !== index))
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error)
    } finally {
      setAddingIndex(null)
    }
  }

  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Non catégorisé'
    const category = categories.find(cat => 
      (typeof cat === 'object' ? cat.id : null) === categoryId
    )
    return category 
      ? (typeof category === 'object' ? category.name : category)
      : `Catégorie ${categoryId}`
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      <PageHeader title="Ingrédients détectés" backPath="/inventaire" />
      
      <main className="flex-1 mx-auto w-full max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl px-4 md:px-6 lg:px-8 py-2 md:py-4 lg:py-6 space-y-4 pb-28 md:pb-32">
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="material-symbols-outlined align-middle mr-2">info</span>
            {editingIngredients.length} ingrédient(s) détecté(s). Modifiez les informations si nécessaire et ajoutez-les un par un à votre inventaire.
          </p>
        </div>

        {editingIngredients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
              Tous les ingrédients ont été ajoutés !
            </p>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity"
            >
              Retour à l'inventaire
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {editingIngredients.map((ingredient, index) => (
              <div
                key={index}
                className="border-2 border-primary bg-primary/5 dark:bg-primary/10 rounded-xl p-4 transition-all"
              >
                <div className="space-y-4">
                  {/* Header avec badge et bouton supprimer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {ingredient.type === 'EXISTING_ITEM' && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                          Existant
                        </span>
                      )}
                      {ingredient.type === 'NEW_ITEM' && (
                        <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 py-1 rounded">
                          Nouveau
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      disabled={addingIndex === index || isLoading}
                      className="text-destructive hover:opacity-80 transition-opacity disabled:opacity-50"
                      title="Supprimer de la liste"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>

                  {/* Nom éditable */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                      Nom de l'ingrédient
                    </label>
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      disabled={addingIndex === index || isLoading}
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                      placeholder="Nom de l'ingrédient"
                    />
                  </div>

                  {/* Catégorie éditable */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                      Catégorie
                    </label>
                    <select
                      value={ingredient.category_id || ''}
                      onChange={(e) => handleCategoryChange(index, e.target.value)}
                      disabled={addingIndex === index || isLoading}
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((category) => {
                        const categoryName = typeof category === 'string' ? category : category.name
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
                      })}
                    </select>
                  </div>

                  {/* Quantité éditable */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                      Quantité
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={ingredient.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      disabled={addingIndex === index || isLoading}
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                    />
                  </div>

                  {/* Bouton Ajouter */}
                  <button
                    type="button"
                    onClick={() => handleAddIngredient(index)}
                    disabled={
                      addingIndex === index || 
                      isLoading || 
                      !ingredient.name || 
                      ingredient.name.trim() === '' ||
                      !ingredient.category_id
                    }
                    className="w-full py-3 px-4 rounded-xl text-center font-bold bg-primary text-white disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  >
                    {addingIndex === index ? 'Ajout...' : 'Ajouter à l\'inventaire'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bouton Annuler en bas */}
        <div className="fixed md:absolute bottom-24 md:bottom-6 left-0 right-0 px-4 md:px-0 max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full py-4 px-4 rounded-xl text-center font-bold bg-slate-200 dark:bg-slate-700 text-text-light dark:text-text-dark text-lg disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Annuler
          </button>
        </div>
      </main>
    </div>
  )
}

export default DetectedIngredients
