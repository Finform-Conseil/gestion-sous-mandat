import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { convertCurrency, fmt, fmtPrice } from '../../shared/lib/finance';
import { Badge, Btn, Card, Eyebrow, Pct, Td, Th } from '../../shared/ui/UiAtoms';
import { C, F_BODY, F_DISPLAY, F_MONO } from '../../shared/theme/theme';
import { ClientBreadcrumb } from './ClientCommon';
import { parsePctNumber } from '../watchlist/WatchlistModel';
import { calculerAvis } from '../trading/AvisOperesModel';

export function createClientDecisionScreens(dependencies) {
  const {
    CLIENT_GESTION_LIBRE,
    buildStaticWatchlistRow,
    buildWatchlistJournaliere,
    clientMarket,
    parseFR,
  } = dependencies;

  function ClientWatchlist({
  goClient,
  watchlistTitles,
  onAddWatch,
  onRemoveWatch,
}) {
  const now = new Date();
  const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(now.getDate()).padStart(2, '0')}`;
  const dateLabel = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(now);

  const defaultDailyFilters = {
    marche: 'Tous',
    secteur: 'Tous',
    mm: 'Tous',
    macd: 'Tous',
    rsiMin: '0',
    rsiMax: '100',
    bol: 'Tous',
    signalTechnique: 'Tous',
    perMax: '',
    rentabiliteMin: '',
    evolMin: '',
    valorisation: 'Tous',
    signalFondamental: 'Tous',
  };
  const [dailyFilters, setDailyFilters] = useState(defaultDailyFilters);
  const [showDailyFilters, setShowDailyFilters] = useState(true);

  const marchesClient = new Set(
    CLIENT_GESTION_LIBRE.portefeuilles.map(
      (portefeuille) => portefeuille.marche
    )
  );

  const staticRows = watchlistTitles
    .map((titre) => {
      const row = buildStaticWatchlistRow(titre);
      const market = clientMarket(titre);
      if (!row || !market || !marchesClient.has(market.marche)) return null;
      return {
        ...row,
        type: market.type,
        cours: market.cours,
        variation: market.variation,
        devise: market.devise,
        compatibles: CLIENT_GESTION_LIBRE.portefeuilles.filter(
          (pf) => pf.marche === market.marche
        ),
      };
    })
    .filter(Boolean);

  const dailyRows = buildWatchlistJournaliere(dateKey)
    .filter((row) => marchesClient.has(row.marche))
    .map((row) => ({
      ...row,
      compatibles: CLIENT_GESTION_LIBRE.portefeuilles.filter(
        (pf) => pf.marche === row.marche
      ),
    }));

  const marches = ['Tous', ...new Set(dailyRows.map((r) => r.marche))];
  const secteurs = ['Tous', ...new Set(dailyRows.map((r) => r.secteur))];
  const macdOptions = [
    'Tous',
    ...new Set(dailyRows.map((r) => r.technique.macd)),
  ];
  const bolOptions = [
    'Tous',
    ...new Set(dailyRows.map((r) => r.technique.bol)),
  ];
  const signauxTechniques = [
    'Tous',
    ...new Set(dailyRows.map((r) => r.technique.signal)),
  ];
  const valorisations = [
    'Tous',
    ...new Set(dailyRows.map((r) => r.fondamentale.valo)),
  ];
  const signauxFondamentaux = [
    'Tous',
    ...new Set(dailyRows.map((r) => r.fondamentale.signal)),
  ];

  const mmDirection = (mm) =>
    mm.includes('>') ? 'Haussière' : mm.includes('<') ? 'Baissière' : 'Neutre';

  const rowsJour = dailyRows.filter((r) => {
    const perMax =
      dailyFilters.perMax === '' ? null : Number(dailyFilters.perMax);
    const rentabiliteMin =
      dailyFilters.rentabiliteMin === ''        ? null
        : Number(dailyFilters.rentabiliteMin);
    const evolMin =
      dailyFilters.evolMin === '' ? null : Number(dailyFilters.evolMin);
    const rsiMin = Number(dailyFilters.rsiMin || 0);
    const rsiMax = Number(dailyFilters.rsiMax || 100);

    return (
      (dailyFilters.marche === 'Tous' || r.marche === dailyFilters.marche) &&
      (dailyFilters.secteur === 'Tous' || r.secteur === dailyFilters.secteur) &&
      (dailyFilters.mm === 'Tous' ||
        mmDirection(r.technique.mm) === dailyFilters.mm) &&
      (dailyFilters.macd === 'Tous' ||
        r.technique.macd === dailyFilters.macd) &&
      r.technique.rsi >= rsiMin &&
      r.technique.rsi <= rsiMax &&
      (dailyFilters.bol === 'Tous' || r.technique.bol === dailyFilters.bol) &&
      (dailyFilters.signalTechnique === 'Tous' ||
        r.technique.signal === dailyFilters.signalTechnique) &&
      (perMax === null || r.fondamentale.per <= perMax) &&
      (rentabiliteMin === null ||
        parsePctNumber(r.fondamentale.rentabilite) >= rentabiliteMin) &&
      (evolMin === null || parsePctNumber(r.fondamentale.evol) >= evolMin) &&
      (dailyFilters.valorisation === 'Tous' ||
        r.fondamentale.valo === dailyFilters.valorisation) &&
      (dailyFilters.signalFondamental === 'Tous' ||
        r.fondamentale.signal === dailyFilters.signalFondamental)
    );
  });

  const activeFilterCount = Object.entries(dailyFilters).filter(
    ([key, value]) => {
      if (
        [
          'marche',
          'secteur',
          'mm',
          'macd',
          'bol',
          'signalTechnique',
          'valorisation',
          'signalFondamental',
        ].includes(key)
      ) {
        return value !== 'Tous';
      }
      if (key === 'rsiMin') return value !== '0';
      if (key === 'rsiMax') return value !== '100';
      return value !== '';
    }
  ).length;

  const updateDailyFilter = (key, value) =>
    setDailyFilters((current) => ({ ...current, [key]: value }));

  const toneSignalJour = (signal) => {
    if (signal === 'Surveiller achat') return 'teal';
    if (signal === 'Attendre confirmation') return 'gold';
    if (signal === 'Écarter / alléger') return 'coral';
    return 'slate';
  };

  const toneSignalFondamental = (signal) => {
    if (signal === 'Acheter') return 'teal';
    if (signal === 'Vendre') return 'coral';
    return 'gold';
  };

  return (
    <div className="space-y-6">
      <ClientBreadcrumb items={['Espace Client', 'Watchlist']} />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Watchlist — sélection fondamentale &amp; signaux de marché
          </h2>
          <div className="text-xs mt-1" style={{ color: C.sub, ...F_BODY }}>
            Une watchlist statique que vous construisez vous-même et une
            watchlist journalière recalculée selon les signaux de marché
            disponibles sur les places accessibles via vos SGI.
          </div>
        </div>
        <Btn tone="ghost" onClick={() => goClient('client-exchanges')}>
          Ajouter depuis la vue des bourses
        </Btn>
      </div>

      <Card className="p-0 overflow-hidden" style={{ borderColor: C.gold }}>
        <div
          className="p-5 flex items-start justify-between gap-4"
          style={{ background: C.warningBackground }}
        >
          <div>
            <Eyebrow>Watchlist statique — conviction fondamentale</Eyebrow>
            <div className="text-sm font-semibold" style={{ color: C.ink }}>
              Votre sélection personnelle de titres à suivre dans la durée            </div>
            <div className="text-xs mt-1" style={{ color: C.sub }}>
              Elle peut être alimentée directement depuis « Vue des bourses
              Actions » ou depuis le marché obligataire. Les titres restent
              enregistrés jusqu'à ce que vous décidiez de les retirer.
            </div>
          </div>
          <Badge tone="gold">{staticRows.length} valeur(s)</Badge>
        </div>

        <div className="gsm-table-scroll">
          <table className="w-full gsm-table--banking" style={{ minWidth: 1780 }}>
            <thead style={{ background: C.surfaceElevated }}>
              <tr>
                <Th>Instrument</Th>
                <Th>Marché</Th>
                <Th>Secteur</Th>
                <Th>Cours</Th>
                <Th>Var. jour</Th>
                <Th>PER</Th>
                <Th>Total return YTD</Th>
                <Th>EVOL</Th>
                <Th>Valorisation</Th>
                <Th>Signal fondamental</Th>
                <Th>SGI accessibles</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {staticRows.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="text-center py-9 text-sm"
                    style={{ color: C.sub }}
                  >
                    Votre watchlist statique est vide. Ajoutez un actif depuis «
                    Marchés — Actions &amp; Obligations ».
                  </td>
                </tr>
              )}
              {staticRows.map((r, i) => (
                <tr
                  key={r.titre}
                  style={{
                    borderTop: `1px solid ${C.line}`,
                    background: i % 2 ? C.rowAlternate : C.surfaceCard,
                  }}
                >
                  <Td className="font-semibold whitespace-nowrap">{r.titre}</Td>
                  <Td>
                    <Badge tone="navy">{r.marche}</Badge>
                  </Td>
                  <Td className="whitespace-nowrap">{r.secteur}</Td>
                  <Td mono className="whitespace-nowrap">
                    {fmtPrice(r.cours)} {r.devise}
                  </Td>
                  <Td>
                    <Pct v={r.variation} />
                  </Td>
                  <Td mono>
                    {r.fondamentale.per == null
                      ? 'N/D'
                      : `${r.fondamentale.per.toFixed(1)}x`}
                  </Td>
                  <Td mono>{r.fondamentale.rentabilite}</Td>
                  <Td mono>{r.fondamentale.evol}</Td>
                  <Td className="whitespace-nowrap">{r.fondamentale.valo}</Td>
                  <Td>
                    <Badge tone={toneSignalFondamental(r.fondamentale.signal)}>
                      {r.fondamentale.signal}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="text-xs font-semibold">
                      {r.compatibles.length} SGI
                    </div>
                    <div className="text-[10px]" style={{ color: C.sub }}>
                      {r.compatibles.map((pf) => pf.sgi).join(' · ')}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() =>
                          goClient('client-market-depth', {
                            instrument: r.titre,
                            marche: r.marche,
                          })
                        }
                        className="text-xs font-semibold"
                        style={{ color: C.indigo }}
                      >
                        Profondeur →
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          goClient('client-ticket', {                            instrument: r.titre,
                            marche: r.marche,
                            source:
                              clientMarket(r.titre, r.marche)?.type ===
                              'Obligation'
                                ? 'obligations'
                                : 'vue-boursiere',
                          })
                        }
                        className="text-xs font-semibold"
                        style={{ color: C.navy }}
                      >
                        Investir →
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveWatch(r.titre)}
                        className="inline-flex items-center gap-1 text-xs font-semibold"
                        style={{ color: C.coral }}
                      >
                        <X size={12} /> Retirer
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        className="gsm-client-daily-watchlist p-0 overflow-hidden flex flex-col"
        style={{
          borderColor: C.navy,
          height: 'clamp(650px, calc(100vh - 100px), 830px)',
        }}
      >
        <div
          className="gsm-client-daily-watchlist__filters p-5 shrink-0"
          style={{
            background: C.infoBackground,
            maxHeight: showDailyFilters ? '52%' : 'auto',
            overflowY: showDailyFilters ? 'auto' : 'visible',
            overscrollBehavior: 'contain',
            scrollbarGutter: 'stable',
          }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Eyebrow>Watchlist journalière — signaux de marché</Eyebrow>
              <div className="text-sm font-semibold" style={{ color: C.ink }}>
                Classement du {dateLabel}
              </div>
              <div className="text-xs mt-1" style={{ color: C.sub }}>
                Classement automatique des titres accessibles sur vos marchés.
                Cette liste ne modifie pas votre watchlist statique tant que
                vous n'ajoutez pas explicitement un titre.
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Badge tone="navy">Actualisation quotidienne</Badge>
              <Badge tone="gold">{rowsJour.length} valeur(s)</Badge>
              <Badge tone={activeFilterCount > 0 ? 'teal' : 'slate'}>
                {activeFilterCount} filtre(s) actif(s)
              </Badge>
              <button
                type="button"
                onClick={() => setShowDailyFilters((visible) => !visible)}
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                style={{
                  borderColor: C.line,
                  color: C.navy,
                  background: C.surfaceCard,
                }}
              >
                {showDailyFilters
                  ? 'Masquer les filtres ↑'
                  : 'Afficher les filtres ↓'}
              </button>
            </div>
          </div>

          {showDailyFilters && (
            <div
              className="mt-4 p-4 rounded-xl border"
              style={{ borderColor: C.borderSubtle, background: C.surfaceCard }}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: C.ink }}
                  >
                    Filtres automatiques — application instantanée
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: C.sub }}>
                    Technique, fondamentale, marché et secteur.
                  </div>
                </div>                <button
                  type="button"
                  onClick={() => setDailyFilters(defaultDailyFilters)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                  style={{
                    borderColor: C.line,
                    color: C.navy,
                    background: C.surfaceCard,
                  }}
                >
                  Réinitialiser les filtres
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3">
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Bourse
                  </label>
                  <select name="gsm-clientdecisionscreens-437" aria-label="Sélection clientdecisionscreens"
                    value={dailyFilters.marche}
                    onChange={(e) =>
                      updateDailyFilter('marche', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {marches.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Secteur
                  </label>
                  <select name="gsm-clientdecisionscreens-457" aria-label="Sélection clientdecisionscreens"
                    value={dailyFilters.secteur}
                    onChange={(e) =>
                      updateDailyFilter('secteur', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {secteurs.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    MM
                  </label>
                  <select name="gsm-clientdecisionscreens-477" aria-label="Sélection clientdecisionscreens"
                    value={dailyFilters.mm}
                    onChange={(e) => updateDailyFilter('mm', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {['Tous', 'Haussière', 'Neutre', 'Baissière'].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    MACD
                  </label>
                  <select name="gsm-clientdecisionscreens-495" aria-label="Sélection clientdecisionscreens"
                    value={dailyFilters.macd}
                    onChange={(e) => updateDailyFilter('macd', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {macdOptions.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    BOL
                  </label>
                  <select name="gsm-clientdecisionscreens-513" aria-label="Sélection clientdecisionscreens"
                    value={dailyFilters.bol}                    onChange={(e) => updateDailyFilter('bol', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {bolOptions.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    RSI minimum
                  </label>
                  <input name="gsm-clientdecisionscreens-531" aria-label="Champ clientdecisionscreens"
                    type="number"
                    min="0"
                    max="100"
                    value={dailyFilters.rsiMin}
                    onChange={(e) =>
                      updateDailyFilter('rsiMin', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    RSI maximum
                  </label>
                  <input name="gsm-clientdecisionscreens-550" aria-label="Champ clientdecisionscreens"
                    type="number"
                    min="0"
                    max="100"
                    value={dailyFilters.rsiMax}
                    onChange={(e) =>
                      updateDailyFilter('rsiMax', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Signal technique
                  </label>
                  <select name="gsm-clientdecisionscreens-569" aria-label="Sélection clientdecisionscreens"
                    value={dailyFilters.signalTechnique}
                    onChange={(e) =>
                      updateDailyFilter('signalTechnique', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {signauxTechniques.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    PER maximum
                  </label>
                  <input name="gsm-clientdecisionscreens-589" aria-label="Sans limite"
                    type="number"
                    min="0"
                    step="0.1"
                    value={dailyFilters.perMax}
                    onChange={(e) =>
                      updateDailyFilter('perMax', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Rentabilité min. (%)
                  </label>
                  <input name="gsm-clientdecisionscreens-609" aria-label="Sans limite"
                    type="number"
                    step="0.1"
                    value={dailyFilters.rentabiliteMin}
                    onChange={(e) =>                      updateDailyFilter('rentabiliteMin', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>

                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    EVOL minimum (%)
                  </label>
                  <input name="gsm-clientdecisionscreens-628" aria-label="Sans limite"
                    type="number"
                    step="0.1"
                    value={dailyFilters.evolMin}
                    onChange={(e) =>
                      updateDailyFilter('evolMin', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Valorisation
                  </label>
                  <select name="gsm-clientdecisionscreens-647" aria-label="Sélection clientdecisionscreens"
                    value={dailyFilters.valorisation}
                    onChange={(e) =>
                      updateDailyFilter('valorisation', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {valorisations.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Signal fondamental
                  </label>
                  <select name="gsm-clientdecisionscreens-667" aria-label="Sélection clientdecisionscreens"
                    value={dailyFilters.signalFondamental}
                    onChange={(e) =>
                      updateDailyFilter('signalFondamental', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {signauxFondamentaux.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className="gsm-client-daily-watchlist__table gsm-table-scroll flex-1 min-h-0 overflow-auto"
          style={{
            overscrollBehavior: 'contain',
            scrollbarGutter: 'stable',
          }}
        >
          <table className="w-full gsm-table--banking" style={{ minWidth: 2450 }}>
            <thead
              style={{
                background: C.surfaceElevated,
                position: 'sticky',
                top: 0,
                zIndex: 2,
              }}
            >
              <tr>
                <Th>Rang</Th>
                <Th>Instrument</Th>
                <Th>Marché</Th>
                <Th>Secteur</Th>
                <Th>Cours</Th>
                <Th>Variation jour</Th>
                <Th>MM</Th>
                <Th>MACD</Th>
                <Th>RSI</Th>
                <Th>BOL</Th>
                <Th>Score technique</Th>
                <Th>PER</Th>
                <Th>Rentabilité</Th>
                <Th>EVOL</Th>
                <Th>VALO</Th>
                <Th>Signal fondamental</Th>
                <Th>Score fondamental</Th>
                <Th>Score combiné</Th>
                <Th>Signal du jour</Th>
                <Th>SGI</Th>
                <Th>Watchlist statique</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rowsJour.length === 0 && (
                <tr>
                  <td
                    colSpan={22}
                    className="text-center py-8 text-sm"
                    style={{ color: C.sub }}
                  >
                    Aucune valeur ne satisfait l'ensemble des filtres
                    automatiques.
                  </td>
                </tr>
              )}
              {rowsJour.map((r, i) => {
                const dejaAjoute = watchlistTitles.includes(r.titre);
                return (
                  <tr
                    key={r.titre}
                    style={{
                      borderTop: `1px solid ${C.line}`,
                      background: i % 2 ? C.rowAlternate : C.surfaceCard,
                    }}
                  >
                    <Td mono>
                      <span className="font-bold" style={{ color: C.gold }}>
                        #{i + 1}
                      </span>
                    </Td>
                    <Td className="font-semibold whitespace-nowrap">
                      {r.titre}
                    </Td>
                    <Td>
                      <Badge tone="navy">{r.marche}</Badge>
                    </Td>
                    <Td className="whitespace-nowrap">{r.secteur}</Td>
                    <Td mono className="whitespace-nowrap">
                      {fmtPrice(r.cours)} {r.devise}
                    </Td>
                    <Td>
                      <Pct v={r.variationJour} />
                    </Td>
                    <Td mono className="whitespace-nowrap">
                      {r.technique.mm}
                    </Td>
                    <Td className="whitespace-nowrap">{r.technique.macd}</Td>
                    <Td mono>{r.technique.rsi}</Td>
                    <Td className="whitespace-nowrap">{r.technique.bol}</Td>
                    <Td mono>{r.scoreTechnique}/100</Td>
                    <Td mono>{r.fondamentale.per.toFixed(1)}x</Td>
                    <Td mono>{r.fondamentale.rentabilite}</Td>
                    <Td mono>{r.fondamentale.evol}</Td>
                    <Td className="whitespace-nowrap">{r.fondamentale.valo}</Td>
                    <Td>
                      <Badge
                        tone={toneSignalFondamental(r.fondamentale.signal)}
                      >
                        {r.fondamentale.signal}
                      </Badge>
                    </Td>
                    <Td mono>{r.scoreFondamental}/100</Td>
                    <Td>
                      <Badge
                        tone={
                          r.scoreCombine >= 78
                            ? 'teal'
                            : r.scoreCombine >= 63
                            ? 'gold'
                            : r.scoreCombine < 48
                            ? 'coral'
                            : 'slate'
                        }
                      >
                        {r.scoreCombine}/100
                      </Badge>
                    </Td>
                    <Td>
                      <Badge tone={toneSignalJour(r.signalJour)}>
                        {r.signalJour}
                      </Badge>
                    </Td>
                    <Td>
                      <div className="text-xs font-semibold">
                        {r.compatibles.length} SGI
                      </div>
                      <div
                        className="text-[10px] whitespace-nowrap"
                        style={{ color: C.sub }}                      >
                        {r.compatibles.map((pf) => pf.sgi).join(' · ')}
                      </div>
                    </Td>
                    <Td>
                      <button
                        type="button"
                        onClick={() =>
                          dejaAjoute
                            ? onRemoveWatch(r.titre)
                            : onAddWatch(r.titre)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap"
                        style={{
                          background: dejaAjoute ? C.surfaceInset : C.warningBackground,
                          color: dejaAjoute ? C.sub : C.warningText,
                        }}
                      >
                        <Star
                          size={13}
                          fill={dejaAjoute ? 'currentColor' : 'none'}
                        />
                        {dejaAjoute ? 'Retirer' : 'Ajouter'}
                      </button>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            goClient('client-market-depth', {
                              instrument: r.titre,
                              marche: r.marche,
                            })
                          }
                          className="text-xs font-semibold"
                          style={{ color: C.indigo }}
                        >
                          Analyser →
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            goClient('client-ticket', {
                              instrument: r.titre,
                              marche: r.marche,
                              source:
                                clientMarket(r.titre, r.marche)?.type ===
                                'Obligation'
                                  ? 'obligations'
                                  : 'vue-boursiere',
                            })
                          }
                          className="text-xs font-semibold"
                          style={{ color: C.navy }}
                        >
                          Investir →
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}


  function ClientAvis({ orders, devise }) {
  const [dateDebut, setDateDebut] = useState('');
  const [filtreMarche, setFiltreMarche] = useState('Tous');
  const [filtreSgi, setFiltreSgi] = useState('Toutes');
  const [filtreSens, setFiltreSens] = useState('Tous');

  const baremes = {
    BRVM: { tauxComSgi: 0.008, tauxIrvm: 0, tauxTaf: 0.18, tauxFraisChange: 0 },
    NGX: { tauxComSgi: 0.007, tauxIrvm: 0, tauxTaf: 0.075, tauxFraisChange: 0 },
    GSE: {
      tauxComSgi: 0.007,
      tauxIrvm: 0,
      tauxTaf: 0.15,
      tauxFraisChange: 0.004,
    },
  };

  const avis = orders
    .filter((ordre) => ordre.statut === 'Exécuté')
    .map((ordre) => {
      const portefeuille = CLIENT_GESTION_LIBRE.portefeuilles.find(
        (pf) => pf.id === ordre.portefeuilleId
      );
      const avisBase = {
        id: `AV-${ordre.id.replace('CL-ORD-', '')}`,
        client: CLIENT_GESTION_LIBRE.nom,
        titre: ordre.instrument,
        sens: ordre.sens,
        qte: ordre.qte,
        prix: ordre.prix,
        marche: ordre.marche,
        devise: ordre.devise,
        date: ordre.date,
        frais: baremes[ordre.marche] || baremes.BRVM,
      };
      return {
        ...avisBase,
        portefeuille,
        details: calculerAvis(avisBase),
      };
    });

  const sgiDisponibles = [
    'Toutes',
    ...new Set(avis.map((item) => item.portefeuille?.sgi).filter(Boolean)),
  ];

  const rows = avis.filter((item) => {
    const correspondDate =
      !dateDebut || parseFR(item.date) >= new Date(`${dateDebut}T00:00:00`);
    return (
      correspondDate &&
      (filtreMarche === 'Tous' || item.marche === filtreMarche) &&
      (filtreSgi === 'Toutes' || item.portefeuille?.sgi === filtreSgi) &&
      (filtreSens === 'Tous' || item.sens === filtreSens)
    );
  });

  const totalFraisVue = rows.reduce(
    (sum, item) =>
      sum + convertCurrency(item.details.totalFrais, item.devise, devise),
    0
  );
  const montantBrutVue = rows.reduce(
    (sum, item) =>
      sum + convertCurrency(item.details.montantBrut, item.devise, devise),
    0
  );

  const reinitialiser = () => {
    setDateDebut('');
    setFiltreMarche('Tous');
    setFiltreSgi('Toutes');
    setFiltreSens('Tous');
  };

  return (
    <div className="space-y-5">
      <ClientBreadcrumb
        items={['Espace Client', "Avis d'opéré — vue générale"]}
      />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Avis d'opéré — vue générale
          </h2>
          <div className="text-xs mt-1" style={{ color: C.sub }}>
            Vos opérations exécutées uniquement, consolidées sur l'ensemble de
            vos SGI. Les ordres en attente restent disponibles dans « Mes ordres
            ».
          </div>
        </div>
        <Badge tone="gold">{rows.length} avis</Badge>
      </div>

      <Card className="p-4" style={{ borderColor: C.navy }}>        <div className="grid grid-cols-4 gap-3">
          <div>
            <label
              className="text-[10px] uppercase font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Depuis le
            </label>
            <input name="gsm-clientdecisionscreens-990" aria-label="Champ clientdecisionscreens"
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-xs"
              style={{ borderColor: C.line }}
            />
          </div>
          <div>
            <label
              className="text-[10px] uppercase font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Marché
            </label>
            <select name="gsm-clientdecisionscreens-1005" aria-label="Sélection clientdecisionscreens"
              value={filtreMarche}
              onChange={(e) => setFiltreMarche(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-xs"
              style={{ borderColor: C.line }}
            >
              {['Tous', 'BRVM', 'NGX', 'GSE'].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-[10px] uppercase font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              SGI
            </label>
            <select name="gsm-clientdecisionscreens-1023" aria-label="Sélection clientdecisionscreens"
              value={filtreSgi}
              onChange={(e) => setFiltreSgi(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-xs"
              style={{ borderColor: C.line }}
            >
              {sgiDisponibles.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-[10px] uppercase font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Sens
            </label>
            <div className="flex gap-1.5">
              {['Tous', 'Achat', 'Vente'].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFiltreSens(value)}
                  className="flex-1 px-2 py-2 rounded-xl text-xs font-semibold"
                  style={{
                    background: filtreSens === value ? C.activeBackground : C.surfaceInset,
                    color: filtreSens === value ? C.textPrimary : C.sub,
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>
        {(dateDebut ||
          filtreMarche !== 'Tous' ||
          filtreSgi !== 'Toutes' ||
          filtreSens !== 'Tous') && (
          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={reinitialiser}
              className="text-xs font-semibold"
              style={{ color: C.navy }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-xs" style={{ color: C.sub }}>
            Opérations exécutées
          </div>
          <div className="text-2xl font-bold mt-1" style={F_DISPLAY}>            {rows.length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs" style={{ color: C.sub }}>
            Montant brut · équiv. {devise}
          </div>
          <div className="text-lg font-bold mt-1" style={F_DISPLAY}>
            {fmt(Math.round(montantBrutVue))} {devise}
          </div>
          <div className="text-[10px] mt-1" style={{ color: C.sub }}>
            Conversion dans la devise de vue
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs" style={{ color: C.sub }}>
            Frais cumulés · équiv. {devise}
          </div>
          <div
            className="text-lg font-bold mt-1"
            style={{ ...F_DISPLAY, color: C.gold }}
          >
            {fmt(Math.round(totalFraisVue))} {devise}
          </div>
          <div className="text-[10px] mt-1" style={{ color: C.sub }}>
            Barèmes de démonstration · conversion dans la devise de vue
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="gsm-table-scroll">
          <table className="w-full gsm-table--banking" style={{ minWidth: 2050 }}>
            <thead style={{ background: C.surfaceElevated }}>
              <tr>
                <Th>Réf.</Th>
                <Th>Date</Th>
                <Th>SGI</Th>
                <Th>Portefeuille</Th>
                <Th>Titre</Th>
                <Th>Sens</Th>
                <Th>Qté</Th>
                <Th>Prix exéc.</Th>
                <Th>Montant brut</Th>
                <Th>Com. SGI</Th>
                <Th>IRVM</Th>
                <Th>TAF</Th>
                <Th>Frais change</Th>
                <Th>Total frais</Th>
                <Th>Montant débité</Th>
                <Th>Montant crédité</Th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={16}
                    className="text-center py-10 text-sm"
                    style={{ color: C.sub }}
                  >
                    Aucun avis d'opéré exécuté ne correspond à ces critères.
                  </td>
                </tr>
              )}
              {rows.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    borderTop: `1px solid ${C.line}`,
                    background: index % 2 ? C.rowAlternate : C.surfaceCard,
                  }}
                >
                  <Td mono>{item.id}</Td>
                  <Td>{item.date}</Td>
                  <Td>
                    <div className="font-semibold whitespace-nowrap">
                      {item.portefeuille?.sgi || '—'}
                    </div>
                    <div className="text-[10px]" style={{ color: C.sub }}>
                      {item.marche}
                    </div>
                  </Td>
                  <Td className="whitespace-nowrap">
                    {item.portefeuille?.nom || '—'}
                  </Td>
                  <Td className="font-semibold whitespace-nowrap">
                    {item.titre}
                  </Td>
                  <Td>
                    <Badge tone={item.sens === 'Achat' ? 'teal' : 'coral'}>
                      {item.sens}
                    </Badge>
                  </Td>
                  <Td mono>{fmt(item.qte)}</Td>
                  <Td mono>
                    {fmtPrice(item.prix)} {item.devise}
                  </Td>
                  <Td mono>
                    {fmtPrice(item.details.montantBrut)} {item.devise}                  </Td>
                  <Td mono>
                    {fmtPrice(item.details.comSgi)} {item.devise}
                  </Td>
                  <Td mono>
                    {fmtPrice(item.details.irvm)} {item.devise}
                  </Td>
                  <Td mono>
                    {fmtPrice(item.details.taf)} {item.devise}
                  </Td>
                  <Td mono>
                    {fmtPrice(item.details.fraisChange)} {item.devise}
                  </Td>
                  <Td mono>
                    <span style={{ color: C.gold, fontWeight: 700 }}>
                      {fmtPrice(item.details.totalFrais)} {item.devise}
                    </span>
                  </Td>
                  <Td mono>
                    {item.details.montantDebite > 0 ? (
                      <span style={{ color: C.coral, fontWeight: 700 }}>
                        {fmtPrice(item.details.montantDebite)} {item.devise}
                      </span>
                    ) : (
                      '—'
                    )}
                  </Td>
                  <Td mono>
                    {item.details.montantCredite > 0 ? (
                      <span style={{ color: C.teal, fontWeight: 700 }}>
                        {fmtPrice(item.details.montantCredite)} {item.devise}
                      </span>
                    ) : (
                      '—'
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="text-[10px]" style={{ color: C.sub }}>
        Les frais affichés sont des paramètres de démonstration. En production,
        les avis devront reprendre les frais et taxes effectivement communiqués
        par chaque SGI.
      </div>
    </div>
  );
}


  function ClientOrders({ orders }) {
  return (
    <div className="space-y-5">
      <ClientBreadcrumb items={['Espace Client', 'Mes ordres']} />
      <div className="gsm-responsive-header flex items-end justify-between gap-3">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Mes ordres
          </h2>
          <div className="text-xs mt-1" style={{ color: C.sub }}>
            Suivi transversal de vos instructions, quelle que soit la SGI.
          </div>
        </div>
        <Badge tone="gold">{orders.length} ordre(s)</Badge>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full">
          <thead style={{ background: C.surfaceElevated }}>
            <tr>
              <Th>Référence</Th>
              <Th>Date</Th>
              <Th>SGI</Th>
              <Th>Instrument</Th>
              <Th>Sens</Th>
              <Th>Quantité</Th>
              <Th>Prix</Th>
              <Th>Type</Th>
              <Th>Statut</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ordre) => {
              const pf = CLIENT_GESTION_LIBRE.portefeuilles.find(
                (portefeuille) => portefeuille.id === ordre.portefeuilleId
              );
              return (
                <tr key={ordre.id} style={{ borderTop: `1px solid ${C.line}` }}>
                  <Td mono>{ordre.id}</Td>
                  <Td>{ordre.date}</Td>
                  <Td>
                    <div className="font-semibold">{pf?.sgi || '—'}</div>
                    <div className="text-[10px]" style={{ color: C.sub }}>
                      {ordre.marche}
                    </div>
                  </Td>
                  <Td className="font-semibold">{ordre.instrument}</Td>
                  <Td>
                    <Badge tone={ordre.sens === 'Achat' ? 'teal' : 'coral'}>
                      {ordre.sens}
                    </Badge>
                  </Td>
                  <Td mono>{fmt(ordre.qte)}</Td>
                  <Td mono>
                    {fmtPrice(ordre.prix)} {ordre.devise}
                  </Td>
                  <Td>{ordre.typeOrdre}</Td>
                  <Td>
                    <Badge
                      tone={
                        ordre.statut === 'Exécuté'
                          ? 'teal'
                          : ordre.statut === 'Annulé'
                          ? 'coral'
                          : 'gold'
                      }
                    >
                      {ordre.statut}
                    </Badge>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}


  return { ClientWatchlist, ClientAvis, ClientOrders };
}
