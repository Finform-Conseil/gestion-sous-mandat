import { ChevronRight } from 'lucide-react';
import { Badge, Card } from '../../shared/ui/UiAtoms';
import { C, F_BODY, F_DISPLAY } from '../../shared/theme/theme';

type BadgeTone =
  | 'slate'
  | 'gold'
  | 'teal'
  | 'coral'
  | 'navy';

export interface AlertStatistic {
  type: string;
  nombre: number;
}

export interface WithdrawalStatusStatistic {
  statut: string;
  nombre: number;
}

export function HomeAlertsCard({
  totalAlerts,
  alertStatistics,
  totalActiveWithdrawals,
  withdrawalStatistics,
  onOpenAlerts,
  onOpenWithdrawals,
  onOpenAvailableWithdrawals,
  statusTone,
}: {
  totalAlerts: number;
  alertStatistics: AlertStatistic[];
  totalActiveWithdrawals: number;
  withdrawalStatistics: WithdrawalStatusStatistic[];
  onOpenAlerts: () => void;
  onOpenWithdrawals: () => void;
  onOpenAvailableWithdrawals: () => void;
  statusTone: (status: string) => BadgeTone;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-2">
        <div
          className="text-xs font-medium"
          style={{ color: C.sub, ...F_BODY }}
        >
          Alertes actives
        </div>
        <button
          type="button"
          onClick={onOpenAlerts}
          className="text-xs font-semibold whitespace-nowrap"
          style={{ color: C.coral }}
        >
          Voir →
        </button>
      </div>

      <div className="flex items-end justify-between gap-2 mt-1">
        <div
          className="text-2xl font-bold"
          style={{ ...F_DISPLAY, color: C.ink }}
        >
          {totalAlerts}
        </div>
        <span
          className="text-[11px]"
          style={{ color: C.sub, ...F_BODY }}
        >
          Total
        </span>
      </div>

      <div
        className="mt-3 pt-3 space-y-1.5"
        style={{ borderTop: `1px solid ${C.line}` }}
      >
        {alertStatistics.map((stat) => (
          <div
            key={stat.type}
            className="flex items-center justify-between gap-2 text-xs"
            style={F_BODY}
          >
            <span style={{ color: C.sub }}>
              {stat.type}
            </span>
            <Badge
              tone={
                stat.type === 'Risque'
                  ? 'coral'
                  : stat.type === 'Rendement'
                  ? 'gold'
                  : 'navy'
              }
            >
              {stat.nombre}
            </Badge>
          </div>
        ))}
      </div>

      <div
        className="mt-4 pt-3"
        style={{ borderTop: `1px solid ${C.line}` }}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div>
            <div
              className="text-[10px] uppercase tracking-wide font-bold"
              style={{ color: C.sub }}
            >
              État cession-retrait
            </div>
            <div
              className="text-[9px] mt-0.5"
              style={{ color: C.sub }}
            >
              {totalActiveWithdrawals} dossier(s) en traitement
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenWithdrawals}
            className="text-[10px] font-semibold whitespace-nowrap"
            style={{ color: C.indigo }}
          >
            Voir →
          </button>
        </div>

        <div className="space-y-1.5">
          {withdrawalStatistics.map((stat) =>
            stat.statut === 'Retrait disponible' ? (
              <button
                type="button"
                key={stat.statut}
                disabled={stat.nombre === 0}
                onClick={onOpenAvailableWithdrawals}
                className="w-full flex items-center justify-between gap-2 text-[11px] rounded-lg px-2 py-1.5 transition-colors"
                style={{
                  background:
                    stat.nombre > 0
                      ? '#EAF8F3'
                      : 'transparent',
                  cursor:
                    stat.nombre > 0
                      ? 'pointer'
                      : 'default',
                  opacity: stat.nombre > 0 ? 1 : 0.6,
                }}
                title={
                  stat.nombre > 0
                    ? 'Voir les retraits disponibles'
                    : 'Aucun retrait disponible'
                }
              >
                <span
                  className="font-semibold flex items-center gap-1.5"
                  style={{
                    color:
                      stat.nombre > 0
                        ? C.teal
                        : C.sub,
                  }}
                >
                  {stat.statut}
                  {stat.nombre > 0 && (
                    <ChevronRight size={12} />
                  )}
                </span>
                <Badge tone={statusTone(stat.statut)}>
                  {stat.nombre}
                </Badge>
              </button>
            ) : (
              <div
                key={stat.statut}
                className="flex items-center justify-between gap-2 text-[11px] px-2 py-1.5"
              >
                <span style={{ color: C.sub }}>
                  {stat.statut}
                </span>
                <Badge tone={statusTone(stat.statut)}>
                  {stat.nombre}
                </Badge>
              </div>
            )
          )}
        </div>
      </div>
    </Card>
  );
}
