import { convertCurrency, fmt } from '../../shared/lib/finance';
import { Badge, Card, Eyebrow } from '../../shared/ui/UiAtoms';
import { C, F_MONO } from '../../shared/theme/theme';

export interface MarketVolumeDatum {
  marche: string;
  type: 'Action' | 'Obligation' | string;
  volume: number;
  devise: string;
}

export function MarketVolumeCard({
  exchanges,
  volumeData,
  currencies,
  selectedCurrencies,
  onCurrencyChange,
}: {
  exchanges: string[];
  volumeData: MarketVolumeDatum[];
  currencies: string[];
  selectedCurrencies: Record<string, string>;
  onCurrencyChange: (exchange: string, currency: string) => void;
}) {
  return (
    <Card className="p-5">
      <div className="gsm-responsive-header flex items-center justify-between mb-3">
        <Eyebrow>Volume d'échange du jour — marchés</Eyebrow>
        <span className="text-xs" style={{ color: C.sub }}>
          Devise d'affichage réglable par bourse
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {exchanges.map((exchange) => {
          const action = volumeData.find(
            (item) =>
              item.marche === exchange && item.type === 'Action'
          );
          const bond = volumeData.find(
            (item) =>
              item.marche === exchange &&
              item.type === 'Obligation'
          );
          const targetCurrency = selectedCurrencies[exchange];

          if (!action || !bond || !targetCurrency) {
            return null;
          }

          return (
            <div
              key={exchange}
              className="p-3 rounded-xl border"
              style={{ borderColor: C.line }}
            >
              <div className="gsm-responsive-inline-row flex items-center justify-between mb-2">
                <Badge tone="navy">{exchange}</Badge>
                <select name="gsm-marketvolumecard-59" aria-label="Sélection marketvolumecard"
                  value={targetCurrency}
                  onChange={(event) =>
                    onCurrencyChange(
                      exchange,
                      event.target.value
                    )
                  }
                  className="text-xs px-2 py-1 rounded-lg border"
                  style={{ borderColor: C.line }}
                >
                  {currencies.map((currency) => (
                    <option key={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              <div className="text-xs" style={{ color: C.sub }}>
                Actions
              </div>
              <div
                className="font-semibold text-sm mb-2"
                style={F_MONO}
              >
                {fmt(
                  Math.round(
                    convertCurrency(
                      action.volume,
                      action.devise,
                      targetCurrency
                    )
                  )
                )}{' '}
                {targetCurrency}
              </div>

              <div className="text-xs" style={{ color: C.sub }}>
                Obligations
              </div>
              <div className="font-semibold text-sm" style={F_MONO}>
                {fmt(
                  Math.round(
                    convertCurrency(
                      bond.volume,
                      bond.devise,
                      targetCurrency
                    )
                  )
                )}{' '}
                {targetCurrency}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
