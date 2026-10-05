'use client';

import { Component, createContext, useContext, useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import {
  Home,
  Briefcase,
  ListOrdered,
  FileCheck2,
  TrendingUp,
  Star,
  SlidersHorizontal,
  Filter,
  AlertTriangle,
  Scale,
  FileBarChart2,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Landmark,
  Building2,
  Sun,
  Moon,
  Activity,
  Droplets,
  BookOpen,
  Download,
  ExternalLink,
} from 'lucide-react';
import { convertCurrency, fmt, fmtCompactMontant, fmtPrice, FX, toRef } from './shared/lib/finance';
import { formatIsoLocalDate, parseIsoLocalDate } from './shared/lib/dateUtils';
import { C, FONTS, F_DISPLAY, F_BODY, F_MONO, PALETTE } from './shared/theme/theme';
import { Badge, Btn, Card, Eyebrow, Pct, Td, Th } from './shared/ui/UiAtoms';
import { Breadcrumb, NavigationContext } from './shared/ui/Navigation';
import { Donut, Legende, MarketTicker } from './features/home/HomeWidgets';
import { Accueil as AccueilScreen } from './features/home/Accueil';
import { Portefeuilles as PortefeuillesScreen } from './features/portfolio/Portefeuilles';
import { PortfolioOpeningPerformanceCard } from './features/portfolio/PortfolioOpeningPerformanceCard';
import { PortfolioReportNoticeCard } from './features/portfolio/PortfolioReportNoticeCard';
import { PortfolioAllocationAnalysis } from './features/portfolio/PortfolioAllocationAnalysis';
import { PortfolioListedAssetsCard } from './features/portfolio/PortfolioListedAssetsCard';
import { PortfolioActivityCards } from './features/portfolio/PortfolioActivityCards';
import { PortfolioDetailHeader } from './features/portfolio/PortfolioDetailHeader';
import { MoneyManagement as MoneyManagementScreen } from './features/money-management/MoneyManagement';
import {
  CessionRetrait as CessionRetraitScreen,
  Cession as CessionInterneScreen,
  CESSION_RETRAIT_ETATS_DEMO,
  CESSION_RETRAIT_REFERENCE_DATE,
  CESSION_RETRAIT_STATUTS,
  cessionRetraitStatusTone,
  cessionAttachNonListedPositions,
} from './features/trading/CessionWorkflow';
import { CarnetOrdres as CarnetOrdresScreen } from './features/trading/CarnetOrdres';
import { AvisOperes as AvisOperesScreen } from './features/trading/AvisOperes';
import { MarchesObligataires as MarchesObligatairesScreen } from './features/markets/MarchesObligataires';
import { WatchlistScreen } from './features/watchlist/Watchlist';
import { RecommandationsActionsScreen } from './features/allocation/RecommandationsActions';
import { RecommandationAllocationScreen } from './features/allocation/RecommandationAllocation';
import { AllocationParCriteresScreen } from './features/allocation/AllocationParCriteres';
import { AlertesScreen } from './features/alerts/Alertes';
import { createReequilibrageScreen } from './features/allocation/Reequilibrage';
import { createAnalysePortefeuilleScreen } from './features/portfolio/AnalysePortefeuille';
import { createComiteWorkflow } from './features/committee/ComiteWorkflow';
import { DocumentationScreen } from './features/documentation/Documentation';
import { createWatchlistModel, parsePctNumber } from './features/watchlist/WatchlistModel';
import { calculerAvis } from './features/trading/AvisOperesModel';
import { createClientOverviewScreens } from './features/clients/ClientOverviewScreens';
import { createClientTradingScreens } from './features/clients/ClientTradingScreens';
import { createClientDecisionScreens } from './features/clients/ClientDecisionScreens';
import { createClientAnalysisScreen } from './features/clients/ClientAnalysis';
import { createClientCashflowsScreen } from './features/clients/ClientCashflows';
import {
  LIQUIDITY_HISTORY_MIN_DATE,
  liquidityHistoricalAmount,
  buildAnatomieExportPayload,
  exportAnatomieExcel,
  exportAnatomiePdf,
  buildMoneyManagementConsolidatedExportPayload,
  exportMoneyManagementExcel,
  exportMoneyManagementPdf,
} from './features/money-management/LiquidityInfrastructure';
import {
  VOLUME_JOUR,
  CLIENTS_ORIGINAUX,
  PROFILS_PORTEFEUILLES_MODELES,
  DEVISE_PAR_MARCHE,
  PORTEFEUILLES_GENERES_SPECS,
  construirePortefeuilleGenere,
  CLIENTS_GENERES,
  DEVISES_INVESTISSEMENT,
  construireExpositionsDevises,
  CLIENTS_BRUTS,
  CLIENTS,
  replaceClients,
  PROFILE_TYPE_LABEL,
  PAYS_MARCHE,
  TITRE_SECTEUR,
  aggregateEncoursBy,
  PROFILE_TYPE_MIX,
  RISK_PROFILE_MIX,
  aggregateCurrencyExposure,
  CURRENCY_MIX,
  CORR_SECTEURS_LABELS,
  CORR_SECTEURS_HIST,
  CORR_SECTEURS_CRISE,
  CORR_PAYS_LABELS,
  CORR_PAYS_HIST,
  CORR_PAYS_CRISE,
  STRESS_SCENARIOS,
  UPCOMING_CASHFLOWS,
  parseFR,
  AUJOURDHUI,
  joursDepuisAujourdhui,
} from './features/portfolio/PortfolioUniverse';
import {
  MARKETS_DATA,
  BOURSES_ACTIVE_CONFIG,
  marketActiveSeed,
  buildBourseActiveSnapshot,
  BOND_MARKET_META,
  resolveMarketInstrument,
  CLIENT_TRADABLE_MARKETS,
} from './features/markets/MarketDomainData';
import { VueBourses, AnalyseInstrument } from './features/markets/MarketAnalysisScreens';
import { PortefeuilleDetail, ProfondeurMarche } from './features/portfolio/PortfolioDetailWorkflow';
import {
  CLIENT_GESTION_LIBRE,
  CLIENT_CASHFLOWS,
  INITIAL_CLIENT_ORDERS,
  CLIENT_NAV,
  clientMarket,
  clientPortfolioValue,
  clientLineValue,
  clientLineCmp,
  clientLinePlusMoinsValue,
  clientPortfolioValueIn,
  clientCashIn,
  CLIENT_OPEN_ORDER_STATUSES,
  clientReservedCash,
  clientAvailableCash,
  clientAvailableCashIn,
  clientReservedCashIn,
  clientAssetClass,
  CLIENT_SECTEUR_INSTRUMENT,
  clientSector,
  CLIENT_HISTORY,
  orderBookDemo,
  executionsDemo,
} from './features/clients/ClientDomainData';
import {
  ASSET_KEYS,
  buildAssetMix,
  ASSET_MIX,
  MARKET_MIX,
  COUNTRY_MIX,
  SECTOR_MIX,
  SECTOR_CONTRIB,
  HISTORY_PERIODS,
  buildCurrencyAumHistory,
  HISTORICAL_EVENT_TYPES,
  historicalEventColor,
  historicalEventDate,
  historicalEventPeriodIndex,
  buildHistoricalPortfolioEvents,
  attachHistoricalEventsToSeries,
  renderHistoricalEventDot,
  HistoricalEventDot,
  HistoricalEventsTooltipBlock,
  HISTORY_GESTION_REFERENCE,
  HISTORY_BRVM_REFERENCE,
  HISTORY_NGX_REFERENCE,
  buildHistoryTwr,
  HISTORIQUE_TRIMESTRIEL_PORTEFEUILLES,
} from './features/portfolio/PortfolioAnalyticsData';
import {
  ORDERS,
  RECOS,
  DEFAULT_STATIC_WATCHLIST_TITLES,
  buildWatchlistJournaliere,
  buildStaticWatchlistRow,
  INSTRUMENTS,
  EXPOSURE,
  exposureOf,
  ACTIONS_LIST,
  OBLIGATIONS_LIST,
  gsmPositionCmp,
  gsmListedAssetMetrics,
  expositionClient,
  ENCAISSEMENTS,
  versementsDemo,
  rentabiliteComment,
  compareOp,
  SEUIL_REEQUILIBRAGE,
  besoinsReequilibrageClient,
  propositionReequilibrage,
  ALERTES,
  IMPACT_COMITE,
  NAV,
} from './features/trading/TradingDomainData';
import {
  getGsmOperationalWriteKey,
  gsmOperationalRequest,
  gsmOperationalUrl,
  loadGsmOperationalSnapshot,
  setGsmOperationalWriteKey,
} from './services/gsmOperationalApi';

class ScreenErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[GSM screen boundary]', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <Card className="p-6">
        <Eyebrow>Écran indisponible</Eyebrow>
        <div className="mt-3 text-sm" style={{ color: C.sub }}>
          Cet écran a rencontré une erreur de rendu. Le shell de navigation reste actif.
        </div>
        <button
          type="button"
          className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: C.navy, color: '#fff' }}
          onClick={() => this.props.onReset?.()}
        >
          Retour à l’accueil
        </button>
      </Card>
    );
  }
}

/* ---------------------------------- DATA ---------------------------------- */





const { ClientCashflows } = createClientCashflowsScreen({
  CLIENT_CASHFLOWS,
  CLIENT_GESTION_LIBRE,
  CLIENT_OPEN_ORDER_STATUSES,
  LIQUIDITY_HISTORY_MIN_DATE,
  buildAnatomieExportPayload,
  clientAssetClass,
  clientAvailableCash,
  clientLineValue,
  clientMarket,
  clientPortfolioValue,
  clientReservedCash,
  exportAnatomieExcel,
  exportAnatomiePdf,
  liquidityHistoricalAmount,
  parseFR,
});

const { ClientAnalysis } = createClientAnalysisScreen({
  CLIENT_GESTION_LIBRE,
  CLIENT_HISTORY,
  clientCashIn,
  clientLineValue,
  clientPortfolioValueIn,
  clientSector,
});

const { ClientWatchlist, ClientAvis, ClientOrders } = createClientDecisionScreens({
  CLIENT_GESTION_LIBRE,
  buildStaticWatchlistRow,
  buildWatchlistJournaliere,
  clientMarket,
  parseFR,
});

const { ClientOrderTicket, ClientMarkets } = createClientTradingScreens({
  BOND_MARKET_META,
  CLIENT_GESTION_LIBRE,
  CLIENT_TRADABLE_MARKETS,
  MARKETS_DATA,
  clientAvailableCash,
  clientMarket,
  clientReservedCash,
});

const { ClientDashboard, ClientPortfolios } = createClientOverviewScreens({
  CLIENT_CASHFLOWS,
  CLIENT_GESTION_LIBRE,
  CLIENT_OPEN_ORDER_STATUSES,
  MARKETS_DATA,
  clientAssetClass,
  clientAvailableCash,
  clientAvailableCashIn,
  clientCashIn,
  clientLineCmp,
  clientLinePlusMoinsValue,
  clientLineValue,
  clientMarket,
  clientPortfolioValue,
  clientPortfolioValueIn,
  clientReservedCash,
  clientReservedCashIn,
});

const { ReequilibrageScreen } = createReequilibrageScreen({
  CLIENTS,
  MARKETS_DATA,
  PROFILE_TYPE_LABEL,
  RECOS,
  SEUIL_REEQUILIBRAGE,
  besoinsReequilibrageClient,
  propositionReequilibrage,
  exposureOf,
});

/* ------------------------- CESSION / RETRAIT GSM ------------------------- */
/*
 * Moteur de simulation de cession destiné aux demandes de retrait des clients
 * en gestion sous mandat.
 *
 * Objectifs de la maquette :
 * - sélectionner plusieurs clients et associer un montant/date de retrait ;
 * - conserver, après retrait, la poche de liquidité cible du profil ;
 * - céder prioritairement les classes d'actifs surpondérées ;
 * - contrôler la liquidité de marché via le volume quotidien simulé ;
 * - produire un plan d'ordres transférable au Carnet d'ordres.
 *
 * En production, les positions et quantités devront provenir des positions ORM
 * réelles. Ici, elles sont reconstruites depuis les allocations/expositions de
 * démonstration déjà présentes dans la maquette.
 */


const { AnalysePortefeuilleScreen } = createAnalysePortefeuilleScreen({
  CLIENTS,
  PROFILE_TYPE_LABEL,
  CORR_PAYS_CRISE,
  CORR_PAYS_HIST,
  CORR_PAYS_LABELS,
  CORR_SECTEURS_CRISE,
  CORR_SECTEURS_HIST,
  CORR_SECTEURS_LABELS,
  STRESS_SCENARIOS,
  VOLUME_JOUR,
  aggregateEncoursBy,
  buildAssetMix,
});
const {
  Comite: ComiteScreen,
  PriseDecisions: PriseDecisionsScreen,
} = createComiteWorkflow({
  ACTIONS_LIST,
  ASSET_MIX,
  COUNTRY_MIX,
  IMPACT_COMITE,
  MARKET_MIX,
  CLIENTS,
  MARKETS_DATA,
  PROFILE_TYPE_LABEL,
  RECOS,
  SECTOR_CONTRIB,
  SECTOR_MIX,
  UPCOMING_CASHFLOWS,
  compareOp,
  exposureOf,
  joursDepuisAujourdhui,
});


export function GsmAppShell({ documentation, onOpenDocumentation, onDownloadDocumentation }) {
  const [workspace, setWorkspace] = useState('gestionnaire');
  const [operationalDbStatus, setOperationalDbStatus] = useState('Connexion');
  const [operationalDbUpdatedAt, setOperationalDbUpdatedAt] = useState(null);
  const [operationalDbPortfolioCount, setOperationalDbPortfolioCount] = useState(0);
  const [operationalDbWriteEnabled, setOperationalDbWriteEnabled] = useState(false);
  const [operationalDbWriteMessage, setOperationalDbWriteMessage] = useState('');
  const [, setOperationalDbRevision] = useState(0);
  const [screen, setScreen] = useState('accueil');
  const [clientScreen, setClientScreen] = useState('client-dashboard');
  const [clientCtx, setClientCtx] = useState({});
  const [ctx, setCtx] = useState({});
  const [reportOpen, setReportOpen] = useState({});
  const [siteDevise, setSiteDevise] = useState('XOF');
  const [dark, setDark] = useState(false);
  const [clientOrders, setClientOrders] = useState(INITIAL_CLIENT_ORDERS);
  const [cessionRetraitEtats, setCessionRetraitEtats] = useState(
    CESSION_RETRAIT_ETATS_DEMO
  );
  const [clientWatchlistTitles, setClientWatchlistTitles] = useState(() => {
    const fallback = ['SONATEL', 'MTN NIGERIA', 'GCB BANK'];
    if (typeof window === 'undefined') return fallback;
    try {
      const saved = window.localStorage.getItem(
        'afrimarket-client-watchlist-v1'
      );
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  });
  const [watchlistTitles, setWatchlistTitles] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_STATIC_WATCHLIST_TITLES;
    try {
      const saved = window.localStorage.getItem(
        'afrimarket-static-watchlist-v1'
      );
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : DEFAULT_STATIC_WATCHLIST_TITLES;
    } catch {
      return DEFAULT_STATIC_WATCHLIST_TITLES;
    }
  });

  const chargerBaseOperationnelle = async ({ silent = false } = {}) => {
    if (!silent) {
      setOperationalDbStatus('Connexion');
    }

    try {
      const snapshot = await loadGsmOperationalSnapshot();

      if (Array.isArray(snapshot?.clients) && snapshot.clients.length > 0) {
        replaceClients(
          snapshot.clients.map((client, index) =>
            cessionAttachNonListedPositions(client, index)
          )
        );
        setOperationalDbPortfolioCount(snapshot.clients.length);
      }

      if (Array.isArray(snapshot?.withdrawalRequests)) {
        setCessionRetraitEtats(snapshot.withdrawalRequests);
      }

      setOperationalDbUpdatedAt(
        snapshot?.generatedAt || new Date().toISOString()
      );
      setOperationalDbStatus('Connectée');
      setOperationalDbRevision((revision) => revision + 1);
      return snapshot;
    } catch (error) {
      console.warn('[GSM DB] Fallback sur les données locales :', error);
      setOperationalDbStatus('Mode local');
      if (!silent) {
        setOperationalDbWriteMessage(
          "API opérationnelle indisponible : l'interface utilise temporairement les données locales."
        );
      }
      return null;
    }
  };

  const verifierCleEcritureOperationnelle = async (candidateKey) => {
    if (!candidateKey) return false;

    await gsmOperationalRequest('/api/admin/check', {
      adminKey: candidateKey,
    });

    return true;
  };

  const activerEcritureOperationnelle = async () => {
    if (typeof window === 'undefined') return;

    const cleActuelle = getGsmOperationalWriteKey();
    const candidate = window.prompt(
      "Clé d'écriture de la base opérationnelle GSM",
      cleActuelle
    );

    if (!candidate) return;

    try {
      await verifierCleEcritureOperationnelle(candidate);
      setGsmOperationalWriteKey(candidate);
      setOperationalDbWriteEnabled(true);
      setOperationalDbWriteMessage(
        'Écriture FastAPI activée pour cette session.'
      );
    } catch (error) {
      setGsmOperationalWriteKey('');
      setOperationalDbWriteEnabled(false);
      setOperationalDbWriteMessage(
        `Écriture refusée : ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const desactiverEcritureOperationnelle = () => {
    setGsmOperationalWriteKey('');
    setOperationalDbWriteEnabled(false);
    setOperationalDbWriteMessage(
      'Écriture désactivée. La base reste connectée en lecture.'
    );
  };

  useEffect(() => {
    let cancelled = false;

    const initialiser = async () => {
      const key = getGsmOperationalWriteKey();

      if (key) {
        try {
          await verifierCleEcritureOperationnelle(key);
          if (!cancelled) {
            setOperationalDbWriteEnabled(true);
          }
        } catch {
          setGsmOperationalWriteKey('');
          if (!cancelled) {
            setOperationalDbWriteEnabled(false);
          }
        }
      }

      if (!cancelled) {
        await chargerBaseOperationnelle();
      }
    };

    void initialiser();

    const intervalId = window.setInterval(() => {
      void chargerBaseOperationnelle({ silent: true });
    }, 10_000);

    const refreshOnFocus = () => {
      void chargerBaseOperationnelle({ silent: true });
    };

    const refreshOnVisibility = () => {
      if (document.visibilityState === 'visible') {
        void chargerBaseOperationnelle({ silent: true });
      }
    };

    window.addEventListener('focus', refreshOnFocus);
    document.addEventListener('visibilitychange', refreshOnVisibility);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshOnFocus);
      document.removeEventListener('visibilitychange', refreshOnVisibility);
    };
  }, []);

  const persistWatchlist = (next) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(
          'afrimarket-static-watchlist-v1',
          JSON.stringify(next)
        );
      } catch {
        // La watchlist reste utilisable pendant la session si le stockage est bloqué.
      }
    }
    return next;
  };
  const addToWatchlist = (titre) =>
    setWatchlistTitles((current) =>
      persistWatchlist(current.includes(titre) ? current : [...current, titre])
    );
  const removeFromWatchlist = (titre) =>
    setWatchlistTitles((current) =>
      persistWatchlist(current.filter((item) => item !== titre))
    );

  const persistClientWatchlist = (next) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(
          'afrimarket-client-watchlist-v1',
          JSON.stringify(next)
        );
      } catch {
        // La watchlist Client reste disponible pendant la session.
      }
    }
    return next;
  };
  const addToClientWatchlist = (titre) =>
    setClientWatchlistTitles((current) =>
      persistClientWatchlist(
        current.includes(titre) ? current : [...current, titre]
      )
    );
  const removeFromClientWatchlist = (titre) =>
    setClientWatchlistTitles((current) =>
      persistClientWatchlist(current.filter((item) => item !== titre))
    );

  const remonterEnHaut = () => {
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      });
    }
  };

  const go = (id, params = {}) => {
    setScreen(id);
    setCtx(params);
    remonterEnHaut();
  };

  const updateCessionRetraitStatus = async (clientId, patch = {}) => {
    const client = CLIENTS.find((item) => item.id === clientId);
    const existing = cessionRetraitEtats.find(
      (item) => item.clientId === clientId
    );

    const nextItem = {
      id: patch.id || existing?.id || null,
      clientId,
      client: patch.client || existing?.client || client?.nom || 'Client',
      montant: Number(patch.montant ?? existing?.montant ?? 0),
      devise: patch.devise || existing?.devise || client?.devise || 'XOF',
      statut: patch.statut || existing?.statut || 'Demande reçue',
      dateDemande:
        patch.dateDemande ||
        existing?.dateDemande ||
        CESSION_RETRAIT_REFERENCE_DATE,
      dateSouhaitee:
        patch.dateSouhaitee ||
        existing?.dateSouhaitee ||
        CESSION_RETRAIT_REFERENCE_DATE,
      chargeeClientele:
        patch.chargeeClientele ||
        existing?.chargeeClientele ||
        'Non renseignée',
      observationChargeeClientele:
        patch.observationChargeeClientele ||
        existing?.observationChargeeClientele ||
        'Aucune observation renseignée.',
      modePaiement: patch.modePaiement || existing?.modePaiement || 'Chèque',
    };

    // Mise à jour optimiste de l'interface.
    setCessionRetraitEtats((current) => {
      const exists = current.some((item) => item.clientId === clientId);
      return exists
        ? current.map((item) =>
            item.clientId === clientId ? nextItem : item
          )
        : [nextItem, ...current];
    });

    const adminKey = getGsmOperationalWriteKey();

    if (!adminKey) {
      setOperationalDbWriteMessage(
        "Modification visible localement mais non enregistrée : activez l'écriture FastAPI."
      );
      return nextItem;
    }

    const payload = {
      portfolio_id: clientId,
      amount: nextItem.montant,
      currency: nextItem.devise,
      status: nextItem.statut,
      requested_date: nextItem.dateDemande,
      desired_date: nextItem.dateSouhaitee,
      relationship_manager: nextItem.chargeeClientele,
      observation: nextItem.observationChargeeClientele,
      payment_method: nextItem.modePaiement,
    };

    try {
      if (nextItem.id) {
        await gsmOperationalRequest(`/api/withdrawals/${nextItem.id}`, {
          method: 'PUT',
          adminKey,
          body: payload,
        });
      } else {
        const result = await gsmOperationalRequest('/api/withdrawals', {
          method: 'POST',
          adminKey,
          body: payload,
        });

        if (result?.id) {
          nextItem.id = result.id;
          setCessionRetraitEtats((current) =>
            current.map((item) =>
              item.clientId === clientId
                ? { ...item, id: result.id }
                : item
            )
          );
        }
      }

      setOperationalDbWriteMessage(
        'Modification enregistrée dans la base opérationnelle.'
      );
      await chargerBaseOperationnelle({ silent: true });
    } catch (error) {
      setOperationalDbWriteMessage(
        `Échec de l'enregistrement : ${error instanceof Error ? error.message : String(error)}`
      );
      await chargerBaseOperationnelle({ silent: true });
    }

    return nextItem;
  };
  const openClient = (
    id,
    showReport = false,
    period = 'Trimestre en cours'
  ) => {
    setScreen('client');
    setCtx({ clientId: id });
    setReportOpen({ notice: showReport, period });
    remonterEnHaut();
  };
  const report = (_clientId, period = 'Trimestre en cours') =>
    setReportOpen({
      notice: true,
      period,
    });

  const goClient = (id, params = {}) => {
    setClientScreen(id);
    setClientCtx(params);
    remonterEnHaut();
  };

  const createClientOrder = (ordre) => {
    const now = new Date();
    const date = now.toLocaleDateString('fr-FR');
    setClientOrders((current) => [
      {
        ...ordre,
        id: `CL-ORD-${String(current.length + 1).padStart(3, '0')}`,
        date,
      },
      ...current,
    ]);
  };

  const switchWorkspace = () => {
    setWorkspace((current) =>
      current === 'gestionnaire' ? 'client' : 'gestionnaire'
    );
    remonterEnHaut();
  };

  const activeClient = ctx.clientId
    ? CLIENTS.find((c) => c.id === ctx.clientId)
    : null;

  return (
    <NavigationContext.Provider value={{ go }}>
      <div
        style={{
          background: C.bg,
          minHeight: '100vh',
          overflowX: 'clip',
          ...F_BODY,
          filter: dark ? 'invert(1) hue-rotate(180deg)' : 'none',
        }}
      >
        <style>{FONTS}</style>
        <div className="flex">
          <aside
            className="w-64 shrink-0 h-screen p-5 sticky top-0 overflow-y-auto"
            style={{
              background: C.navy,
              alignSelf: 'flex-start',
              overscrollBehavior: 'contain',
              scrollbarGutter: 'stable',
            }}
          >
            <div className="flex items-center gap-2 mb-8">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: C.gold }}
              >
                <Landmark size={18} color="#fff" />
              </div>
              <div>
                <div
                  className="text-white font-bold text-sm leading-tight"
                  style={F_DISPLAY}
                >
                  AfriMarket
                </div>
                <div
                  className="text-[11px] tracking-widest uppercase"
                  style={{ color: '#9AA5C4' }}
                >
                  {workspace === 'gestionnaire'
                    ? 'Management'
                    : 'Gestion libre'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={switchWorkspace}
              className="w-full mb-5 p-3 rounded-2xl text-left transition-transform active:scale-[0.98]"
              style={{
                background:
                  workspace === 'gestionnaire'
                    ? 'rgba(201,150,47,0.16)'
                    : 'rgba(30,156,119,0.18)',
                border: `1px solid ${
                  workspace === 'gestionnaire'
                    ? 'rgba(201,150,47,0.42)'
                    : 'rgba(30,156,119,0.45)'
                }`,
              }}
            >
              <div
                className="text-[10px] uppercase tracking-widest font-semibold"
                style={{ color: '#9AA5C4' }}
              >
                Espace actuel
              </div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span                  className="text-sm font-bold"
                  style={{
                    color: workspace === 'gestionnaire' ? C.gold : '#7FE0C2',
                    ...F_DISPLAY,
                  }}
                >
                  {workspace === 'gestionnaire'
                    ? 'Gestionnaire'
                    : 'Client · Gestion libre'}
                </span>
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: '#C7CEE3' }}
                >
                  Basculer ↔
                </span>
              </div>
              <div className="text-[10px] mt-1" style={{ color: '#9AA5C4' }}>
                {workspace === 'gestionnaire'
                  ? "Passer à l'espace Client"
                  : "Revenir à l'espace Gestionnaire"}
              </div>
            </button>

            <nav className="space-y-1">
              {(workspace === 'gestionnaire' ? NAV : CLIENT_NAV).map((n) => {
                const active =
                  workspace === 'gestionnaire'
                    ? screen === n.id ||
                      (n.id === 'cession-retrait' &&
                        screen === 'cession-interne') ||
                      (n.id === 'portefeuilles' && screen === 'client') ||
                      (n.id === 'vue-boursiere' &&
                        ['profondeur', 'instrument-analysis'].includes(
                          screen
                        ) &&
                        ctx.source === 'vue-boursiere') ||
                      (n.id === 'marches' &&
                        screen === 'profondeur' &&
                        ctx.source !== 'vue-boursiere') ||
                      (n.id === 'comite' && screen === 'decisions-comite')
                    : clientScreen === n.id ||
                      (n.id === 'client-exchanges' &&
                        [
                          'client-market-depth',
                          'client-ticket',
                          'client-instrument-analysis',
                        ].includes(clientScreen) &&
                        clientCtx.source === 'vue-boursiere') ||
                      (n.id === 'client-markets' &&
                        ['client-market-depth', 'client-ticket'].includes(
                          clientScreen
                        ) &&
                        clientCtx.source !== 'vue-boursiere');
                return (
                  <button
                    key={n.id}
                    onClick={() =>
                      workspace === 'gestionnaire' ? go(n.id) : goClient(n.id)
                    }
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      background: active
                        ? 'rgba(201,150,47,0.16)'
                        : 'transparent',
                      color: active ? C.gold : '#C7CEE3',
                    }}
                  >
                    <n.icon size={16} />
                    {n.label}
                  </button>
                );
              })}
            </nav>
            {workspace === 'gestionnaire' && (
              <div
                className="mt-6 p-3 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <div
                  className="text-[9px] uppercase tracking-widest font-semibold"
                  style={{ color: '#9AA5C4' }}
                >
                  Base opérationnelle
                </div>

                <div className="flex items-center justify-between gap-2 mt-1">
                  <span
                    className="text-[11px] font-semibold"
                    style={{
                      color:
                        operationalDbStatus === 'Connectée'
                          ? '#7FE0C2'
                          : operationalDbStatus === 'Mode local'
                            ? '#F7D48A'
                            : '#C7CEE3',
                    }}
                  >
                    {operationalDbStatus}
                  </span>
                  <button
                    type="button"
                    onClick={() => void chargerBaseOperationnelle()}
                    className="text-[10px] font-semibold"
                    style={{ color: C.gold }}
                    title="Recharger immédiatement les données métier"
                  >
                    ↻ Synchroniser
                  </button>
                </div>

                <div className="text-[9px] mt-1" style={{ color: '#9AA5C4' }}>
                  {operationalDbPortfolioCount > 0
                    ? `${operationalDbPortfolioCount} portefeuille(s) · synchronisation auto 10 s`
                    : 'Synchronisation automatique toutes les 10 s'}
                </div>

                {operationalDbUpdatedAt && (
                  <div className="text-[9px] mt-1" style={{ color: '#9AA5C4' }}>
                    MAJ{' '}
                    {new Date(operationalDbUpdatedAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                )}

                <button
                  type="button"
                  onClick={
                    operationalDbWriteEnabled
                      ? desactiverEcritureOperationnelle
                      : () => void activerEcritureOperationnelle()
                  }
                  className="w-full mt-2 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[10px] font-semibold"
                  style={{
                    background: operationalDbWriteEnabled
                      ? 'rgba(30,156,119,0.20)'
                      : 'rgba(255,255,255,0.08)',
                    color: operationalDbWriteEnabled ? '#7FE0C2' : '#C7CEE3',
                  }}
                >
                  {operationalDbWriteEnabled
                    ? '✓ Écriture DB activée'
                    : 'Activer écriture DB'}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      gsmOperationalUrl('/admin'),
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                  className="w-full mt-2 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[10px] font-semibold"
                  style={{
                    background: 'rgba(201,150,47,0.16)',
                    color: C.gold,
                  }}
                >
                  <ExternalLink size={12} />
                  Administrer les données
                </button>

                {operationalDbWriteMessage && (
                  <div
                    className="text-[9px] mt-2 leading-relaxed"
                    style={{
                      color:
                        operationalDbWriteMessage.startsWith('Échec') ||
                        operationalDbWriteMessage.startsWith('Écriture refusée')
                          ? '#FFB4AC'
                          : '#9AA5C4',
                    }}
                  >
                    {operationalDbWriteMessage}
                  </div>
                )}
              </div>
            )}

            <div
              className="mt-8 pt-5 text-[11px]"
              style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                color: '#7C87A8',
              }}
            >
              {workspace === 'gestionnaire' ? (
                <>
                  Marchés couverts : BRVM · NGX · GSE
                  <br />
                  Devise de référence : {siteDevise}
                </>
              ) : (
                <>
                  {
                    new Set(
                      CLIENT_GESTION_LIBRE.portefeuilles.map((pf) => pf.sgi)
                    ).size
                  }{' '}
                  SGI connectées ·{' '}
                  {
                    new Set(
                      CLIENT_GESTION_LIBRE.portefeuilles.map((pf) => pf.pays)
                    ).size
                  }{' '}
                  pays
                  <br />
                  Patrimoine consolidé en {siteDevise}
                </>
              )}
            </div>
          </aside>

          <main className="flex-1 p-8 min-w-0 overflow-x-hidden">
            <ScreenErrorBoundary
              key={`${workspace}:${workspace === 'gestionnaire' ? screen : clientScreen}`}
              onReset={() =>
                workspace === 'gestionnaire'
                  ? go('accueil')
                  : goClient('client-dashboard')
              }
            >
            {workspace === 'gestionnaire' && (
              <>
                {screen === 'accueil' && (
                  <AccueilScreen
                    go={go}
                    openClient={openClient}
                    devise={siteDevise}
                    onDeviseChange={setSiteDevise}
                    dark={dark}
                    onToggleDark={() => setDark(!dark)}
                    cessionRetraitEtats={cessionRetraitEtats}
                    dependencies={{
                      clients: CLIENTS,
                      profileTypeLabel: PROFILE_TYPE_LABEL,
                      sectorMix: SECTOR_MIX,
                      quarterlyPortfolioHistory:
                        HISTORIQUE_TRIMESTRIEL_PORTEFEUILLES,
                      aggregateEncoursBy,
                      buildAssetMix,
                      buildHistoryTwr,
                      historyPeriods: HISTORY_PERIODS,
                      buildCurrencyAumHistory,
                      attachHistoricalEventsToSeries,
                      alerts: ALERTES,
                      withdrawalStatuses: CESSION_RETRAIT_STATUTS,
                      withdrawalStatusTone: cessionRetraitStatusTone,
                      markets: MARKETS_DATA,
                      historicalEventTypes: HISTORICAL_EVENT_TYPES,
                      historicalEventColor,
                      historicalEventDot: renderHistoricalEventDot,
                      formatCompact: fmtCompactMontant,
                      renderHistoricalEvents: (events, currency) => (
                        <HistoricalEventsTooltipBlock
                          evenements={events}
                          devise={currency}
                        />
                      ),
                      resolveExposure: expositionClient,
                      volumeData: VOLUME_JOUR,
                    }}
                  />
                )}
                {screen === 'portefeuilles' && (
                  <PortefeuillesScreen
                    clients={CLIENTS}
                    openClient={openClient}
                    initialFilter={ctx.filtre}
                    go={go}
                  />
                )}
                {screen === 'client' && activeClient && (
                  <PortefeuilleDetail
                    client={activeClient}
                    go={go}
                    reportOpen={reportOpen}
                    onGenerateReport={report}
                  />
                )}
                {screen === 'carnet' && (
                  <CarnetOrdresScreen orders={ORDERS} initial={ctx} />
                )}
                {screen === 'profondeur' && (
                  <ProfondeurMarche ctx={ctx} go={go} />
                )}
                {screen === 'avis' && <AvisOperesScreen />}
                {screen === 'vue-boursiere' && (
                  <VueBourses
                    mode="gestionnaire"
                    go={go}
                    watchlistTitles={watchlistTitles}
                    onAddWatch={addToWatchlist}
                  />
                )}
                {screen === 'instrument-analysis' && (
                  <AnalyseInstrument ctx={ctx} go={go} />
                )}
                {screen === 'marches' && (
                  <MarchesObligatairesScreen
                    markets={MARKETS_DATA}
                    bondMeta={BOND_MARKET_META}
                    watchlistTitles={watchlistTitles}
                    onAddWatch={addToWatchlist}
                    onOpenDepth={(context) => go('profondeur', context)}
                  />
                )}
                {screen === 'watchlist' && (
                  <WatchlistScreen
                    watchlistTitles={watchlistTitles}
                    onRemoveWatch={removeFromWatchlist}
                    onOpenDepth={(context) => go('profondeur', context)}
                    buildDailyRows={buildWatchlistJournaliere}
                    buildStaticRow={buildStaticWatchlistRow}
                  />
                )}
                {screen === 'recos-actions' && (
                  <RecommandationsActionsScreen
                    recommendations={RECOS}
                    onOpenGroupedAllocation={(context) => go('alloc-criteres', context)}
                  />                )}
                {screen === 'reco-alloc' && (
                  <RecommandationAllocationScreen
                    clients={CLIENTS}
                    onApplyRebalancing={(context) => go('reequilibrage', context)}
                  />
                )}
                {screen === 'alloc-criteres' && (
                  <AllocationParCriteresScreen
                    initialSens={ctx.sens}
                    initialInstrument={ctx.instrument}
                    clients={CLIENTS}
                    instruments={INSTRUMENTS}
                    profileTypeLabel={PROFILE_TYPE_LABEL}
                    compare={compareOp}
                    exposureOf={exposureOf}
                  />
                )}
                {screen === 'alertes' && (
                  <AlertesScreen
                    alerts={ALERTES}
                    onRebalance={(context) => go('reequilibrage', context)}
                  />
                )}
                {screen === 'money-management' && (
                  <MoneyManagementScreen
                    go={go}
                    devise={siteDevise}
                    dependencies={{
                      clients: CLIENTS,
                      orders: ORDERS,
                      upcomingCashflows: UPCOMING_CASHFLOWS,
                      profileTypeLabel: PROFILE_TYPE_LABEL,
                      liquidityHistoryMinDate: LIQUIDITY_HISTORY_MIN_DATE,
                      rebalanceThreshold: SEUIL_REEQUILIBRAGE,
                      parseIsoLocalDate,
                      parseFR,
                      liquidityHistoricalAmount,
                      buildMoneyManagementConsolidatedExportPayload,
                      exportMoneyManagementPdf,
                      exportMoneyManagementExcel,
                    }}
                  />
                )}
                {screen === 'cession-retrait' && (
                  <CessionRetraitScreen
                    go={go}
                    devise={siteDevise}
                    onCessionStatusChange={updateCessionRetraitStatus}
                  />
                )}
                {screen === 'cession-interne' && (
                  <CessionInterneScreen
                    ctx={ctx}
                    go={go}
                    devise={siteDevise}
                    onCessionStatusChange={updateCessionRetraitStatus}
                    cessionRetraitEtats={cessionRetraitEtats}
                  />
                )}
                {screen === 'reequilibrage' && (
                  <ReequilibrageScreen initial={ctx} devise={siteDevise} />
                )}
                {screen === 'analyse' && (
                  <AnalysePortefeuilleScreen devise={siteDevise} />
                )}
                {screen === 'comite' && <ComiteScreen devise={siteDevise} go={go} />}
                {screen === 'decisions-comite' && <PriseDecisionsScreen go={go} />}
                {screen === 'documentation' && <DocumentationScreen
                    mode="gestionnaire"
                    documents={documentation}
                    onOpenDocument={onOpenDocumentation}
                    onDownloadDocument={onDownloadDocumentation}
                  />}
              </>
            )}

            {workspace === 'client' && (
              <>
                {clientScreen === 'client-dashboard' && (
                  <ClientDashboard
                    goClient={goClient}
                    devise={siteDevise}
                    onDeviseChange={setSiteDevise}
                    orders={clientOrders}
                  />
                )}
                {clientScreen === 'client-portfolios' && (
                  <ClientPortfolios devise={siteDevise} orders={clientOrders} />
                )}
                {clientScreen === 'client-exchanges' && (
                  <VueBourses
                    mode="client"
                    goClient={goClient}
                    watchlistTitles={clientWatchlistTitles}
                    onAddWatch={addToClientWatchlist}
                  />
                )}
                {clientScreen === 'client-instrument-analysis' && (
                  <AnalyseInstrument
                    ctx={clientCtx}
                    mode="client"
                    goClient={goClient}
                  />
                )}
                {clientScreen === 'client-markets' && (
                  <ClientMarkets
                    goClient={goClient}
                    watchlistTitles={clientWatchlistTitles}
                    onAddWatch={addToClientWatchlist}
                    onRemoveWatch={removeFromClientWatchlist}
                  />
                )}
                {clientScreen === 'client-watchlist' && (
                  <ClientWatchlist
                    goClient={goClient}
                    watchlistTitles={clientWatchlistTitles}
                    onAddWatch={addToClientWatchlist}
                    onRemoveWatch={removeFromClientWatchlist}
                  />
                )}
                {clientScreen === 'client-ticket' && (
                  <ClientOrderTicket
                    goClient={goClient}
                    onCreateOrder={createClientOrder}
                    orders={clientOrders}
                    initialInstrument={clientCtx.instrument}
                    initialMarket={clientCtx.marche}
                    source={clientCtx.source}
                  />
                )}
                {clientScreen === 'client-market-depth' && (
                  <ProfondeurMarche
                    ctx={clientCtx}
                    mode="client"
                    goClient={goClient}
                  />
                )}
                {clientScreen === 'client-orders' && (
                  <ClientOrders orders={clientOrders} />
                )}
                {clientScreen === 'client-avis' && (
                  <ClientAvis orders={clientOrders} devise={siteDevise} />
                )}
                {clientScreen === 'client-cashflows' && (
                  <ClientCashflows devise={siteDevise} orders={clientOrders} />
                )}
                {clientScreen === 'client-analysis' && (
                  <ClientAnalysis devise={siteDevise} />
                )}
                {clientScreen === 'client-documentation' && (
                  <DocumentationScreen
                    mode="client"
                    documents={documentation}
                    onOpenDocument={onOpenDocumentation}
                    onDownloadDocument={onDownloadDocumentation}
                  />
                )}
              </>
            )}
            </ScreenErrorBoundary>
          </main>        </div>
      </div>
    </NavigationContext.Provider>
  );
}
