import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fmt } from '../../shared/lib/finance';
import { Donut, Legende, type DonutDatum } from '../home/HomeWidgets';
import { Badge, Card, Eyebrow } from '../../shared/ui/UiAtoms';
import { C, F_BODY, F_DISPLAY, F_MONO } from '../../shared/theme/theme';

export interface PortfolioAllocationClient {
  marche: string;
  devise: string;
  encours: number;
  alloc: Record<string, number>;
  cible: Record<string, number>;
}
export interface AssetHistorySeries {
  key: string;
  label: string;
  color: string;
}
export interface AssetHistoryPoint {
  mois: string;
  [key: string]: string | number;
}

export function PortfolioAllocationAnalysis({
  client,
  allocation,
  history,
  historySeries,
  geographyActions,
  geographyBonds,
  geographyGlobal,
  formatCompact,
}: {
  client: PortfolioAllocationClient;
  allocation: DonutDatum[];
  history: AssetHistoryPoint[];
  historySeries: AssetHistorySeries[];
  geographyActions: DonutDatum[];
  geographyBonds: DonutDatum[];
  geographyGlobal: DonutDatum[];
  formatCompact: (value: number) => string;
}) {
  const liquidityPct = Number(client.alloc['Liquidité'] || 0);
  const assetsValue = Math.round((client.encours * (100 - liquidityPct)) / 100);
  const liquidityValue = Math.round((client.encours * liquidityPct) / 100);
  const geographicBlocks = [
    {
      title: 'Actions',
      subtitle: `${fmt(Math.round((client.encours * Number(client.alloc.Actions || 0)) / 100))} ${client.devise}`,
      data: geographyActions,
    },
    {
      title: 'Obligations',
      subtitle: `${fmt(Math.round((client.encours * (Number(client.alloc['Obl. souveraines'] || 0) + Number(client.alloc['Obl. privées'] || 0))) / 100))} ${client.devise}`,
      data: geographyBonds,
    },
    {
      title: 'Général',
      subtitle: `${fmt(Math.round((client.encours * (Number(client.alloc.Actions || 0) + Number(client.alloc['Obl. souveraines'] || 0) + Number(client.alloc['Obl. privées'] || 0))) / 100))} ${client.devise}`,
      data: geographyGlobal,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5">
          <Eyebrow>Répartition par classe d'actifs</Eyebrow>
          <Donut data={allocation} size={150} />
          <Legende data={allocation} />
        </Card>
        <Card className="col-span-2 p-5">
          <Eyebrow>Actuel vs cible</Eyebrow>
          <div className="space-y-3 mt-2">
            {Object.keys(client.alloc).map((key) => {
              const current = Number(client.alloc[key] || 0);
              const target = Number(client.cible[key] || 0);
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1" style={{ color: C.sub, ...F_BODY }}>
                    <span>{key}</span>
                    <span>{current}% (cible {target}%)</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: C.surfaceInset }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${current}%`,
                        background: Math.abs(current - target) > 5 ? C.coral : C.teal,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-5" style={{ borderColor: C.borderSubtle }}>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <div>
            <Eyebrow>Évolution de la valorisation par classe d'actifs</Eyebrow>
            <div className="text-sm font-semibold" style={{ color: C.ink }}>
              Historique sur 1 an · time frame mensuel
            </div>
            <div className="text-xs mt-1" style={{ color: C.sub, ...F_BODY }}>
              Montants exprimés en {client.devise}. Les variations mensuelles sont
              différenciées selon le risque de chaque classe ; le dernier point
              correspond à la valorisation actuelle du portefeuille.
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone="navy">12 mois</Badge>
            <Badge tone="gold">Mensuel</Badge>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history} margin={{ top: 10, right: 20, left: 8, bottom: 4 }}>
            <CartesianGrid stroke={C.line} vertical={false} />
            <XAxis dataKey="mois" tick={{ fontSize: 10, fill: C.sub }} axisLine={{ stroke: C.line }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: C.sub }} axisLine={false} tickLine={false} width={70} tickFormatter={(value) => formatCompact(Number(value))} />
            <Tooltip
              formatter={(value, name) => [`${fmt(Math.round(Number(value)))} ${client.devise}`, String(name || '')]}
              labelFormatter={(label) => `Mois : ${String(label)}`}
              contentStyle={{ borderRadius: 10, fontSize: 12, border: `1px solid ${C.line}` }}
            />
            {historySeries.map((series) => (
              <Line key={series.key} type="monotone" dataKey={series.key} name={series.label} stroke={series.color} strokeWidth={2.3} dot={{ r: 2 }} activeDot={{ r: 4 }} isAnimationActive={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-5 flex-wrap mt-2" style={F_BODY}>
          {historySeries.map((series) => (
            <div key={series.key} className="inline-flex items-center gap-2 text-xs font-medium" style={{ color: C.ink }}>
              <span className="inline-block w-5 rounded-full" style={{ height: 3, background: series.color }} />
              {series.label}
            </div>
          ))}
        </div>
        <div
          className="mt-3 pt-3 text-[11px]"
          style={{
            borderTop: `1px solid ${C.borderSubtle}`,
            color: C.sub,
            ...F_BODY,
          }}
        >
          Dans cette maquette, le détail historique mensuel par classe d'actifs est
          une série de démonstration reconstruite à partir de la valorisation et de
          l'allocation actuelles. Il pourra être remplacé directement par les
          valorisations historiques réelles.
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <Eyebrow>Répartition géographique des investissements</Eyebrow>
            <div className="text-sm font-semibold" style={{ color: C.ink }}>
              Répartition par État / pays de rattachement des instruments
            </div>
            <div className="text-xs mt-1" style={{ color: C.sub, ...F_BODY }}>
              Lecture séparée des Actions, des Obligations, puis de l'ensemble
              des actifs investis hors liquidité.
            </div>
          </div>
          <Badge tone="navy">{client.marche}</Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 items-start">
          {geographicBlocks.map((block, blockIndex) => (
            <div
              key={block.title}
              className="p-4"
              style={{
                borderLeft:
                  blockIndex === 0 ? 'none' : `1px solid ${C.borderSubtle}`,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.sub, ...F_BODY }}>{block.title}</div>
                  <div className="text-sm font-bold mt-0.5" style={{ color: C.ink, ...F_MONO }}>{block.subtitle}</div>
                </div>
                <Badge tone={block.title === 'Général' ? 'gold' : 'slate'}>Par État</Badge>
              </div>
              {block.data.length > 0 ? (
                <><Donut data={block.data} size={165} /><Legende data={block.data} /></>
              ) : (
                <div className="h-[165px] flex items-center justify-center text-xs text-center px-4" style={{ color: C.sub, ...F_BODY }}>
                  Aucun investissement dans cette catégorie.
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-[10px] mt-3" style={{ color: C.sub, ...F_BODY }}>
          Le rattachement géographique est déterminé à partir de l'émetteur ou de
          l'État associé à l'instrument disponible dans la maquette. La vue générale
          agrège Actions et Obligations et exclut la liquidité.
        </div>
      </Card>

      <Card className="p-5">
        <Eyebrow>Situation globale</Eyebrow>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <div className="text-xs" style={{ color: C.sub }}>Valorisation des actifs</div>
            <div className="text-xl font-bold" style={F_DISPLAY}>{fmt(assetsValue)} {client.devise}</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: C.sub }}>Liquidité</div>
            <div className="text-xl font-bold" style={F_DISPLAY}>{fmt(liquidityValue)} {client.devise}</div>
          </div>
        </div>
      </Card>
    </>
  );
}
