import { useState, useEffect } from 'react'
import { categoriesService } from '../services/api'
import { getCategoriesCache, setCategoriesCache } from '../utils/storage'

/**
 * Hook personnalisé pour charger les catégories depuis l'API
 * Utilise le cache localStorage pour éviter les appels API inutiles
 * @returns {Object} { categories, isLoading, error }
 */
export function useCategories() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    // Vérifier le cache localStorage d'abord
    const cachedCategories = getCategoriesCache()
    if (cachedCategories) {
      setCategories(cachedCategories)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const data = await categoriesService.getCategories()
      
      // Mettre à jour le cache localStorage
      setCategoriesCache(data)
      
      setCategories(data)
    } catch (err) {
      // En cas d'erreur, utiliser des catégories par défaut
      const defaultCategories = [
        { id: 1, name: 'Frais' },
        { id: 2, name: 'Congelé' },
        { id: 3, name: 'Épicerie' },
        { id: 4, name: 'Boissons' }
      ]
      setCategories(defaultCategories)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return { categories, isLoading, error, refetch: loadCategories }
}

