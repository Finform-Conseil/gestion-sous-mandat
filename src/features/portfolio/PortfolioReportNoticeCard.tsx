import { fmt } from '../../shared/lib/finance';
import { Card, Eyebrow, Pct } from '../../shared/ui/UiAtoms';
import { C, F_BODY } from '../../shared/theme/theme';

export interface PortfolioReportSummary {
  nom: string;
  encours: number;
  devise: string;
  perf: number;
  rentabilite: number;
}

export function PortfolioReportNoticeCard({
  visible,
  client,
  period,
  profitabilityComment,
}: {
  visible: boolean;
  client: PortfolioReportSummary;
  period: string;
  profitabilityComment: string;
}) {
  if (!visible) return null;

  const periodVariation = Math.round(
    client.encours - client.encours / (1 + client.perf / 100)
  );

  return (
    <Card className="p-4" style={{ borderColor: C.gold }}>
      <Eyebrow>
        Rapport d'analyse — {client.nom} · {period}
      </Eyebrow>

      <div className="grid grid-cols-3 gap-4 text-sm mt-2" style={F_BODY}>
        <ReportMetric
          label="Situation globale"
          value={`${fmt(client.encours)} ${client.devise}`}
        />
        <div>
          <div className="text-xs" style={{ color: C.sub }}>
            Variation période
          </div>
          <div className="font-semibold">
            {fmt(periodVariation)} {client.devise}{' '}
            <Pct v={client.perf} />
          </div>
        </div>
        <div>
          <div className="text-xs" style={{ color: C.sub }}>
            Rentabilité période
          </div>
          <div className="font-semibold">
            <Pct v={client.rentabilite} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm mt-3" style={F_BODY}>
        <ReportMetric label="Acquisitions" value="3 opérations" />
        <ReportMetric label="Cessions / Encaiss." value="2 opérations" />
        <ReportMetric label="Retenues" value="Fiscalité sur coupons" />
      </div>

      <div
        className="text-xs mt-3 p-3 rounded-xl"
        style={{ background: '#FBF7EE', color: C.ink }}
      >
        Commentaire de Gestion: la performance de la période reflète
        principalement le renforcement de la ligne Télécoms et
        l'encaissement d'un coupon obligataire ; l'écart d'allocation
        Actions reste au-dessus de la cible et justifie un arbitrage.
      </div>

      <div
        className="text-xs mt-2 p-3 rounded-xl"
        style={{ background: '#EFF3FB', color: C.ink }}
      >
        <b>Commentaire (rentabilité) :</b> {profitabilityComment}
      </div>
    </Card>
  );
}

function ReportMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-xs" style={{ color: C.sub }}>
        {label}
      </div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
