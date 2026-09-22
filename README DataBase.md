# OPCVM GSM — Base opérationnelle séparée de la base Marché

Ce dossier contient une base **SQLite réellement générée** (`gsm_operational.db`) et une API FastAPI avec interface d'administration.

## Données stockées ici

- clients et portefeuilles de la Gestion sous mandat ;
- allocations courantes / cibles ;
- expositions multi-devises ;
- dépôts, retraits, coupons et dividendes ;
- demandes `Cession_Retrait` ;
- table `manual_records` pour de futurs modules métier.

**Aucune cotation de marché n'est stockée dans cette base.** Les cours, indices, obligations, historiques de prix et carnets restent dans votre base / API de marché existante.

La base fournie contient 30 portefeuilles de démonstration issus de la maquette actuelle, 90 lignes d'exposition devise, 120 lignes d'allocation, 114 événements financiers et 4 demandes de retrait.

## Démarrage Windows / PowerShell

```powershell
cd OPCVM_GSM_DB
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:GSM_ADMIN_KEY="une-cle-secrete-a-changer"
python -m uvicorn gsm_api:app --host 127.0.0.1 --port 8001 --reload
```

Ou, après installation des dépendances, utilisez `start_gsm_api.bat` / `start_gsm_api.ps1`.

## Accès

- Administration métier : `http://127.0.0.1:8001/admin`
- Documentation API : `http://127.0.0.1:8001/docs`
- Santé API : `http://127.0.0.1:8001/api/health`
- Snapshot utilisé par le front : `http://127.0.0.1:8001/api/snapshot`

L'écran `/admin` permet d'ajouter / modifier / supprimer les portefeuilles, modifier leur ventilation multi-devises, enregistrer les dépôts/retraits/coupons/dividendes et créer les demandes de retrait.

## Connexion du front

La version du composant front fournie avec ce dossier charge par défaut :

`http://127.0.0.1:8001/api/snapshot`

Si l'API est indisponible, la maquette conserve ses données internes de démonstration pour ne pas casser l'interface.

Pour utiliser une autre URL :

```powershell
$env:NEXT_PUBLIC_GSM_API_URL="http://127.0.0.1:8001"
```

puis relancez le serveur React / Next.js.

## Modification directe de SQLite

Vous pouvez ouvrir `gsm_operational.db` avec **DB Browser for SQLite**. L'interface `/admin` reste préférable car elle applique quelques contrôles, notamment la somme des expositions devises à 100 %.

## Passage en PostgreSQL

`schema_postgresql.sql` contient le schéma équivalent. Pour une production multi-utilisateur, PostgreSQL est préférable à SQLite.

La séparation doit rester stricte :

- **base opérationnelle GSM** : clients, portefeuilles, flux, retraits, décisions, etc. ;
- **base Marché** : cours, indices, obligations, historiques de marché, etc.

## Sécurité

La clé `change-me-now` est uniquement une valeur de développement. Définissez `GSM_ADMIN_KEY` avec une valeur forte avant tout déploiement. Les lectures nécessaires au front sont ouvertes, alors que les écritures exigent la clé administrateur.
