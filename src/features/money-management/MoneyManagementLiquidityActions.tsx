import { convertCurrency, fmt } from '../../shared/lib/finance';
import { Badge, Card, Eyebrow, Td, Th } from '../../shared/ui/UiAtoms';
import { C } from '../../shared/theme/theme';

type BadgeTone = 'slate' | 'gold' | 'teal' | 'coral' | 'navy';

export interface LiquidityActionClient {
  id: string;
  nom: string;
  devise: string;
  alloc: Record<string, number>;
  cible: Record<string, number>;
}

export interface LiquidityActionRow {
  client: LiquidityActionClient;
  statut: string;
  ratioPrevisionnel: number;
  ratioCible: number;
  montantVersCible: number;
  action: string;
}

export function MoneyManagementLiquidityActions({
  currency,
  rows,
  rebalanceThreshold,
  statusTone,
  onOpenClient,
  onRebalance,
}: {
  currency: string;
  rows: LiquidityActionRow[];
  rebalanceThreshold: number;
  statusTone: (status: string) => BadgeTone;
  onOpenClient: (clientId: string) => void;
  onRebalance: (clientId: string) => void;
}) {
  const hasCritical = rows.some((row) => row.statut === 'Critique');

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <Eyebrow>6. Actions de gestion de liquidité</Eyebrow>
          <div className="text-xs" style={{ color: C.sub }}>
            Liste priorisée des portefeuilles nécessitant une reconstitution de
            cash ou un réinvestissement de l'excédent.
          </div>
        </div>
        <Badge tone={hasCritical ? 'coral' : 'gold'}>
          {rows.length} action(s)
        </Badge>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full">
          <thead style={{ background: '#FAFAFC' }}>
            <tr>
              <Th>Client</Th>
              <Th>Statut</Th>
              <Th>Liquidité prév.</Th>
              <Th>Cible</Th>
              <Th>Montant à ajuster ({currency})</Th>
              <Th>Action suggérée</Th>
              <Th><span className="sr-only">Actions</span></Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-7 text-sm" style={{ color: C.sub }}>
                  Aucune action de liquidité n'est requise pour les portefeuilles filtrés.
                </td>
              </tr>
            )}
            {rows.map((row, index) => {
              const client = row.client;
              const allocationGap = Math.abs(
                Number(client.alloc.Liquidité || 0) -
                  Number(client.cible.Liquidité || 0)
              );
              return (
                <tr
                  key={client.id}
                  style={{
                    borderTop: `1px solid ${C.line}`,
                    background: index % 2 ? '#FCFCFD' : '#fff',
                  }}
                >
                  <Td className="font-semibold whitespace-nowrap">{client.nom}</Td>
                  <Td><Badge tone={statusTone(row.statut)}>{row.statut}</Badge></Td>
                  <Td mono>{row.ratioPrevisionnel.toFixed(1)}%</Td>
                  <Td mono>{row.ratioCible.toFixed(1)}%</Td>
                  <Td mono className="whitespace-nowrap">
                    {fmt(Math.round(convertCurrency(row.montantVersCible, client.devise, currency)))} {currency}
                  </Td>
                  <Td><span className="text-xs" style={{ color: C.sub }}>{row.action}</span></Td>
                  <Td>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      {allocationGap > rebalanceThreshold && (
                        <button
                          type="button"
                          onClick={() => onRebalance(client.id)}
                          className="text-xs font-semibold"
                          style={{ color: C.coral }}
                        >
                          Rééquilibrer →
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onOpenClient(client.id)}
                        className="text-xs font-semibold"
                        style={{ color: C.navy }}
                      >
                        Portefeuille →
                      </button>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
