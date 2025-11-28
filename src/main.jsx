import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AppProvider } from './contexts/AppContext'
import './styles/index.css'
import { registerSW } from 'virtual:pwa-register'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)

const updateSW = registerSW({
    onNeedRefresh() {
        // Appelé quand une nouvelle version est disponible (si vous n'utilisez pas autoUpdate)
        if (confirm("Nouvelle version disponible. Recharger ?")) {
            updateSW(true)
        }
    },
    onOfflineReady() {
        console.log("App prête à fonctionner hors-ligne !")
    },
})