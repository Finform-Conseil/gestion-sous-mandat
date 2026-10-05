import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Breadcrumb } from '../../shared/ui/Navigation';
import { Badge, Card } from '../../shared/ui/UiAtoms';
import { C, F_BODY, F_DISPLAY, F_MONO } from '../../shared/theme/theme';

export interface MoneyAmountFilter {
  key: string;
  label: string;
  value: string;
  setter: (value: string) => void;
}

export function MoneyManagementFiltersHeader({
  currency,
  clientQuery,
  market,
  type,
  riskProfile,
  status,
  markets,
  types,
  riskProfiles,
  statuses,
  amountFilters,
  activeFilterCount,
  filteredPortfolioCount,
  onClientQueryChange,
  onMarketChange,
  onTypeChange,
  onRiskProfileChange,
  onStatusChange,
  onReset,
}: {
  currency: string;
  clientQuery: string;
  market: string;
  type: string;
  riskProfile: string;
  status: string;
  markets: string[];
  types: string[];
  riskProfiles: string[];
  statuses: string[];
  amountFilters: MoneyAmountFilter[];
  activeFilterCount: number;
  filteredPortfolioCount: number;
  onClientQueryChange: (value: string) => void;
  onMarketChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onRiskProfileChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}) {
  return (
    <>
      <Breadcrumb items={['Accueil', 'Money Management']} />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Money Management — gestion consolidée de la liquidité
          </h2>
          <div
            className="text-xs mt-1 max-w-4xl"
            style={{ color: C.sub, ...F_BODY }}
          >
            Pilotage des disponibilités de tous les portefeuilles, suivi des
            écarts à la cible, anticipation des encaissements et règlements, et
            identification des excédents ou besoins de trésorerie. Les montants
            consolidés sont convertis dans la devise principale choisie sur
            l'accueil.
          </div>
        </div>
        <Badge tone="navy">Devise principale : {currency}</Badge>
      </div>

      <Card className="p-4" style={{ borderColor: C.navy }}>
        <div className="grid grid-cols-5 gap-3">
          <FilterField label="Client">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl border"
              style={{ borderColor: C.line }}
            >
              <Search size={14} color={C.sub} aria-hidden="true" />
              <input aria-label="Rechercher…"
                value={clientQuery}
                onChange={(event) => onClientQueryChange(event.target.value)}
                placeholder="Rechercher…"
                className="w-full text-xs outline-none"
                style={F_BODY}
                type="search"
                name="money-management-client-search"
              />
            </div>
          </FilterField>

          <SelectFilter
            label="Marché"
            value={market}
            options={markets}
            onChange={onMarketChange}
          />
          <SelectFilter
            label="Type de portefeuille"
            value={type}
            options={types}
            onChange={onTypeChange}
          />
          <SelectFilter
            label="Profil de risque"
            value={riskProfile}
            options={riskProfiles}
            onChange={onRiskProfileChange}
          />
          <SelectFilter
            label="Statut liquidité"
            value={status}
            options={statuses}
            onChange={onStatusChange}
          />
        </div>

        <div
          className="mt-4 pt-4"
          style={{ borderTop: `1px solid ${C.line}` }}
        >
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <div>
              <div
                className="text-xs font-semibold"
                style={{ color: C.ink, ...F_BODY }}
              >
                Seuils financiers
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: C.sub }}>
                Tous les seuils sont comparés après conversion dans la devise
                principale de vue : {currency}.
              </div>
            </div>
            <Badge tone="navy">Seuils en {currency}</Badge>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {amountFilters.map((filter) => (
              <FilterField key={filter.key} label={filter.label}>
                <div
                  className="flex items-center rounded-xl border overflow-hidden"
                  style={{ borderColor: C.line, background: '#fff' }}
                >
                  <input name="gsm-moneymanagementfiltersheader-154" aria-label="Aucun minimum"
                    type="number"
                    min="0"
                    step="1"
                    value={filter.value}
                    onChange={(event) => filter.setter(event.target.value)}
                    placeholder="Aucun minimum"
                    className="w-full px-3 py-2 text-xs outline-none min-w-0"
                    style={F_MONO}
                  />
                  <span
                    className="px-2.5 py-2 text-[10px] font-semibold border-l shrink-0"
                    style={{
                      color: C.sub,
                      borderColor: C.line,
                      background: '#FAFAFC',
                      ...F_MONO,
                    }}
                  >
                    {currency}
                  </span>
                </div>
              </FilterField>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
          <div className="text-[11px]" style={{ color: C.sub }}>
            Les mêmes filtres pilotent les positions, les flux, les répartitions
            et les actions de liquidité.
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={activeFilterCount > 0 ? 'teal' : 'slate'}>
              {activeFilterCount} filtre(s) actif(s)
            </Badge>
            <Badge tone="gold">
              {filteredPortfolioCount} portefeuille(s)
            </Badge>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onReset}
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                style={{ borderColor: C.line, color: C.navy }}
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        className="text-[11px] font-semibold block mb-1"
        style={{ color: C.sub }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <FilterField label={label}>
      <select name="gsm-moneymanagementfiltersheader-243" aria-label="Sélection moneymanagementfiltersheader"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-3 py-2 rounded-xl border text-xs"
        style={{ borderColor: C.line }}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </FilterField>
  );
}
