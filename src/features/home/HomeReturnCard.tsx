import type { ProfileStatistic } from '../../shared/types/domain.types.ts';
import { Card, Pct } from '../../shared/ui/UiAtoms';
import { C, F_BODY, F_DISPLAY } from '../../shared/theme/theme';

export function HomeReturnCard({
  currency,
  weightedReturn,
  profileStatistics,
}: {
  currency: string;
  weightedReturn: number;
  profileStatistics: ProfileStatistic[];
}) {
  return (
    <Card className="p-4">
      <div
        className="text-xs font-medium"
        style={{ color: C.sub, ...F_BODY }}
      >
        Rentabilité moyenne pondérée (1 an)
      </div>

      <div className="flex items-end justify-between gap-2 mt-1">
        <div className="text-xl font-bold" style={F_DISPLAY}>
          <Pct v={weightedReturn} />
        </div>
        <span
          className="text-[11px]"
          style={{ color: C.sub, ...F_BODY }}
        >
          Global
        </span>
      </div>

      <div
        className="mt-3 pt-3 space-y-1.5"
        style={{ borderTop: `1px solid ${C.line}` }}
      >
        {profileStatistics.map((stat) => (
          <div
            key={stat.profil}
            className="flex items-center justify-between gap-2 text-xs"
            style={F_BODY}
          >
            <span style={{ color: C.sub }}>
              {stat.profil}
            </span>
            <span>
              <Pct v={stat.rendementPondere} />
            </span>
          </div>
        ))}
      </div>

      <div
        className="text-[10px] mt-2"
        style={{ color: C.sub, ...F_BODY }}
      >
        Pondération par les encours convertis en {currency}
      </div>
    </Card>
  );
}
