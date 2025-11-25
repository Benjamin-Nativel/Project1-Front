/**
 * Composant PublicRoute - Permet l'accès aux routes publiques (login et inscription)
 * Ces routes sont accessibles à tous, connectés ou non
 * @param {Object} props
 * @param {React.ReactNode} props.children - Composant à afficher
 */
function PublicRoute({ children }) {
  // Les routes publiques sont accessibles à tous, pas de vérification nécessaire
  return children
}

export default PublicRoute

