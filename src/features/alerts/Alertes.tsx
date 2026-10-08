import { useState } from 'react';
import { Badge, Card, Td, Th } from '../../shared/ui/UiAtoms';
import { Breadcrumb } from '../../shared/ui/Navigation';
import { C, F_BODY, F_DISPLAY } from '../../shared/theme/theme';

interface AlertRow {
  client: string;
  type: string;
  actif: string;
  ecart: string;
  marche: string;
  severite: string;
  depuis: string;
}

interface Props {
  alerts: AlertRow[];
  onRebalance: (context: { client: string; actif: string }) => void;
}

const toneType = (type: string) => {
  if (type === 'Allocation') return 'navy' as const;
  if (type === 'Rendement') return 'gold' as const;
  if (type === 'Risque') return 'coral' as const;
  return 'slate' as const;
};

export function AlertesScreen({ alerts, onRebalance }: Props) {
  const [filtreType, setFiltreType] = useState('Tous');
  const typesDisponibles = ['Tous', ...new Set(alerts.map((alert) => alert.type))];
  const alertesFiltrees = alerts.filter(
    (alert) => filtreType === 'Tous' || alert.type === filtreType
  );

  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', 'Alertes']} />

      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold" style={{ ...F_DISPLAY, color: C.ink }}>
            Alertes de seuil — allocation, rendement &amp; risque
          </h2>
          <div className="text-xs mt-1" style={{ color: C.sub, ...F_BODY }}>
            Filtrez les alertes suivant leur type pour cibler les contrôles à traiter.
          </div>
        </div>

        <div className="flex items-end gap-3 flex-wrap">
          <div>
            <label htmlFor="alerts-type-filter" className="text-xs font-semibold block mb-1" style={{ color: C.sub }}>
              Type d'alerte
            </label>
            <select
              id="alerts-type-filter"
              name="alerts-type-filter"
              value={filtreType}
              onChange={(event) => setFiltreType(event.target.value)}
              className="min-w-[180px] px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line, background: C.surfaceCard, ...F_BODY }}
            >
              {typesDisponibles.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <Badge tone="gold">{alertesFiltrees.length} alerte(s)</Badge>
          {filtreType !== 'Tous' && (
            <button
              type="button"
              onClick={() => setFiltreType('Tous')}
              className="px-3 py-2 rounded-xl border text-xs font-semibold"
              style={{ borderColor: C.line, color: C.navy, background: C.surfaceCard }}
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full">
          <thead style={{ background: C.surfaceElevated }}>
            <tr>
              <Th>Client</Th><Th>Type</Th><Th>Actif</Th><Th>Écart</Th><Th>Marché</Th><Th>Sévérité</Th><Th>Depuis</Th><Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {alertesFiltrees.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-sm" style={{ color: C.sub, ...F_BODY }}>
                  Aucune alerte ne correspond au type sélectionné.
                </td>
              </tr>
            )}

            {alertesFiltrees.map((alert, index) => (
              <tr
                key={`${alert.client}-${alert.type}-${alert.actif}-${index}`}
                style={{
                  borderTop: `1px solid ${C.line}`,
                  background: index % 2 ? C.rowAlternate : C.surfaceCard,
                }}
              >
                <Td className="font-semibold">{alert.client}</Td>
                <Td><Badge tone={toneType(alert.type)}>{alert.type}</Badge></Td>
                <Td>{alert.actif}</Td>
                <Td>{alert.ecart}</Td>
                <Td><Badge tone="navy">{alert.marche}</Badge></Td>
                <Td>
                  <Badge tone={alert.severite === 'Haute' ? 'coral' : alert.severite === 'Moyenne' ? 'gold' : 'slate'}>
                    {alert.severite}
                  </Badge>
                </Td>
                <Td>{alert.depuis}</Td>
                <Td>
                  <button
                    type="button"
                    onClick={() => onRebalance({ client: alert.client, actif: alert.actif })}
                    className="text-xs font-semibold"
                    style={{ color: C.navy }}
                  >
                    Rééquilibrer →
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
