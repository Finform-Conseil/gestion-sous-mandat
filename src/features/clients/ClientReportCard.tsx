import { Btn, Card, Eyebrow } from '../../shared/ui/UiAtoms';
import { C, F_BODY } from '../../shared/theme/theme';

export interface ReportClient {
  id: string;
  nom: string;
}

export function ClientReportCard({
  clients,
  selectedClientId,
  period,
  onClientChange,
  onPeriodChange,
  onGenerate,
}: {
  clients: ReportClient[];
  selectedClientId: string;
  period: string;
  onClientChange: (clientId: string) => void;
  onPeriodChange: (period: string) => void;
  onGenerate: () => void;
}) {
  return (
    <Card className="p-5">
      <Eyebrow>Rapport d'analyse client</Eyebrow>
      <div className="text-xs mb-3" style={{ color: C.sub, ...F_BODY }}>
        Situation globale, mouvements et commentaire de rendement sur
        période.
      </div>

      <label
        className="text-xs font-semibold block mb-1"
        style={{ color: C.sub }}
      >
        Client
      </label>
      <select name="gsm-clientreportcard-38" aria-label="Sélection clientreportcard"
        value={selectedClientId}
        onChange={(event) => onClientChange(event.target.value)}
        className="w-full mb-2 px-3 py-2 rounded-xl border text-sm"
        style={{ borderColor: C.line, ...F_BODY }}
      >
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.nom}
          </option>
        ))}
      </select>

      <label
        className="text-xs font-semibold block mb-1"
        style={{ color: C.sub }}
      >
        Période
      </label>
      <select name="gsm-clientreportcard-57" aria-label="Sélection clientreportcard"
        value={period}
        onChange={(event) => onPeriodChange(event.target.value)}
        className="w-full mb-4 px-3 py-2 rounded-xl border text-sm"
        style={{ borderColor: C.line, ...F_BODY }}
      >
        <option>Trimestre en cours</option>
        <option>Année en cours</option>
        <option>Personnalisée</option>
      </select>

      <div className="flex items-center gap-2">
        <Btn onClick={onGenerate}>Générer le rapport</Btn>
      </div>
    </Card>
  );
}
