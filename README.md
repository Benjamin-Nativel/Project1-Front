# Project1-Front

Application front-end React avec Vite.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Architecture

Le projet suit une architecture de dossiers claire et organisée pour faciliter le développement et la maintenance.

### Structure des dossiers

```
src/
├── assets/          # Ressources statiques (images, fonts, etc.)
├── components/      # Composants réutilisables
├── config/          # Configuration de l'application
├── contexts/        # Contextes React (state global)
├── hooks/           # Hooks personnalisés React
├── layouts/         # Layouts de l'application
├── pages/           # Pages/Vues de l'application
├── services/        # Services API et logique métier
├── styles/          # Styles globaux
└── utils/           # Fonctions utilitaires
```

Pour plus de détails, consultez le fichier [ARCHITECTURE.md](./ARCHITECTURE.md).

## Technologies

- **React** 18.2.0
- **Vite** 4.4.5
- **React Router** 6.20.0
