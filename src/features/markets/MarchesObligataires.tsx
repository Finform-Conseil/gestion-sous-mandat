import { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { fmt, fmtPrice } from '../../shared/lib/finance';
import { Breadcrumb } from '../../shared/ui/Navigation';
import { Badge, Card, Eyebrow, Pct, Td, Th } from '../../shared/ui/UiAtoms';
import { C, F_DISPLAY, F_MONO } from '../../shared/theme/theme';

export interface MarketInstrument {
  nom: string;
  type: string;
  marche: string;
  devise: string;
  cours: number;
  variation: number;
  volumeJour: number;
  coursMin: number;
  coursMax: number;
}
export interface BondMarketMeta {
  emetteur?: string;
  coupon?: number;
  rendement?: number;
  echeance?: string;
  duration?: number;
}
interface Props {
  markets: MarketInstrument[];
  bondMeta: Record<string, BondMarketMeta>;
  watchlistTitles: string[];
  onAddWatch: (title: string) => void;
  onOpenDepth: (context: { marche: string; instrument: string; source: 'obligations' }) => void;
}
interface Filters {
  recherche: string;
  volumeMin: string;
  variationMin: string;
  variationMax: string;
  coursMin: string;
  coursMax: string;
  statutWatchlist: string;
}
const EMPTY_FILTERS: Filters = {
  recherche: '', volumeMin: '', variationMin: '', variationMax: '',
  coursMin: '', coursMax: '', statutWatchlist: 'Tous',
};
const MARKET_CODES = ['Tous', 'BRVM', 'NGX', 'GSE'] as const;
const WATCHLIST_STATUSES = ['Tous', 'Ajoutés', 'Non ajoutés'] as const;

export function MarchesObligataires({
  markets, bondMeta, watchlistTitles, onAddWatch, onOpenDepth,
}: Props) {
  const [marche, setMarche] = useState<(typeof MARKET_CODES)[number]>('Tous');
  const [showMarketFilters, setShowMarketFilters] = useState(true);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const obligations = useMemo(
    () => markets.filter((item) =>
      item.type === 'Obligation' && (marche === 'Tous' || item.marche === marche)
    ),
    [markets, marche]
  );
  const rows = useMemo(() => obligations.filter((item) => {
    const volumeMin = filters.volumeMin === '' ? null : Number(filters.volumeMin);
    const variationMin = filters.variationMin === '' ? null : Number(filters.variationMin);
    const variationMax = filters.variationMax === '' ? null : Number(filters.variationMax);
    const coursMin = filters.coursMin === '' ? null : Number(filters.coursMin);
    const coursMax = filters.coursMax === '' ? null : Number(filters.coursMax);
    const suivi = watchlistTitles.includes(item.nom);
    return (
      item.nom.toLowerCase().includes(filters.recherche.trim().toLowerCase()) &&
      (volumeMin === null || item.volumeJour >= volumeMin) &&
      (variationMin === null || item.variation >= variationMin) &&
      (variationMax === null || item.variation <= variationMax) &&
      (coursMin === null || item.cours >= coursMin) &&
      (coursMax === null || item.cours <= coursMax) &&
      (filters.statutWatchlist === 'Tous' ||
        (filters.statutWatchlist === 'Ajoutés' && suivi) ||
        (filters.statutWatchlist === 'Non ajoutés' && !suivi))
    );
  }), [filters, obligations, watchlistTitles]);

  const filtresActifs =
    Number(Boolean(filters.recherche.trim())) +
    Number(filters.volumeMin !== '') +
    Number(filters.variationMin !== '') +
    Number(filters.variationMax !== '') +
    Number(filters.coursMin !== '') +
    Number(filters.coursMax !== '') +
    Number(filters.statutWatchlist !== 'Tous');

  const updateFilter = (key: keyof Filters, value: string) =>
    setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', 'Marchés Obligataire']} />
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Eyebrow>Fixed Income · marché secondaire</Eyebrow>
          <h2 className="text-xl font-bold" style={{ ...F_DISPLAY, color: C.ink }}>
            Marchés Obligataire
          </h2>
        </div>
        <Badge tone="gold">{rows.length} obligation(s)</Badge>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1.5">
          {MARKET_CODES.map((code) => (
            <button key={code} type="button" onClick={() => setMarche(code)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: marche === code ? C.navy : '#F0F1F5', color: marche === code ? '#fff' : C.sub }}>
              {code}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden" style={{ borderColor: C.navy }}>
        <div className="p-4" style={{ background: '#EFF3FB' }}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold" style={{ color: C.ink }}>
                Filtres obligataires — application instantanée
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: C.sub }}>
                Filtrez par instrument, volume, variation, niveau de cours et statut dans la watchlist.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={filtresActifs > 0 ? 'teal' : 'slate'}>{filtresActifs} filtre(s)</Badge>
              {filtresActifs > 0 && (
                <button type="button" onClick={() => setFilters(EMPTY_FILTERS)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                  style={{ borderColor: C.line, color: C.navy, background: '#fff' }}>
                  Réinitialiser
                </button>
              )}
              <button type="button" onClick={() => setShowMarketFilters((visible) => !visible)}
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                style={{ borderColor: C.line, color: C.navy, background: '#fff' }}>
                {showMarketFilters ? 'Masquer les filtres ↑' : 'Afficher les filtres ↓'}
              </button>
            </div>
          </div>

          {showMarketFilters && (
            <div className="mt-4 grid grid-cols-4 gap-3 p-4 rounded-xl border"
              style={{ borderColor: '#D8DFEF', background: '#fff' }}>
              {[
                ['market-bond-search', 'Instrument', 'recherche', 'text', 'Rechercher une obligation…', undefined],
                ['market-volume-min', 'Volume minimum', 'volumeMin', 'number', 'Sans limite', '1'],
                ['market-variation-min', 'Variation min. (%)', 'variationMin', 'number', 'Sans limite', '0.1'],
                ['market-variation-max', 'Variation max. (%)', 'variationMax', 'number', 'Sans limite', '0.1'],
                ['market-price-min', 'Cours minimum', 'coursMin', 'number', 'Sans limite', '0.01'],
                ['market-price-max', 'Cours maximum', 'coursMax', 'number', 'Sans limite', '0.01'],
              ].map(([id, label, key, type, placeholder, step]) => (
                <div key={id}>
                  <label htmlFor={id} className="text-[11px] font-semibold block mb-1" style={{ color: C.sub }}>
                    {label}
                  </label>
                  <input aria-label="Champ marchesobligataires"
                    id={id}
                    name={id}
                    type={type}
                    min={type === 'number' ? '0' : undefined}
                    step={step}
                    value={filters[key as keyof Filters]}
                    onChange={(event) => updateFilter(key as keyof Filters, event.target.value)}
                    placeholder={placeholder}
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...(type === 'number' ? F_MONO : {}) }}
                  />
                </div>
              ))}
              <div>
                <label htmlFor="market-watchlist-status" className="text-[11px] font-semibold block mb-1" style={{ color: C.sub }}>
                  Statut watchlist
                </label>
                <select
                  id="market-watchlist-status"
                  name="market-watchlist-status"
                  value={filters.statutWatchlist}
                  onChange={(event) => updateFilter('statutWatchlist', event.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border text-xs"
                  style={{ borderColor: C.line }}
                >
                  {WATCHLIST_STATUSES.map((value) => <option key={value}>{value}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 1550 }}>
            <thead style={{ background: '#FAFAFC' }}>
              <tr>
                <Th>Instrument</Th><Th>Émetteur</Th><Th>Marché</Th><Th>Cours</Th>
                <Th>Coupon</Th><Th>Rendement indicatif</Th><Th>Échéance</Th>
                <Th>Duration</Th><Th>Volume</Th><Th>Var %</Th><Th>Plus bas</Th>
                <Th>Plus haut</Th><Th>Watchlist</Th><Th>Profondeur</Th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={14} className="text-center py-8 text-sm" style={{ color: C.sub }}>
                  Aucune obligation ne correspond aux filtres sélectionnés.
                </td></tr>
              )}
              {rows.map((item, index) => {
                const meta = bondMeta[item.nom] || {};
                const suivi = watchlistTitles.includes(item.nom);
                return (
                  <tr key={item.nom}
                    style={{ borderTop: `1px solid ${C.line}`, background: index % 2 ? '#FCFCFD' : '#fff' }}>
                    <Td className="font-semibold whitespace-nowrap">{item.nom}</Td>
                    <Td>{meta.emetteur || '—'}</Td>
                    <Td><Badge tone="navy">{item.marche}</Badge></Td>
                    <Td mono className="whitespace-nowrap">{fmtPrice(item.cours)} {item.devise}</Td>
                    <Td mono>{meta.coupon != null ? `${meta.coupon.toFixed(2)}%` : '—'}</Td>
                    <Td mono>{meta.rendement != null ? `${meta.rendement.toFixed(2)}%` : '—'}</Td>
                    <Td mono>{meta.echeance || '—'}</Td>
                    <Td mono>{meta.duration != null ? `${meta.duration.toFixed(1)} an(s)` : '—'}</Td>
                    <Td mono>{fmt(item.volumeJour)}</Td>
                    <Td><Pct v={item.variation} /></Td>
                    <Td mono>{fmtPrice(item.coursMin)}</Td>
                    <Td mono>{fmtPrice(item.coursMax)}</Td>
                    <Td>
                      <button type="button" disabled={suivi} onClick={() => !suivi && onAddWatch(item.nom)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap"
                        style={{ background: suivi ? '#E4F5EF' : '#FBF1DD', color: suivi ? C.teal : '#8A6A16', cursor: suivi ? 'default' : 'pointer' }}>
                        <Star size={13} fill={suivi ? 'currentColor' : 'none'} />
                        {suivi ? 'Ajouté' : 'Add Watch'}
                      </button>
                    </Td>
                    <Td>
                      <button type="button"
                        onClick={() => onOpenDepth({ marche: item.marche, instrument: item.nom, source: 'obligations' })}
                        className="text-xs font-semibold whitespace-nowrap" style={{ color: C.indigo }}>
                        Voir profondeur →
                      </button>
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
