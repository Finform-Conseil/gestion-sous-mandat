# AfriMarket Management — Maquette interactive

Maquette React (Vite + Tailwind + Recharts + Lucide) des écrans du logiciel de
gestion pour gestionnaire de portefeuille sous mandat.

## Installation

```bash
npm install
```

## Lancement en local

```bash
npm run dev
```

Puis ouvrir l'URL affichée (par défaut http://localhost:5173).

## Build de production

```bash
npm run build
npm run preview
```

## Structure

```
afrimarket-management/
├── index.html            # page racine chargée par Vite
├── package.json           # dépendances (react, recharts, lucide-react, tailwind)
├── postcss.config.js       # requis par Tailwind
├── tailwind.config.js      # config Tailwind (scan index.html + src/**)
├── vite.config.js          # config Vite (plugin React)
└── src/
    ├── main.jsx            # point d'entrée React
    ├── index.css           # directives @tailwind (base/components/utilities)
    └── App.jsx             # tout le composant : écrans, navigation, données de démo
```

## Notes

- Toutes les données (clients, ordres, alertes, recommandations…) sont des
  données de démonstration codées dans `App.jsx` (`CLIENTS`, `ORDERS`,
  `ALERTES`, etc.) — à remplacer par vos appels API.
- Les polices (Space Grotesk, Inter, IBM Plex Mono) sont chargées via
  `@import` Google Fonts directement dans `App.jsx`. Pour un usage hors-ligne,
  remplacez cet import par des polices auto-hébergées.
- `recharts` et `lucide-react` sont les deux seules dépendances graphiques ;
  aucune autre lib UI n'est requise.
