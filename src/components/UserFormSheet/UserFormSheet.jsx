import { useState, useEffect } from 'react'

/**
 * Composant UserFormSheet - Bottom sheet pour créer/modifier un utilisateur
 * @param {Object} props
 * @param {boolean} props.isOpen - État d'ouverture du sheet
 * @param {Function} props.onClose - Fonction appelée lors de la fermeture
 * @param {Function} props.onSubmit - Fonction appelée lors de la soumission
 * @param {Object} props.editingItem - Utilisateur en cours d'édition (null si création)
 * @param {boolean} props.isLoading - État de chargement
 */
function UserFormSheet({
  isOpen,
  onClose,
  onSubmit,
  editingItem = null,
  isLoading = false
}) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    roles: ['ROLE_USER']
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  // Mettre à jour le formulaire quand editingItem change
  useEffect(() => {
    if (editingItem) {
      // S'assurer que roles est toujours un tableau
      const roles = Array.isArray(editingItem.roles) 
        ? editingItem.roles 
        : (editingItem.roles ? [editingItem.roles] : ['ROLE_USER'])
      
      setFormData({
        email: editingItem.email || '',
        password: '', // Ne pas préremplir le mot de passe
        name: editingItem.name || '',
        roles: roles
      })
    } else {
      setFormData({
        email: '',
        password: '',
        name: '',
        roles: ['ROLE_USER']
      })
    }
    setErrors({})
    setShowPassword(false)
  }, [editingItem, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      // Gérer les rôles (checkboxes)
      const role = value
      setFormData(prev => ({
        ...prev,
        roles: checked
          ? [...prev.roles, role]
          : prev.roles.filter(r => r !== role)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
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

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide'
    }

    // Le mot de passe est requis seulement pour la création
    if (!editingItem && !formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validate()) {
      const submitData = {
        email: formData.email.trim(),
        name: formData.name.trim() || undefined,
        roles: formData.roles.length > 0 ? formData.roles : ['ROLE_USER']
      }
      
      // Ajouter le mot de passe seulement s'il est fourni
      if (formData.password) {
        submitData.password = formData.password
      }
      
      onSubmit?.(submitData)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end pointer-events-none transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 bottom-sheet-backdrop transition-opacity duration-300"
        onClick={onClose}
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
      ></div>

      {/* Sheet Content */}
      <div
        className={`relative w-full max-w-md mx-auto bg-background-light dark:bg-background-dark rounded-t-2xl p-4 bottom-sheet pointer-events-auto max-h-[90vh] overflow-y-auto transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-300 dark:bg-slate-600 mb-4"></div>
        
        <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-6 text-center">
          {editingItem ? 'Modifier l\'Utilisateur' : 'Nouvel Utilisateur'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1"
              htmlFor="user-email"
            >
              Email
            </label>
            <input
              className={`form-input w-full rounded-xl border-2 transition-colors bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 h-14 ${
                errors.email
                  ? 'border-destructive'
                  : 'border-slate-300 dark:border-slate-600 focus:border-primary'
              }`}
              id="user-email"
              name="email"
              type="email"
              placeholder="Ex: utilisateur@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            {errors.email && (
              <span className="text-sm text-destructive mt-1 block">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1"
              htmlFor="user-password"
            >
              {editingItem ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
            </label>
            <div className="relative">
              <input
                className={`form-input w-full rounded-xl border-2 transition-colors bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 h-14 pr-12 ${
                  errors.password
                    ? 'border-destructive'
                    : 'border-slate-300 dark:border-slate-600 focus:border-primary'
                }`}
                id="user-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={editingItem ? 'Laisser vide pour ne pas changer' : 'Minimum 6 caractères'}
                value={formData.password}
                onChange={handleChange}
                required={!editingItem}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.password && (
              <span className="text-sm text-destructive mt-1 block">{errors.password}</span>
            )}
          </div>

          {/* Name */}
          <div>
            <label
              className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1"
              htmlFor="user-name"
            >
              Nom (optionnel)
            </label>
            <input
              className="form-input w-full rounded-xl border-2 transition-colors bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 h-14 border-slate-300 dark:border-slate-600 focus:border-primary"
              id="user-name"
              name="name"
              type="text"
              placeholder="Ex: Jean Dupont"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Roles */}
          <div>
            <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
              Rôles
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value="ROLE_USER"
                  checked={formData.roles.includes('ROLE_USER')}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary"
                />
                <span className="text-text-light dark:text-text-dark">Utilisateur</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value="ROLE_ADMIN"
                  checked={formData.roles.includes('ROLE_ADMIN')}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary"
                />
                <span className="text-text-light dark:text-text-dark">Administrateur</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="py-3 px-4 rounded-xl text-center font-bold bg-slate-200 dark:bg-slate-700 text-text-light dark:text-text-dark hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="py-3 px-4 rounded-xl text-center font-bold bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserFormSheet

