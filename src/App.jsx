import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Register from './pages/Register'
import Inventory from './pages/Inventory'
import Recipes from './pages/Recipes'
import AddItem from './pages/AddItem'
import RecipeResultPage from './pages/RecipeResult'

/**
 * Composant racine de l'application
 * Gère le routing et le layout principal
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Page de connexion sans layout */}
        <Route path="/connexion" element={<Home />} />
        <Route path="/" element={<Home />} />
        {/* Page d'inscription sans layout */}
        <Route path="/inscription" element={<Register />} />
        {/* Page d'inventaire */}
        <Route path="/inventaire" element={<Inventory />} />
        {/* Page d'ajout d'item */}
        <Route path="/ajouter-item" element={<AddItem />} />
        {/* Page de recettes */}
        <Route path="/recipes" element={<Recipes />} />
        {/* Page de résultat de recette */}
        <Route path="/resultat-recette" element={<RecipeResultPage />} />
        {/* Autres pages avec layout */}
        {/* <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} /> */}
      </Routes>
    </Router>
  )
}

export default App