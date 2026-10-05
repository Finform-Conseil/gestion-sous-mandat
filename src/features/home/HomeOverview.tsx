import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Moon, Sun } from 'lucide-react';
import type {
  PortfolioHistoryPoint,
  ProfileStatistic,
} from '../../shared/types/domain.types.ts';
import { fmt } from '../../shared/lib/finance';
import { Card, Pct } from '../../shared/ui/UiAtoms';
import { C, F_BODY, F_DISPLAY, F_MONO } from '../../shared/theme/theme';

export function HomeToolbar({
  currency,
  currencies,
  dark,
  onCurrencyChange,
  onToggleDark,
}: {
  currency: string;
  currencies: string[];
  dark: boolean;
  onCurrencyChange: (currency: string) => void;
  onToggleDark: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-semibold"
          style={{ color: C.sub }}
        >
          Devise d'affichage du site
        </span>
        <select name="gsm-homeoverview-40" aria-label="Sélection homeoverview"
          value={currency}
          onChange={(event) =>
            onCurrencyChange(event.target.value)
          }
          className="px-3 py-1.5 rounded-xl border text-sm"
          style={{ borderColor: C.line }}
        >
          {currencies.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onToggleDark}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold"
        style={{ borderColor: C.line, color: C.ink }}
      >
        {dark ? <Sun size={14} /> : <Moon size={14} />}{' '}
        {dark ? 'Mode lumineux' : 'Mode sombre'}
      </button>
    </div>
  );
}

export function HomeAumCard({
  currency,
  total,
  weightedPerformance,
  profileStatistics,
}: {
  currency: string;
  total: number;
  weightedPerformance: number;
  profileStatistics: ProfileStatistic[];
}) {
  return (
    <Card className="p-4">
      <div
        className="text-xs font-medium"
        style={{ color: C.sub, ...F_BODY }}
      >
        Encours total (éq. {currency})
      </div>

      <div className="flex items-end justify-between gap-2 mt-1">
        <div
          className="text-2xl font-bold"
          style={{ ...F_DISPLAY, color: C.ink }}
        >
          {fmt(Math.round(total))} {currency}
        </div>
        <span
          className="text-[11px]"
          style={{ color: C.sub, ...F_BODY }}
        >
          Global
        </span>
      </div>

      <div className="mt-1">
        <Pct v={weightedPerformance} />
      </div>

      <div
        className="mt-3 pt-3 space-y-1.5"
        style={{ borderTop: `1px solid ${C.line}` }}
      >
        {profileStatistics.map((stat) => (
          <div
            key={stat.profil}
            className="flex items-start justify-between gap-2 text-xs"
            style={F_BODY}
          >
            <span style={{ color: C.sub }}>
              {stat.profil}
            </span>
            <span className="flex flex-col items-end min-w-0">
              <span
                className="text-[10px] font-semibold whitespace-nowrap"
                style={{ color: C.ink, ...F_MONO }}
              >
                {fmt(Math.round(stat.encoursProfil))}{' '}
                {currency}
              </span>
              <Pct v={stat.variationEncoursPonderee} />
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ManagedPortfoliosCard({
  portfolioCount,
  profileStatistics,
  selectedProfile,
  onSelectedProfileChange,
  riskProfiles,
  history,
  currentCount,
  growth,
}: {
  portfolioCount: number;
  profileStatistics: ProfileStatistic[];
  selectedProfile: string;
  onSelectedProfileChange: (profile: string) => void;
  riskProfiles: readonly string[];
  history: PortfolioHistoryPoint[];
  currentCount: number;
  growth: number;
}) {
  return (
    <Card className="p-4">
      <div
        className="text-xs font-medium"
        style={{ color: C.sub, ...F_BODY }}
      >
        Portefeuilles gérés
      </div>

      <div className="flex items-end justify-between gap-2 mt-1">
        <div
          className="text-2xl font-bold"
          style={{ ...F_DISPLAY, color: C.ink }}
        >
          {portfolioCount}
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
            <span
              className="font-semibold"
              style={{ color: C.ink, ...F_MONO }}
            >
              {stat.nombre}
            </span>
          </div>
        ))}
      </div>

      <div
        className="mt-3 pt-3"
        style={{ borderTop: `1px solid ${C.line}` }}
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <span
            className="text-[10px] font-semibold"
            style={{ color: C.sub, ...F_BODY }}
          >
            Historique trimestriel · 2 ans
          </span>

          <select name="gsm-homeoverview-214"
            value={selectedProfile}
            onChange={(event) =>
              onSelectedProfileChange(event.target.value)
            }
            className="max-w-[110px] px-1.5 py-1 rounded-lg border text-[9px]"
            style={{
              borderColor: C.line,
              color: C.ink,
              ...F_BODY,
            }}
            aria-label="Profil affiché dans l'historique des portefeuilles"
          >
            <option>Global</option>
            {riskProfiles.map((profile) => (
              <option key={profile}>{profile}</option>
            ))}
          </select>
        </div>

        <ResponsiveContainer width="100%" height={86}>
          <LineChart
            data={history}
            margin={{
              top: 5,
              right: 4,
              left: 4,
              bottom: 0,
            }}
          >
            <XAxis
              dataKey="trimestre"
              axisLine={false}
              tickLine={false}
              interval={1}
              tick={{ fontSize: 8, fill: C.sub }}
            />
            <YAxis hide domain={[0, 'dataMax + 1']} />
            <Tooltip
              formatter={(value) => [
                `${String(value)} portefeuille(s)`,
                selectedProfile,
              ]}
              contentStyle={{
                borderRadius: 9,
                border: `1px solid ${C.line}`,
                fontSize: 10,
              }}
            />
            <Line
              type="monotone"
              dataKey="nombre"
              stroke={C.indigo}
              strokeWidth={2.2}
              dot={{ r: 1.8 }}
              activeDot={{ r: 3 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>

        <div
          className="flex items-center justify-between text-[9px] mt-0.5"
          style={{ color: C.sub, ...F_BODY }}
        >
          <span>{selectedProfile}</span>
          <span style={F_MONO}>
            {currentCount} actuellement ·{' '}
            {growth >= 0 ? '+' : ''}
            {growth} sur 2 ans
          </span>
        </div>
      </div>

      <div
        className="text-[10px] mt-2"
        style={{ color: C.sub, ...F_BODY }}
      >
        3 marchés · 3 devises · 5 profils de risque
      </div>
    </Card>
  );
}
