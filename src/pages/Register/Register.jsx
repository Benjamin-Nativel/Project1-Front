import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RegisterForm, FlashMessage } from '../../components'
import { authService } from '../../services/api'
import { formatErrorMessage } from '../../utils/errors'

/**
 * Page d'inscription
 * Composant principal de la page d'inscription
 */
function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [flashMessage, setFlashMessage] = useState(null)
  const navigate = useNavigate()

  const handleRegister = async (formData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await authService.register(formData)
      
      // Afficher le message de succès
      setFlashMessage({
        message: 'Compte créé avec succès ! Redirection...',
        type: 'success'
      })
      
      // Rediriger vers la page de connexion après un court délai
      setTimeout(() => {
        navigate('/connexion', { 
          state: { 
            message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.' 
          } 
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
      <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={error} />
    </div>
  )
}

export default Register

