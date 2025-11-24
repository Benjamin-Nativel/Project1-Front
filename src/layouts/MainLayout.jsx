import './MainLayout.css'

/**
 * Layout principal de l'application
 * Utilisé pour envelopper toutes les pages avec une structure commune
 */
function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <header className="main-layout__header">
        <h1>Project1 Front</h1>
      </header>
      <main className="main-layout__main">
        {children}
      </main>
      <footer className="main-layout__footer">
        <p>© 2024 Project1 Front</p>
      </footer>
    </div>
  )
}

export default MainLayout
