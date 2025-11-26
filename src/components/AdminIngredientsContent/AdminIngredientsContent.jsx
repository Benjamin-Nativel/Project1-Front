import AdminListContent from '../AdminListContent'
import IngredientFormSheet from '../IngredientFormSheet'

/**
 * Composant AdminIngredientsContent - Contenu de la page admin de gestion des ingrédients
 * Utilise le composant générique AdminListContent
 */
function AdminIngredientsContent(props) {
  return (
    <AdminListContent
      {...props}
      title="Gestion des Ingrédients"
      backPath="/profil"
      searchPlaceholder="Rechercher un ingrédient..."
      emptyMessage="Aucun ingrédient"
      emptySearchMessage="Aucun résultat trouvé"
      loadingMessage="Chargement des ingrédients..."
      deleteConfirmMessage="Êtes-vous sûr de vouloir supprimer cet ingrédient ?"
      createButtonLabel="Créer un ingrédient"
      FormSheet={IngredientFormSheet}
    />
  )
}

export default AdminIngredientsContent

