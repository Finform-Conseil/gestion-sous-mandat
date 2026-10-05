import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Breadcrumb } from '../../shared/ui/Navigation';
import { Badge, Card, Eyebrow, Pct, Td, Th } from '../../shared/ui/UiAtoms';
import { C, F_BODY, F_DISPLAY, F_MONO } from '../../shared/theme/theme';
import {
  DEFAULT_WATCHLIST_DAILY_FILTERS,
  countWatchlistActiveFilters,
  filterWatchlistDailyRows,
  toneWatchlistSignalFondamental,
  toneWatchlistSignalJour,
  type WatchlistDailyFilters,
  type WatchlistDailyRow,
  type WatchlistStaticRow,
} from './WatchlistModel';

interface Props {
  watchlistTitles: string[];
  onRemoveWatch: (title: string) => void;
  onOpenDepth: (context: { marche: string; instrument: string }) => void;
  buildDailyRows: (dateKey: string) => WatchlistDailyRow[];
  buildStaticRow: (title: string) => WatchlistStaticRow | null;
}
type FilterKey = keyof WatchlistDailyFilters;

function SelectField({ id, label, value, values, onChange }: {
  id: string; label: string; value: string; values: string[]; onChange: (value: string) => void;
}) {
  return <div>
    <label htmlFor={id} className="text-[11px] font-semibold block mb-1" style={{ color: C.sub }}>{label}</label>
    <select aria-label="Sélection watchlist" id={id} name={id} value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full px-2.5 py-2 rounded-xl border text-xs" style={{ borderColor: C.line }}>
      {values.map((item) => <option key={item} value={item}>{item}</option>)}
    </select>
  </div>;
}

function NumberField({ id, label, value, onChange, min, max, step, placeholder }: {
  id: string; label: string; value: string; onChange: (value: string) => void;
  min?: number; max?: number; step?: number; placeholder?: string;
}) {
  return <div>
    <label htmlFor={id} className="text-[11px] font-semibold block mb-1" style={{ color: C.sub }}>{label}</label>
    <input aria-label="Champ watchlist" id={id} name={id} type="number" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-2.5 py-2 rounded-xl border text-xs" style={{ borderColor: C.line, ...F_MONO }} />
  </div>;
}

export function WatchlistScreen({
  watchlistTitles, onRemoveWatch, onOpenDepth, buildDailyRows, buildStaticRow,
}: Props) {
  const now = new Date();
  const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const dateLabel = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  }).format(now);
  const [filters, setFilters] = useState<WatchlistDailyFilters>(() => ({ ...DEFAULT_WATCHLIST_DAILY_FILTERS }));
  const [showFilters, setShowFilters] = useState(true);

  const dailyRows = useMemo(() => buildDailyRows(dateKey), [buildDailyRows, dateKey]);
  const staticRows = useMemo(
    () => watchlistTitles.map(buildStaticRow).filter((row): row is WatchlistStaticRow => row !== null),
    [buildStaticRow, watchlistTitles]
  );
  const rows = useMemo(() => filterWatchlistDailyRows(dailyRows, filters), [dailyRows, filters]);
  const options = useMemo(() => ({
    marches: ['Tous', ...new Set(dailyRows.map((r) => r.marche))],
    secteurs: ['Tous', ...new Set(dailyRows.map((r) => r.secteur))],
    macd: ['Tous', ...new Set(dailyRows.map((r) => r.technique.macd))],
    bol: ['Tous', ...new Set(dailyRows.map((r) => r.technique.bol))],
    tech: ['Tous', ...new Set(dailyRows.map((r) => r.technique.signal))],
    valo: ['Tous', ...new Set(dailyRows.map((r) => r.fondamentale.valo))],
    fund: ['Tous', ...new Set(dailyRows.map((r) => r.fondamentale.signal))],
  }), [dailyRows]);
  const update = (key: FilterKey, value: string) => setFilters((f) => ({ ...f, [key]: value }));
  const active = countWatchlistActiveFilters(filters);

  return <div className="space-y-6">
    <Breadcrumb items={['Accueil', 'Watchlist']} />
    <div>
      <h2 className="text-xl font-bold" style={{ ...F_DISPLAY, color: C.ink }}>
        Watchlist — sélection fondamentale &amp; technique
      </h2>
      <div className="text-xs mt-1" style={{ color: C.sub, ...F_BODY }}>
        Une liste stratégique alimentée depuis Marchés et une sélection journalière recalculée selon les signaux.
      </div>
    </div>

    <Card className="p-0 overflow-hidden" style={{ borderColor: C.gold }}>
      <div className="p-5 flex items-start justify-between gap-4" style={{ background: '#FBF7EE' }}>
        <div>
          <Eyebrow>Watchlist statique — conviction fondamentale</Eyebrow>
          <div className="text-sm font-semibold" style={{ color: C.ink }}>Valeurs suivies dans la durée</div>
        </div>
        <Badge tone="gold">{staticRows.length} valeur(s)</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: 1450 }}>
          <thead style={{ background: '#FAFAFC' }}>
            <tr><Th>Instrument</Th><Th>Marché</Th><Th>Secteur</Th><Th>PER</Th><Th>Total return YTD</Th><Th>EVOL</Th><Th>Valorisation</Th><Th>Signal fondamental</Th><Th>Consulter</Th><Th>Supprimer</Th></tr>
          </thead>
          <tbody>
            {staticRows.length === 0 && <tr><td colSpan={10} className="text-center py-8 text-sm" style={{ color: C.sub }}>La watchlist statique est vide.</td></tr>}
            {staticRows.map((r, i) => <tr key={r.titre} style={{ borderTop: `1px solid ${C.line}`, background: i % 2 ? '#FCFCFD' : '#fff' }}>
              <Td className="font-semibold whitespace-nowrap">{r.titre}</Td>
              <Td><Badge tone="navy">{r.marche}</Badge></Td><Td>{r.secteur}</Td>
              <Td mono>{r.fondamentale.per == null ? 'N/D' : `${r.fondamentale.per.toFixed(1)}x`}</Td>
              <Td mono>{r.fondamentale.rentabilite}</Td><Td mono>{r.fondamentale.evol}</Td><Td>{r.fondamentale.valo}</Td>
              <Td><Badge tone={toneWatchlistSignalFondamental(r.fondamentale.signal)}>{r.fondamentale.signal}</Badge></Td>
              <Td><button type="button" onClick={() => onOpenDepth({ marche: r.marche, instrument: r.titre })} className="text-xs font-semibold" style={{ color: C.navy }}>Voir le marché →</button></Td>
              <Td><button type="button" onClick={() => onRemoveWatch(r.titre)} aria-label={`Supprimer ${r.titre} de la watchlist`}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold" style={{ background: '#FBE9E7', color: C.coral }}><X size={13} /> Retirer</button></Td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </Card>

    <Card className="p-0 overflow-hidden flex flex-col" style={{ borderColor: C.navy, height: 'clamp(620px, calc(100vh - 110px), 780px)' }}>
      <div className="p-5 shrink-0" style={{ background: '#EFF3FB', maxHeight: showFilters ? '52%' : 'auto', overflowY: showFilters ? 'auto' : 'visible' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div><Eyebrow>Watchlist journalière — signaux de marché</Eyebrow><div className="text-sm font-semibold" style={{ color: C.ink }}>Classement du {dateLabel}</div></div>
          <div className="flex items-center gap-2">
            <Badge tone="navy">Actualisation quotidienne</Badge><Badge tone="gold">{rows.length} valeur(s)</Badge>
            <Badge tone={active > 0 ? 'teal' : 'slate'}>{active} filtre(s) actif(s)</Badge>
            <button type="button" onClick={() => setShowFilters((v) => !v)} className="px-3 py-1.5 rounded-xl border text-xs font-semibold" style={{ borderColor: C.line, color: C.navy, background: '#fff' }}>
              {showFilters ? 'Masquer les filtres ↑' : 'Afficher les filtres ↓'}
            </button>
          </div>
        </div>
        {showFilters && <div className="mt-4 p-4 rounded-xl border" style={{ borderColor: '#D8DFEF', background: '#fff' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold" style={{ color: C.ink }}>Filtres automatiques — application instantanée</div>
            <button type="button" onClick={() => setFilters({ ...DEFAULT_WATCHLIST_DAILY_FILTERS })} className="px-3 py-1.5 rounded-xl border text-xs font-semibold" style={{ borderColor: C.line, color: C.navy, background: '#fff' }}>Réinitialiser les filtres</button>
          </div>
          <div className="grid grid-cols-5 gap-3">
            <SelectField id="watch-market" label="Bourse" value={filters.marche} values={options.marches} onChange={(v) => update('marche', v)} />
            <SelectField id="watch-sector" label="Secteur" value={filters.secteur} values={options.secteurs} onChange={(v) => update('secteur', v)} />
            <SelectField id="watch-mm" label="MM" value={filters.mm} values={['Tous','Haussière','Neutre','Baissière']} onChange={(v) => update('mm', v)} />
            <SelectField id="watch-macd" label="MACD" value={filters.macd} values={options.macd} onChange={(v) => update('macd', v)} />
            <SelectField id="watch-bol" label="BOL" value={filters.bol} values={options.bol} onChange={(v) => update('bol', v)} />
            <NumberField id="watch-rsi-min" label="RSI minimum" value={filters.rsiMin} min={0} max={100} onChange={(v) => update('rsiMin', v)} />
            <NumberField id="watch-rsi-max" label="RSI maximum" value={filters.rsiMax} min={0} max={100} onChange={(v) => update('rsiMax', v)} />
            <SelectField id="watch-tech" label="Signal technique" value={filters.signalTechnique} values={options.tech} onChange={(v) => update('signalTechnique', v)} />
            <NumberField id="watch-per" label="PER maximum" value={filters.perMax} min={0} step={0.1} placeholder="Sans limite" onChange={(v) => update('perMax', v)} />
            <NumberField id="watch-profit" label="Rentabilité min. (%)" value={filters.rentabiliteMin} step={0.1} placeholder="Sans limite" onChange={(v) => update('rentabiliteMin', v)} />
            <NumberField id="watch-growth" label="EVOL minimum (%)" value={filters.evolMin} step={0.1} placeholder="Sans limite" onChange={(v) => update('evolMin', v)} />
            <SelectField id="watch-valuation" label="Valorisation" value={filters.valorisation} values={options.valo} onChange={(v) => update('valorisation', v)} />
            <SelectField id="watch-fund" label="Signal fondamental" value={filters.signalFondamental} values={options.fund} onChange={(v) => update('signalFondamental', v)} />
          </div>
        </div>}
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full" style={{ minWidth: 2200 }}>
          <thead style={{ background: '#FAFAFC', position: 'sticky', top: 0, zIndex: 2 }}>
            <tr><Th>Rang</Th><Th>Instrument</Th><Th>Marché</Th><Th>Secteur</Th><Th>Cours</Th><Th>Variation jour</Th><Th>MM</Th><Th>MACD</Th><Th>RSI</Th><Th>BOL</Th><Th>Score technique</Th><Th>PER</Th><Th>Rentabilité</Th><Th>EVOL</Th><Th>VALO</Th><Th>Signal fondamental</Th><Th>Score fondamental</Th><Th>Score combiné</Th><Th>Signal du jour</Th><Th>Actions</Th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={20} className="text-center py-8 text-sm" style={{ color: C.sub }}>Aucune valeur ne satisfait l'ensemble des filtres automatiques.</td></tr>}
            {rows.map((r, i) => <tr key={r.titre} style={{ borderTop: `1px solid ${C.line}`, background: i % 2 ? '#FCFCFD' : '#fff' }}>
              <Td mono><span className="font-bold" style={{ color: C.gold }}>#{i + 1}</span></Td><Td className="font-semibold">{r.titre}</Td>
              <Td><Badge tone="navy">{r.marche}</Badge></Td><Td>{r.secteur}</Td><Td mono>{r.cours} {r.devise}</Td><Td><Pct v={r.variationJour} /></Td>
              <Td mono>{r.technique.mm}</Td><Td>{r.technique.macd}</Td><Td mono>{r.technique.rsi}</Td><Td>{r.technique.bol}</Td><Td mono>{r.scoreTechnique}/100</Td>
              <Td mono>{r.fondamentale.per == null ? 'N/D' : `${r.fondamentale.per.toFixed(1)}x`}</Td><Td mono>{r.fondamentale.rentabilite}</Td><Td mono>{r.fondamentale.evol}</Td><Td>{r.fondamentale.valo}</Td>
              <Td><Badge tone={toneWatchlistSignalFondamental(r.fondamentale.signal)}>{r.fondamentale.signal}</Badge></Td><Td mono>{r.scoreFondamental}/100</Td>
              <Td><Badge tone={r.scoreCombine >= 78 ? 'teal' : r.scoreCombine >= 63 ? 'gold' : r.scoreCombine < 48 ? 'coral' : 'slate'}>{r.scoreCombine}/100</Badge></Td>
              <Td><Badge tone={toneWatchlistSignalJour(r.signalJour)}>{r.signalJour}</Badge></Td>
              <Td><button type="button" onClick={() => onOpenDepth({ marche: r.marche, instrument: r.titre })} className="text-xs font-semibold" style={{ color: C.navy }}>Analyser →</button></Td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </Card>
  </div>;
}
