# GSM → FINFORM — Décontamination architecturale

## Invariants
- `main` reste la baseline fonctionnelle et métier.
- `refactor/nextjs-scss` est le sas de décontamination.
- La cible finale est une route native dans `algowebsite`.
- Aucun copier-coller direct du monolithe `src/App.jsx` vers FINFORM.

## État qualifié au 2026-10-05
- La baseline `main` reste la référence fonctionnelle historique.
- Le monolithe GSM a été décomposé en `src/features/*`, `src/shared/*`, `src/services/*` et `src/GsmAppShell.jsx`.
- La branche est désormais une application Next.js 16.3.3 App Router native avec React 19 et SCSS.
- Entrées Next: `app/layout.tsx`, `app/page.tsx`, `app/gestion-sous-mandat/page.tsx`.
- Façade opérationnelle: `app/api/gsm/[...path]/route.ts` → FastAPI/DB GSM.
- Client opérationnel: `src/services/gsmOperationalApi.ts` avec fallback local contrôlé.
- Node cible: 22 (`.nvmrc`); gestionnaire de paquets: pnpm 10.13.1.
- Vite n'est plus une dépendance ni un point d'entrée de la cible.
- Qualification WCER full: typecheck PASS, build PASS, git-diff-check PASS, 0 erreur IDE.
- Runtime Chrome: `/gestion-sous-mandat` APP_READY sur le port canonique 5173, chunks Next 200, snapshot API 200.
- `OPCVM-GSM-LOCAL` a été audité comme starter Vite legacy sans valeur métier unique et reste hors périmètre d'intégration FINFORM.

## Matrice
| GSM actuel | Transition | Cible FINFORM |
| --- | --- | --- |
| App.jsx monolithique | features + adapters | composant feature dédié |
| thème JS inline | variables CSS/SCSS | abstracts/tokens + variables |
| Card/Btn locaux | FinformPrimitives | primitives FINFORM |
| calculs dans écran | model/selectors | core/domain/feature model |
| appels API couplés | service dédié | repository/API route |

## Ordre
1. Alignement Git.
2. Fondation SCSS et primitives.
3. Accueil pilote.
4. Extraction model/selectors.
5. Découpage sections.
6. Corrélation UI FINFORM.
7. Portefeuilles / Money Management / Cession-Retrait.
8. Marchés / Watchlist / Recommandations.
9. Allocation / Rééquilibrage / Analyse / Comité.
10. Espace client / documentation.
11. Qualification globale.
12. Intégration algowebsite.

## Definition of Done
- métier préservé;
- code extrait réellement utilisé;
- SCSS sans nouvelle dette inline;
- responsive vérifié;
- build PASS;
- runtime Chrome PASS;
- Git diff borné;
- Graphify requalifié.
