import { createContext, useContext, useState } from 'react'

/**
 * Contexte global de l'application
 * Utilisé pour partager des données entre composants sans prop drilling
 */
const AppContext = createContext()

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const [user, setUser] = useState(null)

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
