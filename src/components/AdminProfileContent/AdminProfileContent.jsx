import ProfileCard from '../ProfileCard'

/**
 * Composant AdminProfileContent - Contenu de la page de profil pour les administrateurs
 * Affiche les cartes de gestion : Ingrédients, Catégories, Utilisateurs
 */
function AdminProfileContent() {
  return (
    <div className="w-full px-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Gestion
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Gérez les ressources de l'application
        </p>
      </div>
      
      <div className="space-y-4">
        <ProfileCard
          icon="restaurant"
          title="Gestion des Ingrédients"
          description="Créer, modifier et supprimer des ingrédients"
          path="/admin/ingredients"
        />
        <ProfileCard
          icon="category"
          title="Gestion des Catégories"
          description="Créer, modifier et supprimer des catégories"
          path="/admin/categories"
        />
        {/* <ProfileCard
          icon="people"
          title="Gestion des Utilisateurs"
          description="Créer, modifier et supprimer des utilisateurs"
          // path="/admin/users"
        /> */}
      </div>
    </div>
  )
}

export default AdminProfileContent

