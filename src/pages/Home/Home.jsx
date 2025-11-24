import { useState } from 'react'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import './Home.css'

/**
 * Page d'accueil
 * Composant principal de la page d'accueil
 */
function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="home">
      <div className="home__content">
        <h2>Bienvenue sur Project1 Front</h2>
        <Card>
          <Button onClick={() => setCount((count) => count + 1)}>
            Compteur : {count}
          </Button>
          <p>
            Modifiez <code>src/pages/Home/Home.jsx</code> et sauvegardez pour tester le HMR
          </p>
        </Card>
      </div>
    </div>
  )
}

export default Home
