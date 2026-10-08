import { useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChevronRight, X } from 'lucide-react';
import { convertCurrency, fmt, FX, toRef } from '../../shared/lib/finance';
import { C, F_BODY, F_DISPLAY, F_MONO, PALETTE } from '../../shared/theme/theme';
import { Badge, Btn, Card, Eyebrow, Pct, Td, Th } from '../../shared/ui/UiAtoms';
import { Breadcrumb } from '../../shared/ui/Navigation';
import { AvailableWithdrawalsModal } from '../../shared/ui/AvailableWithdrawalsModal';
import { Donut, HistoryLegend, Legende, MarketTicker } from './HomeWidgets';
import {
  CLIENTS,
  PROFILE_TYPE_LABEL,
  VOLUME_JOUR,
  aggregateEncoursBy,
} from '../portfolio/PortfolioUniverse';
import {
  HISTORICAL_EVENT_TYPES,
  HISTORIQUE_TRIMESTRIEL_PORTEFEUILLES,
  HistoricalEventsTooltipBlock,
  renderHistoricalEventDot,
  SECTOR_MIX,
  buildAssetMix,
  buildHistoryTwr,
  historicalEventColor,
} from '../portfolio/PortfolioAnalyticsData';
import { ALERTES, expositionClient } from '../trading/TradingDomainData';
import { MARKETS_DATA } from '../markets/MarketDomainData';
import {
  CESSION_RETRAIT_STATUTS,
  cessionRetraitStatusTone,
} from '../trading/CessionWorkflow';

/*
 * Accueil synchronisé depuis origin/main sans réintroduire App.jsx.
 */
function Accueil({
  go,
  openClient,
  devise,
  onDeviseChange,
  cessionRetraitEtats = /** @type {Array<Record<string, unknown>>} */ ([]),
}) {
  const [dim, setDim] = useState('Profil de risque');
  const [genClient, setGenClient] = useState(CLIENTS[0].id);
  const [reportPeriod, setReportPeriod] = useState('Trimestre en cours');
  const [allReports, setAllReports] = useState(false);
  const [devBourse, setDevBourse] = useState({
    BRVM: 'XOF',
    NGX: 'NGN',
    GSE: 'GHS',
  });
  const [selection, setSelection] = useState(null);
  const [retraitsDisponiblesOuverts, setRetraitsDisponiblesOuverts] =
    useState(false);
  const [seuilExpo, setSeuilExpo] = useState(0);
  const [rechercheClient, setRechercheClient] = useState('');
  const [profilHistoriquePortefeuilles, setProfilHistoriquePortefeuilles] =
    useState('Global');
  const [historyVisibility, setHistoryVisibility] = useState({
    gestionTwr: true,
    brvm: true,
    ngxAsi: true,
  });
  const toggleHistorySeries = (dataKey) => {
    setHistoryVisibility((current) => ({
      ...current,
      [dataKey]: !current[dataKey],
    }));
  };
  const profileTypeMixAccueil = aggregateEncoursBy(
    (client) => PROFILE_TYPE_LABEL[client.type] || client.type,
    CLIENTS
  );
  const riskProfileMixAccueil = aggregateEncoursBy(
    (client) => client.profilRisque,
    CLIENTS
  );
  const assetMixAccueil = buildAssetMix(CLIENTS);
  const marketMixAccueil = aggregateEncoursBy(
    (client) => `${client.marche} (${client.devise})`,
    CLIENTS
  );
  const countryMixAccueil = aggregateEncoursBy(
    (client) => client.pays,
    CLIENTS
  );

  const dims = {
    'Profil de risque': riskProfileMixAccueil,
    "Type d'actif": assetMixAccueil,
    'Marché boursier': marketMixAccueil,
    Pays: countryMixAccueil,
    Secteur: SECTOR_MIX,
    'Type de portefeuille': profileTypeMixAccueil,
  };
  const totalRef = CLIENTS.reduce(
    (s, c) => s + convertCurrency(c.encours, c.devise, devise),
    0
  );

  const repartitionCourante = dims[dim].map((element) => ({
    ...element,
    montant: (totalRef * element.value) / 100,
    devise,
  }));

  const profilsRisqueAccueil = [
    'Équilibré',
    'Prudence',
    'Performance',
    'Croissance',
    'Sérénité',
  ];

  const statistiquesProfilsAccueil = profilsRisqueAccueil.map((profil) => {
    const portefeuilles = CLIENTS.filter((c) => c.profilRisque === profil);
    const encoursProfil = portefeuilles.reduce(
      (s, c) => s + convertCurrency(c.encours, c.devise, devise),
      0
    );
    const variationEncoursPonderee =
      encoursProfil > 0
        ? portefeuilles.reduce(
            (s, c) =>
              s +
              convertCurrency(c.encours, c.devise, devise) *
                Number(c.perf || 0),
            0
          ) / encoursProfil
        : 0;
    const rendementPondere =
      encoursProfil > 0
        ? portefeuilles.reduce(
            (s, c) =>
              s +
              convertCurrency(c.encours, c.devise, devise) *
                Number(c.rentabilite || 0),
            0
          ) / encoursProfil
        : 0;

    return {
      profil,
      nombre: portefeuilles.length,
      encoursProfil,
      variationEncoursPonderee,
      rendementPondere,
    };
  });

  const historiqueNombrePortefeuilles =
    HISTORIQUE_TRIMESTRIEL_PORTEFEUILLES.map(({ trimestre, fin }) => {
      const portefeuillesActifs = CLIENTS.filter(
        (client) => !client.dateEntree || client.dateEntree <= fin
      );
      const ligne = { trimestre, Global: portefeuillesActifs.length };
      profilsRisqueAccueil.forEach((profil) => {
        ligne[profil] = portefeuillesActifs.filter(
          (client) => client.profilRisque === profil
        ).length;
      });
      return ligne;
    });

  const serieHistoriquePortefeuilles = historiqueNombrePortefeuilles.map(
    (ligne) => ({
      trimestre: ligne.trimestre,
      nombre: ligne[profilHistoriquePortefeuilles] || 0,
    })
  );
  const premierPointHistoriquePortefeuilles =
    serieHistoriquePortefeuilles[0]?.nombre || 0;
  const dernierPointHistoriquePortefeuilles =
    serieHistoriquePortefeuilles[serieHistoriquePortefeuilles.length - 1]
      ?.nombre || 0;
  const croissanceHistoriquePortefeuilles =
    dernierPointHistoriquePortefeuilles - premierPointHistoriquePortefeuilles;

  const variationEncoursPondereeGlobale =
    totalRef > 0
      ? CLIENTS.reduce(
          (s, c) =>
            s +
            convertCurrency(c.encours, c.devise, devise) * Number(c.perf || 0),
          0
        ) / totalRef
      : 0;

  const rendementMoyenPondereGlobal =
    totalRef > 0
      ? CLIENTS.reduce(
          (s, c) =>
            s +
            convertCurrency(c.encours, c.devise, devise) *
              Number(c.rentabilite || 0),
          0
        ) / totalRef
      : 0;

  const historiquePerformance = buildHistoryTwr(totalRef, devise);
  const dernierHistorique =
    historiquePerformance[historiquePerformance.length - 1] || {};
  const performanceGestionTwr =
    Number(dernierHistorique.gestionTwr || 100) - 100;
  const performanceBrvm = Number(dernierHistorique.brvm || 100) - 100;
  const performanceNgx = Number(dernierHistorique.ngxAsi || 100) - 100;
  const fluxNetHistorique = historiquePerformance.reduce(
    (somme, point) => somme + Number(point.fluxNet || 0),
    0
  );

  const typesAlertesAccueil = ['Rendement', 'Risque', 'Allocation'];
  const statistiquesAlertesAccueil = typesAlertesAccueil.map((type) => ({
    type,
    nombre: ALERTES.filter((alerte) => alerte.type === type).length,
  }));
  const totalAlertes = statistiquesAlertesAccueil.reduce(
    (somme, stat) => somme + stat.nombre,
    0
  );

  const statistiquesCessionRetraitAccueil = CESSION_RETRAIT_STATUTS.map(
    (statut) => ({
      statut,
      nombre: cessionRetraitEtats.filter((item) => item.statut === statut)
        .length,
    })
  );
  const totalCessionRetraitActifs = cessionRetraitEtats.filter(
    (item) => item.statut !== 'Retrait disponible'
  ).length;
  const retraitsDisponiblesAccueil = cessionRetraitEtats.filter(
    (item) => item.statut === 'Retrait disponible'
  );

  return (
    <div className="space-y-6">
      <Breadcrumb items={['Accueil']} />

      <MarketTicker
        markets={MARKETS_DATA}
        onViewAll={() => go('vue-boursiere')}
        onInstrumentClick={(m) =>
          go('instrument-analysis', {
            marche: m.marche,
            instrument: m.nom,
            source: 'accueil-ticker',
          })
        }
      />

      <div className="flex items-center justify-end gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: C.sub }}>
            Devise d'affichage du site
          </span>
          <select name="gsm-homemainscreen-266" aria-label="Sélection homemainscreen"
            value={devise}
            onChange={(e) => onDeviseChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl border text-sm"
            style={{ borderColor: C.line }}
          >
            {Object.keys(FX).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 items-stretch">
        <Card className="p-4">
          <div
            className="text-xs font-medium"
            style={{ color: C.sub, ...F_BODY }}
          >
            Encours total (éq. {devise})
          </div>

          <div className="flex items-end justify-between gap-2 mt-1">
            <div
              className="text-2xl font-bold"
              style={{ ...F_DISPLAY, color: C.ink }}
            >
              {fmt(Math.round(totalRef))} {devise}
            </div>
            <span className="text-[11px]" style={{ color: C.sub, ...F_BODY }}>
              Global
            </span>
          </div>

          <div className="mt-1">
            <Pct v={variationEncoursPondereeGlobale} />
          </div>

          <div
            className="mt-3 pt-3 space-y-1.5"
            style={{ borderTop: `1px solid ${C.line}` }}
          >
            {statistiquesProfilsAccueil.map((stat) => (
              <div
                key={stat.profil}
                className="flex items-start justify-between gap-2 text-xs"
                style={F_BODY}
              >
                <span style={{ color: C.sub }}>{stat.profil}</span>
                <span className="flex flex-col items-end min-w-0">
                  <span
                    className="text-[10px] font-semibold whitespace-nowrap"
                    style={{ color: C.ink, ...F_MONO }}
                  >
                    {fmt(Math.round(stat.encoursProfil))} {devise}
                  </span>
                  <Pct v={stat.variationEncoursPonderee} />
                </span>
              </div>
            ))}
          </div>
        </Card>

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
              {CLIENTS.length}
            </div>
            <span className="text-[11px]" style={{ color: C.sub, ...F_BODY }}>
              Global
            </span>
          </div>

          <div
            className="mt-3 pt-3 space-y-1.5"
            style={{ borderTop: `1px solid ${C.line}` }}
          >
            {statistiquesProfilsAccueil.map((stat) => (
              <div
                key={stat.profil}
                className="flex items-center justify-between gap-2 text-xs"
                style={F_BODY}
              >
                <span style={{ color: C.sub }}>{stat.profil}</span>
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
              <select name="gsm-homemainscreen-387"
                value={profilHistoriquePortefeuilles}
                onChange={(e) =>
                  setProfilHistoriquePortefeuilles(e.target.value)
                }
                className="max-w-[110px] px-1.5 py-1 rounded-lg border text-[9px]"
                style={{ borderColor: C.line, color: C.ink, ...F_BODY }}
                aria-label="Profil affiché dans l'historique des portefeuilles"
              >
                <option>Global</option>
                {profilsRisqueAccueil.map((profil) => (
                  <option key={profil}>{profil}</option>
                ))}
              </select>
            </div>

            <ResponsiveContainer width="100%" height={86}>
              <LineChart
                data={serieHistoriquePortefeuilles}
                margin={{ top: 5, right: 4, left: 4, bottom: 0 }}
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
                    `${value} portefeuille(s)`,
                    profilHistoriquePortefeuilles,
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
              <span>{profilHistoriquePortefeuilles}</span>
              <span style={F_MONO}>
                {dernierPointHistoriquePortefeuilles} actuellement ·{' '}
                {croissanceHistoriquePortefeuilles >= 0 ? '+' : ''}
                {croissanceHistoriquePortefeuilles} sur 2 ans
              </span>
            </div>
          </div>

          <div className="text-[10px] mt-2" style={{ color: C.sub, ...F_BODY }}>
            3 marchés · 3 devises · 5 profils de risque
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div
              className="text-xs font-medium"
              style={{ color: C.sub, ...F_BODY }}
            >
              Alertes actives
            </div>
            <button
              onClick={() => go('alertes')}
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
              {totalAlertes}
            </div>
            <span className="text-[11px]" style={{ color: C.sub, ...F_BODY }}>
              Total
            </span>
          </div>

          <div
            className="mt-3 pt-3 space-y-1.5"
            style={{ borderTop: `1px solid ${C.line}` }}
          >
            {statistiquesAlertesAccueil.map((stat) => (
              <div
                key={stat.type}
                className="flex items-center justify-between gap-2 text-xs"
                style={F_BODY}
              >
                <span style={{ color: C.sub }}>{stat.type}</span>
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
                <div className="text-[9px] mt-0.5" style={{ color: C.sub }}>
                  {totalCessionRetraitActifs} dossier(s) en traitement
                </div>
              </div>
              <button
                type="button"
                onClick={() => go('cession-retrait')}
                className="text-[10px] font-semibold whitespace-nowrap"
                style={{ color: C.indigo }}
              >
                Voir →
              </button>
            </div>

            <div className="space-y-1.5">
              {statistiquesCessionRetraitAccueil.map((stat) =>
                stat.statut === 'Retrait disponible' ? (
                  <button
                    type="button"
                    key={stat.statut}
                    disabled={stat.nombre === 0}
                    onClick={() => setRetraitsDisponiblesOuverts(true)}
                    className="w-full flex items-center justify-between gap-2 text-[11px] rounded-lg px-2 py-1.5 transition-colors"
                    style={{
                      background: stat.nombre > 0 ? C.positiveBackground : 'transparent',
                      cursor: stat.nombre > 0 ? 'pointer' : 'default',
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
                      style={{ color: stat.nombre > 0 ? C.teal : C.sub }}
                    >
                      {stat.statut}
                      {stat.nombre > 0 && <ChevronRight size={12} />}
                    </span>
                    <Badge tone={cessionRetraitStatusTone(stat.statut)}>
                      {stat.nombre}
                    </Badge>
                  </button>
                ) : (
                  <div
                    key={stat.statut}
                    className="flex items-center justify-between gap-2 text-[11px] px-2 py-1.5"
                  >
                    <span style={{ color: C.sub }}>{stat.statut}</span>
                    <Badge tone={cessionRetraitStatusTone(stat.statut)}>
                      {stat.nombre}
                    </Badge>
                  </div>
                )
              )}
            </div>

          </div>
        </Card>

        <AvailableWithdrawalsModal
          open={retraitsDisponiblesOuverts}
          items={retraitsDisponiblesAccueil}
          onClose={() => setRetraitsDisponiblesOuverts(false)}
          onOpenClient={openClient}
          onOpenWithdrawals={() => go('cession-retrait')}
        />

        <Card className="p-4">
          <div
            className="text-xs font-medium"
            style={{ color: C.sub, ...F_BODY }}
          >
            Rentabilité moyenne pondérée (1 an)
          </div>
          <div className="flex items-end justify-between gap-2 mt-1">
            <div className="text-xl font-bold" style={F_DISPLAY}>
              <Pct v={rendementMoyenPondereGlobal} />
            </div>
            <span className="text-[11px]" style={{ color: C.sub, ...F_BODY }}>
              Global
            </span>
          </div>

          <div
            className="mt-3 pt-3 space-y-1.5"
            style={{ borderTop: `1px solid ${C.line}` }}
          >
            {statistiquesProfilsAccueil.map((stat) => (
              <div
                key={stat.profil}
                className="flex items-center justify-between gap-2 text-xs"
                style={F_BODY}
              >
                <span style={{ color: C.sub }}>{stat.profil}</span>
                <span>
                  <Pct v={stat.rendementPondere} />
                </span>
              </div>
            ))}
          </div>

          <div className="text-[10px] mt-2" style={{ color: C.sub, ...F_BODY }}>
            Pondération par les encours convertis en {devise}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Eyebrow>Répartition de l'encours</Eyebrow>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {Object.keys(dims).map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDim(d);
                  setSelection(null);
                }}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: dim === d ? C.navySoft : C.card,
                  color: dim === d ? C.ink : C.sub,
                  border: `1px solid ${dim === d ? C.indigo : C.line}`,
                  ...F_BODY,
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 flex flex-col items-center">
            <Donut data={repartitionCourante} size={170} />
          </div>
          <div className="col-span-1">
            <Legende data={repartitionCourante} />
          </div>
          <div
            className="col-span-2 border-l pl-5"
            style={{ borderColor: C.line }}
          >
            {!selection && (
              <>
                <div
                  className="text-xs mb-2"
                  style={{ color: C.sub, ...F_BODY }}
                >
                  Cliquez une part pour voir le détail par portefeuille.
                </div>
                <div className="flex flex-wrap gap-2">
                  {repartitionCourante.map((d, i) => (
                    <button
                      key={d.name}
                      onClick={() =>
                        setSelection({ dimension: dim, value: d.name })
                      }
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium text-left transition-transform active:scale-[0.98]"
                      style={{
                        borderColor: C.line,
                        background: C.card,
                        cursor: 'pointer',
                        ...F_BODY,
                      }}
                      title={`Voir le détail ${d.name}`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: PALETTE[i % PALETTE.length] }}
                      />
                      <span>
                        <span className="block">
                          {d.name} · {d.value}%
                        </span>
                        <span
                          className="block text-[10px] font-semibold mt-0.5"
                          style={{ color: C.sub, ...F_MONO }}
                        >
                          {fmt(Math.round(d.montant))} {d.devise}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {selection &&
              (() => {
                const allExpo = CLIENTS.map((c) => ({
                  client: c,
                  expo: expositionClient(
                    c,
                    selection.dimension,
                    selection.value
                  ),
                }));
                const totalValeurRef = allExpo.reduce(
                  (s, r) => s + toRef(r.expo.valeur, r.client.devise),
                  0
                );
                const rows = allExpo
                  .filter((r) => r.expo.pct > 0 && r.expo.pct >= seuilExpo)
                  .filter((r) =>
                    r.client.nom
                      .toLowerCase()
                      .includes(rechercheClient.toLowerCase())
                  )
                  .sort((a, b) => b.expo.pct - a.expo.pct);
                return (
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge tone="gold">
                          {selection.dimension} : {selection.value}
                        </Badge>
                        {(() => {
                          const elementSelectionne = repartitionCourante.find(
                            (element) => element.name === selection.value
                          );
                          return elementSelectionne ? (
                            <Badge tone="navy">
                              {elementSelectionne.value}% ·{' '}
                              {fmt(Math.round(elementSelectionne.montant))}{' '}
                              {elementSelectionne.devise}
                            </Badge>
                          ) : null;
                        })()}
                      </div>
                      <button
                        onClick={() => setSelection(null)}
                        className="text-xs font-semibold"
                        style={{ color: C.sub }}
                      >
                        Retour aux parts{' '}
                        <X size={12} style={{ display: 'inline' }} />
                      </button>
                    </div>
                    <div className="flex items-end gap-3 mb-3 flex-wrap">
                      <div>
                        <label
                          className="text-xs font-semibold block mb-1"
                          style={{ color: C.sub }}
                        >
                          Seuil d'allocation min. (%)
                        </label>
                        <input name="gsm-homemainscreen-910" aria-label="Champ homemainscreen"
                          type="number"
                          min="0"
                          max="100"
                          value={seuilExpo}
                          onChange={(e) => setSeuilExpo(Number(e.target.value))}
                          className="w-28 px-2 py-1.5 rounded-lg border text-xs"
                          style={{ borderColor: C.line, ...F_MONO }}
                        />
                      </div>
                      <div className="flex-1 min-w-[140px]">
                        <label
                          className="text-xs font-semibold block mb-1"
                          style={{ color: C.sub }}
                        >
                          Nom du client
                        </label>
                        <input name="gsm-homemainscreen-927" aria-label="Rechercher…"
                          type="text"
                          value={rechercheClient}
                          onChange={(e) => setRechercheClient(e.target.value)}
                          placeholder="Rechercher…"
                          className="w-full px-2 py-1.5 rounded-lg border text-xs"
                          style={{ borderColor: C.line, ...F_BODY }}
                        />
                      </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto pr-1">
                      {selection.dimension === 'Profil de risque' ? (
                        <table className="w-full">
                          <thead style={{ background: C.navySoft }}>
                            <tr>
                              <Th>Client</Th>
                              <Th>Exposition Actions</Th>
                              <Th>Exposition Obligation</Th>
                              <Th>Allocation</Th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.length === 0 && (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="text-center text-xs py-4"
                                  style={{ color: C.sub }}
                                >
                                  Aucun portefeuille ne correspond à ce profil.
                                </td>
                              </tr>
                            )}
                            {rows.map(({ client, expo }) => {
                              const expositionActions = Number(
                                client.alloc.Actions || 0
                              );
                              const expositionObligations =
                                Number(client.alloc['Obl. souveraines'] || 0) +
                                Number(client.alloc['Obl. privées'] || 0);
                              const allocationProfil =
                                totalValeurRef > 0
                                  ? (toRef(expo.valeur, client.devise) /
                                      totalValeurRef) *
                                    100
                                  : 0;

                              return (
                                <tr
                                  key={client.id}
                                  style={{ borderTop: `1px solid ${C.line}` }}
                                >
                                  <Td className="font-semibold">
                                    {client.nom}
                                  </Td>
                                  <Td mono>{expositionActions.toFixed(1)}%</Td>
                                  <Td mono>
                                    {expositionObligations.toFixed(1)}%
                                  </Td>
                                  <Td mono>{allocationProfil.toFixed(1)}%</Td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <table className="w-full">
                          <thead style={{ background: C.navySoft }}>
                            <tr>
                              <Th>Client</Th>
                              <Th>Exposition</Th>
                              <Th>Valeur</Th>
                              <Th>Allocation</Th>
                              <Th>Profil risque</Th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.length === 0 && (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="text-center text-xs py-4"
                                  style={{ color: C.sub }}
                                >
                                  Aucun portefeuille ne correspond à ces
                                  critères.
                                </td>
                              </tr>
                            )}
                            {rows.map(({ client, expo }) => (
                              <tr
                                key={client.id}
                                style={{ borderTop: `1px solid ${C.line}` }}
                              >
                                <Td className="font-semibold">{client.nom}</Td>
                                <Td mono>{expo.pct.toFixed(1)}%</Td>
                                <Td mono>
                                  {fmt(expo.valeur)} {client.devise}
                                </Td>
                                <Td mono>
                                  {totalValeurRef > 0
                                    ? (
                                        (toRef(expo.valeur, client.devise) /
                                          totalValeurRef) *
                                        100
                                      ).toFixed(1)
                                    : '0.0'}
                                  %
                                </Td>
                                <Td>
                                  <Badge tone="slate">
                                    {client.profilRisque}
                                  </Badge>
                                </Td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                );
              })()}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-5">
          <div className="flex items-start justify-between mb-3 gap-3 flex-wrap">
            <div>
              <Eyebrow>Historique de l'encours</Eyebrow>
              <div className="text-xs" style={{ color: C.sub }}>
                Performance de la gestion neutralisée des dépôts et retraits
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Badge tone="navy">Base 100 · méthode TWR</Badge>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              {
                label: 'Gestion TWR',
                value: `${
                  performanceGestionTwr >= 0 ? '+' : ''
                }${performanceGestionTwr.toFixed(1)}%`,
                color: performanceGestionTwr >= 0 ? C.teal : C.coral,
              },
              {
                label: 'BRVM Composite',
                value: `${
                  performanceBrvm >= 0 ? '+' : ''
                }${performanceBrvm.toFixed(1)}%`,
                color: C.gold,
              },
              {
                label: 'NGX ASI',
                value: `${
                  performanceNgx >= 0 ? '+' : ''
                }${performanceNgx.toFixed(1)}%`,
                color: C.teal,
              },
              {
                label: 'Flux clients nets',
                value: `${fluxNetHistorique >= 0 ? '+' : '-'}${fmt(
                  Math.abs(fluxNetHistorique)
                )} ${devise}`,
                color: C.sub,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border p-2.5"
                style={{ borderColor: C.line, background: C.navySoft }}
              >
                <div
                  className="text-[9px] uppercase font-semibold"
                  style={{ color: C.sub }}
                >
                  {stat.label}
                </div>
                <div
                  className="text-sm font-bold mt-1"
                  style={{ color: stat.color, ...F_MONO }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div
            className="flex items-center gap-3 flex-wrap mb-3 text-[10px]"
            style={{ color: C.sub }}
          >
            <span>
              Écart vs BRVM :{' '}
              <b
                style={{
                  color:
                    performanceGestionTwr - performanceBrvm >= 0
                      ? C.teal
                      : C.coral,
                  ...F_MONO,
                }}
              >
                {performanceGestionTwr - performanceBrvm >= 0 ? '+' : ''}
                {(performanceGestionTwr - performanceBrvm).toFixed(1)} pt
              </b>
            </span>
            <span>·</span>
            <span>
              Écart vs NGX :{' '}
              <b
                style={{
                  color:
                    performanceGestionTwr - performanceNgx >= 0
                      ? C.teal
                      : C.coral,
                  ...F_MONO,
                }}
              >
                {performanceGestionTwr - performanceNgx >= 0 ? '+' : ''}
                {(performanceGestionTwr - performanceNgx).toFixed(1)} pt
              </b>
            </span>
          </div>

          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={historiquePerformance}>
              <CartesianGrid stroke={C.line} vertical={false} />
              <XAxis
                dataKey="mois"
                tick={{ fontSize: 11, fill: C.sub }}
                axisLine={{ stroke: C.line }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: C.sub }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 2', 'dataMax + 2']}
                tickFormatter={(value) => Number(value).toFixed(0)}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const point = payload[0]?.payload;
                  if (!point) return null;
                  const fluxLabel =
                    point.fluxNet > 0
                      ? 'Dépôt net'
                      : point.fluxNet < 0
                      ? 'Retrait net'
                      : 'Flux client';
                  return (
                    <div
                      className="rounded-xl border p-3 text-xs shadow-sm"
                      style={{
                        background: C.card,
                        borderColor: C.line,
                        ...F_BODY,
                      }}
                    >
                      <div className="font-bold mb-2" style={{ color: C.ink }}>
                        {label}
                      </div>
                      <div className="space-y-1" style={{ color: C.sub }}>
                        <div>
                          Gestion TWR :{' '}
                          <b style={{ color: C.navy, ...F_MONO }}>
                            {Number(point.gestionTwr).toFixed(2)}
                          </b>
                        </div>
                        <div>
                          BRVM Composite :{' '}
                          <b style={{ color: C.gold, ...F_MONO }}>
                            {Number(point.brvm).toFixed(2)}
                          </b>
                        </div>
                        <div>
                          NGX ASI :{' '}
                          <b style={{ color: C.teal, ...F_MONO }}>
                            {Number(point.ngxAsi).toFixed(2)}
                          </b>
                        </div>
                        <div
                          className="pt-1 mt-1"
                          style={{ borderTop: `1px solid ${C.line}` }}
                        >
                          Encours brut :{' '}
                          <b style={{ color: C.ink, ...F_MONO }}>
                            {fmt(point.encoursBrut)} {devise}
                          </b>
                        </div>
                        <div>
                          {fluxLabel} :{' '}
                          <b
                            style={{
                              color: point.fluxNet >= 0 ? C.teal : C.coral,
                              ...F_MONO,
                            }}
                          >
                            {point.fluxNet >= 0 ? '+' : '-'}
                            {fmt(Math.abs(point.fluxNet))} {devise}
                          </b>
                        </div>

                        <HistoricalEventsTooltipBlock
                          evenements={point.evenements}
                          devise={devise}
                        />
                      </div>
                    </div>
                  );
                }}
              />
              {historyVisibility.gestionTwr && (
                <Line
                  type="monotone"
                  dataKey="gestionTwr"
                  name="Gestion globale (TWR)"
                  stroke={C.navy}
                  strokeWidth={2.8}
                  dot={renderHistoricalEventDot}
                  activeDot={{ r: 7 }}
                />
              )}
              {historyVisibility.brvm && (
                <Line
                  type="monotone"
                  dataKey="brvm"
                  name="BRVM Composite"
                  stroke={C.gold}
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="4 3"
                />
              )}
              {historyVisibility.ngxAsi && (
                <Line
                  type="monotone"
                  dataKey="ngxAsi"
                  name="NGX ASI"
                  stroke={C.teal}
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="4 3"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
          <HistoryLegend
            visibility={historyVisibility}
            onToggle={toggleHistorySeries}
          />
          <div
            className="flex items-center gap-4 flex-wrap mt-2 text-[9px]"
            style={{ color: C.sub }}
          >
            {HISTORICAL_EVENT_TYPES.map((type) => (
              <span key={type} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border-2"
                  style={{
                    borderColor: historicalEventColor(type),
                    background: C.card,
                  }}
                />
                {type}
              </span>
            ))}
            <span>Survolez un point pour voir le résumé des mouvements.</span>
          </div>
          <div
            className="mt-3 rounded-xl px-3 py-2 text-[10px]"
            style={{ background: C.navySoft, color: C.sub, ...F_BODY }}
          >
            <b style={{ color: C.ink }}>Lecture :</b> la courbe « Gestion
            globale (TWR) » mesure uniquement la performance de gestion. Les
            points signalent les dépôts, retraits, coupons et dividendes reçus
            pendant chaque période. Dépôts et retraits sont neutralisés dans le
            calcul du TWR ; coupons et dividendes restent des revenus de
            portefeuille. En production, ces marqueurs seront alimentés par les
            mouvements et revenus réellement comptabilisés.
          </div>
        </Card>

        <Card className="p-5">
          <Eyebrow>Rapport d'analyse client</Eyebrow>
          <div className="text-xs mb-3" style={{ color: C.sub, ...F_BODY }}>
            Situation globale, mouvements et commentaire de rendement sur
            période.
          </div>
          <label
            className="text-xs font-semibold block mb-1"
            style={{ color: C.sub }}
          >
            Client
          </label>
          <select name="gsm-homemainscreen-1329" aria-label="Sélection homemainscreen"
            value={genClient}
            onChange={(e) => setGenClient(e.target.value)}
            className="w-full mb-2 px-3 py-2 rounded-xl border text-sm"
            style={{ borderColor: C.line, ...F_BODY }}
          >
            {CLIENTS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
          <label
            className="text-xs font-semibold block mb-1"
            style={{ color: C.sub }}
          >
            Période
          </label>
          <select name="gsm-homemainscreen-1347" aria-label="Sélection homemainscreen"
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="w-full mb-4 px-3 py-2 rounded-xl border text-sm"
            style={{ borderColor: C.line, ...F_BODY }}
          >
            <option>Trimestre en cours</option>
            <option>Année en cours</option>
            <option>Personnalisée</option>
          </select>
          <div className="flex items-center gap-2">
            <Btn onClick={() => openClient(genClient, true, reportPeriod)}>
              Générer le rapport
            </Btn>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Eyebrow>Volume d'échange du jour — marchés</Eyebrow>
          <span className="text-xs" style={{ color: C.sub }}>
            Devise d'affichage réglable par bourse
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {['BRVM', 'NGX', 'GSE'].map((bourse) => {
            const action = VOLUME_JOUR.find(
              (v) => v.marche === bourse && v.type === 'Action'
            );
            const oblig = VOLUME_JOUR.find(
              (v) => v.marche === bourse && v.type === 'Obligation'
            );
            const dev = devBourse[bourse];
            return (
              <div
                key={bourse}
                className="p-3 rounded-xl border"
                style={{ borderColor: C.line }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge tone="navy">{bourse}</Badge>
                  <select name="gsm-homemainscreen-1389" aria-label="Sélection homemainscreen"
                    value={dev}
                    onChange={(e) =>
                      setDevBourse({ ...devBourse, [bourse]: e.target.value })
                    }
                    className="text-xs px-2 py-1 rounded-lg border"
                    style={{ borderColor: C.line }}
                  >
                    {Object.keys(FX).map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="text-xs" style={{ color: C.sub }}>
                  Actions
                </div>
                <div className="font-semibold text-sm mb-2" style={F_MONO}>
                  {fmt(
                    Math.round(
                      convertCurrency(action.volume, action.devise, dev)
                    )
                  )}{' '}
                  {dev}
                </div>
                <div className="text-xs" style={{ color: C.sub }}>
                  Obligations
                </div>
                <div className="font-semibold text-sm" style={F_MONO}>
                  {fmt(
                    Math.round(convertCurrency(oblig.volume, oblig.devise, dev))
                  )}{' '}
                  {dev}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export { Accueil };
