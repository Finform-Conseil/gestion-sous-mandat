import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { fmt, fmtPrice } from '../../shared/lib/finance';
import { Badge, Card, Eyebrow, Td, Th } from '../../shared/ui/UiAtoms';
import { C, F_BODY, F_MONO } from '../../shared/theme/theme';

export interface ListedAssetRow {
  title: string;
  exposition: number;
  cmp: number;
  valeurMarche: number;
  plusMoinsValue: number;
  plusMoinsValuePct: number;
}

export function PortfolioListedAssetsCard({
  currency,
  actions,
  bonds,
}: {
  currency: string;
  actions: ListedAssetRow[];
  bonds: ListedAssetRow[];
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Eyebrow>Présentation des actifs cotés</Eyebrow>
          <div className="text-[10px]" style={{ color: C.sub, ...F_BODY }}>
            CMP = Coût Moyen Pondéré · +/- Value = gain ou perte latent(e)
            de la ligne par rapport à sa valorisation actuelle.
          </div>
        </div>
        <Badge tone="slate">Valorisation par ligne</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-3">
        <ListedAssetTable
          label="Actions"
          emptyLabel="Aucune action détenue"
          currency={currency}
          rows={actions}
        />
        <ListedAssetTable
          label="Obligations"
          emptyLabel="Aucune obligation détenue en direct"
          currency={currency}
          rows={bonds}
        />
      </div>

      <div
        className="text-[10px] mt-3 p-3 rounded-xl"
        style={{ background: '#FAFAFC', color: C.sub, ...F_BODY }}
      >
        <b style={{ color: C.ink }}>Calcul :</b> +/- Value = valeur de
        marché de la ligne − coût historique de la position. Le coût
        historique est obtenu à partir du CMP multiplié par la quantité
        correspondante.
      </div>
    </Card>
  );
}

function ListedAssetTable({
  label,
  emptyLabel,
  currency,
  rows,
}: {
  label: string;
  emptyLabel: string;
  currency: string;
  rows: ListedAssetRow[];
}) {
  return (
    <div>
      <div className="text-xs font-semibold mb-1" style={{ color: C.sub }}>
        {label}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: 700 }}>
          <thead>
            <tr>
              <Th>Titre</Th>
              <Th>Exposition</Th>
              <Th>CMP</Th>
              <Th>Valeur estimée</Th>
              <Th>+/- Value</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const gain = row.plusMoinsValue >= 0;
              return (
                <tr key={row.title} style={{ borderTop: `1px solid ${C.line}` }}>
                  <Td>{row.title}</Td>
                  <Td mono>{row.exposition}%</Td>
                  <Td mono className="whitespace-nowrap">
                    {fmtPrice(row.cmp)} {currency}
                  </Td>
                  <Td mono className="whitespace-nowrap">
                    {fmt(Math.round(row.valeurMarche))} {currency}
                  </Td>
                  <Td>
                    <div
                      className="inline-flex flex-col whitespace-nowrap"
                      style={{ color: gain ? C.teal : C.coral, ...F_MONO }}
                    >
                      <span className="inline-flex items-center gap-1 text-xs font-semibold">
                        {gain ? <ArrowUpRight size={13} aria-hidden="true" /> : <ArrowDownRight size={13} aria-hidden="true" />}
                        {gain ? '+' : '-'}
                        {fmt(Math.round(Math.abs(row.plusMoinsValue)))} {currency}
                      </span>
                      <span className="text-[9px]">
                        {gain ? '+' : '-'}
                        {Math.abs(row.plusMoinsValuePct).toFixed(2)}%
                      </span>
                    </div>
                  </Td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-xs py-3" style={{ color: C.sub }}>
                  {emptyLabel}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
