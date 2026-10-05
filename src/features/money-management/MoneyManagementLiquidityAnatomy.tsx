import { convertCurrency, fmt } from '../../shared/lib/finance';
import { Donut, Legende } from '../home/HomeWidgets';
import { Badge, Card, Eyebrow, Pct } from '../../shared/ui/UiAtoms';
import { C, F_DISPLAY, F_MONO } from '../../shared/theme/theme';

type BadgeTone = 'slate' | 'gold' | 'teal' | 'coral' | 'navy';
export type LiquidityDetailView = 'origines' | 'affectations' | 'profil';

export interface LiquidityDetailClient {
  id: string;
  nom: string;
  marche: string;
  devise: string;
  profilRisque: string;
  encours: number;
}

export interface LiquidityOrigin {
  numero: string;
  libelle: string;
  description: string;
  responsable: string;
  montant: number;
}

export interface LiquidityAllocation {
  numero: string;
  libelle: string;
  groupe: string;
  responsable: string;
  montant: number;
}

export interface LiquidityAccountDetail {
  client: LiquidityDetailClient;
  statut: string;
  liquiditeActuelle: number;
  ratioCible: number;
  ratioPrevisionnel: number;
  dateDernierDepot: string;
  montantDernierDepot: number;
  origines: LiquidityOrigin[];
  affectations: LiquidityAllocation[];
  totalOrigines: number;
  liquiditeBloquee: number;
  autreLiquiditeAInvestir: number;
  liquiditeDisponibleNette: number;
  ecartActions: number;
  ecartObligations: number;
  montantCorrectionActions: number;
  montantCorrectionObligations: number;
  rendement: number;
}

export function MoneyManagementLiquidityAnatomy({
  currency,
  minDate,
  maxDate,
  situationDate,
  situationLabel,
  accountCount,
  filteredDetails,
  selectedDetail,
  view,
  canExport,
  statusTone,
  roleTone,
  onSituationDateChange,
  onUseCurrentSituation,
  onSelectClient,
  onViewChange,
  onExportPdf,
  onExportExcel,
}: {
  currency: string;
  minDate: string;
  maxDate: string;
  situationDate: string;
  situationLabel: string;
  accountCount: number;
  filteredDetails: LiquidityAccountDetail[];
  selectedDetail: LiquidityAccountDetail | null;
  view: LiquidityDetailView;
  canExport: boolean;
  statusTone: (status: string) => BadgeTone;
  roleTone: (role: string) => BadgeTone;
  onSituationDateChange: (date: string) => void;
  onUseCurrentSituation: () => void;
  onSelectClient: (clientId: string) => void;
  onViewChange: (view: LiquidityDetailView) => void;
  onExportPdf: () => void;
  onExportExcel: () => void;
}) {
  return (
    <section className="space-y-3">
      <AnatomyToolbar
        minDate={minDate}
        maxDate={maxDate}
        situationDate={situationDate}
        situationLabel={situationLabel}
        accountCount={accountCount}
        canExport={canExport}
        onSituationDateChange={onSituationDateChange}
        onUseCurrentSituation={onUseCurrentSituation}
        onExportPdf={onExportPdf}
        onExportExcel={onExportExcel}
      />

      <div className="grid grid-cols-12 gap-4 items-start">
        <AccountSelector
          details={filteredDetails}
          selectedId={selectedDetail?.client.id ?? null}
          statusTone={statusTone}
          onSelect={onSelectClient}
        />

        <div className="col-span-8 space-y-3">
          {selectedDetail ? (
            <>
              <AccountSummary
                detail={selectedDetail}
                currency={currency}
                statusTone={statusTone}
              />
              <Card className="p-4">
                <ViewTabs view={view} onChange={onViewChange} />
                {view === 'origines' && (
                  <OriginsView detail={selectedDetail} roleTone={roleTone} />
                )}
                {view === 'affectations' && (
                  <AllocationsView detail={selectedDetail} roleTone={roleTone} />
                )}
                {view === 'profil' && <ProfileView detail={selectedDetail} />}
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center text-sm" style={{ color: C.sub }}>
              Sélectionnez un portefeuille pour afficher son anatomie de liquidité.
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}

function AnatomyToolbar({
  minDate,
  maxDate,
  situationDate,
  situationLabel,
  accountCount,
  canExport,
  onSituationDateChange,
  onUseCurrentSituation,
  onExportPdf,
  onExportExcel,
}: {
  minDate: string;
  maxDate: string;
  situationDate: string;
  situationLabel: string;
  accountCount: number;
  canExport: boolean;
  onSituationDateChange: (date: string) => void;
  onUseCurrentSituation: () => void;
  onExportPdf: () => void;
  onExportExcel: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <Eyebrow>2. Anatomie de la liquidité des comptes clients</Eyebrow>
      <div className="flex items-center gap-2 flex-wrap justify-end">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl border"
          style={{ borderColor: C.line, background: '#fff' }}
        >
          <label
            htmlFor="manager-liquidity-situation-date"
            className="text-[11px] font-semibold whitespace-nowrap"
            style={{ color: C.sub }}
          >
            Date de situation
          </label>
          <input
            id="manager-liquidity-situation-date"
            type="date"
            min={minDate}
            max={maxDate}
            value={situationDate}
            onChange={(event) => onSituationDateChange(event.target.value)}
            className="px-2 py-1 rounded-lg border text-xs"
            style={{ borderColor: C.line, color: C.ink, ...F_MONO }}
          />
          {situationDate !== maxDate && (
            <button
              type="button"
              onClick={onUseCurrentSituation}
              className="text-[10px] font-semibold whitespace-nowrap"
              style={{ color: C.navy }}
            >
              Situation actuelle
            </button>
          )}
        </div>
        <Badge tone="navy">Situation au {situationLabel}</Badge>
        <ExportButton disabled={!canExport} onClick={onExportPdf}>
          Exporter PDF
        </ExportButton>
        <ExportButton disabled={!canExport} onClick={onExportExcel} excel>
          Exporter Excel
        </ExportButton>
        <Badge tone="teal">Export consolidé · {accountCount} compte(s)</Badge>
        <Badge tone="gold">Excel : 2 feuilles · rubriques 1 à 26</Badge>
      </div>
    </div>
  );
}

function ExportButton({
  disabled,
  onClick,
  excel = false,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  excel?: boolean;
  children: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="px-3 py-2 rounded-xl border text-xs font-semibold transition-opacity"
      style={{
        borderColor: C.line,
        background: excel ? '#E4F5EF' : '#fff',
        color: excel ? C.teal : C.navy,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function AccountSelector({
  details,
  selectedId,
  statusTone,
  onSelect,
}: {
  details: LiquidityAccountDetail[];
  selectedId: string | null;
  statusTone: (status: string) => BadgeTone;
  onSelect: (clientId: string) => void;
}) {
  return (
    <Card className="col-span-4 p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <div className="text-sm font-bold" style={{ ...F_DISPLAY, color: C.ink }}>
            Comptes clients
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: C.sub }}>
            Sélectionnez un compte pour analyser la provenance et l'affectation de sa liquidité.
          </div>
        </div>
        <Badge tone="navy">{details.length}</Badge>
      </div>

      <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
        {details.length === 0 && (
          <div className="text-xs py-5 text-center" style={{ color: C.sub }}>
            Aucun compte ne correspond aux filtres.
          </div>
        )}

        {details.map((detail) => {
          const active = selectedId === detail.client.id;
          const mobilePercent =
            detail.liquiditeActuelle > 0
              ? ((detail.autreLiquiditeAInvestir + detail.liquiditeDisponibleNette) /
                  detail.liquiditeActuelle) *
                100
              : 0;

          return (
            <button
              key={detail.client.id}
              type="button"
              onClick={() => onSelect(detail.client.id)}
              className="w-full p-3 rounded-xl border text-left transition-colors"
              style={{
                borderColor: active ? C.navy : C.line,
                background: active ? '#EFF3FB' : '#fff',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate" style={{ color: C.ink }}>
                    {detail.client.nom}
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: C.sub }}>
                    {detail.client.marche} · {detail.client.profilRisque} · {detail.client.devise}
                  </div>
                </div>
                <Badge tone={statusTone(detail.statut)}>{detail.statut}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div>
                  <div className="text-[9px] uppercase font-semibold" style={{ color: C.sub }}>
                    Liquidité
                  </div>
                  <div className="text-[11px] font-semibold mt-0.5" style={F_MONO}>
                    {fmt(Math.round(detail.liquiditeActuelle))} {detail.client.devise}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] uppercase font-semibold" style={{ color: C.sub }}>
                    Mobilisable
                  </div>
                  <div className="text-[11px] font-semibold mt-0.5" style={{ ...F_MONO, color: C.teal }}>
                    {mobilePercent.toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="h-1.5 rounded-full mt-2" style={{ background: '#EEF0F4' }}>
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, mobilePercent)}%`, background: C.teal }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function AccountSummary({
  detail,
  currency,
  statusTone,
}: {
  detail: LiquidityAccountDetail;
  currency: string;
  statusTone: (status: string) => BadgeTone;
}) {
  const converted = convertCurrency(detail.liquiditeActuelle, detail.client.devise, currency);

  return (
    <Card className="p-4" style={{ borderColor: C.navy }}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-lg font-bold" style={{ ...F_DISPLAY, color: C.ink }}>
            {detail.client.nom}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge tone="navy">{detail.client.marche} · {detail.client.devise}</Badge>
            <Badge tone="slate">{detail.client.profilRisque}</Badge>
            <Badge tone={statusTone(detail.statut)}>{detail.statut}</Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase font-semibold" style={{ color: C.sub }}>
            Liquidité globale du compte (10)
          </div>
          <div className="text-xl font-bold mt-1" style={F_DISPLAY}>
            {fmt(Math.round(detail.liquiditeActuelle))} {detail.client.devise}
          </div>
          {detail.client.devise !== currency && (
            <div className="text-[10px] mt-0.5" style={{ color: C.sub, ...F_MONO }}>
              ≈ {fmt(Math.round(converted))} {currency}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4">
        <MiniMetric
          label="Dernier dépôt (2)"
          value={detail.dateDernierDepot}
          subValue={`${fmt(Math.round(detail.montantDernierDepot))} ${detail.client.devise}`}
          background="#F7F8FB"
          subColor={C.navy}
        />
        <MiniMetric
          label="Bloquée / réservée"
          value={`${fmt(detail.liquiditeBloquee)} ${detail.client.devise}`}
          background="#FBE9E7"
          labelColor={C.coral}
        />
        <MiniMetric
          label="Autre liquidité à investir (12)"
          value={`${fmt(detail.autreLiquiditeAInvestir)} ${detail.client.devise}`}
          background="#FBF1DD"
          labelColor="#8A6A16"
        />
        <MiniMetric
          label="Liquidité disponible (21)"
          value={`${fmt(detail.liquiditeDisponibleNette)} ${detail.client.devise}`}
          background="#E4F5EF"
          labelColor={C.teal}
        />
      </div>
    </Card>
  );
}

function MiniMetric({
  label,
  value,
  subValue,
  background,
  labelColor = C.sub,
  subColor = C.ink,
}: {
  label: string;
  value: string;
  subValue?: string;
  background: string;
  labelColor?: string;
  subColor?: string;
}) {
  return (
    <div className="p-3 rounded-xl" style={{ background }}>
      <div className="text-[9px] uppercase font-semibold" style={{ color: labelColor }}>{label}</div>
      <div className="text-xs font-bold mt-1" style={F_MONO}>{value}</div>
      {subValue && (
        <div className="text-[11px] font-bold mt-1" style={{ ...F_MONO, color: subColor }}>
          {subValue}
        </div>
      )}
    </div>
  );
}

function ViewTabs({
  view,
  onChange,
}: {
  view: LiquidityDetailView;
  onChange: (view: LiquidityDetailView) => void;
}) {
  const tabs: Array<[LiquidityDetailView, string]> = [
    ['origines', 'Origine des fonds · 1–10'],
    ['affectations', 'Bloquée & disponible · 11–21'],
    ['profil', 'Écart profil & rendement · 22–26'],
  ];

  return (
    <div className="flex gap-1.5 flex-wrap mb-4">
      {tabs.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className="px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: view === id ? C.navy : '#F0F1F5',
            color: view === id ? '#fff' : C.sub,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function OriginsView({
  detail,
  roleTone,
}: {
  detail: LiquidityAccountDetail;
  roleTone: (role: string) => BadgeTone;
}) {
  const chartData = detail.origines.map((item) => ({
    name: item.libelle,
    value:
      detail.totalOrigines > 0
        ? Number(((item.montant / detail.totalOrigines) * 100).toFixed(1))
        : 0,
    montant: item.montant,
    devise: detail.client.devise,
  }));

  return (
    <div className="grid grid-cols-5 gap-4 items-start">
      <div className="col-span-2">
        <Donut data={chartData} size={210} />
        <Legende data={chartData} />
      </div>
      <div className="col-span-3 grid grid-cols-2 gap-2">
        {detail.origines.map((item) => (
          <div key={item.numero} className="p-3 rounded-xl border" style={{ borderColor: C.line }}>
            <div className="flex items-start justify-between gap-2">
              <div className="text-[11px] font-bold" style={{ color: C.ink }}>
                {item.numero}. {item.libelle}
              </div>
              <Badge tone={roleTone(item.responsable)}>{item.responsable}</Badge>
            </div>
            <div className="text-sm font-bold mt-2" style={F_MONO}>
              {fmt(item.montant)} {detail.client.devise}
            </div>
            <div className="text-[9px] mt-1 leading-relaxed" style={{ color: C.sub }}>
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AllocationsView({
  detail,
  roleTone,
}: {
  detail: LiquidityAccountDetail;
  roleTone: (role: string) => BadgeTone;
}) {
  const totals = [
    ['Bloquée / réservée', detail.liquiditeBloquee, C.coral, '#FBE9E7'],
    ['À investir', detail.autreLiquiditeAInvestir, '#8A6A16', '#FBF1DD'],
    ['Disponible', detail.liquiditeDisponibleNette, C.teal, '#E4F5EF'],
  ] as const;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {totals.map(([label, amount, tone, bg]) => (
          <div key={label} className="p-3 rounded-xl" style={{ background: bg }}>
            <div className="text-[10px] uppercase font-semibold" style={{ color: tone }}>{label}</div>
            <div className="text-lg font-bold mt-1" style={{ ...F_DISPLAY, color: C.ink }}>
              {fmt(amount)} {detail.client.devise}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {detail.affectations.map((item) => {
          const pct =
            detail.liquiditeActuelle > 0
              ? (item.montant / detail.liquiditeActuelle) * 100
              : 0;
          const color =
            item.groupe === 'Disponible'
              ? C.teal
              : item.groupe === 'À investir'
              ? C.gold
              : C.coral;

          return (
            <div key={item.numero} className="p-3 rounded-xl border" style={{ borderColor: C.line }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] font-bold" style={{ color: C.ink }}>
                    {item.numero}. {item.libelle}
                  </div>
                  <div className="text-[9px] mt-0.5" style={{ color: C.sub }}>{item.groupe}</div>
                </div>
                <Badge tone={roleTone(item.responsable)}>{item.responsable}</Badge>
              </div>
              <div className="flex items-end justify-between gap-2 mt-2">
                <div className="text-sm font-bold" style={F_MONO}>
                  {fmt(item.montant)} {detail.client.devise}
                </div>
                <div className="text-[10px] font-semibold" style={{ color, ...F_MONO }}>
                  {pct.toFixed(1)}%
                </div>
              </div>
              <div className="h-1.5 rounded-full mt-2" style={{ background: '#EEF0F4' }}>
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, pct)}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfileView({ detail }: { detail: LiquidityAccountDetail }) {
  const gaps = [
    ['22 / 24', 'Actions', detail.ecartActions, detail.montantCorrectionActions],
    ['23 / 25', 'Obligations', detail.ecartObligations, detail.montantCorrectionObligations],
  ] as const;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {gaps.map(([number, asset, gap, amount]) => (
          <div key={asset} className="p-4 rounded-xl border" style={{ borderColor: C.line }}>
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-bold">{number}. Correction écart — {asset}</div>
              <Badge tone="teal">Système</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <div className="text-[9px] uppercase font-semibold" style={{ color: C.sub }}>
                  Écart à corriger
                </div>
                <div
                  className="text-xl font-bold mt-1"
                  style={{ ...F_DISPLAY, color: gap > 0 ? C.teal : gap < 0 ? C.coral : C.sub }}
                >
                  {gap > 0 ? '+' : ''}{gap.toFixed(1)} pts
                </div>
                <div className="text-[10px] mt-1" style={{ color: C.sub }}>
                  {gap > 0
                    ? `Renforcer ${asset.toLowerCase()}`
                    : gap < 0
                    ? `Réduire ${asset.toLowerCase()}`
                    : 'Allocation déjà alignée'}
                </div>
              </div>
              <div>
                <div className="text-[9px] uppercase font-semibold" style={{ color: C.sub }}>
                  Valeur correspondante
                </div>
                <div className="text-sm font-bold mt-2" style={F_MONO}>
                  {fmt(amount)} {detail.client.devise}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl" style={{ background: '#EFF3FB' }}>
          <div className="text-[10px] uppercase font-semibold" style={{ color: C.sub }}>
            26. Rendement du portefeuille
          </div>
          <div className="mt-1"><Pct v={detail.rendement} /></div>
          <div className="mt-2"><Badge tone="teal">Système</Badge></div>
        </div>
        <ProfileMetric label="Liquidité cible" value={`${detail.ratioCible.toFixed(1)}%`} />
        <ProfileMetric label="Liquidité prévisionnelle" value={`${detail.ratioPrevisionnel.toFixed(1)}%`} />
      </div>
    </div>
  );
}

function ProfileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl" style={{ background: '#F7F8FB' }}>
      <div className="text-[10px] uppercase font-semibold" style={{ color: C.sub }}>{label}</div>
      <div className="text-lg font-bold mt-1" style={F_DISPLAY}>{value}</div>
    </div>
  );
}
