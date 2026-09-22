from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import sqlite3
import os
import uuid
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = Path(os.getenv('GSM_DB_PATH', str(BASE_DIR / 'gsm_operational.db')))
ADMIN_KEY = os.getenv('GSM_ADMIN_KEY', 'change-me-now')
ALLOWED_ORIGINS = [
    x.strip()
    for x in os.getenv(
        'GSM_ALLOWED_ORIGINS',
        'http://localhost:3000,http://127.0.0.1:3000',
    ).split(',')
    if x.strip()
]

app = FastAPI(title='OPCVM GSM Operational API', version='1.0.0')
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


def db():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    con.execute('PRAGMA foreign_keys=ON')
    return con


def rows(con, sql, params=()):
    return [dict(r) for r in con.execute(sql, params).fetchall()]


def row(con, sql, params=()):
    r = con.execute(sql, params).fetchone()
    return dict(r) if r else None


def require_admin(request: Request):
    key = request.headers.get('X-Admin-Key') or request.query_params.get('admin_key')
    if key != ADMIN_KEY:
        raise HTTPException(status_code=401, detail='Clé administrateur invalide')


def now_iso():
    return datetime.utcnow().isoformat(timespec='seconds') + 'Z'


@app.get('/api/health')
def health():
    con = db()
    n = con.execute('SELECT count(*) FROM portfolios').fetchone()[0]
    con.close()
    return {'ok': True, 'database': str(DB_PATH), 'portfolios': n}


@app.get('/api/snapshot')
def snapshot():
    con = db()
    portfolios = rows(
        con,
        '''
        SELECT p.*, c.name client_name, c.client_type, c.country,
               c.relationship_manager
        FROM portfolios p
        JOIN clients c ON c.id = p.client_id
        ORDER BY p.entry_date, p.id
        ''',
    )

    clients = []
    for p in portfolios:
        alloc_rows = rows(
            con,
            'SELECT asset_class,current_pct,target_pct FROM portfolio_allocations WHERE portfolio_id=?',
            (p['id'],),
        )
        exp_rows = rows(
            con,
            'SELECT currency,weight_pct FROM currency_exposures WHERE portfolio_id=? ORDER BY weight_pct DESC',
            (p['id'],),
        )
        event_rows = rows(
            con,
            '''
            SELECT id,event_type,event_date,amount,currency,label,status,source
            FROM cash_events
            WHERE portfolio_id=?
            ORDER BY event_date,id
            ''',
            (p['id'],),
        )
        clients.append(
            {
                'id': p['id'],
                'pays': p['country'],
                'dateEntree': p['entry_date'],
                'nom': p['client_name'],
                'type': p['client_type'],
                'marche': p['market'],
                'devise': p['reference_currency'],
                'encours': p['assets'],
                'perf': p['performance'],
                'risque': p['risk_level'],
                'alertes': p['alerts'],
                'profilRisque': p['risk_profile'],
                'rentabilite': p['profitability'],
                'alloc': {r['asset_class']: r['current_pct'] for r in alloc_rows},
                'cible': {r['asset_class']: r['target_pct'] for r in alloc_rows},
                'expositionsDevises': {
                    r['currency']: r['weight_pct'] for r in exp_rows
                },
                'cashEvents': [
                    {
                        'id': e['id'],
                        'type': e['event_type'],
                        'date': e['event_date'],
                        'montant': e['amount'],
                        'devise': e['currency'],
                        'libelle': e['label'],
                        'statut': e['status'],
                        'source': e['source'],
                    }
                    for e in event_rows
                ],
                'chargeeClientele': p['relationship_manager'],
            }
        )

    wr = rows(
        con,
        '''
        SELECT w.*, c.name client_name
        FROM withdrawal_requests w
        JOIN portfolios p ON p.id = w.portfolio_id
        JOIN clients c ON c.id = p.client_id
        ORDER BY w.requested_date DESC, w.id
        ''',
    )
    con.close()

    return {
        'clients': clients,
        'withdrawalRequests': [
            {
                'id': w['id'],
                'clientId': w['portfolio_id'],
                'client': w['client_name'],
                'montant': w['amount'],
                'devise': w['currency'],
                'statut': w['status'],
                'dateDemande': w['requested_date'],
                'dateSouhaitee': w['desired_date'],
                'chargeeClientele': w['relationship_manager'],
                'observationChargeeClientele': w['observation'],
                'modePaiement': w['payment_method'],
            }
            for w in wr
        ],
        'generatedAt': now_iso(),
    }


@app.get('/api/portfolios')
def get_portfolios():
    con = db()
    data = rows(
        con,
        '''
        SELECT p.*, c.name client_name, c.client_type, c.country,
               c.relationship_manager
        FROM portfolios p
        JOIN clients c ON c.id = p.client_id
        ORDER BY c.name
        ''',
    )
    con.close()
    return data


@app.post('/api/portfolios')
async def create_portfolio(request: Request):
    require_admin(request)
    x = await request.json()
    pid = str(x.get('id') or 'p-' + uuid.uuid4().hex[:10])
    cid = str(x.get('client_id') or pid)
    required = ['name', 'client_type', 'market', 'reference_currency']
    missing = [k for k in required if not x.get(k)]
    if missing:
        raise HTTPException(400, f"Champs requis: {', '.join(missing)}")

    con = db()
    try:
        con.execute(
            'INSERT INTO clients(id,name,client_type,country,relationship_manager) VALUES(?,?,?,?,?)',
            (
                cid,
                x['name'],
                x['client_type'],
                x.get('country'),
                x.get('relationship_manager'),
            ),
        )
        con.execute(
            '''
            INSERT INTO portfolios(
              id,client_id,name,market,reference_currency,assets,performance,
              risk_level,alerts,risk_profile,profitability,entry_date,status
            ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)
            ''',
            (
                pid,
                cid,
                x.get('portfolio_name') or x['name'],
                x['market'],
                x['reference_currency'].upper(),
                float(x.get('assets') or 0),
                float(x.get('performance') or 0),
                x.get('risk_level'),
                int(x.get('alerts') or 0),
                x.get('risk_profile'),
                float(x.get('profitability') or 0),
                x.get('entry_date'),
                x.get('status') or 'Actif',
            ),
        )
        for a, cur, tgt in [
            ('Actions', 40, 40),
            ('Obl. souveraines', 30, 30),
            ('Obl. privées', 20, 20),
            ('Liquidité', 10, 10),
        ]:
            con.execute(
                'INSERT INTO portfolio_allocations VALUES(?,?,?,?)',
                (pid, a, cur, tgt),
            )
        con.execute(
            'INSERT INTO currency_exposures VALUES(?,?,?)',
            (pid, x['reference_currency'].upper(), 100),
        )
        con.commit()
        return {'ok': True, 'id': pid}
    except sqlite3.IntegrityError as exc:
        con.rollback()
        raise HTTPException(409, str(exc)) from exc
    finally:
        con.close()


@app.put('/api/portfolios/{pid}')
async def update_portfolio(pid: str, request: Request):
    require_admin(request)
    x = await request.json()
    con = db()
    p = row(con, 'SELECT client_id FROM portfolios WHERE id=?', (pid,))
    if not p:
        con.close()
        raise HTTPException(404, 'Portefeuille introuvable')

    cid = p['client_id']
    c = row(con, 'SELECT * FROM clients WHERE id=?', (cid,))
    old = row(con, 'SELECT * FROM portfolios WHERE id=?', (pid,))

    con.execute(
        '''
        UPDATE clients
        SET name=?,client_type=?,country=?,relationship_manager=?,updated_at=CURRENT_TIMESTAMP
        WHERE id=?
        ''',
        (
            x.get('name', c['name']),
            x.get('client_type', c['client_type']),
            x.get('country', c['country']),
            x.get('relationship_manager', c['relationship_manager']),
            cid,
        ),
    )
    con.execute(
        '''
        UPDATE portfolios
        SET name=?,market=?,reference_currency=?,assets=?,performance=?,
            risk_level=?,alerts=?,risk_profile=?,profitability=?,entry_date=?,
            status=?,updated_at=CURRENT_TIMESTAMP
        WHERE id=?
        ''',
        (
            x.get('portfolio_name', old['name']),
            x.get('market', old['market']),
            x.get('reference_currency', old['reference_currency']).upper(),
            float(x.get('assets', old['assets'])),
            float(x.get('performance', old['performance'])),
            x.get('risk_level', old['risk_level']),
            int(x.get('alerts', old['alerts'])),
            x.get('risk_profile', old['risk_profile']),
            float(x.get('profitability', old['profitability'])),
            x.get('entry_date', old['entry_date']),
            x.get('status', old['status']),
            pid,
        ),
    )
    con.commit()
    con.close()
    return {'ok': True}


@app.delete('/api/portfolios/{pid}')
def delete_portfolio(pid: str, request: Request):
    require_admin(request)
    con = db()
    p = row(con, 'SELECT client_id FROM portfolios WHERE id=?', (pid,))
    if not p:
        con.close()
        raise HTTPException(404, 'Portefeuille introuvable')
    con.execute('DELETE FROM clients WHERE id=?', (p['client_id'],))
    con.commit()
    con.close()
    return {'ok': True}


@app.get('/api/exposures/{pid}')
def get_exposures(pid: str):
    con = db()
    data = rows(
        con,
        'SELECT currency,weight_pct FROM currency_exposures WHERE portfolio_id=? ORDER BY weight_pct DESC',
        (pid,),
    )
    con.close()
    return {
        'portfolio_id': pid,
        'exposures': {r['currency']: r['weight_pct'] for r in data},
    }


@app.put('/api/exposures/{pid}')
async def put_exposures(pid: str, request: Request):
    require_admin(request)
    x = await request.json()
    ex = x.get('exposures') or x
    if not isinstance(ex, dict) or not ex:
        raise HTTPException(400, 'Expositions requises')
    total = sum(float(v) for v in ex.values())
    if abs(total - 100) > 0.05:
        raise HTTPException(
            400, f'La somme doit être 100 %, valeur reçue: {total:.2f}%'
        )

    con = db()
    con.execute('DELETE FROM currency_exposures WHERE portfolio_id=?', (pid,))
    for cur, weight in ex.items():
        con.execute(
            'INSERT INTO currency_exposures VALUES(?,?,?)',
            (pid, str(cur).upper(), float(weight)),
        )
    con.commit()
    con.close()
    return {'ok': True, 'total': total}


@app.get('/api/allocations/{pid}')
def get_allocations(pid: str):
    con = db()
    data = rows(
        con,
        'SELECT asset_class,current_pct,target_pct FROM portfolio_allocations WHERE portfolio_id=?',
        (pid,),
    )
    con.close()
    return data


@app.put('/api/allocations/{pid}')
async def put_allocations(pid: str, request: Request):
    require_admin(request)
    x = await request.json()
    items = x.get('allocations') or []
    if not items:
        raise HTTPException(400, 'allocations requises')
    if abs(sum(float(i.get('current_pct', 0)) for i in items) - 100) > 0.05:
        raise HTTPException(400, 'Allocation actuelle doit sommer à 100%')

    con = db()
    con.execute('DELETE FROM portfolio_allocations WHERE portfolio_id=?', (pid,))
    for item in items:
        con.execute(
            'INSERT INTO portfolio_allocations VALUES(?,?,?,?)',
            (
                pid,
                item['asset_class'],
                float(item.get('current_pct', 0)),
                float(item.get('target_pct', 0)),
            ),
        )
    con.commit()
    con.close()
    return {'ok': True}


@app.get('/api/events')
def get_events(portfolio_id: str | None = None):
    con = db()
    if portfolio_id:
        data = rows(
            con,
            'SELECT * FROM cash_events WHERE portfolio_id=? ORDER BY event_date DESC',
            (portfolio_id,),
        )
    else:
        data = rows(con, 'SELECT * FROM cash_events ORDER BY event_date DESC')
    con.close()
    return data


@app.post('/api/events')
async def create_event(request: Request):
    require_admin(request)
    x = await request.json()
    eid = str(x.get('id') or 'EV-' + uuid.uuid4().hex[:12])
    for k in ['portfolio_id', 'event_type', 'event_date', 'amount', 'currency']:
        if x.get(k) in (None, ''):
            raise HTTPException(400, f'{k} requis')

    con = db()
    con.execute(
        '''
        INSERT INTO cash_events(
          id,portfolio_id,event_type,event_date,amount,currency,label,status,source
        ) VALUES(?,?,?,?,?,?,?,?,?)
        ''',
        (
            eid,
            x['portfolio_id'],
            x['event_type'],
            x['event_date'],
            float(x['amount']),
            x['currency'].upper(),
            x.get('label'),
            x.get('status') or 'Réalisé',
            'MANUAL',
        ),
    )
    con.commit()
    con.close()
    return {'ok': True, 'id': eid}


@app.put('/api/events/{eid}')
async def update_event(eid: str, request: Request):
    require_admin(request)
    x = await request.json()
    con = db()
    old = row(con, 'SELECT * FROM cash_events WHERE id=?', (eid,))
    if not old:
        con.close()
        raise HTTPException(404, 'Événement introuvable')

    con.execute(
        '''
        UPDATE cash_events
        SET portfolio_id=?,event_type=?,event_date=?,amount=?,currency=?,label=?,status=?,source='MANUAL'
        WHERE id=?
        ''',
        (
            x.get('portfolio_id', old['portfolio_id']),
            x.get('event_type', old['event_type']),
            x.get('event_date', old['event_date']),
            float(x.get('amount', old['amount'])),
            x.get('currency', old['currency']).upper(),
            x.get('label', old['label']),
            x.get('status', old['status']),
            eid,
        ),
    )
    con.commit()
    con.close()
    return {'ok': True}


@app.delete('/api/events/{eid}')
def delete_event(eid: str, request: Request):
    require_admin(request)
    con = db()
    con.execute('DELETE FROM cash_events WHERE id=?', (eid,))
    con.commit()
    con.close()
    return {'ok': True}


@app.get('/api/withdrawals')
def get_withdrawals():
    con = db()
    data = rows(con, 'SELECT * FROM withdrawal_requests ORDER BY requested_date DESC')
    con.close()
    return data


@app.post('/api/withdrawals')
async def create_withdrawal(request: Request):
    require_admin(request)
    x = await request.json()
    wid = str(x.get('id') or 'WR-' + uuid.uuid4().hex[:10])
    con = db()
    con.execute(
        '''
        INSERT INTO withdrawal_requests(
          id,portfolio_id,amount,currency,status,requested_date,desired_date,
          relationship_manager,observation,payment_method
        ) VALUES(?,?,?,?,?,?,?,?,?,?)
        ''',
        (
            wid,
            x['portfolio_id'],
            float(x['amount']),
            x['currency'].upper(),
            x.get('status') or 'Demande reçue',
            x.get('requested_date'),
            x.get('desired_date'),
            x.get('relationship_manager'),
            x.get('observation'),
            x.get('payment_method'),
        ),
    )
    con.commit()
    con.close()
    return {'ok': True, 'id': wid}


@app.put('/api/withdrawals/{wid}')
async def update_withdrawal(wid: str, request: Request):
    require_admin(request)
    x = await request.json()
    con = db()
    old = row(con, 'SELECT * FROM withdrawal_requests WHERE id=?', (wid,))
    if not old:
        con.close()
        raise HTTPException(404, 'Retrait introuvable')

    con.execute(
        '''
        UPDATE withdrawal_requests
        SET portfolio_id=?,amount=?,currency=?,status=?,requested_date=?,
            desired_date=?,relationship_manager=?,observation=?,payment_method=?,
            updated_at=CURRENT_TIMESTAMP
        WHERE id=?
        ''',
        (
            x.get('portfolio_id', old['portfolio_id']),
            float(x.get('amount', old['amount'])),
            x.get('currency', old['currency']).upper(),
            x.get('status', old['status']),
            x.get('requested_date', old['requested_date']),
            x.get('desired_date', old['desired_date']),
            x.get('relationship_manager', old['relationship_manager']),
            x.get('observation', old['observation']),
            x.get('payment_method', old['payment_method']),
            wid,
        ),
    )
    con.commit()
    con.close()
    return {'ok': True}


@app.delete('/api/withdrawals/{wid}')
def delete_withdrawal(wid: str, request: Request):
    require_admin(request)
    con = db()
    con.execute('DELETE FROM withdrawal_requests WHERE id=?', (wid,))
    con.commit()
    con.close()
    return {'ok': True}


@app.get('/admin', response_class=HTMLResponse)
def admin():
    return HTMLResponse(ADMIN_HTML)


ADMIN_HTML = r'''<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>OPCVM GSM — Administration</title>
<style>
:root{font-family:Inter,Arial,sans-serif;color:#101827;background:#f5f6f9}body{margin:0}.top{background:#0f1b33;color:white;padding:18px 28px;display:flex;align-items:center;justify-content:space-between}.top h1{font-size:18px;margin:0}.wrap{padding:24px;max-width:1500px;margin:auto}.card{background:white;border:1px solid #e7e9ef;border-radius:16px;padding:18px;margin-bottom:18px}.tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}.tabs button,.btn{border:0;border-radius:10px;padding:9px 13px;font-weight:700;cursor:pointer}.tabs button{background:#eef0f4}.tabs button.active,.btn.primary{background:#0f1b33;color:#fff}.btn.red{background:#feecea;color:#b83227}.btn.green{background:#e7f7f1;color:#13795b}input,select,textarea{width:100%;box-sizing:border-box;border:1px solid #dfe3ea;border-radius:9px;padding:8px;background:white}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.grid .wide{grid-column:span 2}.actions{display:flex;gap:8px;align-items:end}.tablewrap{overflow:auto}table{width:100%;border-collapse:collapse;min-width:1000px}th,td{padding:9px;border-bottom:1px solid #eee;text-align:left;font-size:12px}th{background:#fafafc;position:sticky;top:0}.muted{color:#5b6474;font-size:12px}.hidden{display:none}.status{padding:5px 9px;border-radius:999px;background:#eef0f4;font-size:11px}.error{color:#b83227}.ok{color:#13795b}.mono{font-family:ui-monospace,Consolas,monospace}@media(max-width:900px){.grid{grid-template-columns:1fr 1fr}}@media(max-width:600px){.grid{grid-template-columns:1fr}}
</style></head>
<body><div class="top"><h1>OPCVM GSM · Base opérationnelle</h1><span id="health" class="status">Connexion…</span></div><div class="wrap">
<div class="card"><div class="grid"><div><label>Clé administrateur</label><input id="key" type="password" placeholder="GSM_ADMIN_KEY"></div><div class="actions"><button class="btn primary" onclick="saveKey()">Enregistrer la clé</button><button class="btn" onclick="refreshAll()">Actualiser</button></div><div class="wide muted">Lecture libre pour le site. Les créations/modifications/suppressions exigent cette clé. Changez la clé par défaut avant tout déploiement.</div></div></div>
<div class="tabs"><button data-tab="portfolios" class="active">Portefeuilles</button><button data-tab="exposures">Expositions devises</button><button data-tab="events">Dépôts / retraits / coupons / dividendes</button><button data-tab="withdrawals">Cession-retrait</button></div>
<section id="portfolios" class="tab"><div class="card"><h3>Créer / modifier un portefeuille</h3><input type="hidden" id="p_edit"><div class="grid"><div><label>ID (optionnel)</label><input id="p_id"></div><div><label>Client</label><input id="p_name"></div><div><label>Type</label><select id="p_type"><option>Privé</option><option>Institutionnel</option></select></div><div><label>Pays</label><input id="p_country"></div><div><label>Marché</label><select id="p_market"><option>BRVM</option><option>NGX</option><option>GSE</option><option>JSE</option><option>CSE</option><option>NSE</option></select></div><div><label>Devise de référence</label><input id="p_currency" value="XOF"></div><div><label>Encours</label><input id="p_assets" type="number"></div><div><label>Date d'entrée</label><input id="p_entry" type="date"></div><div><label>Profil de risque</label><input id="p_profile"></div><div><label>Niveau de risque</label><input id="p_risk"></div><div><label>Performance %</label><input id="p_perf" type="number" step="0.01"></div><div><label>Rentabilité %</label><input id="p_profit" type="number" step="0.01"></div><div><label>Chargé(e) clientèle</label><input id="p_rm"></div><div class="actions"><button class="btn primary" onclick="savePortfolio()">Enregistrer</button><button class="btn" onclick="resetPortfolio()">Nouveau</button></div></div><div id="p_msg" class="muted"></div></div><div class="card tablewrap"><table><thead><tr><th>ID</th><th>Client</th><th>Type</th><th>Pays</th><th>Marché</th><th>Devise</th><th>Encours</th><th>Profil</th><th>Actions</th></tr></thead><tbody id="p_rows"></tbody></table></div></section>
<section id="exposures" class="tab hidden"><div class="card"><h3>Ventilation multi-devises</h3><div class="grid"><div class="wide"><label>Portefeuille</label><select id="x_pid" onchange="loadExposure()"></select></div><div class="wide"><label>JSON des poids — somme = 100</label><textarea id="x_json" rows="5" class="mono" placeholder='{"XOF":55,"USD":25,"EUR":20}'></textarea></div><div class="actions"><button class="btn primary" onclick="saveExposure()">Enregistrer la ventilation</button></div></div><div id="x_msg" class="muted"></div></div></section>
<section id="events" class="tab hidden"><div class="card"><h3>Ajouter un événement financier</h3><div class="grid"><div><label>Portefeuille</label><select id="e_pid"></select></div><div><label>Type</label><select id="e_type"><option>Dépôt</option><option>Retrait</option><option>Coupon</option><option>Dividende</option></select></div><div><label>Date</label><input id="e_date" type="date"></div><div><label>Montant</label><input id="e_amount" type="number"></div><div><label>Devise</label><input id="e_currency" value="XOF"></div><div class="wide"><label>Libellé</label><input id="e_label"></div><div class="actions"><button class="btn primary" onclick="addEvent()">Ajouter</button></div></div><div id="e_msg" class="muted"></div></div><div class="card tablewrap"><table><thead><tr><th>Date</th><th>Portefeuille</th><th>Type</th><th>Montant</th><th>Devise</th><th>Libellé</th><th>Source</th><th></th></tr></thead><tbody id="e_rows"></tbody></table></div></section>
<section id="withdrawals" class="tab hidden"><div class="card"><h3>Ajouter une demande de retrait</h3><div class="grid"><div><label>Portefeuille</label><select id="w_pid"></select></div><div><label>Montant</label><input id="w_amount" type="number"></div><div><label>Devise</label><input id="w_currency" value="XOF"></div><div><label>Statut</label><select id="w_status"><option>Demande reçue</option><option>Processus lancé</option><option>Cession en cours</option><option>Retrait disponible</option></select></div><div><label>Date demande</label><input id="w_req" type="date"></div><div><label>Date souhaitée</label><input id="w_des" type="date"></div><div><label>Chargé(e) clientèle</label><input id="w_rm"></div><div><label>Mode paiement</label><select id="w_pay"><option>Chèque</option><option>Virement bancaire</option><option>Espèces</option></select></div><div class="wide"><label>Observation</label><textarea id="w_obs" rows="3"></textarea></div><div class="actions"><button class="btn primary" onclick="addWithdrawal()">Ajouter</button></div></div></div><div class="card tablewrap"><table><thead><tr><th>ID</th><th>Portefeuille</th><th>Montant</th><th>Devise</th><th>Statut</th><th>Date</th><th>Mode</th><th></th></tr></thead><tbody id="w_rows"></tbody></table></div></section>
</div>
<script>
let portfolios=[],events=[],withdrawals=[];const $=id=>document.getElementById(id);function key(){return sessionStorage.getItem('gsm-key')||''}function saveKey(){sessionStorage.setItem('gsm-key',$('key').value);alert('Clé enregistrée pour cette session.')}async function api(url,opt={}){opt.headers={...(opt.headers||{}),'Content-Type':'application/json'};if(opt.method&&opt.method!=='GET')opt.headers['X-Admin-Key']=key();const r=await fetch(url,opt);const t=await r.text();let d;try{d=JSON.parse(t)}catch{d=t}if(!r.ok)throw new Error(d.detail||d||r.statusText);return d}function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}function money(v){return new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0}).format(Number(v||0))}
async function refreshAll(){try{const h=await api('/api/health');$('health').textContent='Connectée · '+h.portfolios+' portefeuilles';$('health').className='status ok';portfolios=await api('/api/portfolios');events=await api('/api/events');withdrawals=await api('/api/withdrawals');render()}catch(e){$('health').textContent='Erreur';$('health').className='status error';alert(e.message)}}
function render(){const opts=portfolios.map(p=>`<option value="${esc(p.id)}">${esc(p.client_name)} · ${esc(p.market)} · ${esc(p.reference_currency)}</option>`).join('');['x_pid','e_pid','w_pid'].forEach(id=>$(id).innerHTML=opts);$('p_rows').innerHTML=portfolios.map(p=>`<tr><td class=mono>${esc(p.id)}</td><td>${esc(p.client_name)}</td><td>${esc(p.client_type)}</td><td>${esc(p.country)}</td><td>${esc(p.market)}</td><td>${esc(p.reference_currency)}</td><td>${money(p.assets)}</td><td>${esc(p.risk_profile)}</td><td><button class="btn green" onclick='editPortfolio(${JSON.stringify(p)})'>Modifier</button> <button class="btn red" onclick="deletePortfolio('${esc(p.id)}')">Supprimer</button></td></tr>`).join('');$('e_rows').innerHTML=events.slice(0,200).map(e=>`<tr><td>${esc(e.event_date)}</td><td>${esc(e.portfolio_id)}</td><td>${esc(e.event_type)}</td><td>${money(e.amount)}</td><td>${esc(e.currency)}</td><td>${esc(e.label)}</td><td>${esc(e.source)}</td><td><button class="btn red" onclick="deleteEvent('${esc(e.id)}')">Supprimer</button></td></tr>`).join('');$('w_rows').innerHTML=withdrawals.map(w=>`<tr><td>${esc(w.id)}</td><td>${esc(w.portfolio_id)}</td><td>${money(w.amount)}</td><td>${esc(w.currency)}</td><td>${esc(w.status)}</td><td>${esc(w.requested_date)}</td><td>${esc(w.payment_method)}</td><td><button class="btn red" onclick="deleteWithdrawal('${esc(w.id)}')">Supprimer</button></td></tr>`).join('');if(portfolios.length)loadExposure()}
function editPortfolio(p){$('p_edit').value=p.id;$('p_id').value=p.id;$('p_id').disabled=true;$('p_name').value=p.client_name||'';$('p_type').value=p.client_type||'Privé';$('p_country').value=p.country||'';$('p_market').value=p.market||'BRVM';$('p_currency').value=p.reference_currency||'XOF';$('p_assets').value=p.assets||0;$('p_entry').value=p.entry_date||'';$('p_profile').value=p.risk_profile||'';$('p_risk').value=p.risk_level||'';$('p_perf').value=p.performance||0;$('p_profit').value=p.profitability||0;$('p_rm').value=p.relationship_manager||'';window.scrollTo({top:0,behavior:'smooth'})}
function resetPortfolio(){['p_edit','p_id','p_name','p_country','p_assets','p_entry','p_profile','p_risk','p_perf','p_profit','p_rm'].forEach(id=>$(id).value='');$('p_id').disabled=false;$('p_type').value='Privé';$('p_market').value='BRVM';$('p_currency').value='XOF'}
async function savePortfolio(){try{const edit=$('p_edit').value;const x={id:$('p_id').value||undefined,name:$('p_name').value,client_type:$('p_type').value,country:$('p_country').value,market:$('p_market').value,reference_currency:$('p_currency').value.toUpperCase(),assets:Number($('p_assets').value||0),entry_date:$('p_entry').value||null,risk_profile:$('p_profile').value,risk_level:$('p_risk').value,performance:Number($('p_perf').value||0),profitability:Number($('p_profit').value||0),relationship_manager:$('p_rm').value};await api(edit?'/api/portfolios/'+edit:'/api/portfolios',{method:edit?'PUT':'POST',body:JSON.stringify(x)});$('p_msg').textContent='Enregistré.';resetPortfolio();await refreshAll()}catch(e){$('p_msg').textContent=e.message;$('p_msg').className='error'}}
async function deletePortfolio(id){if(!confirm('Supprimer ce portefeuille et ses données liées ?'))return;try{await api('/api/portfolios/'+id,{method:'DELETE'});await refreshAll()}catch(e){alert(e.message)}}
async function loadExposure(){const id=$('x_pid').value;if(!id)return;try{const d=await api('/api/exposures/'+id);$('x_json').value=JSON.stringify(d.exposures,null,2)}catch(e){$('x_msg').textContent=e.message}}
async function saveExposure(){try{const id=$('x_pid').value;const ex=JSON.parse($('x_json').value);await api('/api/exposures/'+id,{method:'PUT',body:JSON.stringify({exposures:ex})});$('x_msg').textContent='Ventilation enregistrée.'}catch(e){$('x_msg').textContent=e.message}}
async function addEvent(){try{await api('/api/events',{method:'POST',body:JSON.stringify({portfolio_id:$('e_pid').value,event_type:$('e_type').value,event_date:$('e_date').value,amount:Number($('e_amount').value),currency:$('e_currency').value,label:$('e_label').value})});$('e_msg').textContent='Événement ajouté.';await refreshAll()}catch(e){$('e_msg').textContent=e.message}}
async function deleteEvent(id){if(!confirm('Supprimer cet événement ?'))return;await api('/api/events/'+id,{method:'DELETE'});await refreshAll()}
async function addWithdrawal(){try{await api('/api/withdrawals',{method:'POST',body:JSON.stringify({portfolio_id:$('w_pid').value,amount:Number($('w_amount').value),currency:$('w_currency').value,status:$('w_status').value,requested_date:$('w_req').value,desired_date:$('w_des').value,relationship_manager:$('w_rm').value,observation:$('w_obs').value,payment_method:$('w_pay').value})});await refreshAll()}catch(e){alert(e.message)}}
async function deleteWithdrawal(id){if(!confirm('Supprimer cette demande ?'))return;await api('/api/withdrawals/'+id,{method:'DELETE'});await refreshAll()}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.tab').forEach(x=>x.classList.add('hidden'));$(b.dataset.tab).classList.remove('hidden')});$('key').value=sessionStorage.getItem('gsm-key')||'';refreshAll();
</script></body></html>'''
