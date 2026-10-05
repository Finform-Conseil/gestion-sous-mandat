import { Badge, Btn } from '../../shared/ui/UiAtoms';
import { Breadcrumb } from '../../shared/ui/Navigation';
import { C, F_BODY, F_DISPLAY } from '../../shared/theme/theme';

export interface PortfolioDetailHeaderClient {
  id: string;
  nom: string;
  type: string;
  marche: string;
  devise: string;
  risque: string;
}

export function PortfolioDetailHeader({
  client,
  rebalanceCount,
  reportPeriod,
  onReportPeriodChange,
  onRebalance,
  onGenerateReport,
}: {
  client: PortfolioDetailHeaderClient;
  rebalanceCount: number;
  reportPeriod: string;
  onReportPeriodChange: (period: string) => void;
  onRebalance: () => void;
  onGenerateReport: () => void;
}) {
  return (
    <>
      <Breadcrumb items={['Accueil', 'Portefeuilles', client.nom]} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ ...F_DISPLAY, color: C.ink }}>
            {client.nom}
          </h2>
          <div className="flex gap-2 mt-1">
            <Badge tone="navy">{client.type}</Badge>
            <Badge tone="navy">{client.marche} · {client.devise}</Badge>
            <Badge tone="slate">Risque {client.risque}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {rebalanceCount > 0 ? (
            <Btn tone="ghost" onClick={onRebalance}>
              Voir {rebalanceCount} écart(s) → Rééquilibrage
            </Btn>
          ) : (
            <Badge tone="teal">Allocation conforme — aucun rééquilibrage</Badge>
          )}
          <div className="flex items-center gap-2">
            <select name="gsm-portfoliodetailheader-52"
              value={reportPeriod}
              onChange={(event) => onReportPeriodChange(event.target.value)}
              className="px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line, ...F_BODY }}
              aria-label="Période du rapport du portefeuille"
              title="Définir la période du rapport"
            >
              <option>Trimestre en cours</option>
              <option>Année en cours</option>
              <option>Personnalisée</option>
            </select>
            <Btn onClick={onGenerateReport}>Générer rapport</Btn>
          </div>
        </div>
      </div>
    </>
  );
}
