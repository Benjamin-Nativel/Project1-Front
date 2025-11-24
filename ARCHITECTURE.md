# Architecture du projet

Ce document décrit l'architecture et l'organisation des dossiers du projet.

## Structure des dossiers

```
src/
├── assets/          # Ressources statiques (images, fonts, etc.)
│   └── images/
├── components/      # Composants réutilisables
│   ├── Button/
│   ├── Card/
│   └── ...
├── config/          # Fichiers de configuration
│   └── routes.js
├── contexts/        # Contextes React (state global)
│   └── AppContext.jsx
├── hooks/           # Hooks personnalisés React
│   ├── useCounter.js
│   └── index.js
├── layouts/         # Layouts de l'application
│   ├── MainLayout.jsx
│   └── MainLayout.css
├── pages/           # Pages/Vues de l'application
│   ├── Home/
│   └── ...
├── services/        # Services API et logique métier
│   └── api.js
├── styles/          # Styles globaux
│   └── index.css
├── utils/           # Fonctions utilitaires
│   ├── constants.js
│   └── index.js
├── App.jsx          # Composant racine
└── main.jsx         # Point d'entrée de l'application
```

## Description des dossiers

### `/components`

Composants réutilisables à travers l'application. Chaque composant a son propre dossier avec :

- Le fichier du composant (`.jsx`)
- Ses styles (`.css`)
- Un fichier `index.js` pour faciliter les imports

**Exemple :**

```jsx
import Button from "./components/Button";
// ou
import { Button } from "./components";
```

### `/pages`

Pages/vues de l'application. Chaque page représente une route dans l'application.

**Structure recommandée :**

- Un dossier par page
- Composant principal de la page
- Styles spécifiques à la page
- Fichier `index.js` pour l'export

### `/layouts`

Layouts qui enveloppent les pages pour fournir une structure commune (header, footer, sidebar, etc.).

### `/hooks`

Hooks personnalisés React réutilisables. Utilisez `use` comme préfixe pour le nom du hook.

**Exemple :**

```jsx
import { useCounter } from "./hooks";
```

### `/services`

Services pour les appels API et la logique métier. Centralise toutes les interactions avec le backend.

**Exemple :**

```jsx
import apiService from "./services/api";
const data = await apiService.get("/users");
```

### `/utils`

Fonctions utilitaires réutilisables (validation, formatage, etc.).

### `/contexts`

Contextes React pour gérer l'état global de l'application sans prop drilling.

**Exemple :**

```jsx
import { useApp } from "./contexts/AppContext";
const { theme, setTheme } = useApp();
```

### `/config`

Fichiers de configuration (routes, constantes d'application, etc.).

### `/styles`

Styles globaux de l'application (variables CSS, reset, etc.).

### `/assets`

Ressources statiques (images, fonts, icônes).

## Bonnes pratiques

### Nommage des fichiers

- **Composants** : PascalCase (`Button.jsx`, `UserProfile.jsx`)
- **Hooks** : camelCase avec préfixe `use` (`useCounter.js`, `useAuth.js`)
- **Utilitaires** : camelCase (`formatDate.js`, `validateEmail.js`)
- **Constants** : UPPER_SNAKE_CASE dans le fichier (`API_BASE_URL`)

### Imports

Privilégiez les imports relatifs pour les fichiers dans `src/` :

```jsx
import Button from "../components/Button";
import { useCounter } from "../hooks";
```

### Organisation des composants

1. Un composant = un dossier
2. Styles CSS avec le composant
3. Fichier `index.js` pour faciliter les imports
4. JSDoc pour documenter les props

### Gestion d'état

- **État local** : `useState` ou `useReducer` dans le composant
- **État partagé** : Contextes React dans `/contexts`
- **État serveur** : Services dans `/services` avec fetch/axios

## Exemple d'utilisation

```jsx
// pages/Home/Home.jsx
import { useState } from "react";
import { Button, Card } from "../../components";
import { useCounter } from "../../hooks";
import { useApp } from "../../contexts/AppContext";
import apiService from "../../services/api";
import "./Home.css";

function Home() {
  const { theme } = useApp();
  const { count, increment } = useCounter(0);

  return (
    <div className="home">
      <Card>
        <Button onClick={increment}>Cliquez-moi : {count}</Button>
      </Card>
    </div>
  );
}
```

## Ajouter une nouvelle page

1. Créer un dossier dans `/pages` : `pages/About/`
2. Créer les fichiers : `About.jsx`, `About.css`, `index.js`
3. Ajouter la route dans `App.jsx`
4. Optionnellement ajouter la route dans `/config/routes.js`

## Ajouter un nouveau composant

1. Créer un dossier dans `/components` : `components/Modal/`
2. Créer les fichiers : `Modal.jsx`, `Modal.css`, `index.js`
3. Exporter depuis `components/index.js` (optionnel)

## Ajouter un nouveau hook

1. Créer le fichier dans `/hooks` : `hooks/useAuth.js`
2. Exporter depuis `hooks/index.js`
3. Utiliser avec : `import { useAuth } from '../hooks'`
