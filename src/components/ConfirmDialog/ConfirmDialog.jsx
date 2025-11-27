import { useEffect } from 'react'

/**
 * Composant ConfirmDialog - Modal de confirmation moderne
 * @param {Object} props
 * @param {boolean} props.isOpen - État d'ouverture du dialog
 * @param {Function} props.onClose - Fonction appelée lors de la fermeture (annulation)
 * @param {Function} props.onConfirm - Fonction appelée lors de la confirmation
 * @param {string} props.title - Titre du dialog
 * @param {string} props.message - Message de confirmation
 * @param {string} props.confirmLabel - Label du bouton de confirmation (défaut: "Confirmer")
 * @param {string} props.cancelLabel - Label du bouton d'annulation (défaut: "Annuler")
 * @param {string} props.confirmButtonType - Type de bouton de confirmation ('primary' | 'destructive', défaut: 'destructive')
 */
function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation',
  message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  confirmButtonType = 'destructive'
}) {
  // Gérer la fermeture avec la touche Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Empêcher le scroll du body quand le dialog est ouvert
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const confirmButtonClass = confirmButtonType === 'destructive'
    ? 'bg-destructive text-white hover:bg-destructive/90'
    : 'bg-primary text-white hover:bg-primary/90'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
      style={{
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out'
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
      />

      {/* Dialog Content */}
      <div
        className="relative bg-background-light dark:bg-background-dark rounded-2xl shadow-2xl max-w-md w-full mx-4 pointer-events-auto transform transition-all duration-200"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10">
            <span className="material-symbols-outlined text-4xl text-destructive">
              warning
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-text-light dark:text-text-dark text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-center mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-center font-medium bg-slate-200 dark:bg-slate-700 text-text-light dark:text-text-dark hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`flex-1 py-3 px-4 rounded-xl text-center font-medium transition-colors ${confirmButtonClass}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

