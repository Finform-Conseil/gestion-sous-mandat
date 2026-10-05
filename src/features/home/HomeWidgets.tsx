import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { fmt, fmtPrice } from '../../shared/lib/finance';
import { Card, Eyebrow, Pct } from '../../shared/ui/UiAtoms';
import { C, F_BODY, F_MONO, PALETTE } from '../../shared/theme/theme';

export interface DonutDatum {
  name: string;
  value: number;
  montant?: number;
  devise?: string;
  color?: string;
  [key: string]: unknown;
}

interface DonutProps {
  data: DonutDatum[];
  size?: number;
  onSliceClick?: (datum: DonutDatum) => void;
}

export function Donut({ data, size = 150, onSliceClick }: DonutProps) {
  return (
    <ResponsiveContainer width="100%" height={size}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={size * 0.28}
          outerRadius={size * 0.46}
          paddingAngle={2}
          onClick={(_, index) => {
            const selected = data[index];
            if (selected) onSliceClick?.(selected);
          }}
          style={{ cursor: onSliceClick ? 'pointer' : 'default' }}
        >
          {data.map((item: DonutDatum, i: number) => (
            <Cell
              key={i}
              fill={item?.color || PALETTE[i % PALETTE.length]}
              stroke="none"
              style={{ cursor: onSliceClick ? 'pointer' : 'default' }}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(v) => `${v}%`}
          contentStyle={{
            borderRadius: 10,
            border: `1px solid ${C.line}`,
            fontSize: 12,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function Legende({ data }: { data: DonutDatum[] }) {
  return (
    <div className="flex flex-col gap-1.5 mt-2">
      {data.map((d: DonutDatum, i: number) => (
        <div
          key={d.name}
          className="flex items-center justify-between gap-3 text-xs"
          style={F_BODY}
        >
          <span
            className="flex items-center gap-2 min-w-0"
            style={{ color: C.ink }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{
                background: d?.color || PALETTE[i % PALETTE.length],
              }}
            />
            <span className="truncate">{d.name}</span>
          </span>
          <span
            className="flex flex-col items-end shrink-0"
            style={{ color: C.sub, ...F_MONO }}
          >
            <span className="font-semibold">{d.value}%</span>
            {typeof d.montant === 'number' && Number.isFinite(d.montant) && d.devise && (
              <span className="text-[10px] font-semibold">
                {fmt(Math.round(d.montant))} {d.devise}
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

const HISTORY_SERIES = [
  {
    dataKey: 'gestionTwr',
    label: 'Gestion globale (TWR)',
    color: C.navy,
  },
  {
    dataKey: 'brvm',
    label: 'BRVM Composite',
    color: C.gold,
  },
  {
    dataKey: 'ngxAsi',
    label: 'NGX ASI',
    color: C.teal,
  },
] as const;

type HistorySeriesKey =
  (typeof HISTORY_SERIES)[number]['dataKey'];

export function HistoryLegend({
  visibility,
  onToggle,
}: {
  visibility: Record<HistorySeriesKey, boolean>;
  onToggle: (dataKey: HistorySeriesKey) => void;
}) {
  return (
    <div
      className="flex items-center justify-center gap-5 flex-wrap mt-1"
      style={F_BODY}
    >
      {HISTORY_SERIES.map((series) => {
        const visible = visibility[series.dataKey];

        return (
          <button
            key={series.dataKey}
            type="button"
            onClick={() => onToggle(series.dataKey)}
            aria-pressed={visible}
            title={
              visible
                ? `Masquer ${series.label}`
                : `Afficher ${series.label}`
            }
            className="inline-flex items-center gap-2 text-xs font-medium transition-opacity"
            style={{
              color: visible ? C.ink : C.sub,
              opacity: visible ? 1 : 0.4,
              textDecoration: visible
                ? 'none'
                : 'line-through',
              cursor: 'pointer',
            }}
          >
            <span
              className="inline-block w-5 rounded-full"
              style={{
                height: 3,
                background: series.color,
                opacity: visible ? 1 : 0.45,
              }}
            />
            {series.label}
          </button>
        );
      })}
    </div>
  );
}

export interface MarketTickerItem {
  nom: string;
  marche: string;
  devise: string;
  cours: number;
  variation: number;
  [key: string]: unknown;
}

export function MarketTicker({
  markets,
  onInstrumentClick,
  onViewAll,
}: {
  markets: MarketTickerItem[];
  onInstrumentClick?: (market: MarketTickerItem) => void;
  onViewAll?: () => void;
}) {
  const tickerMarkets = [...markets].sort(
    (a, b) => b.variation - a.variation
  );

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-3">
        <Eyebrow>Vue des Marchés</Eyebrow>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold"
          style={{ color: C.navy }}
        >
          Voir tous les marchés →
        </button>
      </div>

      <div
        className="relative overflow-hidden py-3"
        style={{
          borderTop: `1px solid ${C.line}`,
          marginTop: 8,
        }}
      >
        <div
          className="flex gap-3 w-max"
          style={{
            animation: 'ticker-scroll 28s linear infinite',
          }}
        >
          {[...tickerMarkets, ...tickerMarkets].map(
            (market, index) => (
              <button
                key={`${market.nom}-${index}`}
                type="button"
                onClick={() =>
                  onInstrumentClick?.(market)
                }
                className="flex items-center gap-2 px-3 py-2 rounded-xl border shrink-0"
                style={{ borderColor: C.line }}
                title={`Ouvrir ${market.nom} · ${market.marche}`}
              >
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: C.ink,
                    ...F_BODY,
                  }}
                >
                  {market.nom}
                </span>

                <span
                  className="text-xs"
                  style={{
                    ...F_MONO,
                    color: C.sub,
                  }}
                >
                  {fmtPrice(market.cours)} {market.devise} ·{' '}
                  {market.marche}
                </span>

                <Pct v={market.variation} />
              </button>
            )
          )}
        </div>
      </div>
    </Card>
  );
}
