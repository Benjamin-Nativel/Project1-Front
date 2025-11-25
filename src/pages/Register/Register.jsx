import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RegisterForm } from '../../components'
import { authService } from '../../services/api'
import { formatErrorMessage } from '../../utils/errors'

/**
 * Page d'inscription
 * Composant principal de la page d'inscription
 */
function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleRegister = async (formData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authService.register(formData)
      console.log('Inscription réussie:', response)
      
      // Rediriger vers la page de connexion après inscription réussie
      // L'utilisateur devra se connecter avec ses identifiants
      navigate('/connexion', { 
        state: { 
          message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.' 
        } 
      })
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
      const errorMessage = formatErrorMessage(error)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark">
      <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={error} />
    </div>
  )
}

export default Register

