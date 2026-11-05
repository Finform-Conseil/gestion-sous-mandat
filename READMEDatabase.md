# OPCVM GSM — backend Django séparé

Ce dossier est volontairement indépendant du gros `App.jsx`.

## Principe

Le frontend React/Vite ne doit plus porter la logique métier ni la persistance.
Le backend devient la source de vérité.

```text
React/Vite
   |
   | JWT + X-Institution-ID
   v
Django REST Framework
   |
   +-- PostgreSQL
   +-- Redis/Celery
   +-- stockage documents
```

## Modules

- `accounts` : utilisateurs
- `institutions` : SGI, rôles, memberships
- `clients` : clients, KYC, mandats
- `portfolios` : portefeuilles, comptes titres, comptes espèces, gestionnaires
- `instruments` : référentiel titres / émetteurs / bourses
- `ledger` : mouvements titres/espèces, positions, cash, valorisations
- `orders` : ordres, journal d'états, exécutions, allocations
- `committees` : comités, décisions, cibles, résultats, écarts
- `imports` : Excel SGI -> staging
- `marketdata` : cours, indices, FX
- `api` : serializers, viewsets et routes DRF

## Multi-SGI

Toutes les données métier héritent de `InstitutionOwnedModel`.

Le frontend envoie :

```http
Authorization: Bearer <token>
X-Institution-ID: <uuid-sgi>
```

Le backend vérifie l'appartenance du user à la SGI avant de retourner les données.

## Installation

```powershell
cd opcvm_gsm_backend

python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1

pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate

python manage.py createsuperuser
python manage.py runserver 8001
```

Pour PostgreSQL :

```powershell
$env:DB_ENGINE="postgres"
$env:DB_NAME="opcvm_gsm"
$env:DB_USER="opcvm_gsm"
$env:DB_PASSWORD="..."
$env:DB_HOST="127.0.0.1"
python manage.py migrate
```

## Endpoints principaux

```text
POST /api/v1/auth/token/
POST /api/v1/auth/token/refresh/

GET/POST /api/v1/clients/
GET/POST /api/v1/portfolios/
GET/POST /api/v1/security-movements/
GET/POST /api/v1/cash-movements/
GET/POST /api/v1/orders/
POST     /api/v1/orders/{id}/transition/
GET/POST /api/v1/executions/

GET/POST /api/v1/committee-sessions/
GET/POST /api/v1/committee-decisions/
GET/POST /api/v1/decision-targets/
GET/POST /api/v1/decision-executions/
GET/POST /api/v1/decision-deviations/

POST /api/v1/import-jobs/upload/
GET  /api/v1/import-jobs/{id}/rows/

GET /api/v1/market-indices/
GET /api/v1/index-levels/
GET /api/v1/market-prices/
GET /api/v1/fx-rates/
```

## Import SGI

Les feuilles obligatoires sont :

- `Compte`
- `Positions`
- `Mouvements`

Les feuilles facultatives prévues sont :

- `Ordres_ouverts`
- `Flux_futurs`
- `Valorisations`

Le fichier est d'abord copié dans `ImportJob`, puis ses lignes vont dans
`ImportStagingRow`. Aucune donnée métier définitive ne doit être modifiée avant
la phase de validation/commit.

## Migrations

Je fournis les modèles et les packages `migrations/`.
Il est préférable que Django génère les migrations initiales à partir de ces
modèles :

```powershell
python manage.py makemigrations
python manage.py migrate
```

Cela évite de maintenir à la main un graphe de migration fragile pendant que
nous ajustons encore le modèle métier.
