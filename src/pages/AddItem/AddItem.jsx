import { useNavigate } from 'react-router-dom'
import { AddItemForm, BottomNavigation } from '../../components'

/**
 * Page d'ajout d'item
 * Composant principal de la page d'ajout d'item
 */
function AddItem() {
  const navigate = useNavigate()

  const handleSubmit = async (itemData) => {
    console.log('Nouvel item à ajouter:', itemData)
    
    // TODO: Remplacer par un appel API réel
    // const response = await api.addItem(itemData)
    
    // Simuler une requête API
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      console.log('Item ajouté avec succès')
      // La navigation est gérée dans le composant AddItemForm
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error)
    }
  }

  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark flex md:flex-row">
      <BottomNavigation />
      <div className="flex-1 md:ml-20 lg:ml-24">
        <AddItemForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export default AddItem

