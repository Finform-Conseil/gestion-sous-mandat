import type { ComponentProps, ReactNode } from 'react';
import { X } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fmt } from '../lib/finance';
import { Badge, Eyebrow } from './UiAtoms';
import { C, F_BODY, F_DISPLAY, F_MONO } from '../theme/theme';

export interface CurrencyPortfolio {
  id: string;
  nom: string;
  marche: string;
  devise: string;
  expositionsDevises?: Record<string, number>;
}

export interface CurrencyHistoryPoint {
  mois: string;
  evenements?: unknown;
  [key: string]: unknown;
}

type HistoricalDot = ComponentProps<typeof Line>['dot'];

export function CurrencyExposureModal({
  open,
  activeCurrency,
  availableCurrencies,
  currentAmount,
  initialDate,
  minDate,
  maxDate,
  portfolioType,
  portfolioTypes,
  riskProfile,
  riskProfiles,
  selectedPortfolioId,
  filteredPortfolios,
  selectedPortfolio,
  history,
  eventTypes,
  eventColor,
  dot,
  formatCompact,
  renderEvents,
  onClose,
  onCurrencyChange,
  onInitialDateChange,
  onPortfolioTypeChange,
  onRiskProfileChange,
  onPortfolioChange,
}: {
  open: boolean;
  activeCurrency: string;
  availableCurrencies: string[];
  currentAmount: number;
  initialDate: string;
  minDate: string;
  maxDate: string;
  portfolioType: string;
  portfolioTypes: string[];
  riskProfile: string;
  riskProfiles: string[];
  selectedPortfolioId: string;
  filteredPortfolios: CurrencyPortfolio[];
  selectedPortfolio: CurrencyPortfolio | null;
  history: CurrencyHistoryPoint[];
  eventTypes: readonly string[];
  eventColor: (type: string) => string;
  dot: HistoricalDot;
  formatCompact: (value: number) => string;
  renderEvents: (events: unknown, currency: string) => ReactNode;
  onClose: () => void;
  onCurrencyChange: (currency: string) => void;
  onInitialDateChange: (date: string) => void;
  onPortfolioTypeChange: (type: string) => void;
  onRiskProfileChange: (profile: string) => void;
  onPortfolioChange: (portfolioId: string) => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        zIndex: 130,
        background: 'rgba(15, 27, 51, 0.52)',
        backdropFilter: 'blur(3px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exposition-devise-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-7xl rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          background: C.card,
          borderColor: C.line,
          maxHeight: '90vh',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="flex items-start justify-between gap-4 p-5"
          style={{ borderBottom: `1px solid ${C.line}` }}
        >
          <div>
            <Eyebrow>Exposition par devise</Eyebrow>
            <h3
              id="exposition-devise-title"
              className="text-xl font-bold"
              style={{ ...F_DISPLAY, color: C.ink }}
            >
              Évolution de l'encours en {activeCurrency}
            </h3>
            <div
              className="text-xs mt-1 max-w-3xl"
              style={{ color: C.sub }}
            >
              Analyse de l'évolution monétaire de l'encours. Vous pouvez
              modifier la date initiale, le type de portefeuille, le profil
              de risque ou isoler un portefeuille client précis.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="px-4 py-2 rounded-xl border text-right"
              style={{
                borderColor: C.line,
                background: C.surfaceElevated,
              }}
            >
              <div
                className="text-[9px] uppercase font-semibold"
                style={{ color: C.sub }}
              >
                Encours actuel affiché
              </div>
              <div
                className="text-lg font-bold mt-0.5"
                style={{ color: C.navy, ...F_MONO }}
              >
                {fmt(Math.round(currentAmount))} {activeCurrency}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-xl border flex items-center justify-center"
              style={{
                borderColor: C.line,
                color: C.sub,
                background: C.surfaceCard,
              }}
              aria-label="Fermer l'exposition par devise"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          className="overflow-y-auto p-5"
          style={{ maxHeight: 'calc(90vh - 105px)' }}
        >
          <div
            className="grid grid-cols-5 gap-3 mt-5 p-4 rounded-2xl border"
            style={{
              borderColor: C.line,
              background: C.surfaceElevated,
            }}
          >
            <div>
              <label
                className="text-[10px] uppercase font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Devise
              </label>
              <select name="gsm-currencyexposuremodal-190" aria-label="Sélection currencyexposuremodal"
                value={activeCurrency}
                onChange={(event) =>
                  onCurrencyChange(event.target.value)
                }
                className="w-full px-3 py-2 rounded-xl border text-sm font-semibold"
                style={{
                  borderColor: C.line,
                  background: C.surfaceCard,
                  color: C.ink,
                  ...F_BODY,
                }}
                title={
                  selectedPortfolio
                    ? 'Choisir une devise détenue dans ce portefeuille.'
                    : 'Choisir la devise à analyser.'
                }
              >
                {availableCurrencies.map((currency) => {
                  const weight =
                    selectedPortfolio?.expositionsDevises?.[
                      currency
                    ];

                  return (
                    <option key={currency} value={currency}>
                      {currency}
                      {Number.isFinite(Number(weight))
                        ? ` · ${Number(weight).toFixed(0)}%`
                        : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label
                className="text-[10px] uppercase font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Date initiale
              </label>
              <input name="gsm-currencyexposuremodal-233" aria-label="Champ currencyexposuremodal"
                type="date"
                min={minDate}
                max={maxDate}
                value={initialDate}
                onChange={(event) =>
                  onInitialDateChange(event.target.value)
                }
                className="w-full px-3 py-2 rounded-xl border text-sm"
                style={{
                  borderColor: C.line,
                  background: C.surfaceCard,
                  color: C.ink,
                  ...F_MONO,
                }}
              />
            </div>

            <div>
              <label
                className="text-[10px] uppercase font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Type de portefeuille
              </label>
              <select name="gsm-currencyexposuremodal-258" aria-label="Sélection currencyexposuremodal"
                value={portfolioType}
                onChange={(event) =>
                  onPortfolioTypeChange(event.target.value)
                }
                className="w-full px-3 py-2 rounded-xl border text-sm"
                style={{
                  borderColor: C.line,
                  background: C.surfaceCard,
                  color: C.ink,
                  ...F_BODY,
                }}
              >
                <option value="Tous">Tous</option>
                {portfolioTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="text-[10px] uppercase font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Profil de risque
              </label>
              <select name="gsm-currencyexposuremodal-287" aria-label="Sélection currencyexposuremodal"
                value={riskProfile}
                onChange={(event) =>
                  onRiskProfileChange(event.target.value)
                }
                className="w-full px-3 py-2 rounded-xl border text-sm"
                style={{
                  borderColor: C.line,
                  background: C.surfaceCard,
                  color: C.ink,
                  ...F_BODY,
                }}
              >
                <option value="Tous">Tous</option>
                {riskProfiles.map((profile) => (
                  <option key={profile} value={profile}>
                    {profile}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="text-[10px] uppercase font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Portefeuille client
              </label>
              <select name="gsm-currencyexposuremodal-316" aria-label="Sélection currencyexposuremodal"
                value={selectedPortfolioId}
                onChange={(event) =>
                  onPortfolioChange(event.target.value)
                }
                className="w-full px-3 py-2 rounded-xl border text-sm"
                style={{
                  borderColor: C.line,
                  background: C.surfaceCard,
                  color: C.ink,
                  ...F_BODY,
                }}
              >
                <option value="Tous">
                  Tous les portefeuilles filtrés
                </option>
                {filteredPortfolios.map((portfolio) => (
                  <option
                    key={portfolio.id}
                    value={portfolio.id}
                  >
                    {portfolio.nom} · {portfolio.marche} · réf.{' '}
                    {portfolio.devise} ·{' '}
                    {Object.keys(
                      portfolio.expositionsDevises || {
                        [portfolio.devise]: 100,
                      }
                    ).join('/')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="inline-block w-5 h-1 rounded-full"
                  style={{ background: C.indigo }}
                />
                <span
                  className="text-xs font-semibold"
                  style={{ color: C.ink }}
                >
                  {activeCurrency}
                </span>

                {selectedPortfolio && (
                  <>
                    <Badge tone="gold">
                      {selectedPortfolio.nom}
                    </Badge>
                    {Object.entries(
                      selectedPortfolio.expositionsDevises || {
                        [selectedPortfolio.devise]: 100,
                      }
                    ).map(([currency, weight]) => (
                      <Badge
                        key={`${selectedPortfolio.id}-${currency}`}
                        tone={
                          currency === activeCurrency
                            ? 'navy'
                            : 'slate'
                        }
                      >
                        {currency} {Number(weight).toFixed(0)}%
                      </Badge>
                    ))}
                  </>
                )}

                {!selectedPortfolio &&
                  portfolioType !== 'Tous' && (
                    <Badge tone="slate">
                      {portfolioType}
                    </Badge>
                  )}

                {!selectedPortfolio &&
                  riskProfile !== 'Tous' && (
                    <Badge tone="slate">
                      {riskProfile}
                    </Badge>
                  )}
              </div>

              <Badge tone="navy">
                Encours · {activeCurrency}
              </Badge>
            </div>

            {history.length > 0 && activeCurrency ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart
                  data={history}
                  margin={{
                    top: 12,
                    right: 20,
                    left: 20,
                    bottom: 4,
                  }}
                >
                  <CartesianGrid
                    stroke={C.line}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="mois"
                    tick={{
                      fontSize: 10,
                      fill: C.sub,
                    }}
                    axisLine={{ stroke: C.line }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: C.sub,
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={88}
                    tickFormatter={(value) =>
                      formatCompact(Number(value))
                    }
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) {
                        return null;
                      }

                      const point = payload[0]?.payload as
                        | CurrencyHistoryPoint
                        | undefined;

                      if (!point) return null;

                      return (
                        <div
                          className="rounded-xl border p-3 text-xs shadow-sm"
                          style={{
                            background: C.surfaceCard,
                            borderColor: C.line,
                            minWidth: 280,
                            ...F_BODY,
                          }}
                        >
                          <div
                            className="font-bold mb-2"
                            style={{ color: C.ink }}
                          >
                            Situation · {String(label || '')}
                          </div>
                          <div style={{ color: C.sub }}>
                            Encours :{' '}
                            <b
                              style={{
                                color: C.navy,
                                ...F_MONO,
                              }}
                            >
                              {fmt(
                                Math.round(
                                  Number(
                                    point[activeCurrency] || 0
                                  )
                                )
                              )}{' '}
                              {activeCurrency}
                            </b>
                          </div>

                          {renderEvents(
                            point.evenements,
                            activeCurrency
                          )}
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={activeCurrency}
                    name={
                      selectedPortfolio
                        ? selectedPortfolio.nom
                        : `Encours ${activeCurrency}`
                    }
                    stroke={C.indigo}
                    strokeWidth={3}
                    dot={dot}
                    activeDot={{ r: 7 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div
                className="h-72 rounded-2xl border flex items-center justify-center text-sm"
                style={{
                  borderColor: C.line,
                  background: C.surfaceElevated,
                  color: C.sub,
                }}
              >
                Aucune donnée disponible avec ces filtres et cette date
                initiale.
              </div>
            )}

            <div
              className="flex items-center gap-4 flex-wrap mt-2 text-[9px]"
              style={{ color: C.sub }}
            >
              {eventTypes.map((type) => (
                <span
                  key={`popup-${type}`}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border-2"
                    style={{
                      borderColor: eventColor(type),
                      background: C.surfaceCard,
                    }}
                  />
                  {type}
                </span>
              ))}
              <span>
                Les points correspondent aux événements enregistrés sur
                la période.
              </span>
            </div>
          </div>

          <div
            className="mt-3 pt-3 flex items-center justify-between gap-3 flex-wrap text-[10px]"
            style={{
              borderTop: `1px solid ${C.line}`,
              color: C.sub,
            }}
          >
            <span>
              {selectedPortfolio
                ? `Courbe de l'exposition ${activeCurrency} du portefeuille ${selectedPortfolio.nom}.`
                : `Courbe agrégée des investissements exposés à la devise ${activeCurrency}.`}
            </span>
            <span>
              Période affichée depuis le {initialDate || minDate}.
            </span>
            <span>
              Maquette : historique déterministe · remplacer par les
              valorisations historisées réelles en production.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
