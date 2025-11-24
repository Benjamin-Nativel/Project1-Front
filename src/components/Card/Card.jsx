import './Card.css'

/**
 * Composant Card réutilisable
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu de la carte
 * @param {string} props.title - Titre de la carte (optionnel)
 */
function Card({ children, title, ...props }) {
  return (
    <div className="card" {...props}>
      {title && <h3 className="card__title">{title}</h3>}
      <div className="card__content">
        {children}
      </div>
    </div>
  )
}

export default Card
