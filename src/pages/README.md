# Pages

Ce dossier contient toutes les pages/vues de l'application.

## Structure recommandée

Chaque page doit avoir son propre dossier avec :

- `PageName.jsx` : Le composant de la page
- `PageName.css` : Les styles de la page
- `index.js` : Export de la page

## Exemple

```
pages/
  Home/
    Home.jsx
    Home.css
    index.js
  About/
    About.jsx
    About.css
    index.js
```

Les pages sont typiquement utilisées avec React Router dans `App.jsx`.
