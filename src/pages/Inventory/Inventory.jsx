import { useState } from 'react'
import { BottomNavigation, InventoryContent } from '../../components'

/**
 * Page d'inventaire
 * Composant principal de la page d'inventaire
 */
function Inventory() {
  // Exemple de données d'inventaire
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Apples',
      emoji: '🍎',
      category: 'Frais',
      quantity: 5
    },
    {
      id: 2,
      name: 'Milk',
      emoji: '🥛',
      category: 'Frais',
      quantity: 1
    },
    {
      id: 3,
      name: 'Chicken Breast',
      emoji: '🍗',
      category: 'Congelé',
      quantity: 2
    },
    {
      id: 4,
      name: 'Bread',
      emoji: '🍞',
      category: 'Épicerie',
      quantity: 1
    }
  ])

  const handleItemUpdate = (itemId, updatedItem) => {
    setItems(items.map(item => 
      item.id === itemId ? updatedItem : item
    ))
  }

  const handleAddItem = () => {
    // La navigation est gérée dans InventoryContent
  }

  const handleNewItem = (newItem) => {
    setItems([...items, newItem])
  }

  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark flex md:flex-row">
      <BottomNavigation />
      <div className="flex-1 md:ml-20 lg:ml-24">
        <InventoryContent
          items={items}
          onItemUpdate={handleItemUpdate}
          onAddItem={handleAddItem}
        />
      </div>
    </div>
  )
}

export default Inventory

