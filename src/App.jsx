import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Register from './pages/Register'
import Inventory from './pages/Inventory'
import MesIngredients from './pages/MesIngredients'
import Recipes from './pages/Recipes'
import AddItem from './pages/AddItem'
import RecipeResultPage from './pages/RecipeResult'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import { routes } from './config/routes'

/**
 * Composant racine de l'application
 * Gère le routing et le layout principal
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques - accessibles sans authentification : login (/) et inscription uniquement */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        {/* Alias pour la route de connexion */}
        <Route
          path="/connexion"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/inscription"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        
        {/* Routes protégées - nécessitent une authentification */}
        <Route
          path="/inventaire"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mes-ingredients"
          element={
            <ProtectedRoute>
              <MesIngredients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ajouter-item"
          element={
            <ProtectedRoute>
              <AddItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <Recipes />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.RECIPE_RESULT}
          element={
            <ProtectedRoute>
              <RecipeResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.PROFILE}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        {/* Autres pages avec layout */}
        {/* <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} /> */}
      </Routes>
    </Router>
  )
}

export default App