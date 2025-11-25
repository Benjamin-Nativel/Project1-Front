import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../../components'
import { authService } from '../../services/api'
import { formatErrorMessage } from '../../utils/errors'

/**
 * Page d'accueil
 * Composant principal de la page d'accueil
 */
function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (formData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authService.login(formData)
      console.log('Connexion réussie:', response)
      
      // Rediriger vers la page d'inventaire ou dashboard après connexion
      navigate('/inventaire')
    } catch (error) {
      console.error('Erreur de connexion:', error)
      const errorMessage = formatErrorMessage(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark">
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
    </div>
  )
}

export default Home
