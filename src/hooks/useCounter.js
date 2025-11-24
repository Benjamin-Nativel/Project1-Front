import { useState } from 'react'

/**
 * Hook personnalisé pour gérer un compteur
 * @param {number} initialValue - Valeur initiale du compteur
 * @returns {Object} { count, increment, decrement, reset }
 */
export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)

  const increment = () => setCount((prev) => prev + 1)
  const decrement = () => setCount((prev) => prev - 1)
  const reset = () => setCount(initialValue)

  return { count, increment, decrement, reset }
}
