import './Button.css'

/**
 * Composant Button réutilisable
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu du bouton
 * @param {Function} props.onClick - Fonction appelée au clic
 * @param {string} props.variant - Variante du bouton ('primary' | 'secondary' | 'danger')
 * @param {boolean} props.disabled - État désactivé
 */
function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  ...props 
}) {
  return (
    <button 
      className={`button button--${variant}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
