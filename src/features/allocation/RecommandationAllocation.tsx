import { Badge, Card, Td, Th } from '../../shared/ui/UiAtoms';
import { Breadcrumb } from '../../shared/ui/Navigation';
import { C, F_DISPLAY } from '../../shared/theme/theme';

interface AllocationClient {
  id: string;
  nom: string;
  alloc: Record<string, number>;
  cible: Record<string, number>;
}

interface Props {
  clients: AllocationClient[];
  onApplyRebalancing: (context: { client: string; actif: string }) => void;
}

export function RecommandationAllocationScreen({
  clients,
  onApplyRebalancing,
}: Props) {
  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', "Recommandation d'allocation"]} />
      <h2 className="text-xl font-bold" style={{ ...F_DISPLAY, color: C.ink }}>
        Recommandation d'allocation aux portefeuilles clients
      </h2>

      <Card className="p-0 overflow-hidden">
        <table className="w-full">
          <thead style={{ background: C.surfaceElevated }}>
            <tr>
              <Th>Client</Th>
              <Th>Actuel</Th>
              <Th>Cible</Th>
              <Th>Écart</Th>
              <Th>Action suggérée</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => {
              const ecart = client.alloc.Actions - client.cible.Actions;
              return (
                <tr
                  key={client.id}
                  style={{
                    borderTop: `1px solid ${C.line}`,
                    background: index % 2 ? C.rowAlternate : C.surfaceCard,
                  }}
                >
                  <Td className="font-semibold">{client.nom}</Td>
                  <Td mono>{client.alloc.Actions}% Actions</Td>
                  <Td mono>{client.cible.Actions}% Actions</Td>
                  <Td>
                    <Badge tone={ecart > 0 ? 'coral' : 'teal'}>
                      {ecart > 0 ? '+' : ''}
                      {ecart} pts
                    </Badge>
                  </Td>
                  <Td>
                    {ecart > 3
                      ? 'Réduire Actions'
                      : ecart < -3
                        ? 'Renforcer Actions'
                        : 'Aucune'}
                  </Td>
                  <Td>
                    {Math.abs(ecart) > 3 && (
                      <button
                        type="button"
                        onClick={() =>
                          onApplyRebalancing({
                            client: client.id,
                            actif: 'Actions',
                          })
                        }
                        className="text-xs font-semibold"
                        style={{ color: C.navy }}
                      >
                        Appliquer →
                      </button>
                    )}
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
