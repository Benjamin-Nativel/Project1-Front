import { createContext, useContext, useState, useEffect } from 'react'
import { getUser } from '../utils/storage'

/**
 * Contexte global de l'application
 * Utilisé pour partager des données entre composants sans prop drilling
 */
const AppContext = createContext()

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const [user, setUser] = useState(null)

  // Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const storedUser = getUser()
    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  const value = {
    theme,
    setTheme,
    user,
    setUser,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp doit être utilisé dans un AppProvider')
  }
  return context
}
