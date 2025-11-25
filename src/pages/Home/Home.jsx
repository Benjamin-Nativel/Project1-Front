import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LoginForm, FlashMessage } from '../../components'
import { authService } from '../../services/api'
import { formatErrorMessage } from '../../utils/errors'

/**
 * Page d'accueil
 * Composant principal de la page d'accueil
 */
function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [flashMessage, setFlashMessage] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Récupérer le message flash depuis le state de navigation
  useEffect(() => {
    if (location.state?.message) {
      setFlashMessage({
        message: location.state.message,
        type: 'success'
      })
      // Nettoyer le state pour éviter de réafficher le message au rechargement
      window.history.replaceState({}, document.title)
    }
  }, [location])

  const handleLogin = async (formData) => {
    setIsLoading(true)
    setError(null)
    setFlashMessage(null)
    
    try {
      await authService.login(formData)
      
      // Afficher le message de succès
      setFlashMessage({
        message: 'Connexion réussie ! Redirection en cours...',
        type: 'success'
      })
      
      // Rediriger vers la page d'inventaire après un court délai pour voir le message
      setTimeout(() => {
        navigate('/inventaire', {
          state: { message: 'Bienvenue ! Vous êtes maintenant connecté.' }
        })
      }, 500)
    } catch (error) {
      const errorMessage = formatErrorMessage(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark">
      {flashMessage && (
        <FlashMessage
          message={flashMessage.message}
          type={flashMessage.type}
          onClose={() => setFlashMessage(null)}
        />
      )}
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
    </div>
  )
}

export default Home
