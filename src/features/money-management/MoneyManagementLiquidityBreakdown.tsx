import { Donut, Legende, type DonutDatum } from '../home/HomeWidgets';
import { Card, Eyebrow } from '../../shared/ui/UiAtoms';
import { C } from '../../shared/theme/theme';

const DIMENSIONS = [
  'Devise',
  'Marché',
  'Profil de risque',
  'Type de portefeuille',
] as const;

export type LiquidityDimension = (typeof DIMENSIONS)[number];

export function MoneyManagementLiquidityBreakdown({
  dimension,
  data,
  onDimensionChange,
}: {
  dimension: LiquidityDimension;
  data: DonutDatum[];
  onDimensionChange: (dimension: LiquidityDimension) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <Eyebrow>5. Répartition et concentration de la liquidité</Eyebrow>
          <div className="text-xs" style={{ color: C.sub }}>
            Analyse de la liquidité disponible selon les principales dimensions
            déjà utilisées dans la plateforme.
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {DIMENSIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onDimensionChange(item)}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: dimension === item ? C.navy : '#F0F1F5',
                color: dimension === item ? '#fff' : C.sub,
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <Card className="p-5">
        <div className="grid grid-cols-2 gap-6 items-center">
          <div><Donut data={data} size={210} /></div>
          <div>
            <div className="text-xs mb-3" style={{ color: C.sub }}>
              Liquidité actuelle ventilée par {dimension.toLowerCase()}.
            </div>
            <Legende data={data} />
          </div>
        </div>
      </Card>
    </section>
  );
}
