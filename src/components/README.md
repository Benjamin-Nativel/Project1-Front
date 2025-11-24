# Components

Ce dossier contient tous les composants réutilisables de l'application.

## Structure recommandée

Chaque composant doit avoir son propre dossier avec :

- `ComponentName.jsx` : Le composant React
- `ComponentName.css` : Les styles du composant
- `index.js` : Export du composant (facilite les imports)

## Exemple

```
components/
  Button/
    Button.jsx
    Button.css
    index.js
  Card/
    Card.jsx
    Card.css
    index.js
```

## Imports

Vous pouvez importer les composants de deux façons :

```jsx
// Import direct
import Button from "./components/Button";

// Import depuis l'export centralisé
import { Button, Card } from "./components";
```
