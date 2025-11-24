import { useState } from 'react'
import { Link } from 'react-router-dom'

/**
 * Composant RegisterForm - Formulaire d'inscription (Mobile First)
 * @param {Object} props
 * @param {Function} props.onSubmit - Fonction appelée lors de la soumission du formulaire
 * @param {boolean} props.isLoading - État de chargement
 */
function RegisterForm({ onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.username) {
      newErrors.username = 'Le nom d\'utilisateur est requis'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères'
    }

    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide'
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validate()) {
      onSubmit?.(formData)
    }
  }

  return (
    <div className="relative mx-auto flex h-auto min-h-screen w-full max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      <main className="flex-1 flex flex-col justify-center px-6 md:px-8 lg:px-12 pb-20 md:pb-24">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-2xl p-4 mb-4">
            <span 
              className="material-symbols-outlined text-primary text-5xl" 
              style={{ fontVariationSettings: "'wght' 300, 'opsz' 48, 'FILL' 1" }}
            >
              kitchen
            </span>
          </div>
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark tracking-tight">
            Créer un compte
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Commencez à gérer votre inventaire dès aujourd'hui
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Username Field */}
          <label className="flex flex-col min-w-40 w-full">
            <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1.5 ml-1">
              Nom d'utilisateur
            </span>
            <div className={`flex w-full flex-1 items-stretch rounded-xl h-14 shadow-soft dark:shadow-none border-2 transition-colors ${
              errors.username 
                ? 'border-destructive' 
                : focusedField === 'username'
                  ? 'border-primary'
                  : 'border-transparent'
            }`}>
              <div className="text-text-secondary-light dark:text-text-secondary-dark flex bg-surface-light dark:bg-surface-dark items-center justify-center pl-4 rounded-l-xl border-r-0">
                <span className="material-symbols-outlined">person</span>
              </div>
              <input
                type="text"
                id="username"
                name="username"
                className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-surface-light dark:bg-surface-dark h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark px-4 pl-2 text-base font-normal leading-normal ${
                  errors.username ? 'focus:ring-destructive/50' : ''
                }`}
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                placeholder="votre_nom_utilisateur"
                disabled={isLoading}
                autoComplete="username"
              />
            </div>
            {errors.username && (
              <span className="text-sm text-destructive mt-1 ml-1">{errors.username}</span>
            )}
          </label>

          {/* Email Field */}
          <label className="flex flex-col min-w-40 w-full">
            <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1.5 ml-1">
              Email
            </span>
            <div className={`flex w-full flex-1 items-stretch rounded-xl h-14 shadow-soft dark:shadow-none border-2 transition-colors ${
              errors.email 
                ? 'border-destructive' 
                : focusedField === 'email'
                  ? 'border-primary'
                  : 'border-transparent'
            }`}>
              <div className="text-text-secondary-light dark:text-text-secondary-dark flex bg-surface-light dark:bg-surface-dark items-center justify-center pl-4 rounded-l-xl border-r-0">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-surface-light dark:bg-surface-dark h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark px-4 pl-2 text-base font-normal leading-normal ${
                  errors.email ? 'focus:ring-destructive/50' : ''
                }`}
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="votre@email.com"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <span className="text-sm text-destructive mt-1 ml-1">{errors.email}</span>
            )}
          </label>

          {/* Password Field */}
          <label className="flex flex-col min-w-40 w-full">
            <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1.5 ml-1">
              Mot de passe
            </span>
            <div className={`flex w-full flex-1 items-stretch rounded-xl h-14 shadow-soft dark:shadow-none border-2 transition-colors ${
              errors.password 
                ? 'border-destructive' 
                : focusedField === 'password'
                  ? 'border-primary'
                  : 'border-transparent'
            }`}>
              <div className="text-text-secondary-light dark:text-text-secondary-dark flex bg-surface-light dark:bg-surface-dark items-center justify-center pl-4 rounded-l-xl border-r-0">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-surface-light dark:bg-surface-dark h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark px-4 pl-2 text-base font-normal leading-normal ${
                  errors.password ? 'focus:ring-destructive/50' : ''
                }`}
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Entrez votre mot de passe"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
            {errors.password && (
              <span className="text-sm text-destructive mt-1 ml-1">{errors.password}</span>
            )}
          </label>

          {/* Submit Button */}
          <div className="mt-10 space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 rounded-2xl text-center font-bold bg-primary text-white shadow-fab cursor-pointer text-lg disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {isLoading ? 'Création...' : 'Créer un compte'}
            </button>
            <Link
              to="/connexion"
              className="w-full py-4 px-4 rounded-2xl text-center font-bold bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark shadow-soft dark:shadow-none cursor-pointer text-lg block hover:opacity-90 transition-opacity"
            >
              Se connecter
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}

export default RegisterForm

