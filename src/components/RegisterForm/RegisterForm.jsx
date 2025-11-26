import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

/**
 * Composant RegisterForm - Formulaire d'inscription (Mobile First)
 * @param {Object} props
 * @param {Function} props.onSubmit - Fonction appelée lors de la soumission du formulaire
 * @param {boolean} props.isLoading - État de chargement
 * @param {string} props.error - Message d'erreur à afficher
 */
function RegisterForm({ onSubmit, isLoading = false, error: apiError = null }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState(null)
  const [touched, setTouched] = useState({})
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Effacer l'erreur du champ modifié seulement s'il a été touché
    if (errors[name] && touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setFocusedField(null)
    setTouched(prev => ({ ...prev, [name]: true }))
    
    // Valider le champ seulement après qu'il ait été touché
    if (hasSubmitted || touched[name]) {
      validateField(name, formData[name])
    }
  }

  const validateField = (name, value) => {
    const newErrors = { ...errors }
    
    if (name === 'name') {
      if (!value) {
        newErrors.name = 'Le nom est requis'
      } else if (value.length < 2) {
        newErrors.name = 'Le nom doit contenir au moins 2 caractères'
      } else {
        delete newErrors.name
      }
    }
    
    if (name === 'email') {
      if (!value) {
        newErrors.email = 'L\'email est requis'
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = 'L\'email n\'est pas valide'
      } else {
        delete newErrors.email
      }
    }
    
    if (name === 'password') {
      if (!value) {
        newErrors.password = 'Le mot de passe est requis'
      } else if (value.length < 6) {
        newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
      } else {
        delete newErrors.password
      }
    }
    
    setErrors(newErrors)
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name) {
      newErrors.name = 'Le nom est requis'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères'
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
    setHasSubmitted(true)
    
    // Marquer tous les champs comme touchés
    setTouched({ name: true, email: true, password: true })
    
    if (validate()) {
      onSubmit?.(formData)
    }
  }

  return (
    <div className="relative mx-auto flex h-auto min-h-screen w-full max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      <main className="flex-1 flex flex-col justify-center px-6 md:px-8 lg:px-12 pb-20 md:pb-24">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="mb-4">
            <Logo size="xl" />
          </div>
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark tracking-tight">
            Créer un compte
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Commencez à gérer votre inventaire dès aujourd'hui
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5" noValidate>
          {/* Error Message */}
          {apiError && (
            <div className="w-full animate-[fadeIn_0.3s_ease-in-out]">
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-xl flex-shrink-0 mt-0.5">error</span>
                  <span className="leading-relaxed flex-1">{apiError}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Name Field */}
          <label className="flex flex-col min-w-40 w-full">
            <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1.5 ml-1">
              Nom
            </span>
            <div className={`flex w-full flex-1 items-stretch rounded-xl h-14 shadow-soft dark:shadow-none border-2 transition-colors ${
              errors.name 
                ? 'border-destructive' 
                : focusedField === 'name'
                  ? 'border-primary'
                  : 'border-transparent'
            }`}>
              <div className="text-text-secondary-light dark:text-text-secondary-dark flex bg-surface-light dark:bg-surface-dark items-center justify-center pl-4 rounded-l-xl border-r-0">
                <span className="material-symbols-outlined">person</span>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-surface-light dark:bg-surface-dark h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark px-4 pl-2 text-base font-normal leading-normal ${
                  errors.name ? 'focus:ring-destructive/50' : ''
                }`}
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={handleBlur}
                placeholder="Votre nom"
                disabled={isLoading}
                autoComplete="name"
                noValidate
              />
            </div>
            {errors.name && touched.name && (
              <div className="mt-2 animate-[fadeIn_0.2s_ease-in-out]">
                <div className="relative inline-flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm shadow-sm">
                  <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
                  <span className="leading-relaxed">{errors.name}</span>
                  {/* Flèche pointant vers le champ */}
                  <div className="absolute -top-1.5 left-4 w-3 h-3 rotate-45 bg-amber-50 dark:bg-amber-900/20 border-l border-t border-amber-200 dark:border-amber-800"></div>
                </div>
              </div>
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
                onBlur={handleBlur}
                placeholder="votre@email.com"
                disabled={isLoading}
                autoComplete="email"
                noValidate
              />
            </div>
            {errors.email && touched.email && (
              <div className="mt-2 animate-[fadeIn_0.2s_ease-in-out]">
                <div className="relative inline-flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm shadow-sm">
                  <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
                  <span className="leading-relaxed">{errors.email}</span>
                  {/* Flèche pointant vers le champ */}
                  <div className="absolute -top-1.5 left-4 w-3 h-3 rotate-45 bg-amber-50 dark:bg-amber-900/20 border-l border-t border-amber-200 dark:border-amber-800"></div>
                </div>
              </div>
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
                onBlur={handleBlur}
                placeholder="Entrez votre mot de passe"
                disabled={isLoading}
                autoComplete="new-password"
                noValidate
              />
            </div>
            {errors.password && touched.password && (
              <div className="mt-2 animate-[fadeIn_0.2s_ease-in-out]">
                <div className="relative inline-flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm shadow-sm">
                  <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
                  <span className="leading-relaxed">{errors.password}</span>
                  {/* Flèche pointant vers le champ */}
                  <div className="absolute -top-1.5 left-4 w-3 h-3 rotate-45 bg-amber-50 dark:bg-amber-900/20 border-l border-t border-amber-200 dark:border-amber-800"></div>
                </div>
              </div>
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

