import { useState, useEffect } from 'react'

/**
 * Composant FlashMessage - Affiche un message flash temporaire
 * @param {Object} props
 * @param {string} props.message - Message à afficher
 * @param {string} props.type - Type de message ('success', 'error', 'info', 'warning')
 * @param {number} props.duration - Durée d'affichage en millisecondes (défaut: 8000)
 * @param {Function} props.onClose - Fonction appelée lors de la fermeture
 */
function FlashMessage({ 
  message, 
  type = 'success', 
  duration = 8000, 
  onClose 
}) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!message) return

    // Masquer le message après la durée spécifiée
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onClose?.()
      }, 300) // Attendre la fin de l'animation
    }, duration)

    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message || !isVisible) return null

  const typeStyles = {
    success: 'bg-emerald-500 text-white border-emerald-600',
    error: 'bg-red-500 text-white border-red-600',
    info: 'bg-blue-500 text-white border-blue-600',
    warning: 'bg-yellow-500 text-white border-yellow-600'
  }

  const iconMap = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
    warning: 'warning'
  }

  return (
    <div
      className={`fixed top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-[10000] max-w-md sm:w-full px-4 py-3 rounded-xl shadow-lg border-2 ${typeStyles[type]} transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined flex-shrink-0">
          {iconMap[type]}
        </span>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose?.(), 300)
          }}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
          aria-label="Fermer"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  )
}

export default FlashMessage

