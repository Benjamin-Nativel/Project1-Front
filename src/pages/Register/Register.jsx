import { useState } from 'react'
import { RegisterForm } from '../../components'

/**
 * Page d'inscription
 * Composant principal de la page d'inscription
 */
function Register() {
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (formData) => {
    setIsLoading(true)
    console.log('Tentative d\'inscription avec:', formData)
    
    // Simuler une requête API
    try {
      // TODO: Remplacer par un appel API réel
      // const response = await api.register(formData)
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Inscription réussie')
      // Redirection ou gestion de la session ici
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark">
      <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
    </div>
  )
}

export default Register

