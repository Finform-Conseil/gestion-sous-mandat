import { createContext, useContext, useState } from 'react';
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
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  X,
  Landmark,
  Building2,
  Sun,
  Moon,
  Activity,
  Droplets,
} from 'lucide-react';

/* ---------------------------------- THEME ---------------------------------- */
const C = {
  navy: '#0F1B33',
  navySoft: '#16264A',
  ink: '#101827',
  sub: '#5B6474',
  bg: '#F5F6F9',
  card: '#FFFFFF',
  line: '#E7E9EF',
  gold: '#C9962F',
  teal: '#1E9C77',
  coral: '#D6564A',
  indigo: '#3E5CC7',
};
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
@keyframes ticker-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
`;
const F_DISPLAY = { fontFamily: "'Space Grotesk', sans-serif" };
const F_BODY = { fontFamily: "'Inter', sans-serif" };
const F_MONO = { fontFamily: "'IBM Plex Mono', monospace" };
const PALETTE = [C.navy, C.gold, C.teal, C.indigo, C.coral, '#8B93A7'];

/* ---------------------------------- DATA ---------------------------------- */
const FX = { XOF: 1, NGN: 1.35, GHS: 78, USD: 615, EUR: 655.957 };
const fmt = (n) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n);
const fmtPrice = (n) =>
  new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: Number.isInteger(Number(n)) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Number(n));
const toRef = (amount, devise) => Math.round(amount * FX[devise]);
const convertCurrency = (amount, from, to) => (amount * FX[from]) / FX[to];
const VOLUME_JOUR = [
  { marche: 'BRVM', type: 'Action', volume: 1_250_000_000, devise: 'XOF' },
  { marche: 'BRVM', type: 'Obligation', volume: 430_000_000, devise: 'XOF' },
  { marche: 'NGX', type: 'Action', volume: 680_000_000, devise: 'NGN' },
  { marche: 'NGX', type: 'Obligation', volume: 150_000_000, devise: 'NGN' },
  { marche: 'GSE', type: 'Action', volume: 9_500_000, devise: 'GHS' },
  { marche: 'GSE', type: 'Obligation', volume: 2_100_000, devise: 'GHS' },
];

const CLIENTS_ORIGINAUX = [
  {
    id: 'c1',
    pays: "Côte d'Ivoire",
    dateEntree: '2024-06-15',
    nom: 'Aïcha Koné',
    type: 'Privé',
    marche: 'BRVM',
    devise: 'XOF',
    encours: 245_000_000,
    perf: 3.2,
    risque: 'Modéré',
    alertes: 1,
    profilRisque: 'Équilibré',
    rentabilite: 2.8,
    alloc: {
      Actions: 48,
      'Obl. souveraines': 22,
      'Obl. privées': 18,
      Liquidité: 12,
    },
    cible: {
      Actions: 40,
      'Obl. souveraines': 28,
      'Obl. privées': 20,
      Liquidité: 12,
    },
  },
  {
    id: 'c2',
    pays: "Côte d'Ivoire",
    dateEntree: '2024-03-01',
    nom: 'Fonds Prévoyance CI',
    type: 'Institutionnel',
    marche: 'BRVM',
    devise: 'XOF',
    encours: 1_850_000_000,
    perf: 1.8,
    risque: 'Faible',
    alertes: 0,
    profilRisque: 'Prudence',
    rentabilite: 1.6,
    alloc: {
      Actions: 25,
      'Obl. souveraines': 45,
      'Obl. privées': 20,
      Liquidité: 10,
    },
    cible: {
      Actions: 25,
      'Obl. souveraines': 45,
      'Obl. privées': 20,
      Liquidité: 10,
    },
  },
  {
    id: 'c3',
    pays: 'Nigeria',
    dateEntree: '2024-07-10',
    nom: 'Emeka Okafor',
    type: 'Privé',
    marche: 'NGX',
    devise: 'NGN',
    encours: 380_000_000,
    perf: -1.4,
    risque: 'Élevé',
    alertes: 2,
    profilRisque: 'Performance',
    rentabilite: -1.9,
    alloc: {
      Actions: 61,
      'Obl. souveraines': 12,
      'Obl. privées': 15,
      Liquidité: 12,
    },
    cible: {
      Actions: 45,
      'Obl. souveraines': 20,
      'Obl. privées': 25,
      Liquidité: 10,
    },
  },
  {
    id: 'c4',
    pays: 'Sénégal',
    dateEntree: '2024-05-20',
    nom: 'Groupe Assurance Sahel',
    type: 'Institutionnel',
    marche: 'BRVM',
    devise: 'XOF',
    encours: 920_000_000,
    perf: 2.1,
    risque: 'Modéré',
    alertes: 1,
    profilRisque: 'Prudence',
    rentabilite: 1.9,
    alloc: {
      Actions: 30,
      'Obl. souveraines': 38,
      'Obl. privées': 22,
      Liquidité: 10,
    },
    cible: {
      Actions: 30,
      'Obl. souveraines': 30,
      'Obl. privées': 25,
      Liquidité: 15,
    },
  },
  {
    id: 'c5',
    pays: 'Ghana',
    dateEntree: '2024-08-05',
    nom: 'Ama Boateng',
    type: 'Privé',
    marche: 'GSE',
    devise: 'GHS',
    encours: 1_250_000,
    perf: 4.6,
    risque: 'Modéré',
    alertes: 0,
    profilRisque: 'Croissance',
    rentabilite: 4.1,
    alloc: {
      Actions: 44,
      'Obl. souveraines': 26,
      'Obl. privées': 18,
      Liquidité: 12,
    },
    cible: {
      Actions: 40,
      'Obl. souveraines': 30,
      'Obl. privées': 20,
      Liquidité: 10,
    },
  },
  {
    id: 'c6',
    pays: 'Nigeria',
    dateEntree: '2024-02-12',
    nom: 'Caisse Retraite Littoral',
    type: 'Institutionnel',
    marche: 'NGX',
    devise: 'NGN',
    encours: 2_400_000_000,
    perf: 0.6,
    risque: 'Faible',
    alertes: 1,
    profilRisque: 'Sérénité',
    rentabilite: 0.5,
    alloc: {
      Actions: 18,
      'Obl. souveraines': 52,
      'Obl. privées': 20,
      Liquidité: 10,
    },
    cible: {
      Actions: 20,
      'Obl. souveraines': 50,
      'Obl. privées': 22,
      Liquidité: 8,
    },
  },
];

const PROFILS_PORTEFEUILLES_MODELES = {
  Équilibré: {
    risque: 'Modéré',
    perf: 2.7,
    rentabilite: 2.5,
    cible: {
      Actions: 40,
      'Obl. souveraines': 28,
      'Obl. privées': 20,
      Liquidité: 12,
    },
  },
  Prudence: {
    risque: 'Faible',
    perf: 1.5,
    rentabilite: 1.6,
    cible: {
      Actions: 25,
      'Obl. souveraines': 45,
      'Obl. privées': 20,
      Liquidité: 10,
    },
  },
  Performance: {
    risque: 'Élevé',
    perf: 4.4,
    rentabilite: 4.0,
    cible: {
      Actions: 55,
      'Obl. souveraines': 15,
      'Obl. privées': 20,
      Liquidité: 10,
    },
  },
  Croissance: {
    risque: 'Modéré',
    perf: 3.7,
    rentabilite: 3.5,
    cible: {
      Actions: 50,
      'Obl. souveraines': 20,
      'Obl. privées': 20,
      Liquidité: 10,
    },
  },
  Sérénité: {
    risque: 'Faible',
    perf: 1.0,
    rentabilite: 1.1,
    cible: {
      Actions: 20,
      'Obl. souveraines': 50,
      'Obl. privées': 22,
      Liquidité: 8,
    },
  },
};

const DEVISE_PAR_MARCHE = { BRVM: 'XOF', NGX: 'NGN', GSE: 'GHS' };

const PORTEFEUILLES_GENERES_SPECS = [
  // T4 2024
  {
    id: 'c7',
    nom: 'Mariam Traoré',
    profilRisque: 'Équilibré',
    type: 'Privé',
    marche: 'BRVM',
    pays: 'Sénégal',
    encours: 310_000_000,
    dateEntree: '2024-10-15',
  },
  {
    id: 'c8',
    nom: 'Tunde Adebayo',
    profilRisque: 'Performance',
    type: 'Privé',
    marche: 'NGX',
    pays: 'Nigeria',
    encours: 620_000_000,
    dateEntree: '2024-11-12',
  },
  {
    id: 'c9',
    nom: 'Adwoa Kwarteng',
    profilRisque: 'Croissance',
    type: 'Privé',
    marche: 'GSE',
    pays: 'Ghana',
    encours: 2_200_000,
    dateEntree: '2024-12-05',
  },
  // T1 2025
  {
    id: 'c10',
    nom: 'Fonds Retraite UEMOA',
    profilRisque: 'Sérénité',
    type: 'Institutionnel',
    marche: 'BRVM',
    pays: 'Sénégal',
    encours: 2_100_000_000,
    dateEntree: '2025-01-20',
  },
  {
    id: 'c11',
    nom: 'Mutuelle Horizon CI',
    profilRisque: 'Prudence',
    type: 'Institutionnel',
    marche: 'BRVM',
    pays: "Côte d'Ivoire",
    encours: 1_350_000_000,
    dateEntree: '2025-02-14',
  },
  {
    id: 'c12',
    nom: "Koffi N'Dri",
    profilRisque: 'Équilibré',
    type: 'Privé',
    marche: 'BRVM',
    pays: "Côte d'Ivoire",
    encours: 420_000_000,
    dateEntree: '2025-03-07',
  },
  // T2 2025
  {
    id: 'c13',
    nom: 'Nneka Obi',
    profilRisque: 'Performance',
    type: 'Privé',
    marche: 'NGX',
    pays: 'Nigeria',
    encours: 540_000_000,
    dateEntree: '2025-04-18',
  },
  {
    id: 'c14',
    nom: 'Kwame Asare',
    profilRisque: 'Croissance',
    type: 'Privé',
    marche: 'GSE',
    pays: 'Ghana',
    encours: 1_800_000,
    dateEntree: '2025-05-10',
  },
  {
    id: 'c15',
    nom: 'Pension Fund Lagos',
    profilRisque: 'Sérénité',
    type: 'Institutionnel',
    marche: 'NGX',
    pays: 'Nigeria',
    encours: 3_100_000_000,
    dateEntree: '2025-06-21',
  },
  // T3 2025
  {
    id: 'c16',
    nom: 'Pension Trust Accra',
    profilRisque: 'Prudence',
    type: 'Institutionnel',
    marche: 'GSE',
    pays: 'Ghana',
    encours: 18_000_000,
    dateEntree: '2025-07-11',
  },
  {
    id: 'c17',
    nom: 'Adjoa Mensah',
    profilRisque: 'Équilibré',
    type: 'Privé',
    marche: 'GSE',
    pays: 'Ghana',
    encours: 2_600_000,
    dateEntree: '2025-08-08',
  },
  {
    id: 'c18',
    nom: 'Ibrahim Diallo',
    profilRisque: 'Performance',
    type: 'Privé',
    marche: 'BRVM',
    pays: "Côte d'Ivoire",
    encours: 360_000_000,
    dateEntree: '2025-09-16',
  },
  // T4 2025
  {
    id: 'c19',
    nom: 'Binta Sow',
    profilRisque: 'Croissance',
    type: 'Privé',
    marche: 'BRVM',
    pays: 'Sénégal',
    encours: 275_000_000,
    dateEntree: '2025-10-06',
  },
  {
    id: 'c20',
    nom: 'Assurance Vie Atlantique',
    profilRisque: 'Sérénité',
    type: 'Institutionnel',
    marche: 'BRVM',
    pays: "Côte d'Ivoire",
    encours: 1_700_000_000,
    dateEntree: '2025-11-13',
  },
  {
    id: 'c21',
    nom: 'Caisse Sociale Atlantique',
    profilRisque: 'Prudence',
    type: 'Institutionnel',
    marche: 'NGX',
    pays: 'Nigeria',
    encours: 2_800_000_000,
    dateEntree: '2025-12-09',
  },
  // T1 2026
  {
    id: 'c22',
    nom: 'Chinedu Eze',
    profilRisque: 'Équilibré',
    type: 'Privé',
    marche: 'NGX',
    pays: 'Nigeria',
    encours: 710_000_000,
    dateEntree: '2026-01-17',
  },
  {
    id: 'c23',
    nom: 'Yao Kouassi',
    profilRisque: 'Performance',
    type: 'Privé',
    marche: 'BRVM',
    pays: "Côte d'Ivoire",
    encours: 295_000_000,
    dateEntree: '2026-02-06',
  },
  {
    id: 'c24',
    nom: 'Segun Balogun',
    profilRisque: 'Croissance',
    type: 'Privé',
    marche: 'NGX',
    pays: 'Nigeria',
    encours: 810_000_000,
    dateEntree: '2026-03-22',
  },
  // T2 2026
  {
    id: 'c25',
    nom: 'Caisse Patrimoine Ghana',
    profilRisque: 'Sérénité',
    type: 'Institutionnel',
    marche: 'GSE',
    pays: 'Ghana',
    encours: 22_000_000,
    dateEntree: '2026-04-09',
  },
  {
    id: 'c26',
    nom: 'Fondation Patrimoine Afrique',
    profilRisque: 'Prudence',
    type: 'Institutionnel',
    marche: 'BRVM',
    pays: 'Sénégal',
    encours: 1_150_000_000,
    dateEntree: '2026-05-18',
  },
  {
    id: 'c27',
    nom: 'Fatou Ndiaye',
    profilRisque: 'Équilibré',
    type: 'Privé',
    marche: 'BRVM',
    pays: 'Sénégal',
    encours: 260_000_000,
    dateEntree: '2026-06-25',
  },
  // T3 2026
  {
    id: 'c28',
    nom: 'Akosua Owusu',
    profilRisque: 'Performance',
    type: 'Privé',
    marche: 'GSE',
    pays: 'Ghana',
    encours: 3_000_000,
    dateEntree: '2026-07-08',
  },
  {
    id: 'c29',
    nom: 'Chiamaka Nwosu',
    profilRisque: 'Croissance',
    type: 'Privé',
    marche: 'NGX',
    pays: 'Nigeria',
    encours: 690_000_000,
    dateEntree: '2026-07-23',
  },
  {
    id: 'c30',
    nom: 'Fondation Épargne Sahel',
    profilRisque: 'Sérénité',
    type: 'Institutionnel',
    marche: 'BRVM',
    pays: 'Sénégal',
    encours: 980_000_000,
    dateEntree: '2026-08-03',
  },
];

const construirePortefeuilleGenere = (spec, index) => {
  const modele = PROFILS_PORTEFEUILLES_MODELES[spec.profilRisque];
  const deltaActions = [-4, -2, 0, 2, 4][index % 5];
  const deltaLiquidite = [-2, 0, 2, 0, -1][index % 5];
  const actions = modele.cible.Actions + deltaActions;
  const souveraines =
    modele.cible['Obl. souveraines'] - Math.round(deltaActions / 2);
  const liquidite = modele.cible.Liquidité + deltaLiquidite;
  const privees = 100 - actions - souveraines - liquidite;
  const decalagePerformance = [-0.8, -0.4, 0, 0.4, 0.8][index % 5];
  const decalageRendement = [-0.6, -0.3, 0, 0.3, 0.6][index % 5];

  return {
    ...spec,
    devise: DEVISE_PAR_MARCHE[spec.marche],
    perf: Number((modele.perf + decalagePerformance).toFixed(1)),
    risque: modele.risque,
    alertes: 0,
    rentabilite: Number((modele.rentabilite + decalageRendement).toFixed(1)),
    alloc: {
      Actions: actions,
      'Obl. souveraines': souveraines,
      'Obl. privées': privees,
      Liquidité: liquidite,
    },
    cible: { ...modele.cible },
  };
};

const CLIENTS_GENERES = PORTEFEUILLES_GENERES_SPECS.map(
  construirePortefeuilleGenere
);
const CLIENTS = [...CLIENTS_ORIGINAUX, ...CLIENTS_GENERES];

const PROFILE_TYPE_LABEL = {
  Privé: 'Particulier',
  Institutionnel: 'Institutionnel',
};
const PAYS_MARCHE = {
  "Côte d'Ivoire": 'BRVM',
  Sénégal: 'BRVM',
  Nigeria: 'NGX',
  Ghana: 'GSE',
};
const TITRE_SECTEUR = {
  SONATEL: 'Télécoms',
  'ECOBANK CI': 'Banques',
  'MTN NIGERIA': 'Télécoms',
  'ZENITH BANK': 'Banques',
  'GCB BANK': 'Banques',
  PALMCI: 'Agro-industrie',
};
function aggregateEncoursBy(keyFn) {
  const map = {};
  let total = 0;
  CLIENTS.forEach((c) => {
    const key = keyFn(c);
    const v = toRef(c.encours, c.devise);
    map[key] = (map[key] || 0) + v;
    total += v;
  });
  return Object.entries(map).map(([name, v]) => ({
    name,
    value: Math.round((v / total) * 100),
  }));
}
const PROFILE_TYPE_MIX = aggregateEncoursBy(
  (c) => PROFILE_TYPE_LABEL[c.type] || c.type
);
const RISK_PROFILE_MIX = aggregateEncoursBy((c) => c.profilRisque);
const CURRENCY_MIX = aggregateEncoursBy((c) => c.devise);

const CORR_SECTEURS_LABELS = [
  'Banques',
  'Télécoms',
  'Agro-industrie',
  'Énergie',
  'Assurance',
  'Distribution',
];
const CORR_SECTEURS_HIST = [
  [1, 0.35, 0.2, 0.3, 0.55, 0.25],
  [0.35, 1, 0.15, 0.25, 0.3, 0.2],
  [0.2, 0.15, 1, 0.3, 0.2, 0.35],
  [0.3, 0.25, 0.3, 1, 0.25, 0.2],
  [0.55, 0.3, 0.2, 0.25, 1, 0.3],
  [0.25, 0.2, 0.35, 0.2, 0.3, 1],
];
const CORR_SECTEURS_CRISE = [
  [1, 0.68, 0.55, 0.6, 0.8, 0.58],
  [0.68, 1, 0.5, 0.55, 0.62, 0.52],
  [0.55, 0.5, 1, 0.58, 0.5, 0.6],
  [0.6, 0.55, 0.58, 1, 0.55, 0.5],
  [0.8, 0.62, 0.5, 0.55, 1, 0.6],
  [0.58, 0.52, 0.6, 0.5, 0.6, 1],
];
const CORR_PAYS_LABELS = ["Côte d'Ivoire", 'Nigeria', 'Ghana', 'Sénégal'];
const CORR_PAYS_HIST = [
  [1, 0.3, 0.25, 0.5],
  [0.3, 1, 0.35, 0.2],
  [0.25, 0.35, 1, 0.2],
  [0.5, 0.2, 0.2, 1],
];
const CORR_PAYS_CRISE = [
  [1, 0.65, 0.6, 0.78],
  [0.65, 1, 0.68, 0.55],
  [0.6, 0.68, 1, 0.5],
  [0.78, 0.55, 0.5, 1],
];

const STRESS_SCENARIOS = [
  {
    nom: 'Choc marché Actions',
    zone: 'Actions',
    unite: '%',
    chocDefaut: -15,
    sensibilite: 0.42,
    min: -40,
    max: 0,
  },
  {
    nom: 'Choc marché Obligations',
    zone: 'Obligations',
    unite: 'bps',
    chocDefaut: 100,
    sensibilite: -0.021,
    min: -200,
    max: 200,
  },
  {
    nom: 'Choc niveau de liquidité',
    zone: 'Liquidité',
    unite: 'bps',
    chocDefaut: -50,
    sensibilite: 0.006,
    min: -200,
    max: 200,
  },
];
const UPCOMING_CASHFLOWS = [
  {
    titre: 'SONATEL',
    type: 'Dividende',
    echeance: '15/08/2026',
    montant: 150000,
    devise: 'XOF',
    portefeuilles: 'Aïcha Koné, Fonds Prévoyance CI',
  },
  {
    titre: 'Obligation Trésor CI 6.5% 2029',
    type: 'Coupon',
    echeance: '12/08/2026',
    montant: 410000,
    devise: 'XOF',
    portefeuilles: 'Fonds Prévoyance CI, Groupe Assurance Sahel',
  },
  {
    titre: 'MTN NIGERIA',
    type: 'Dividende',
    echeance: '20/08/2026',
    montant: 260000,
    devise: 'NGN',
    portefeuilles: 'Emeka Okafor',
  },
  {
    titre: 'ZENITH BANK',
    type: 'Dividende',
    echeance: '28/08/2026',
    montant: 175000,
    devise: 'NGN',
    portefeuilles: 'Caisse Retraite Littoral',
  },
  {
    titre: 'GCB BANK',
    type: 'Dividende',
    echeance: '05/09/2026',
    montant: 32000,
    devise: 'GHS',
    portefeuilles: 'Ama Boateng',
  },
];
const parseFR = (d) => {
  const [j, m, a] = d.split('/').map(Number);
  return new Date(a, m - 1, j);
};
const AUJOURDHUI = new Date(2026, 6, 29);
const joursDepuisAujourdhui = (d) =>
  Math.round((parseFR(d) - AUJOURDHUI) / 86_400_000);

const MARKETS_DATA = [
  {
    nom: 'SONATEL',
    type: 'Action',
    marche: 'BRVM',
    devise: 'XOF',
    cours: 14200,
    variation: 1.8,
    volumeJour: 128_450,
    coursMin: 13950,
    coursMax: 14350,
  },
  {
    nom: 'ECOBANK CI',
    type: 'Action',
    marche: 'BRVM',
    devise: 'XOF',
    cours: 6650,
    variation: -0.9,
    volumeJour: 84_620,
    coursMin: 6600,
    coursMax: 6750,
  },
  {
    nom: 'PALMCI',
    type: 'Action',
    marche: 'BRVM',
    devise: 'XOF',
    cours: 8100,
    variation: 0.3,
    volumeJour: 23_410,
    coursMin: 8030,
    coursMax: 8160,
  },
  {
    nom: 'MTN NIGERIA',
    type: 'Action',
    marche: 'NGX',
    devise: 'NGN',
    cours: 218.5,
    variation: 2.4,
    volumeJour: 2_845_000,
    coursMin: 212.4,
    coursMax: 221.8,
  },
  {
    nom: 'ZENITH BANK',
    type: 'Action',
    marche: 'NGX',
    devise: 'NGN',
    cours: 41.2,
    variation: -1.1,
    volumeJour: 7_420_000,
    coursMin: 40.8,
    coursMax: 42.1,
  },
  {
    nom: 'GCB BANK',
    type: 'Action',
    marche: 'GSE',
    devise: 'GHS',
    cours: 5.4,
    variation: 3.2,
    volumeJour: 318_500,
    coursMin: 5.18,
    coursMax: 5.48,
  },
  {
    nom: 'Obligation Trésor CI 6.5% 2029',
    type: 'Obligation',
    marche: 'BRVM',
    devise: 'XOF',
    cours: 10050,
    variation: 0.1,
    volumeJour: 1_250,
    coursMin: 10020,
    coursMax: 10080,
  },
  {
    nom: 'Obligation Trésor NGN 2028',
    type: 'Obligation',
    marche: 'NGX',
    devise: 'NGN',
    cours: 98.7,
    variation: -0.2,
    volumeJour: 3_600,
    coursMin: 98.4,
    coursMax: 99.1,
  },
  {
    nom: 'Obligation Corporate GSE 2027',
    type: 'Obligation',
    marche: 'GSE',
    devise: 'GHS',
    cours: 101.4,
    variation: 0.4,
    volumeJour: 920,
    coursMin: 101.0,
    coursMax: 101.8,
  },
];

/* ---------------------- ESPACE CLIENT — GESTION LIBRE ---------------------- */
/*
 * Données de démonstration : un même investisseur consolide ici plusieurs
 * portefeuilles détenus auprès de SGI différentes et sur plusieurs marchés.
 * En production, ces données proviendront des connexions/API ou imports des SGI.
 */
const CLIENT_GESTION_LIBRE = {
  id: 'investisseur-demo-01',
  nom: 'Koffi Mensah',
  deviseReference: 'XOF',
  portefeuilles: [
    {
      id: 'cl-pf-brvm',
      nom: 'Portefeuille BRVM Côte d’Ivoire',
      sgi: 'Atlantic Bourse',
      pays: "Côte d'Ivoire",
      marche: 'BRVM',
      devise: 'XOF',
      compteEspeces: 15_000_000,
      perfYtd: 6.4,
      lignes: [
        { instrument: 'SONATEL', qte: 4_200, pru: 13_250 },
        { instrument: 'ECOBANK CI', qte: 3_000, pru: 6_920 },
        {
          instrument: 'Obligation Trésor CI 6.5% 2029',
          qte: 3_500,
          pru: 10_010,
        },
      ],
    },
    {
      id: 'cl-pf-brvm-2',
      nom: 'Portefeuille BRVM Sénégal',
      sgi: 'Sahel Capital Markets',
      pays: 'Sénégal',
      marche: 'BRVM',
      devise: 'XOF',
      compteEspeces: 8_500_000,
      perfYtd: 5.2,
      lignes: [
        { instrument: 'SONATEL', qte: 1_600, pru: 13_480 },
        { instrument: 'PALMCI', qte: 900, pru: 7_950 },
        {
          instrument: 'Obligation Trésor CI 6.5% 2029',
          qte: 1_200,
          pru: 10_020,
        },
      ],
    },
    {
      id: 'cl-pf-ngx',
      nom: 'Portefeuille Nigeria Lagos',
      sgi: 'Lagos Securities',
      pays: 'Nigeria',
      marche: 'NGX',
      devise: 'NGN',
      compteEspeces: 9_000_000,
      perfYtd: 4.1,
      lignes: [
        { instrument: 'MTN NIGERIA', qte: 120_000, pru: 205.4 },
        { instrument: 'ZENITH BANK', qte: 500_000, pru: 38.6 },
        { instrument: 'Obligation Trésor NGN 2028', qte: 180_000, pru: 99.2 },
      ],
    },
    {
      id: 'cl-pf-ngx-2',
      nom: 'Portefeuille Nigeria Abuja',
      sgi: 'Abuja Capital Securities',
      pays: 'Nigeria',
      marche: 'NGX',
      devise: 'NGN',
      compteEspeces: 5_000_000,
      perfYtd: 6.0,
      lignes: [
        { instrument: 'MTN NIGERIA', qte: 55_000, pru: 209.8 },
        { instrument: 'ZENITH BANK', qte: 180_000, pru: 39.1 },
        { instrument: 'Obligation Trésor NGN 2028', qte: 90_000, pru: 98.9 },
      ],
    },
    {
      id: 'cl-pf-gse',
      nom: 'Portefeuille Ghana Accra',
      sgi: 'Accra Capital',
      pays: 'Ghana',
      marche: 'GSE',
      devise: 'GHS',
      compteEspeces: 450_000,
      perfYtd: 8.2,
      lignes: [
        { instrument: 'GCB BANK', qte: 220_000, pru: 4.85 },
        {
          instrument: 'Obligation Corporate GSE 2027',
          qte: 13_000,
          pru: 100.2,
        },
      ],
    },
    {
      id: 'cl-pf-gse-2',
      nom: 'Portefeuille Ghana secondaire',
      sgi: 'Gold Coast Securities',
      pays: 'Ghana',
      marche: 'GSE',
      devise: 'GHS',
      compteEspeces: 280_000,
      perfYtd: 5.7,
      lignes: [
        { instrument: 'GCB BANK', qte: 95_000, pru: 5.02 },
        {
          instrument: 'Obligation Corporate GSE 2027',
          qte: 7_000,
          pru: 100.7,
        },
      ],
    },
  ],
};

const CLIENT_CASHFLOWS = [
  {
    id: 'CF-CL-01',
    portefeuilleId: 'cl-pf-brvm',
    date: '15/08/2026',
    type: 'Dividende',
    instrument: 'SONATEL',
    montant: 1_680_000,
    devise: 'XOF',
    statut: 'À recevoir',
  },
  {
    id: 'CF-CL-02',
    portefeuilleId: 'cl-pf-brvm',
    date: '12/08/2026',
    type: 'Coupon',
    instrument: 'Obligation Trésor CI 6.5% 2029',
    montant: 2_275_000,
    devise: 'XOF',
    statut: 'À recevoir',
  },
  {
    id: 'CF-CL-03',
    portefeuilleId: 'cl-pf-ngx',
    date: '20/08/2026',
    type: 'Dividende',
    instrument: 'MTN NIGERIA',
    montant: 1_260_000,
    devise: 'NGN',
    statut: 'À recevoir',
  },
  {
    id: 'CF-CL-04',
    portefeuilleId: 'cl-pf-ngx',
    date: '28/08/2026',
    type: 'Dividende',
    instrument: 'ZENITH BANK',
    montant: 925_000,
    devise: 'NGN',
    statut: 'À recevoir',
  },
  {
    id: 'CF-CL-05',
    portefeuilleId: 'cl-pf-gse',
    date: '05/09/2026',
    type: 'Dividende',
    instrument: 'GCB BANK',
    montant: 88_000,
    devise: 'GHS',
    statut: 'À recevoir',
  },
  {
    id: 'CF-CL-06',
    portefeuilleId: 'cl-pf-brvm-2',
    date: '18/08/2026',
    type: 'Dividende',
    instrument: 'SONATEL',
    montant: 640_000,
    devise: 'XOF',
    statut: 'À recevoir',
  },
  {
    id: 'CF-CL-07',
    portefeuilleId: 'cl-pf-ngx-2',
    date: '26/08/2026',
    type: 'Coupon',
    instrument: 'Obligation Trésor NGN 2028',
    montant: 410_000,
    devise: 'NGN',
    statut: 'À recevoir',
  },
  {
    id: 'CF-CL-08',
    portefeuilleId: 'cl-pf-gse-2',
    date: '07/09/2026',
    type: 'Coupon',
    instrument: 'Obligation Corporate GSE 2027',
    montant: 46_000,
    devise: 'GHS',
    statut: 'À recevoir',
  },
];

const INITIAL_CLIENT_ORDERS = [
  {
    id: 'CL-ORD-001',
    date: '08/08/2026',
    portefeuilleId: 'cl-pf-brvm',
    instrument: 'SONATEL',
    marche: 'BRVM',
    devise: 'XOF',
    sens: 'Achat',
    qte: 200,
    typeOrdre: 'Ordre limite',
    prix: 14_050,
    statut: 'Exécuté',
  },
  {
    id: 'CL-ORD-002',
    date: '09/08/2026',
    portefeuilleId: 'cl-pf-ngx',
    instrument: 'ZENITH BANK',
    marche: 'NGX',
    devise: 'NGN',
    sens: 'Vente',
    qte: 25_000,
    typeOrdre: 'Ordre limite',
    prix: 41.5,
    statut: 'En attente',
  },
  {
    id: 'CL-ORD-003',
    date: '10/08/2026',
    portefeuilleId: 'cl-pf-brvm',
    instrument: 'SONATEL',
    marche: 'BRVM',
    devise: 'XOF',
    sens: 'Achat',
    qte: 150,
    typeOrdre: 'Ordre limite',
    prix: 14_100,
    statut: 'En attente',
  },
  {
    id: 'CL-ORD-004',
    date: '10/08/2026',
    portefeuilleId: 'cl-pf-ngx',
    instrument: 'MTN NIGERIA',
    marche: 'NGX',
    devise: 'NGN',
    sens: 'Achat',
    qte: 10_000,
    typeOrdre: 'Ordre limite',
    prix: 216,
    statut: 'En cours',
  },
  {
    id: 'CL-ORD-005',
    date: '10/08/2026',
    portefeuilleId: 'cl-pf-gse',
    instrument: 'GCB BANK',
    marche: 'GSE',
    devise: 'GHS',
    sens: 'Achat',
    qte: 10_000,
    typeOrdre: 'Ordre limite',
    prix: 5.35,
    statut: 'En attente',
  },
  {
    id: 'CL-ORD-006',
    date: '11/08/2026',
    portefeuilleId: 'cl-pf-brvm-2',
    instrument: 'PALMCI',
    marche: 'BRVM',
    devise: 'XOF',
    sens: 'Achat',
    qte: 200,
    typeOrdre: 'Ordre limite',
    prix: 8_050,
    statut: 'En attente',
  },
  {
    id: 'CL-ORD-007',
    date: '11/08/2026',
    portefeuilleId: 'cl-pf-ngx-2',
    instrument: 'ZENITH BANK',
    marche: 'NGX',
    devise: 'NGN',
    sens: 'Achat',
    qte: 50_000,
    typeOrdre: 'Ordre limite',
    prix: 40.9,
    statut: 'En cours',
  },
  {
    id: 'CL-ORD-008',
    date: '11/08/2026',
    portefeuilleId: 'cl-pf-gse-2',
    instrument: 'GCB BANK',
    marche: 'GSE',
    devise: 'GHS',
    sens: 'Achat',
    qte: 5_000,
    typeOrdre: 'Ordre limite',
    prix: 5.3,
    statut: 'En attente',
  },
];

const CLIENT_NAV = [
  { id: 'client-dashboard', label: 'Vue consolidée', icon: Home },
  {
    id: 'client-portfolios',
    label: 'Mes portefeuilles & SGI',
    icon: Briefcase,
  },
  {
    id: 'client-markets',
    label: 'Vues  des Marchés',
    icon: Building2,
  },
  { id: 'client-watchlist', label: 'Watchlist', icon: Star },
  { id: 'client-invest', label: 'Passer un ordre', icon: TrendingUp },
  { id: 'client-orders', label: 'Mes ordres', icon: ListOrdered },
  { id: 'client-avis', label: "Avis d'opéré", icon: FileCheck2 },
  { id: 'client-cashflows', label: 'Liquidité & revenus', icon: Droplets },
  { id: 'client-analysis', label: 'Performance & risque', icon: Activity },
];

const clientMarket = (instrument) =>
  MARKETS_DATA.find((item) => item.nom === instrument);

const clientPortfolioValue = (portefeuille) =>
  portefeuille.compteEspeces +
  portefeuille.lignes.reduce((somme, ligne) => {
    const marche = clientMarket(ligne.instrument);
    return somme + ligne.qte * Number(marche?.cours || ligne.pru || 0);
  }, 0);

const clientLineValue = (ligne) => {
  const marche = clientMarket(ligne.instrument);
  return ligne.qte * Number(marche?.cours || ligne.pru || 0);
};

const clientPortfolioValueIn = (portefeuille, devise) =>
  convertCurrency(
    clientPortfolioValue(portefeuille),
    portefeuille.devise,
    devise
  );

const clientCashIn = (portefeuille, devise) =>
  convertCurrency(portefeuille.compteEspeces, portefeuille.devise, devise);

const CLIENT_OPEN_ORDER_STATUSES = ['En attente', 'En cours'];

const clientReservedCash = (portefeuille, orders = []) => {
  const montantReserve = orders
    .filter(
      (ordre) =>
        ordre.portefeuilleId === portefeuille.id &&
        ordre.sens === 'Achat' &&
        CLIENT_OPEN_ORDER_STATUSES.includes(ordre.statut)
    )
    .reduce(
      (somme, ordre) =>
        somme + Number(ordre.qte || 0) * Number(ordre.prix || 0),
      0
    );

  return Math.min(
    Number(portefeuille.compteEspeces || 0),
    Math.max(0, montantReserve)
  );
};

const clientAvailableCash = (portefeuille, orders = []) =>
  Math.max(
    0,
    Number(portefeuille.compteEspeces || 0) -
      clientReservedCash(portefeuille, orders)
  );

const clientAvailableCashIn = (portefeuille, orders, devise) =>
  convertCurrency(
    clientAvailableCash(portefeuille, orders),
    portefeuille.devise,
    devise
  );

const clientReservedCashIn = (portefeuille, orders, devise) =>
  convertCurrency(
    clientReservedCash(portefeuille, orders),
    portefeuille.devise,
    devise
  );

const clientAssetClass = (instrument) =>
  clientMarket(instrument)?.type === 'Obligation' ? 'Obligations' : 'Actions';

const CLIENT_SECTEUR_INSTRUMENT = {
  SONATEL: 'Télécoms',
  'ECOBANK CI': 'Banques',
  PALMCI: 'Agro-industrie',
  'MTN NIGERIA': 'Télécoms',
  'ZENITH BANK': 'Banques',
  'GCB BANK': 'Banques',
  'Obligation Trésor CI 6.5% 2029': 'Souverain',
  'Obligation Trésor NGN 2028': 'Souverain',
  'Obligation Corporate GSE 2027': 'Corporate',
};

const clientSector = (instrument) =>
  CLIENT_SECTEUR_INSTRUMENT[instrument] || 'Autres';

const CLIENT_HISTORY = [
  { date: '2025-09-01', mois: 'Sept 25', valeur: 100 },
  { date: '2025-10-01', mois: 'Oct', valeur: 101.8 },
  { date: '2025-11-01', mois: 'Nov', valeur: 103.1 },
  { date: '2025-12-01', mois: 'Déc', valeur: 102.4 },
  { date: '2026-01-01', mois: 'Jan 26', valeur: 104.6 },
  { date: '2026-02-01', mois: 'Fév', valeur: 105.2 },
  { date: '2026-03-01', mois: 'Mar', valeur: 106.9 },
  { date: '2026-04-01', mois: 'Avr', valeur: 108.1 },
  { date: '2026-05-01', mois: 'Mai', valeur: 109.4 },
  { date: '2026-06-01', mois: 'Juin', valeur: 108.8 },
  { date: '2026-07-01', mois: 'Juil', valeur: 111.7 },
  { date: '2026-08-01', mois: 'Août', valeur: 113.2 },
];

const orderBookDemo = (m) => {
  const step = Math.max(m.cours * 0.002, 0.01);
  const asks = [4, 3, 2, 1].map((i) => ({
    prix: +(m.cours + step * i).toFixed(2),
    qte: Math.round(180 + i * 140),
  }));
  const bids = [1, 2, 3, 4].map((i) => ({
    prix: +(m.cours - step * i).toFixed(2),
    qte: Math.round(200 + i * 120),
  }));
  return { asks, bids };
};
const executionsDemo = (m) => {
  const execs = [
    { heure: '09:58', sens: 'Achat', qte: 150, prix: m.cours },
    {
      heure: '10:15',
      sens: 'Vente',
      qte: 220,
      prix: +(m.cours * 0.999).toFixed(2),
    },
    {
      heure: '10:41',
      sens: 'Achat',
      qte: 90,
      prix: +(m.cours * 1.001).toFixed(2),
    },
    { heure: '11:05', sens: 'Achat', qte: 310, prix: m.cours },
    {
      heure: '11:32',
      sens: 'Vente',
      qte: 140,
      prix: +(m.cours * 0.998).toFixed(2),
    },
  ];
  let cumule = 0;
  return execs.map((e) => {
    cumule += e.qte;
    return { ...e, cumule };
  });
};

const ASSET_KEYS = ['Actions', 'Obl. souveraines', 'Obl. privées', 'Liquidité'];
const totalEncoursReference = CLIENTS.reduce(
  (somme, client) => somme + toRef(client.encours, client.devise),
  0
);
const ASSET_MIX = ASSET_KEYS.map((name) => {
  const valeur = CLIENTS.reduce(
    (somme, client) =>
      somme +
      toRef(
        (client.encours * Number(client.alloc[name] || 0)) / 100,
        client.devise
      ),
    0
  );
  return {
    name,
    value:
      totalEncoursReference > 0
        ? Math.round((valeur / totalEncoursReference) * 100)
        : 0,
  };
});
const MARKET_MIX = aggregateEncoursBy(
  (client) => `${client.marche} (${client.devise})`
);
const COUNTRY_MIX = aggregateEncoursBy((client) => client.pays);
const SECTOR_MIX = [
  { name: 'Banques', value: 34 },
  { name: 'Télécoms', value: 20 },
  { name: 'Agro-industrie', value: 16 },
  { name: 'Énergie', value: 14 },
  { name: 'Assurance', value: 10 },
  { name: 'Distribution', value: 6 },
];
const SECTOR_CONTRIB = [
  { name: 'Banques', valeur: 1720, pct: 34 },
  { name: 'Télécoms', valeur: 1010, pct: 20 },
  { name: 'Agro-industrie', valeur: 810, pct: 16 },
  { name: 'Énergie', valeur: 705, pct: 14 },
  { name: 'Assurance', valeur: 505, pct: 10 },
  { name: 'Distribution', valeur: 300, pct: 6 },
];
const HISTORY = Array.from({ length: 12 }).map((_, i) => ({
  mois: [
    'Août',
    'Sept',
    'Oct',
    'Nov',
    'Déc',
    'Jan',
    'Fév',
    'Mar',
    'Avr',
    'Mai',
    'Juin',
    'Juil',
  ][i],
  encours: 100 + i * 1.6 + Math.sin(i) * 2.2,
  brvm: 100 + i * 1.1 + Math.cos(i) * 2.5,
  ngxAsi: 100 + i * 0.6 + Math.sin(i * 1.3) * 3,
}));
const HISTORIQUE_TRIMESTRIEL_PORTEFEUILLES = [
  { trimestre: 'T4 2024', fin: '2024-12-31' },
  { trimestre: 'T1 2025', fin: '2025-03-31' },
  { trimestre: 'T2 2025', fin: '2025-06-30' },
  { trimestre: 'T3 2025', fin: '2025-09-30' },
  { trimestre: 'T4 2025', fin: '2025-12-31' },
  { trimestre: 'T1 2026', fin: '2026-03-31' },
  { trimestre: 'T2 2026', fin: '2026-06-30' },
  { trimestre: 'T3 2026', fin: '2026-09-30' },
];

const ORDERS = [
  {
    id: 'OR-2201',
    sens: 'Achat',
    titre: 'SONATEL',
    marche: 'BRVM',
    devise: 'XOF',
    qte: 500,
    prix: 14200,
    statut: 'Exécuté',
    pf: 'Fonds Prévoyance CI',
  },
  {
    id: 'OR-2202',
    sens: 'Vente',
    titre: 'ECOBANK CI',
    marche: 'BRVM',
    devise: 'XOF',
    qte: 1200,
    prix: 6650,
    statut: 'Exécuté',
    pf: 'Aïcha Koné',
  },
  {
    id: 'OR-2203',
    sens: 'Achat',
    titre: 'MTN NIGERIA',
    marche: 'NGX',
    devise: 'NGN',
    qte: 300,
    prix: 218.5,
    statut: 'En cours',
    pf: 'Emeka Okafor',
  },
  {
    id: 'OR-2204',
    sens: 'Achat',
    titre: 'Obligation Trésor CI 6.5% 2029',
    marche: 'BRVM',
    devise: 'XOF',
    qte: 200,
    prix: 10050,
    statut: 'En attente',
    pf: 'Groupe Assurance Sahel',
  },
  {
    id: 'OR-2205',
    sens: 'Vente',
    titre: 'GCB BANK',
    marche: 'GSE',
    devise: 'GHS',
    qte: 800,
    prix: 5.4,
    statut: 'Exécuté',
    pf: 'Ama Boateng',
  },
  {
    id: 'OR-2206',
    sens: 'Achat',
    titre: 'ZENITH BANK',
    marche: 'NGX',
    devise: 'NGN',
    qte: 1500,
    prix: 41.2,
    statut: 'Annulé',
    pf: 'Caisse Retraite Littoral',
  },
];
const AVIS = [
  {
    id: 'AV-9001',
    client: 'Fonds Prévoyance CI',
    titre: 'SONATEL',
    sens: 'Achat',
    qte: 500,
    prix: 14200,
    marche: 'BRVM',
    devise: 'XOF',
    date: '22/07/2026',
    frais: {
      tauxComSgi: 0.008,
      tauxIrvm: 0,
      tauxTaf: 0.18,
      tauxFraisChange: 0,
    },
  },
  {
    id: 'AV-9002',
    client: 'Aïcha Koné',
    titre: 'ECOBANK CI',
    sens: 'Vente',
    qte: 1200,
    prix: 6650,
    marche: 'BRVM',
    devise: 'XOF',
    date: '22/07/2026',
    frais: {
      tauxComSgi: 0.008,
      tauxIrvm: 0,
      tauxTaf: 0.18,
      tauxFraisChange: 0,
    },
  },
  {
    id: 'AV-9003',
    client: 'Ama Boateng',
    titre: 'GCB BANK',
    sens: 'Vente',
    qte: 800,
    prix: 5.4,
    marche: 'GSE',
    devise: 'GHS',
    date: '21/07/2026',
    frais: {
      tauxComSgi: 0.007,
      tauxIrvm: 0,
      tauxTaf: 0.15,
      tauxFraisChange: 0.004,
    },
  },
  {
    id: 'AV-9004',
    client: 'Groupe Assurance Sahel',
    titre: 'Obligation Trésor CI 6.5% 2029',
    sens: 'Achat',
    qte: 200,
    prix: 10050,
    marche: 'BRVM',
    devise: 'XOF',
    date: '20/07/2026',
    frais: {
      tauxComSgi: 0.005,
      tauxIrvm: 0,
      tauxTaf: 0.18,
      tauxFraisChange: 0,
    },
  },
];

const arrondirMontantAvis = (montant, devise) =>
  devise === 'XOF'
    ? Math.round(montant)
    : Math.round((montant + Number.EPSILON) * 100) / 100;

const calculerAvis = (avis) => {
  const montantBrut = arrondirMontantAvis(avis.qte * avis.prix, avis.devise);
  const comSgi = arrondirMontantAvis(
    montantBrut * (avis.frais?.tauxComSgi || 0),
    avis.devise
  );
  const irvm = arrondirMontantAvis(
    montantBrut * (avis.frais?.tauxIrvm || 0),
    avis.devise
  );
  const taf = arrondirMontantAvis(
    comSgi * (avis.frais?.tauxTaf || 0),
    avis.devise
  );
  const fraisChange = arrondirMontantAvis(
    avis.frais?.montantFraisChange ??
      montantBrut * (avis.frais?.tauxFraisChange || 0),
    avis.devise
  );
  const totalFrais = arrondirMontantAvis(
    comSgi + irvm + taf + fraisChange,
    avis.devise
  );

  return {
    montantBrut,
    comSgi,
    irvm,
    taf,
    fraisChange,
    totalFrais,
    montantDebite:
      avis.sens === 'Achat'
        ? arrondirMontantAvis(montantBrut + totalFrais, avis.devise)
        : 0,
    montantCredite:
      avis.sens === 'Vente'
        ? arrondirMontantAvis(
            Math.max(0, montantBrut - totalFrais),
            avis.devise
          )
        : 0,
  };
};

const RECOS = [
  {
    titre: 'SONATEL',
    marche: 'BRVM',
    devise: 'XOF',
    sens: 'Achat',
    secteur: 'Télécoms',
    cours: 14200,
    objectif: 16000,
    conviction: 'Forte',
    technique: {
      mm: 'MM20 > MM50',
      macd: 'Positif',
      rsi: 62,
      bol: 'Proche bande sup.',
      signal: 'Acheter',
    },
    fondamentale: {
      per: 12.8,
      rentabilite: '18.4%',
      evol: '+9.2%',
      valo: 'Sous-évaluée',
      signal: 'Acheter',
    },
  },
  {
    titre: 'MTN NIGERIA',
    marche: 'NGX',
    devise: 'NGN',
    sens: 'Conserver',
    secteur: 'Télécoms',
    cours: 218.5,
    objectif: 225,
    conviction: 'Moyenne',
    technique: {
      mm: 'MM20 ≈ MM50',
      macd: 'Neutre',
      rsi: 54,
      bol: 'Milieu des bandes',
      signal: 'Conserver',
    },
    fondamentale: {
      per: 10.6,
      rentabilite: '24.1%',
      evol: '+6.8%',
      valo: 'Équitable',
      signal: 'Acheter',
    },
  },
  {
    titre: 'ECOBANK CI',
    marche: 'BRVM',
    devise: 'XOF',
    sens: 'Vente',
    secteur: 'Banques',
    cours: 6650,
    objectif: 5900,
    conviction: 'Forte',
    technique: {
      mm: 'MM20 < MM50',
      macd: 'Négatif',
      rsi: 38,
      bol: 'Proche bande inf.',
      signal: 'Vendre',
    },
    fondamentale: {
      per: 15.3,
      rentabilite: '9.7%',
      evol: '-4.5%',
      valo: 'Surévaluée',
      signal: 'Vendre',
    },
  },
  {
    titre: 'GCB BANK',
    marche: 'GSE',
    devise: 'GHS',
    sens: 'Achat',
    secteur: 'Banques',
    cours: 5.4,
    objectif: 6.3,
    conviction: 'Moyenne',
    technique: {
      mm: 'MM20 > MM50',
      macd: 'Positif',
      rsi: 66,
      bol: 'Proche bande sup.',
      signal: 'Acheter',
    },
    fondamentale: {
      per: 7.9,
      rentabilite: '21.5%',
      evol: '+12.4%',
      valo: 'Sous-évaluée',
      signal: 'Acheter',
    },
  },
  {
    titre: 'ZENITH BANK',
    marche: 'NGX',
    devise: 'NGN',
    sens: 'Achat',
    secteur: 'Banques',
    cours: 41.2,
    objectif: 47,
    conviction: 'Forte',
    technique: {
      mm: 'MM20 > MM50',
      macd: 'Positif',
      rsi: 71,
      bol: 'Au-dessus bande sup.',
      signal: 'Alléger',
    },
    fondamentale: {
      per: 5.8,
      rentabilite: '31.2%',
      evol: '+15.1%',
      valo: 'Sous-évaluée',
      signal: 'Acheter',
    },
  },
  {
    titre: 'PALMCI',
    marche: 'BRVM',
    devise: 'XOF',
    sens: 'Conserver',
    secteur: 'Agro-industrie',
    cours: 8100,
    objectif: 8300,
    conviction: 'Faible',
    technique: {
      mm: 'MM20 ≈ MM50',
      macd: 'Faible +',
      rsi: 57,
      bol: 'Milieu des bandes',
      signal: 'Conserver',
    },
    fondamentale: {
      per: 17.4,
      rentabilite: '8.2%',
      evol: '+1.6%',
      valo: 'Surévaluée',
      signal: 'Vendre',
    },
  },
];

const WATCHLIST_THESES = {
  SONATEL: {
    horizon: '12–24 mois',
    these:
      'Croissance régulière, forte génération de trésorerie et valorisation encore attractive.',
  },
  'MTN NIGERIA': {
    horizon: '9–18 mois',
    these:
      'Rentabilité élevée et potentiel de revalorisation, sous réserve du risque de change.',
  },
  'GCB BANK': {
    horizon: '12–18 mois',
    these:
      'PER faible, rentabilité solide et progression bénéficiaire favorable.',
  },
  'ZENITH BANK': {
    horizon: '6–12 mois',
    these:
      'Valorisation décotée, rentabilité élevée et dynamique bénéficiaire robuste.',
  },
};

const WATCHLIST_STATIQUE = RECOS.filter(
  (r) => r.fondamentale.signal === 'Acheter'
).map((r) => ({
  ...r,
  horizon: WATCHLIST_THESES[r.titre]?.horizon || '12 mois',
  these:
    WATCHLIST_THESES[r.titre]?.these ||
    'Fondamentaux favorables et potentiel de revalorisation à moyen terme.',
}));

const parsePctNumber = (value) =>
  Number(String(value).replace('%', '').replace('+', '').replace(',', '.')) ||
  0;

const watchlistDailyDrift = (dateKey, titre) => {
  const seed = `${dateKey}-${titre}`
    .split('')
    .reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);
  return (seed % 11) - 5;
};

const scoreTechniqueWatchlist = (r) => {
  const signalBase =
    {
      Acheter: 78,
      Conserver: 58,
      Alléger: 42,
      Vendre: 24,
    }[r.technique.signal] || 50;

  const mm = r.technique.mm.includes('>')
    ? 8
    : r.technique.mm.includes('<')
    ? -8
    : 2;
  const macd = r.technique.macd.includes('Positif')
    ? 8
    : r.technique.macd.includes('Négatif')
    ? -8
    : 1;
  const rsi =
    r.technique.rsi >= 45 && r.technique.rsi <= 68
      ? 7
      : r.technique.rsi >= 35 && r.technique.rsi <= 75
      ? 3
      : -4;

  return Math.max(0, Math.min(100, signalBase + mm + macd + rsi));
};

const scoreFondamentalWatchlist = (r) => {
  const signal = r.fondamentale.signal === 'Acheter' ? 55 : 25;
  const valorisation =
    r.fondamentale.valo === 'Sous-évaluée'
      ? 16
      : r.fondamentale.valo === 'Équitable'
      ? 9
      : -8;
  const rentabilite = Math.min(
    14,
    parsePctNumber(r.fondamentale.rentabilite) * 0.45
  );
  const croissance = Math.max(
    -10,
    Math.min(15, parsePctNumber(r.fondamentale.evol) * 0.7)
  );

  return Math.max(
    0,
    Math.min(100, Math.round(signal + valorisation + rentabilite + croissance))
  );
};

const buildWatchlistJournaliere = (dateKey) =>
  RECOS.map((r) => {
    const scoreTechnique = scoreTechniqueWatchlist(r);
    const scoreFondamental = scoreFondamentalWatchlist(r);
    const scoreCombine = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          scoreTechnique * 0.7 +
            scoreFondamental * 0.3 +
            watchlistDailyDrift(dateKey, r.titre)
        )
      )
    );
    const marche = MARKETS_DATA.find((m) => m.nom === r.titre);
    const signalJour =
      scoreCombine >= 78
        ? 'Surveiller achat'
        : scoreCombine >= 63
        ? 'Attendre confirmation'
        : scoreCombine >= 48
        ? 'Conserver sous surveillance'
        : 'Écarter / alléger';

    return {
      ...r,
      variationJour: marche?.variation ?? 0,
      scoreTechnique,
      scoreFondamental,
      scoreCombine,
      signalJour,
    };
  }).sort((a, b) => b.scoreCombine - a.scoreCombine);

const DEFAULT_STATIC_WATCHLIST_TITLES = WATCHLIST_STATIQUE.map((r) => r.titre);

const buildStaticWatchlistRow = (titre) => {
  const reco = RECOS.find((r) => r.titre === titre);
  const market = MARKETS_DATA.find((m) => m.nom === titre);

  if (reco) {
    return {
      ...reco,
      horizon: WATCHLIST_THESES[titre]?.horizon || 'À définir',
      these:
        WATCHLIST_THESES[titre]?.these ||
        'Actif ajouté depuis la page Marchés — thèse fondamentale à documenter.',
    };
  }

  if (!market) return null;

  return {
    titre: market.nom,
    marche: market.marche,
    devise: market.devise,
    cours: market.cours,
    secteur: market.type === 'Obligation' ? 'Obligations' : 'Non renseigné',
    fondamentale: {
      per: null,
      rentabilite: 'N/D',
      evol: 'N/D',
      valo: 'À analyser',
      signal: 'À analyser',
    },
    horizon: 'À définir',
    these:
      'Actif ajouté depuis la page Marchés — analyse fondamentale à compléter.',
  };
};

const INSTRUMENTS = [
  'SONATEL',
  'ECOBANK CI',
  'MTN NIGERIA',
  'ZENITH BANK',
  'GCB BANK',
  'PALMCI',
  'Obligation Trésor CI 6.5% 2029',
];
const EXPOSURE = {
  c1: { SONATEL: 4, 'ECOBANK CI': 9, PALMCI: 3 },
  c2: {
    SONATEL: 6,
    'ECOBANK CI': 5,
    'Obligation Trésor CI 6.5% 2029': 12,
    PALMCI: 2,
  },
  c3: { 'MTN NIGERIA': 14, 'ZENITH BANK': 8 },
  c4: { 'ECOBANK CI': 7, 'Obligation Trésor CI 6.5% 2029': 15, SONATEL: 3 },
  c5: { 'GCB BANK': 11 },
  c6: { 'ZENITH BANK': 6, 'MTN NIGERIA': 9 },
};
const exposureOf = (clientId, instrument) => {
  const expositionExplicite = EXPOSURE[clientId]?.[instrument];
  if (expositionExplicite != null) return expositionExplicite;

  const client = CLIENTS.find((c) => c.id === clientId);
  const instrumentMarche = MARKETS_DATA.find((m) => m.nom === instrument);
  if (
    !client ||
    !instrumentMarche ||
    client.marche !== instrumentMarche.marche
  ) {
    return 0;
  }

  if (instrumentMarche.type === 'Action') {
    const actionsMarche = MARKETS_DATA.filter(
      (m) => m.type === 'Action' && m.marche === client.marche
    );
    const rang = actionsMarche.findIndex((m) => m.nom === instrument);
    const poids =
      actionsMarche.length === 1
        ? [1]
        : actionsMarche.length === 2
        ? [0.58, 0.42]
        : [0.45, 0.33, 0.22];
    return rang >= 0
      ? Number((Number(client.alloc.Actions || 0) * poids[rang]).toFixed(1))
      : 0;
  }

  const expositionObligataire =
    Number(client.alloc['Obl. souveraines'] || 0) +
    Number(client.alloc['Obl. privées'] || 0);
  return Number((expositionObligataire * 0.65).toFixed(1));
};
const ACTIONS_LIST = [
  'SONATEL',
  'ECOBANK CI',
  'MTN NIGERIA',
  'ZENITH BANK',
  'GCB BANK',
  'PALMCI',
];
const OBLIGATIONS_LIST = ['Obligation Trésor CI 6.5% 2029'];
const expositionClient = (client, dimension, value) => {
  if (dimension === 'Profil de risque') {
    const pct = client.profilRisque === value ? 100 : 0;
    return { pct, valeur: pct ? client.encours : 0 };
  }
  if (dimension === "Type d'actif") {
    const pct = client.alloc[value] ?? 0;
    return { pct, valeur: Math.round((client.encours * pct) / 100) };
  }
  if (dimension === 'Marché boursier') {
    const code = value.split(' ')[0];
    const pct = client.marche === code ? 100 : 0;
    return { pct, valeur: pct ? client.encours : 0 };
  }
  if (dimension === 'Pays') {
    const code = PAYS_MARCHE[value];
    const pct = code && client.marche === code ? 100 : 0;
    return { pct, valeur: pct ? client.encours : 0 };
  }
  if (dimension === 'Secteur') {
    const pct = ACTIONS_LIST.filter((t) => TITRE_SECTEUR[t] === value).reduce(
      (s, t) => s + exposureOf(client.id, t),
      0
    );
    return { pct, valeur: Math.round((client.encours * pct) / 100) };
  }
  if (dimension === 'Type de portefeuille') {
    const label = PROFILE_TYPE_LABEL[client.type] || client.type;
    const pct = label === value ? 100 : 0;
    return { pct, valeur: pct ? client.encours : 0 };
  }
  return { pct: 0, valeur: 0 };
};
const ENCAISSEMENTS = [
  {
    titre: 'SONATEL',
    type: 'Dividende',
    montant: 145000,
    devise: 'XOF',
    date: '15/07/2026',
  },
  {
    titre: 'ECOBANK CI',
    type: 'Dividende',
    montant: 98000,
    devise: 'XOF',
    date: '10/07/2026',
  },
  {
    titre: 'Obligation Trésor CI 6.5% 2029',
    type: 'Coupon',
    montant: 410000,
    devise: 'XOF',
    date: '12/07/2026',
  },
  {
    titre: 'MTN NIGERIA',
    type: 'Dividende',
    montant: 260000,
    devise: 'NGN',
    date: '08/07/2026',
  },
  {
    titre: 'ZENITH BANK',
    type: 'Dividende',
    montant: 175000,
    devise: 'NGN',
    date: '05/07/2026',
  },
  {
    titre: 'GCB BANK',
    type: 'Dividende',
    montant: 32000,
    devise: 'GHS',
    date: '02/07/2026',
  },
];
const versementsDemo = (client) => [
  {
    type: 'Virement',
    montant: Math.round(client.encours * 0.02),
    devise: client.devise,
    date: '14/07/2026',
  },
  {
    type: 'Chèque',
    montant: Math.round(client.encours * 0.008),
    devise: client.devise,
    date: '05/07/2026',
  },
  {
    type: 'Espèces',
    montant: Math.round(client.encours * 0.003),
    devise: client.devise,
    date: '01/07/2026',
  },
];
const rentabiliteComment = (client) => {
  const r = client.rentabilite;
  if (r < 0)
    return `La rentabilité nette de la période est négative (${r.toFixed(
      1
    )}%) ; un point avec le client sur son horizon d'investissement est recommandé avant tout arbitrage supplémentaire. Une plus ou moins value de (...${
      client.devise
    }) est noté sur la période`;
  if (r >= 3)
    return `La rentabilité nette de la période est solide (+${r.toFixed(
      1
    )}%) ; une prise partielle de plus-value vers des actifs moins volatils (obligations, liquidité) peut être envisagée pour sécuriser le gain.`;
  return `La rentabilité nette de la période est modérée (+${r.toFixed(
    1
  )}%), en ligne avec le profil du portefeuille ; aucun arbitrage urgent lié au rendement n'est nécessaire à ce stade. Une plus ou moins value de (...${
    client.devise
  }) est noté sur la période`;
};
const compareOp = (value, op, seuil) => {
  if (op === '<') return value < seuil;
  if (op === '>') return value > seuil;
  return value === seuil;
};

const SEUIL_REEQUILIBRAGE = 3;

const besoinsReequilibrageClient = (client) =>
  Object.keys(client.alloc)
    .map((actif) => {
      const actuel = Number(client.alloc[actif] || 0);
      const cible = Number(client.cible[actif] ?? actuel);
      const ecart = actuel - cible;
      const ecartAbsolu = Math.abs(ecart);

      return {
        actif,
        actuel,
        cible,
        ecart,
        ecartAbsolu,
        sens: ecart > 0 ? 'Réduire' : 'Renforcer',
        montant: Math.round((client.encours * ecartAbsolu) / 100),
        priorite:
          ecartAbsolu >= 10
            ? 'Haute'
            : ecartAbsolu >= 6
            ? 'Moyenne'
            : 'Normale',
      };
    })
    .filter((besoin) => besoin.ecartAbsolu > SEUIL_REEQUILIBRAGE)
    .sort((a, b) => b.ecartAbsolu - a.ecartAbsolu);

const propositionReequilibrage = (besoin) => {
  const renforcer = besoin.sens === 'Renforcer';

  if (besoin.actif === 'Actions') {
    return renforcer
      ? "Renforcer progressivement les actions jusqu'à la cible, en privilégiant les valeurs disposant des meilleurs signaux techniques et fondamentaux."
      : "Alléger progressivement les actions jusqu'à la cible, en donnant la priorité aux lignes les moins bien orientées ou les plus surpondérées.";
  }

  if (besoin.actif === 'Obl. souveraines') {
    return renforcer
      ? 'Renforcer les obligations souveraines pour réduire la volatilité et rapprocher le portefeuille de son allocation stratégique.'
      : "Réduire l'exposition aux obligations souveraines et réallouer l'excédent vers les classes d'actifs sous-pondérées.";
  }

  if (besoin.actif === 'Obl. privées') {
    return renforcer
      ? 'Renforcer sélectivement les obligations privées présentant un couple rendement-risque compatible avec le profil du client.'
      : 'Alléger les obligations privées les moins liquides ou les moins attractives afin de revenir vers la cible.';
  }

  return renforcer
    ? 'Reconstituer la poche de liquidité afin de couvrir les besoins opérationnels et les prochaines échéances du portefeuille.'
    : "Réinvestir l'excédent de liquidité dans les classes d'actifs sous-pondérées, selon les opportunités de marché disponibles.";
};

const ALERTES = [
  {
    client: 'Emeka Okafor',
    type: 'Rendement',
    actif: 'Actions',
    ecart: '-16 pts vs cible',
    marche: 'NGX',
    severite: 'Haute',
    depuis: '5 j',
  },
  {
    client: 'Emeka Okafor',
    type: 'Risque',
    actif: 'Portefeuille',
    ecart: 'VaR 30j au-dessus du seuil',
    marche: 'NGX',
    severite: 'Haute',
    depuis: '2 j',
  },
  {
    client: 'Aïcha Koné',
    type: 'Allocation',
    actif: 'Actions',
    ecart: '+8 pts vs cible',
    marche: 'BRVM',
    severite: 'Moyenne',
    depuis: '9 j',
  },
  {
    client: 'Groupe Assurance Sahel',
    type: 'Allocation',
    actif: 'Obl. privées',
    ecart: '-3 pts vs cible',
    marche: 'BRVM',
    severite: 'Basse',
    depuis: '3 j',
  },
  {
    client: 'Caisse Retraite Littoral',
    type: 'Rendement',
    actif: 'Actions',
    ecart: '-2 pts vs cible',
    marche: 'NGX',
    severite: 'Basse',
    depuis: '12 j',
  },
];
const IMPACT_COMITE = [
  {
    theme: 'Réduction poids Banques BRVM',
    pf: '12 portefeuilles',
    impact: '+1.4 pt de perf.',
    statut: 'Appliqué',
  },
  {
    theme: 'Renforcement Télécoms NGX',
    pf: '6 portefeuilles',
    impact: '+0.9 pt de perf.',
    statut: 'Appliqué',
  },
  {
    theme: 'Sortie Distribution GSE',
    pf: '3 portefeuilles',
    impact: '-0.2 pt de perf.',
    statut: 'Partiel',
  },
];

const NAV = [
  { id: 'accueil', label: 'Accueil', icon: Home },
  { id: 'portefeuilles', label: 'Portefeuilles', icon: Briefcase },
  { id: 'money-management', label: 'Money Management', icon: Droplets },
  { id: 'carnet', label: "Carnet d'ordres", icon: ListOrdered },
  { id: 'avis', label: "Avis d'opéré", icon: FileCheck2 },
  { id: 'marches', label: 'Marchés (Actions & Obligations)', icon: Building2 },
  { id: 'watchlist', label: 'Watchlist', icon: Star },
  { id: 'recos-actions', label: 'Recommandations actions', icon: TrendingUp },
  { id: 'reco-alloc', label: "Reco. d'allocation", icon: SlidersHorizontal },
  { id: 'alloc-criteres', label: 'Allocation par critères', icon: Filter },
  { id: 'alertes', label: 'Alertes', icon: AlertTriangle },
  { id: 'reequilibrage', label: 'Rééquilibrage', icon: Scale },
  { id: 'analyse', label: 'Analyse portefeuille', icon: Activity },
  { id: 'comite', label: 'Rapport de comité', icon: FileBarChart2 },
];

/* ------------------------------- UI ATOMS ------------------------------- */
function Card({ children, className = '', onClick, style = {} }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border ${className}`}
      style={{
        borderColor: C.line,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
function Eyebrow({ children }) {
  return (
    <div
      className="text-[11px] font-semibold tracking-widest uppercase mb-2"
      style={{ color: C.gold, ...F_BODY }}
    >
      {children}
    </div>
  );
}
function Pct({ v }) {
  const up = v >= 0;
  return (
    <span
      className="inline-flex items-center gap-1 text-sm font-semibold"
      style={{ color: up ? C.teal : C.coral, ...F_MONO }}
    >
      {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      {Math.abs(v).toFixed(1)}%
    </span>
  );
}
function Donut({ data, size = 150, onSliceClick }) {
  return (
    <ResponsiveContainer width="100%" height={size}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={size * 0.28}
          outerRadius={size * 0.46}
          paddingAngle={2}
          onClick={(_, index) => onSliceClick?.(data[index])}
          style={{ cursor: onSliceClick ? 'pointer' : 'default' }}
        >
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={PALETTE[i % PALETTE.length]}
              stroke="none"
              style={{ cursor: onSliceClick ? 'pointer' : 'default' }}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(v) => `${v}%`}
          contentStyle={{
            borderRadius: 10,
            border: `1px solid ${C.line}`,
            fontSize: 12,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
function Legende({ data }) {
  return (
    <div className="flex flex-col gap-1.5 mt-2">
      {data.map((d, i) => (
        <div
          key={d.name}
          className="flex items-center justify-between gap-3 text-xs"
          style={F_BODY}
        >
          <span
            className="flex items-center gap-2 min-w-0"
            style={{ color: C.ink }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: PALETTE[i % PALETTE.length] }}
            />
            <span className="truncate">{d.name}</span>
          </span>
          <span
            className="flex flex-col items-end shrink-0"
            style={{ color: C.sub, ...F_MONO }}
          >
            <span className="font-semibold">{d.value}%</span>
            {Number.isFinite(d.montant) && d.devise && (
              <span className="text-[10px] font-semibold">
                {fmt(Math.round(d.montant))} {d.devise}
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
function Badge({ children, tone = 'slate' }) {
  const tones = {
    slate: { bg: '#EEF0F4', fg: C.sub },
    gold: { bg: '#FBF1DD', fg: '#8A6A16' },
    teal: { bg: '#E4F5EF', fg: C.teal },
    coral: { bg: '#FBE9E7', fg: C.coral },
    navy: { bg: '#E9ECF5', fg: C.navy },
  }[tone];
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: tones.bg, color: tones.fg, ...F_BODY }}
    >
      {children}
    </span>
  );
}
function Th({ children }) {
  return (
    <th
      className="text-left text-[11px] uppercase tracking-wider font-semibold py-2 px-3"
      style={{ color: C.sub, ...F_BODY }}
    >
      {children}
    </th>
  );
}
function Td({ children, mono, className = '' }) {
  return (
    <td
      className={`py-2.5 px-3 text-sm ${className}`}
      style={{ color: C.ink, ...(mono ? F_MONO : F_BODY) }}
    >
      {children}
    </td>
  );
}
function Btn({ children, onClick, tone = 'navy' }) {
  const tones = {
    navy: { bg: C.navy, fg: '#fff' },
    gold: { bg: C.gold, fg: '#fff' },
    ghost: { bg: '#fff', fg: C.navy },
  }[tone];
  return (
    <button
      onClick={onClick}
      className="px-3.5 py-2 rounded-xl text-sm font-semibold transition-transform active:scale-[0.97]"
      style={{
        background: tones.bg,
        color: tones.fg,
        border: tone === 'ghost' ? `1px solid ${C.line}` : 'none',
        ...F_BODY,
      }}
    >
      {children}
    </button>
  );
}
const NavigationContext = createContext({ go: () => {} });

const BREADCRUMB_ROUTES = {
  Accueil: 'accueil',
  'Portefeuilles gérés': 'portefeuilles',
  Portefeuilles: 'portefeuilles',
  'Money Management': 'money-management',
  "Carnet d'ordres": 'carnet',
  "Avis d'opéré": 'avis',
  'Marchés (Actions & Obligations)': 'marches',
  Marchés: 'marches',
  Watchlist: 'watchlist',
  'Recommandations actions': 'recos-actions',
  "Recommandation d'allocation": 'reco-alloc',
  'Allocation par critères': 'alloc-criteres',
  Alertes: 'alertes',
  Rééquilibrage: 'reequilibrage',
  'Analyse portefeuille': 'analyse',
  'Rapport de comité de gestion': 'comite',
  'Prise de décisions': 'decisions-comite',
};

function Breadcrumb({ items }) {
  const { go } = useContext(NavigationContext);

  return (
    <nav
      aria-label="Fil d’Ariane"
      className="flex items-center gap-1.5 text-sm mb-4 flex-wrap"
      style={{ color: C.sub, ...F_BODY }}
    >
      {items.map((item, i) => {
        const descriptor =
          typeof item === 'string' ? { label: item } : item || {};
        const label = descriptor.label || '';
        const route = descriptor.route || BREADCRUMB_ROUTES[label];
        const params = descriptor.params || {};
        const isCurrent = i === items.length - 1;
        const isClickable = !isCurrent && Boolean(route);

        return (
          <span key={`${label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={13} aria-hidden="true" />}
            {isClickable ? (
              <button
                type="button"
                onClick={() => go(route, params)}
                className="inline-flex items-center gap-1 rounded-lg px-1.5 py-1 font-medium transition-colors hover:underline focus:outline-none focus:ring-2"
                style={{
                  color: C.navy,
                  cursor: 'pointer',
                  '--tw-ring-color': C.gold,
                }}
                title={`Revenir à ${label}`}
              >
                {label === 'Accueil' && <Home size={13} aria-hidden="true" />}
                {label}
              </button>
            ) : (
              <span
                aria-current={isCurrent ? 'page' : undefined}
                className="px-1.5 py-1"
                style={{
                  color: isCurrent ? C.ink : C.sub,
                  fontWeight: isCurrent ? 600 : 500,
                }}
              >
                {label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

const HISTORY_SERIES = [
  { dataKey: 'encours', label: 'Encours général', color: C.navy },
  { dataKey: 'brvm', label: 'BRVM Composite', color: C.gold },
  { dataKey: 'ngxAsi', label: 'NGX ASI', color: C.teal },
];

function HistoryLegend({ visibility, onToggle }) {
  return (
    <div
      className="flex items-center justify-center gap-5 flex-wrap mt-1"
      style={F_BODY}
    >
      {HISTORY_SERIES.map((serie) => {
        const visible = visibility[serie.dataKey];
        return (
          <button
            key={serie.dataKey}
            type="button"
            onClick={() => onToggle(serie.dataKey)}
            aria-pressed={visible}
            title={
              visible ? `Masquer ${serie.label}` : `Afficher ${serie.label}`
            }
            className="inline-flex items-center gap-2 text-xs font-medium transition-opacity"
            style={{
              color: visible ? C.ink : C.sub,
              opacity: visible ? 1 : 0.4,
              textDecoration: visible ? 'none' : 'line-through',
              cursor: 'pointer',
            }}
          >
            <span
              className="inline-block w-5 rounded-full"
              style={{
                height: 3,
                background: serie.color,
                opacity: visible ? 1 : 0.45,
              }}
            />
            {serie.label}
          </button>
        );
      })}
    </div>
  );
}

function MarketTicker({ onInstrumentClick, onViewAll }) {
  const tickerMarches = [...MARKETS_DATA].sort(
    (a, b) => b.variation - a.variation
  );

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-3">
        <Eyebrow>Vue des Marchés</Eyebrow>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold"
          style={{ color: C.navy }}
        >
          Voir tous les marchés →
        </button>
      </div>
      <div
        className="relative overflow-hidden py-3"
        style={{ borderTop: `1px solid ${C.line}`, marginTop: 8 }}
      >
        <div
          className="flex gap-3 w-max"
          style={{ animation: 'ticker-scroll 28s linear infinite' }}
        >
          {[...tickerMarches, ...tickerMarches].map((m, i) => (
            <button
              key={`${m.nom}-${i}`}
              type="button"
              onClick={() => onInstrumentClick?.(m)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border shrink-0"
              style={{ borderColor: C.line }}
              title={`Ouvrir ${m.nom} · ${m.marche}`}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: C.ink, ...F_BODY }}
              >
                {m.nom}
              </span>
              <span className="text-xs" style={{ ...F_MONO, color: C.sub }}>
                {fmtPrice(m.cours)} {m.devise} · {m.marche}
              </span>
              <Pct v={m.variation} />
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* -------------------------------- SCREENS -------------------------------- */
function Accueil({
  go,
  openClient,
  devise,
  onDeviseChange,
  dark,
  onToggleDark,
}) {
  const [dim, setDim] = useState('Profil de risque');
  const [genClient, setGenClient] = useState(CLIENTS[0].id);
  const [allReports, setAllReports] = useState(false);
  const [devBourse, setDevBourse] = useState({
    BRVM: 'XOF',
    NGX: 'NGN',
    GSE: 'GHS',
  });
  const [selection, setSelection] = useState(null);
  const [seuilExpo, setSeuilExpo] = useState(0);
  const [rechercheClient, setRechercheClient] = useState('');
  const [profilHistoriquePortefeuilles, setProfilHistoriquePortefeuilles] =
    useState('Global');
  const [historyVisibility, setHistoryVisibility] = useState({
    encours: true,
    brvm: true,
    ngxAsi: true,
  });
  const toggleHistorySeries = (dataKey) => {
    setHistoryVisibility((current) => ({
      ...current,
      [dataKey]: !current[dataKey],
    }));
  };
  const dims = {
    'Profil de risque': RISK_PROFILE_MIX,
    "Type d'actif": ASSET_MIX,
    'Marché boursier': MARKET_MIX,
    Pays: COUNTRY_MIX,
    Secteur: SECTOR_MIX,
    'Type de portefeuille': PROFILE_TYPE_MIX,
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

  const typesAlertesAccueil = ['Rendement', 'Risque', 'Allocation'];
  const statistiquesAlertesAccueil = typesAlertesAccueil.map((type) => ({
    type,
    nombre: ALERTES.filter((alerte) => alerte.type === type).length,
  }));
  const totalAlertes = statistiquesAlertesAccueil.reduce(
    (somme, stat) => somme + stat.nombre,
    0
  );

  return (
    <div className="space-y-6">
      <Breadcrumb items={['Accueil']} />

      <MarketTicker
        onViewAll={() => go('marches')}
        onInstrumentClick={(m) =>
          go('profondeur', { marche: m.marche, instrument: m.nom })
        }
      />

      <div className="flex items-center justify-end gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: C.sub }}>
            Devise d'affichage du site
          </span>
          <select
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
        <button
          onClick={onToggleDark}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold"
          style={{ borderColor: C.line, color: C.ink }}
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}{' '}
          {dark ? 'Mode lumineux' : 'Mode sombre'}
        </button>
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
              <select
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
        </Card>

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
                  background: dim === d ? C.navy : '#F0F1F5',
                  color: dim === d ? '#fff' : C.sub,
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
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium text-left"
                      style={{ borderColor: C.line, ...F_BODY }}
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
                          Seuil d'exposition min. (%)
                        </label>
                        <input
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
                        <input
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
                          <thead style={{ background: '#FAFAFC' }}>
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
                          <thead style={{ background: '#FAFAFC' }}>
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
          <div className="flex items-center justify-between mb-2">
            <Eyebrow>Historique de l'encours</Eyebrow>
            <span className="text-xs" style={{ color: C.sub }}>
              Base 100 · comparaison indices
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={HISTORY}>
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
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  fontSize: 12,
                  border: `1px solid ${C.line}`,
                }}
              />
              {historyVisibility.encours && (
                <Line
                  type="monotone"
                  dataKey="encours"
                  name="Encours général"
                  stroke={C.navy}
                  strokeWidth={2.5}
                  dot={false}
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
          <select
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
          <select
            className="w-full mb-4 px-3 py-2 rounded-xl border text-sm"
            style={{ borderColor: C.line, ...F_BODY }}
          >
            <option>Trimestre en cours</option>
            <option>Année en cours</option>
            <option>Personnalisée</option>
          </select>
          <div className="flex items-center gap-2">
            <Btn onClick={() => openClient(genClient, true)}>
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
                  <select
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

function Portefeuilles({ go, openClient, initialFilter }) {
  const [q, setQ] = useState('');
  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', 'Portefeuilles gérés']} />
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Vue générale des portefeuilles
          </h2>
          {initialFilter && (
            <div className="mt-1">
              <Badge tone="gold">Filtre : {initialFilter}</Badge>
            </div>
          )}
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl border"
          style={{ borderColor: C.line }}
        >
          <Search size={14} color={C.sub} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un client…"
            className="text-sm outline-none"
            style={F_BODY}
          />
        </div>
      </div>
      <Card className="p-0 overflow-hidden">
        <table className="w-full">
          <thead style={{ background: '#FAFAFC' }}>
            <tr>
              <Th>Client</Th>
              <Th>Marché</Th>
              <Th>Encours</Th>
              <Th>Perf. période</Th>
              <Th>Écart alloc.</Th>
              <Th>Risque</Th>
              <Th>Alertes</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.filter((c) =>
              c.nom.toLowerCase().includes(q.toLowerCase())
            ).map((c, idx) => {
              const ecart = Math.max(
                ...Object.keys(c.alloc).map((k) =>
                  Math.abs(c.alloc[k] - c.cible[k])
                )
              );
              return (
                <tr
                  key={c.id}
                  onClick={() => openClient(c.id)}
                  className="cursor-pointer"
                  style={{
                    borderTop: `1px solid ${C.line}`,
                    background: idx % 2 ? '#FCFCFD' : '#fff',
                  }}
                >
                  <Td>
                    <span className="font-semibold">{c.nom}</span>
                    <div className="text-xs" style={{ color: C.sub }}>
                      {c.type}
                    </div>
                  </Td>
                  <Td>
                    <Badge tone="navy">
                      {c.marche} · {c.devise}
                    </Badge>
                  </Td>
                  <Td mono>
                    {fmt(c.encours)} {c.devise}
                  </Td>
                  <Td>
                    <Pct v={c.perf} />
                  </Td>
                  <Td>
                    {ecart >= 8 ? (
                      <Badge tone="coral">{ecart} pts</Badge>
                    ) : (
                      <Badge tone="teal">{ecart} pts</Badge>
                    )}
                  </Td>
                  <Td>{c.risque}</Td>
                  <Td>
                    {c.alertes > 0 ? (
                      <Badge tone="coral">{c.alertes}</Badge>
                    ) : (
                      <Badge tone="teal">0</Badge>
                    )}
                  </Td>
                  <Td>
                    <ChevronRight size={15} color={C.sub} />
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

const MOIS_HISTORIQUE_CLASSES_ACTIFS = [
  { key: '2025-09', label: 'Sept 25' },
  { key: '2025-10', label: 'Oct' },
  { key: '2025-11', label: 'Nov' },
  { key: '2025-12', label: 'Déc' },
  { key: '2026-01', label: 'Jan 26' },
  { key: '2026-02', label: 'Fév' },
  { key: '2026-03', label: 'Mar' },
  { key: '2026-04', label: 'Avr' },
  { key: '2026-05', label: 'Mai' },
  { key: '2026-06', label: 'Juin' },
  { key: '2026-07', label: 'Juil' },
  { key: '2026-08', label: 'Août' },
];

const CLASSES_ACTIFS_HISTORIQUES = [
  { key: 'Actions', label: 'Actions', color: C.navy },
  { key: 'OblSouveraines', label: 'Obligations souveraines', color: C.gold },
  { key: 'OblPrivees', label: 'Obligations privées', color: C.teal },
  { key: 'Liquidite', label: 'Liquidité', color: C.indigo },
];

const INSTRUMENT_ETAT = {
  SONATEL: 'Sénégal',
  'ECOBANK CI': "Côte d'Ivoire",
  PALMCI: "Côte d'Ivoire",
  'MTN NIGERIA': 'Nigeria',
  'ZENITH BANK': 'Nigeria',
  'GCB BANK': 'Ghana',
  'Obligation Trésor CI 6.5% 2029': "Côte d'Ivoire",
  'Obligation Trésor NGN 2028': 'Nigeria',
  'Obligation Corporate GSE 2027': 'Ghana',
};

const ORDRE_ETATS_INVESTISSEMENT = [
  "Côte d'Ivoire",
  'Sénégal',
  'Nigeria',
  'Ghana',
  'Autres',
];

const fmtCompactMontant = (value) =>
  new Intl.NumberFormat('fr-FR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value || 0));

const seedPortefeuille = (client) =>
  String(client?.id || client?.nom || '')
    .split('')
    .reduce((somme, caractere, index) => {
      return somme + caractere.charCodeAt(0) * (index + 1);
    }, 0);

const buildHistoriqueClassesActifs = (client) => {
  const montantsActuels = {
    Actions:
      (Number(client.encours || 0) * Number(client.alloc.Actions || 0)) / 100,
    OblSouveraines:
      (Number(client.encours || 0) *
        Number(client.alloc['Obl. souveraines'] || 0)) /
      100,
    OblPrivees:
      (Number(client.encours || 0) *
        Number(client.alloc['Obl. privées'] || 0)) /
      100,
    Liquidite:
      (Number(client.encours || 0) * Number(client.alloc.Liquidité || 0)) / 100,
  };

  const rendementClient = Number(client.perf || 0);
  const rendementsClasses = {
    Actions: Math.max(-18, Math.min(24, rendementClient * 1.25 + 2.2)),
    OblSouveraines: Math.max(-6, Math.min(12, rendementClient * 0.3 + 2.0)),
    OblPrivees: Math.max(-8, Math.min(14, rendementClient * 0.45 + 2.6)),
    Liquidite: Math.max(0.2, Math.min(3.5, rendementClient * 0.08 + 0.8)),
  };

  // Profils mensuels déterministes inspirés d'un comportement de marché réaliste :
  // les actions sont plus volatiles, les obligations souveraines plus stables,
  // les obligations privées intermédiaires et la liquidité quasi stable.
  // Les chocs sont exprimés en décimal et sont combinés avec une dérive mensuelle
  // calibrée pour que le rendement cumulé sur 11 intervalles corresponde au
  // rendement annuel cible de chaque classe.
  const chocsMensuelsBase = {
    Actions: [
      -0.021, 0.026, -0.013, 0.031, 0.009, -0.027, 0.019, -0.008, 0.024, -0.016,
      0.012,
    ],
    OblSouveraines: [
      -0.003, 0.0022, -0.0012, 0.0034, 0.0016, -0.0025, 0.002, -0.001, 0.0027,
      -0.0015, 0.0013,
    ],
    OblPrivees: [
      -0.005, 0.004, -0.0025, 0.006, 0.0028, -0.0045, 0.0036, -0.002, 0.0048,
      -0.0032, 0.0025,
    ],
    Liquidite: [
      0.0015, -0.001, 0.0008, 0.0012, -0.0006, 0.001, -0.0005, 0.0009, -0.0004,
      0.0006, -0.0003,
    ],
  };

  const seed = seedPortefeuille(client);
  const historique = MOIS_HISTORIQUE_CLASSES_ACTIFS.map((mois) => ({
    mois: mois.label,
    date: mois.key,
  }));

  Object.keys(montantsActuels).forEach((classe, classeIndex) => {
    const rendementAnnuel = rendementsClasses[classe] / 100;
    const montantActuel = Number(montantsActuels[classe] || 0);
    const chocsBase = chocsMensuelsBase[classe];
    const decalage = (seed + classeIndex * 2) % chocsBase.length;
    const multiplicateurVolatilite =
      0.88 + ((seed + classeIndex * 17) % 25) / 100;

    const chocsPersonnalises = chocsBase.map((_, index) => {
      const choc = chocsBase[(index + decalage) % chocsBase.length];
      const microVariation =
        ((((seed + index * 11 + classeIndex * 7) % 9) - 4) / 10000) *
        (classe === 'Actions' ? 4 : classe === 'OblPrivees' ? 2 : 1);
      return choc * multiplicateurVolatilite + microVariation;
    });

    const produitChocs = chocsPersonnalises.reduce(
      (produit, choc) => produit * (1 + choc),
      1
    );
    const nombreIntervalles = chocsPersonnalises.length;
    const deriveMensuelle =
      Math.pow(
        Math.max(0.65, 1 + rendementAnnuel) / produitChocs,
        1 / nombreIntervalles
      ) - 1;

    const montantDepart = montantActuel / Math.max(0.65, 1 + rendementAnnuel);
    let montant = montantDepart;
    historique[0][classe] = Math.round(montant);

    chocsPersonnalises.forEach((choc, index) => {
      const rendementMensuel = (1 + deriveMensuelle) * (1 + choc) - 1;
      montant *= 1 + rendementMensuel;
      historique[index + 1][classe] = Math.round(montant);
      historique[index + 1][`${classe}Variation`] = Number(
        (rendementMensuel * 100).toFixed(2)
      );
    });

    // Sécurise l'égalité exacte entre le dernier point du graphique et la
    // valorisation courante affichée ailleurs dans la fiche portefeuille.
    historique[historique.length - 1][classe] = Math.round(montantActuel);
  });

  historique.forEach((ligne) => {
    ligne.TotalInvesti =
      Number(ligne.Actions || 0) +
      Number(ligne.OblSouveraines || 0) +
      Number(ligne.OblPrivees || 0);
  });

  return historique;
};

const buildRepartitionEtatsInvestissement = (client, categorie) => {
  const estAction = categorie === 'Actions';
  const estObligataire = categorie === 'Obligations';

  const montantActions =
    (Number(client.encours || 0) * Number(client.alloc.Actions || 0)) / 100;
  const montantObligations =
    (Number(client.encours || 0) *
      (Number(client.alloc['Obl. souveraines'] || 0) +
        Number(client.alloc['Obl. privées'] || 0))) /
    100;

  const repartirClasse = (type, montantClasse) => {
    if (montantClasse <= 0) return {};

    const instruments = MARKETS_DATA.filter(
      (instrument) =>
        instrument.marche === client.marche && instrument.type === type
    );

    if (instruments.length === 0) {
      return { [client.pays || 'Autres']: montantClasse };
    }

    const poidsBruts = instruments.map((instrument) => ({
      etat: INSTRUMENT_ETAT[instrument.nom] || client.pays || 'Autres',
      poids: Math.max(0, Number(exposureOf(client.id, instrument.nom) || 0)),
    }));
    const totalPoids = poidsBruts.reduce(
      (somme, item) => somme + item.poids,
      0
    );

    return poidsBruts.reduce((acc, item) => {
      const poidsNormalise =
        totalPoids > 0 ? item.poids / totalPoids : 1 / poidsBruts.length;
      acc[item.etat] = (acc[item.etat] || 0) + montantClasse * poidsNormalise;
      return acc;
    }, {});
  };

  const actionsParEtat = repartirClasse('Action', montantActions);
  const obligationsParEtat = repartirClasse('Obligation', montantObligations);

  let source = {};
  if (estAction) {
    source = actionsParEtat;
  } else if (estObligataire) {
    source = obligationsParEtat;
  } else {
    [
      ...Object.entries(actionsParEtat),
      ...Object.entries(obligationsParEtat),
    ].forEach(([etat, montant]) => {
      source[etat] = (source[etat] || 0) + montant;
    });
  }

  const total = Object.values(source).reduce(
    (somme, montant) => somme + Number(montant || 0),
    0
  );

  return Object.entries(source)
    .filter(([, montant]) => Number(montant) > 0)
    .sort(([etatA], [etatB]) => {
      const indexA = ORDRE_ETATS_INVESTISSEMENT.indexOf(etatA);
      const indexB = ORDRE_ETATS_INVESTISSEMENT.indexOf(etatB);
      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    })
    .map(([name, montant]) => ({
      name,
      montant,
      devise: client.devise,
      value: total > 0 ? Number(((montant / total) * 100).toFixed(1)) : 0,
    }));
};

function PortefeuilleDetail({ client, go, reportOpen, onGenerateReport }) {
  const data = Object.entries(client.alloc).map(([name, value]) => ({
    name,
    value,
  }));
  const besoinsReequilibrage = besoinsReequilibrageClient(client);
  const historiqueClassesActifs = buildHistoriqueClassesActifs(client);
  const repartitionEtatsActions = buildRepartitionEtatsInvestissement(
    client,
    'Actions'
  );
  const repartitionEtatsObligations = buildRepartitionEtatsInvestissement(
    client,
    'Obligations'
  );
  const repartitionEtatsGenerale = buildRepartitionEtatsInvestissement(
    client,
    'General'
  );

  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', 'Portefeuilles', client.nom]} />
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            {client.nom}
          </h2>
          <div className="flex gap-2 mt-1">
            <Badge tone="navy">{client.type}</Badge>
            <Badge tone="navy">
              {client.marche} · {client.devise}
            </Badge>
            <Badge tone="slate">Risque {client.risque}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {besoinsReequilibrage.length > 0 ? (
            <Btn
              tone="ghost"
              onClick={() =>
                go('reequilibrage', {
                  client: client.id,
                  actif: besoinsReequilibrage[0].actif,
                })
              }
            >
              Voir {besoinsReequilibrage.length} écart(s) → Rééquilibrage
            </Btn>
          ) : (
            <Badge tone="teal">Allocation conforme — aucun rééquilibrage</Badge>
          )}
          <Btn onClick={() => onGenerateReport(client.id)}>Générer rapport</Btn>
        </div>
      </div>

      {reportOpen.notice && (
        <Card className="p-4" style={{ borderColor: C.gold }}>
          <Eyebrow>Rapport d'analyse — {client.nom}</Eyebrow>
          <div className="grid grid-cols-3 gap-4 text-sm mt-2" style={F_BODY}>
            <div>
              <div className="text-xs" style={{ color: C.sub }}>
                Situation globale
              </div>
              <div className="font-semibold">
                {fmt(client.encours)} {client.devise}
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: C.sub }}>
                Variation période
              </div>
              <div className="font-semibold">
                {fmt(
                  Math.round(
                    client.encours - client.encours / (1 + client.perf / 100)
                  )
                )}{' '}
                {client.devise} <Pct v={client.perf} />
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: C.sub }}>
                Rentabilité période
              </div>
              <div className="font-semibold">
                <Pct v={client.rentabilite} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm mt-3" style={F_BODY}>
            <div>
              <div className="text-xs" style={{ color: C.sub }}>
                Acquisitions
              </div>
              <div className="font-semibold">3 opérations</div>
            </div>
            <div>
              <div className="text-xs" style={{ color: C.sub }}>
                Cessions / Encaiss.
              </div>
              <div className="font-semibold">2 opérations</div>
            </div>
            <div>
              <div className="text-xs" style={{ color: C.sub }}>
                Retenues
              </div>
              <div className="font-semibold">Fiscalité sur coupons</div>
            </div>
          </div>
          <div
            className="text-xs mt-3 p-3 rounded-xl"
            style={{ background: '#FBF7EE', color: C.ink }}
          >
            Commentaire de Gestion: la performance de la période reflète
            principalement le renforcement de la ligne Télécoms et
            l'encaissement d'un coupon obligataire ; l'écart d'allocation
            Actions reste au-dessus de la cible et justifie un arbitrage.
          </div>
          <div
            className="text-xs mt-2 p-3 rounded-xl"
            style={{ background: '#EFF3FB', color: C.ink }}
          >
            <b>Commentaire (rentabilité) :</b> {rentabiliteComment(client)}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5">
          <Eyebrow>Répartition par classe d'actifs</Eyebrow>
          <Donut data={data} size={150} />
          <Legende data={data} />
        </Card>
        <Card className="col-span-2 p-5">
          <Eyebrow>Actuel vs cible</Eyebrow>
          <div className="space-y-3 mt-2">
            {Object.keys(client.alloc).map((k) => (
              <div key={k}>
                <div
                  className="flex justify-between text-xs mb-1"
                  style={{ color: C.sub, ...F_BODY }}
                >
                  <span>{k}</span>
                  <span>
                    {client.alloc[k]}% (cible {client.cible[k]}%)
                  </span>
                </div>
                <div
                  className="h-2 rounded-full"
                  style={{ background: '#EEF0F4' }}
                >
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${client.alloc[k]}%`,
                      background:
                        Math.abs(client.alloc[k] - client.cible[k]) > 5
                          ? C.coral
                          : C.teal,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5" style={{ borderColor: '#D8DFEF' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <div>
            <Eyebrow>Évolution de la valorisation par classe d'actifs</Eyebrow>
            <div className="text-sm font-semibold" style={{ color: C.ink }}>
              Historique sur 1 an · time frame mensuel
            </div>
            <div className="text-xs mt-1" style={{ color: C.sub, ...F_BODY }}>
              Montants exprimés en {client.devise}. Les variations mensuelles
              sont différenciées selon le risque de chaque classe ; le dernier
              point correspond à la valorisation actuelle du portefeuille.
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone="navy">12 mois</Badge>
            <Badge tone="gold">Mensuel</Badge>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={historiqueClassesActifs}
            margin={{ top: 10, right: 20, left: 8, bottom: 4 }}
          >
            <CartesianGrid stroke={C.line} vertical={false} />
            <XAxis
              dataKey="mois"
              tick={{ fontSize: 10, fill: C.sub }}
              axisLine={{ stroke: C.line }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: C.sub }}
              axisLine={false}
              tickLine={false}
              width={70}
              tickFormatter={(value) => fmtCompactMontant(value)}
            />
            <Tooltip
              formatter={(value, name) => [
                `${fmt(Math.round(Number(value)))} ${client.devise}`,
                name,
              ]}
              labelFormatter={(label) => `Mois : ${label}`}
              contentStyle={{
                borderRadius: 10,
                fontSize: 12,
                border: `1px solid ${C.line}`,
              }}
            />
            {CLASSES_ACTIFS_HISTORIQUES.map((serie) => (
              <Line
                key={serie.key}
                type="monotone"
                dataKey={serie.key}
                name={serie.label}
                stroke={serie.color}
                strokeWidth={2.3}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        <div
          className="flex items-center justify-center gap-5 flex-wrap mt-2"
          style={F_BODY}
        >
          {CLASSES_ACTIFS_HISTORIQUES.map((serie) => (
            <div
              key={serie.key}
              className="inline-flex items-center gap-2 text-xs font-medium"
              style={{ color: C.ink }}
            >
              <span
                className="inline-block w-5 rounded-full"
                style={{ height: 3, background: serie.color }}
              />
              {serie.label}
            </div>
          ))}
        </div>

        <div
          className="mt-3 p-3 rounded-xl text-[11px]"
          style={{ background: '#FAFAFC', color: C.sub, ...F_BODY }}
        >
          Dans cette maquette, le détail historique mensuel par classe d'actifs
          est une série de démonstration reconstruite à partir de la
          valorisation et de l'allocation actuelles. Il pourra être remplacé
          directement par les valorisations historiques du backend.
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <Eyebrow>Répartition géographique des investissements</Eyebrow>
            <div className="text-sm font-semibold" style={{ color: C.ink }}>
              Répartition par État / pays de rattachement des instruments
            </div>
            <div className="text-xs mt-1" style={{ color: C.sub, ...F_BODY }}>
              Lecture séparée des Actions, des Obligations, puis de l'ensemble
              des actifs investis hors liquidité.
            </div>
          </div>
          <Badge tone="navy">{client.marche}</Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 items-start">
          {[
            {
              titre: 'Actions',
              sousTitre: `${fmt(
                Math.round(
                  (client.encours * Number(client.alloc.Actions || 0)) / 100
                )
              )} ${client.devise}`,
              data: repartitionEtatsActions,
            },
            {
              titre: 'Obligations',
              sousTitre: `${fmt(
                Math.round(
                  (client.encours *
                    (Number(client.alloc['Obl. souveraines'] || 0) +
                      Number(client.alloc['Obl. privées'] || 0))) /
                    100
                )
              )} ${client.devise}`,
              data: repartitionEtatsObligations,
            },
            {
              titre: 'Général',
              sousTitre: `${fmt(
                Math.round(
                  (client.encours *
                    (Number(client.alloc.Actions || 0) +
                      Number(client.alloc['Obl. souveraines'] || 0) +
                      Number(client.alloc['Obl. privées'] || 0))) /
                    100
                )
              )} ${client.devise}`,
              data: repartitionEtatsGenerale,
            },
          ].map((bloc) => (
            <div
              key={bloc.titre}
              className="rounded-2xl border p-4"
              style={{ borderColor: C.line, background: '#FAFAFC' }}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: C.sub, ...F_BODY }}
                  >
                    {bloc.titre}
                  </div>
                  <div
                    className="text-sm font-bold mt-0.5"
                    style={{ color: C.ink, ...F_MONO }}
                  >
                    {bloc.sousTitre}
                  </div>
                </div>
                <Badge tone={bloc.titre === 'Général' ? 'gold' : 'slate'}>
                  Par État
                </Badge>
              </div>

              {bloc.data.length > 0 ? (
                <>
                  <Donut data={bloc.data} size={165} />
                  <Legende data={bloc.data} />
                </>
              ) : (
                <div
                  className="h-[165px] flex items-center justify-center text-xs text-center px-4"
                  style={{ color: C.sub, ...F_BODY }}
                >
                  Aucun investissement dans cette catégorie.
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-[10px] mt-3" style={{ color: C.sub, ...F_BODY }}>
          Le rattachement géographique est déterminé à partir de l'émetteur ou
          de l'État associé à l'instrument disponible dans la maquette. La vue
          générale agrège Actions et Obligations et exclut la liquidité.
        </div>
      </Card>

      <Card className="p-5">
        <Eyebrow>Situation globale</Eyebrow>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <div className="text-xs" style={{ color: C.sub }}>
              Valorisation des actifs
            </div>
            <div className="text-xl font-bold" style={F_DISPLAY}>
              {fmt(
                Math.round(
                  (client.encours * (100 - client.alloc['Liquidité'])) / 100
                )
              )}{' '}
              {client.devise}
            </div>
          </div>
          <div>
            <div className="text-xs" style={{ color: C.sub }}>
              Liquidité
            </div>
            <div className="text-xl font-bold" style={F_DISPLAY}>
              {fmt(
                Math.round((client.encours * client.alloc['Liquidité']) / 100)
              )}{' '}
              {client.devise}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <Eyebrow>Présentation des actifs cotés</Eyebrow>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <div
              className="text-xs font-semibold mb-1"
              style={{ color: C.sub }}
            >
              Actions
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <Th>Titre</Th>
                  <Th>Exposition</Th>
                  <Th>Valeur estimée</Th>
                </tr>
              </thead>
              <tbody>
                {ACTIONS_LIST.filter((t) => exposureOf(client.id, t) > 0).map(
                  (t) => (
                    <tr key={t} style={{ borderTop: `1px solid ${C.line}` }}>
                      <Td>{t}</Td>
                      <Td mono>{exposureOf(client.id, t)}%</Td>
                      <Td mono>
                        {fmt(
                          Math.round(
                            (client.encours * exposureOf(client.id, t)) / 100
                          )
                        )}{' '}
                        {client.devise}
                      </Td>
                    </tr>
                  )
                )}
                {ACTIONS_LIST.every((t) => exposureOf(client.id, t) === 0) && (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center text-xs py-3"
                      style={{ color: C.sub }}
                    >
                      Aucune action détenue
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div>
            <div
              className="text-xs font-semibold mb-1"
              style={{ color: C.sub }}
            >
              Obligations
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <Th>Titre</Th>
                  <Th>Exposition</Th>
                  <Th>Valeur estimée</Th>
                </tr>
              </thead>
              <tbody>
                {OBLIGATIONS_LIST.filter(
                  (t) => exposureOf(client.id, t) > 0
                ).map((t) => (
                  <tr key={t} style={{ borderTop: `1px solid ${C.line}` }}>
                    <Td>{t}</Td>
                    <Td mono>{exposureOf(client.id, t)}%</Td>
                    <Td mono>
                      {fmt(
                        Math.round(
                          (client.encours * exposureOf(client.id, t)) / 100
                        )
                      )}{' '}
                      {client.devise}
                    </Td>
                  </tr>
                ))}
                {OBLIGATIONS_LIST.every(
                  (t) => exposureOf(client.id, t) === 0
                ) && (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center text-xs py-3"
                      style={{ color: C.sub }}
                    >
                      Aucune obligation détenue en direct
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <Eyebrow>
            Présentation des encaissements (dividendes, coupons)
          </Eyebrow>
          <table className="w-full mt-1">
            <thead>
              <tr>
                <Th>Titre</Th>
                <Th>Type</Th>
                <Th>Montant</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody>
              {ENCAISSEMENTS.filter(
                (e) => exposureOf(client.id, e.titre) > 0
              ).map((e, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                  <Td>{e.titre}</Td>
                  <Td>
                    <Badge tone="teal">{e.type}</Badge>
                  </Td>
                  <Td mono>
                    {fmt(e.montant)} {e.devise}
                  </Td>
                  <Td>{e.date}</Td>
                </tr>
              ))}
              {ENCAISSEMENTS.filter((e) => exposureOf(client.id, e.titre) > 0)
                .length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-xs py-3"
                    style={{ color: C.sub }}
                  >
                    Aucun encaissement sur la période
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
        <Card className="p-5">
          <Eyebrow>
            Présentation des versements (espèces, chèques, virement)
          </Eyebrow>
          <table className="w-full mt-1">
            <thead>
              <tr>
                <Th>Type</Th>
                <Th>Montant</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody>
              {versementsDemo(client).map((v, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                  <Td>
                    <Badge tone="navy">{v.type}</Badge>
                  </Td>
                  <Td mono>
                    {fmt(v.montant)} {v.devise}
                  </Td>
                  <Td>{v.date}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Card className="p-5">
        <Eyebrow>Mouvements récents</Eyebrow>
        <table className="w-full mt-1">
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th>Titre</Th>
              <Th>Montant</Th>
            </tr>
          </thead>
          <tbody>
            {[
              ['18/07/2026', 'Acquisition', 'SONATEL', '7 100 000 XOF'],
              [
                '12/07/2026',
                'Encaissement',
                'Coupon Trésor 6.5%',
                '410 000 XOF',
              ],
              ['03/07/2026', 'Cession', 'ECOBANK CI', '7 980 000 XOF'],
            ].map((r, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                {r.map((c, j) => (
                  <Td key={j} mono={j === 3}>
                    {c}
                  </Td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Carnet({ initial }) {
  const [f, setF] = useState(initial?.marche || 'Tous');
  const [instrumentFilter, setInstrumentFilter] = useState(
    initial?.instrument || null
  );
  const rows = ORDERS.filter(
    (o) =>
      (f === 'Tous' || o.marche === f) &&
      (!instrumentFilter || o.titre === instrumentFilter)
  );
  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', "Carnet d'ordres"]} />
      <div className="flex items-center justify-between">
        <h2
          className="text-xl font-bold"
          style={{ ...F_DISPLAY, color: C.ink }}
        >
          Carnet d'ordres
        </h2>
        <div className="flex items-center gap-2">
          {instrumentFilter && (
            <button
              onClick={() => setInstrumentFilter(null)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: '#FBF1DD', color: '#8A6A16' }}
            >
              Instrument : {instrumentFilter} <X size={12} />
            </button>
          )}
          <div className="flex gap-1.5">
            {['Tous', 'BRVM', 'NGX', 'GSE'].map((m) => (
              <button
                key={m}
                onClick={() => setF(m)}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: f === m ? C.navy : '#F0F1F5',
                  color: f === m ? '#fff' : C.sub,
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
      {rows.length === 0 && (
        <Card className="p-6 text-center text-sm" style={{ color: C.sub }}>
          Aucun ordre pour ce filtre.
        </Card>
      )}
      <Card className="p-0 overflow-hidden">
        <table className="w-full">
          <thead style={{ background: '#FAFAFC' }}>
            <tr>
              <Th>Réf.</Th>
              <Th>Sens</Th>
              <Th>Titre</Th>
              <Th>Marché</Th>
              <Th>Qté</Th>
              <Th>Prix</Th>
              <Th>Portefeuille</Th>
              <Th>Statut</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o, i) => (
              <tr
                key={o.id}
                style={{
                  borderTop: `1px solid ${C.line}`,
                  background: i % 2 ? '#FCFCFD' : '#fff',
                }}
              >
                <Td mono>{o.id}</Td>
                <Td>
                  <Badge tone={o.sens === 'Achat' ? 'teal' : 'coral'}>
                    {o.sens}
                  </Badge>
                </Td>
                <Td className="font-semibold">{o.titre}</Td>
                <Td>
                  <Badge tone="navy">{o.marche}</Badge>
                </Td>
                <Td mono>{o.qte}</Td>
                <Td mono>
                  {o.prix} {o.devise}
                </Td>
                <Td>{o.pf}</Td>
                <Td>
                  <Badge
                    tone={
                      o.statut === 'Exécuté'
                        ? 'teal'
                        : o.statut === 'Annulé'
                        ? 'coral'
                        : 'gold'
                    }
                  >
                    {o.statut}
                  </Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Avis() {
  const [dateDebut, setDateDebut] = useState('');
  const [filtreMarche, setFiltreMarche] = useState('Tous');
  const [filtreClient, setFiltreClient] = useState('Tous');

  const marchesDisponibles = ['Tous', ...new Set(AVIS.map((a) => a.marche))];
  const clientsDisponibles = [
    'Tous',
    ...new Set(AVIS.map((a) => a.client).sort((a, b) => a.localeCompare(b))),
  ];

  const avisFiltres = AVIS.filter((a) => {
    const correspondDate =
      !dateDebut || parseFR(a.date) >= new Date(`${dateDebut}T00:00:00`);
    const correspondMarche =
      filtreMarche === 'Tous' || a.marche === filtreMarche;
    const correspondClient =
      filtreClient === 'Tous' || a.client === filtreClient;

    return correspondDate && correspondMarche && correspondClient;
  });

  const filtresActifs =
    Number(Boolean(dateDebut)) +
    Number(filtreMarche !== 'Tous') +
    Number(filtreClient !== 'Tous');

  const reinitialiserFiltres = () => {
    setDateDebut('');
    setFiltreMarche('Tous');
    setFiltreClient('Tous');
  };

  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', "Avis d'opéré"]} />

      <div>
        <h2
          className="text-xl font-bold"
          style={{ ...F_DISPLAY, color: C.ink }}
        >
          Avis d'opéré — vue générale
        </h2>
        <div className="text-xs mt-1" style={{ color: C.sub, ...F_BODY }}>
          Détail des frais et des flux nets générés par chaque achat ou vente.
          Les frais de change sont appliqués uniquement lorsqu'une conversion de
          devise est nécessaire. Les taux présents dans les données sont des
          valeurs de démonstration à remplacer par les barèmes transmis par le
          backend.
        </div>
      </div>

      <Card className="p-4" style={{ borderColor: C.navy }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="grid grid-cols-3 gap-3 flex-1 min-w-[650px]">
            <div>
              <label
                className="text-xs font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Depuis le
              </label>
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm"
                style={{ borderColor: C.line, background: '#fff', ...F_BODY }}
              />
            </div>

            <div>
              <label
                className="text-xs font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Marché
              </label>
              <select
                value={filtreMarche}
                onChange={(e) => setFiltreMarche(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm"
                style={{ borderColor: C.line, background: '#fff', ...F_BODY }}
              >
                {marchesDisponibles.map((marche) => (
                  <option key={marche} value={marche}>
                    {marche === 'Tous' ? 'Tous les marchés' : marche}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="text-xs font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Client
              </label>
              <select
                value={filtreClient}
                onChange={(e) => setFiltreClient(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm"
                style={{ borderColor: C.line, background: '#fff', ...F_BODY }}
              >
                {clientsDisponibles.map((client) => (
                  <option key={client} value={client}>
                    {client === 'Tous' ? 'Tous les clients' : client}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Badge tone="gold">{avisFiltres.length} avis</Badge>
            <Badge tone={filtresActifs > 0 ? 'teal' : 'slate'}>
              {filtresActifs} filtre(s) actif(s)
            </Badge>
            {filtresActifs > 0 && (
              <button
                type="button"
                onClick={reinitialiserFiltres}
                className="px-3 py-2 rounded-xl border text-xs font-semibold"
                style={{
                  borderColor: C.line,
                  color: C.navy,
                  background: '#fff',
                }}
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        <div className="text-[11px] mt-3" style={{ color: C.sub, ...F_BODY }}>
          Les filtres s'appliquent instantanément. Le filtre de date conserve
          tous les avis émis à partir de la date sélectionnée, date comprise.
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 2100 }}>
            <thead style={{ background: '#FAFAFC' }}>
              <tr>
                <Th>Réf.</Th>
                <Th>Client</Th>
                <Th>Titre</Th>
                <Th>Sens</Th>
                <Th>Qté</Th>
                <Th>Prix exéc.</Th>
                <Th>Marché</Th>
                <Th>Com SGI</Th>
                <Th>IRVM</Th>
                <Th>TAF</Th>
                <Th>Total Frais</Th>
                <Th>Montant débité</Th>
                <Th>Montant crédité</Th>
                <Th>Date</Th>
              </tr>
            </thead>

            <tbody>
              {avisFiltres.length === 0 && (
                <tr>
                  <td
                    colSpan={15}
                    className="text-center py-8 text-sm"
                    style={{ color: C.sub, ...F_BODY }}
                  >
                    Aucun avis d'opéré ne correspond aux critères sélectionnés.
                  </td>
                </tr>
              )}

              {avisFiltres.map((a, i) => {
                const details = calculerAvis(a);

                return (
                  <tr
                    key={a.id}
                    style={{
                      borderTop: `1px solid ${C.line}`,
                      background: i % 2 ? '#FCFCFD' : '#fff',
                    }}
                  >
                    <Td mono>{a.id}</Td>
                    <Td className="whitespace-nowrap">{a.client}</Td>
                    <Td className="font-semibold whitespace-nowrap">
                      {a.titre}
                    </Td>
                    <Td>
                      <Badge tone={a.sens === 'Achat' ? 'teal' : 'coral'}>
                        {a.sens}
                      </Badge>
                    </Td>
                    <Td mono>{fmt(a.qte)}</Td>
                    <Td mono className="whitespace-nowrap">
                      {fmtPrice(a.prix)} {a.devise}
                    </Td>
                    <Td>
                      <Badge tone="navy">{a.marche}</Badge>
                    </Td>
                    <Td mono className="whitespace-nowrap">
                      {fmtPrice(details.comSgi)} {a.devise}
                    </Td>
                    <Td mono className="whitespace-nowrap">
                      {fmtPrice(details.irvm)} {a.devise}
                    </Td>
                    <Td mono className="whitespace-nowrap">
                      {fmtPrice(details.taf)} {a.devise}
                    </Td>
                    <Td mono className="whitespace-nowrap">
                      <span style={{ color: '#8A6A16', fontWeight: 700 }}>
                        {fmtPrice(details.totalFrais)} {a.devise}
                      </span>
                    </Td>
                    <Td mono className="whitespace-nowrap">
                      {details.montantDebite > 0 ? (
                        <span style={{ color: C.coral, fontWeight: 700 }}>
                          {fmtPrice(details.montantDebite)} {a.devise}
                        </span>
                      ) : (
                        <span style={{ color: C.sub }}>—</span>
                      )}
                    </Td>
                    <Td mono className="whitespace-nowrap">
                      {details.montantCredite > 0 ? (
                        <span style={{ color: C.teal, fontWeight: 700 }}>
                          {fmtPrice(details.montantCredite)} {a.devise}
                        </span>
                      ) : (
                        <span style={{ color: C.sub }}>—</span>
                      )}
                    </Td>
                    <Td className="whitespace-nowrap">{a.date}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Marches({ go, watchlistTitles, onAddWatch }) {
  const [tab, setTab] = useState('Action');
  const [marche, setMarche] = useState('Tous');
  const [showMarketFilters, setShowMarketFilters] = useState(true);

  const defaultMarketFilters = {
    recherche: '',
    secteur: 'Tous',
    volumeMin: '',
    variationMin: '',
    variationMax: '',
    coursMin: '',
    coursMax: '',
    statutWatchlist: 'Tous',
    mm: 'Tous',
    macd: 'Tous',
    rsiMin: '0',
    rsiMax: '100',
    bol: 'Tous',
    signalTechnique: 'Tous',
    perMax: '',
    rentabiliteMin: '',
    evolMin: '',
    valorisation: 'Tous',
    signalFondamental: 'Tous',
  };
  const [marketFilters, setMarketFilters] = useState(defaultMarketFilters);

  const mmDirection = (mm) =>
    mm.includes('>') ? 'Haussière' : mm.includes('<') ? 'Baissière' : 'Neutre';

  const marketUniverse = MARKETS_DATA.filter(
    (m) => m.type === tab && (marche === 'Tous' || m.marche === marche)
  ).map((m) => {
    const reco = RECOS.find((r) => r.titre === m.nom);
    return {
      ...m,
      reco,
      secteur:
        reco?.secteur ||
        (m.type === 'Obligation' ? 'Obligations' : 'Non renseigné'),
    };
  });

  const secteurs = ['Tous', ...new Set(marketUniverse.map((m) => m.secteur))];
  const macdOptions = [
    'Tous',
    ...new Set(
      marketUniverse.map((m) => m.reco?.technique.macd).filter(Boolean)
    ),
  ];
  const bolOptions = [
    'Tous',
    ...new Set(
      marketUniverse.map((m) => m.reco?.technique.bol).filter(Boolean)
    ),
  ];
  const signauxTechniques = [
    'Tous',
    ...new Set(
      marketUniverse.map((m) => m.reco?.technique.signal).filter(Boolean)
    ),
  ];
  const valorisations = [
    'Tous',
    ...new Set(
      marketUniverse.map((m) => m.reco?.fondamentale.valo).filter(Boolean)
    ),
  ];
  const signauxFondamentaux = [
    'Tous',
    ...new Set(
      marketUniverse.map((m) => m.reco?.fondamentale.signal).filter(Boolean)
    ),
  ];

  const rows = marketUniverse.filter((m) => {
    const reco = m.reco;
    const volumeMin =
      marketFilters.volumeMin === '' ? null : Number(marketFilters.volumeMin);
    const variationMin =
      marketFilters.variationMin === ''
        ? null
        : Number(marketFilters.variationMin);
    const variationMax =
      marketFilters.variationMax === ''
        ? null
        : Number(marketFilters.variationMax);
    const coursMin =
      marketFilters.coursMin === '' ? null : Number(marketFilters.coursMin);
    const coursMax =
      marketFilters.coursMax === '' ? null : Number(marketFilters.coursMax);
    const perMax =
      marketFilters.perMax === '' ? null : Number(marketFilters.perMax);
    const rentabiliteMin =
      marketFilters.rentabiliteMin === ''
        ? null
        : Number(marketFilters.rentabiliteMin);
    const evolMin =
      marketFilters.evolMin === '' ? null : Number(marketFilters.evolMin);
    const rsiMin = Number(marketFilters.rsiMin || 0);
    const rsiMax = Number(marketFilters.rsiMax || 100);
    const estAjoute = watchlistTitles.includes(m.nom);

    return (
      m.nom.toLowerCase().includes(marketFilters.recherche.toLowerCase()) &&
      (marketFilters.secteur === 'Tous' ||
        m.secteur === marketFilters.secteur) &&
      (volumeMin === null || m.volumeJour >= volumeMin) &&
      (variationMin === null || m.variation >= variationMin) &&
      (variationMax === null || m.variation <= variationMax) &&
      (coursMin === null || m.cours >= coursMin) &&
      (coursMax === null || m.cours <= coursMax) &&
      (marketFilters.statutWatchlist === 'Tous' ||
        (marketFilters.statutWatchlist === 'Ajoutés' && estAjoute) ||
        (marketFilters.statutWatchlist === 'Non ajoutés' && !estAjoute)) &&
      (marketFilters.mm === 'Tous' ||
        (reco && mmDirection(reco.technique.mm) === marketFilters.mm)) &&
      (marketFilters.macd === 'Tous' ||
        (reco && reco.technique.macd === marketFilters.macd)) &&
      (marketFilters.rsiMin === '' ||
        marketFilters.rsiMin === '0' ||
        (reco && reco.technique.rsi >= rsiMin)) &&
      (marketFilters.rsiMax === '' ||
        marketFilters.rsiMax === '100' ||
        (reco && reco.technique.rsi <= rsiMax)) &&
      (marketFilters.bol === 'Tous' ||
        (reco && reco.technique.bol === marketFilters.bol)) &&
      (marketFilters.signalTechnique === 'Tous' ||
        (reco && reco.technique.signal === marketFilters.signalTechnique)) &&
      (perMax === null || (reco && reco.fondamentale.per <= perMax)) &&
      (rentabiliteMin === null ||
        (reco &&
          parsePctNumber(reco.fondamentale.rentabilite) >= rentabiliteMin)) &&
      (evolMin === null ||
        (reco && parsePctNumber(reco.fondamentale.evol) >= evolMin)) &&
      (marketFilters.valorisation === 'Tous' ||
        (reco && reco.fondamentale.valo === marketFilters.valorisation)) &&
      (marketFilters.signalFondamental === 'Tous' ||
        (reco && reco.fondamentale.signal === marketFilters.signalFondamental))
    );
  });

  const activeMarketFilterCount = Object.entries(marketFilters).filter(
    ([key, value]) => {
      if (
        [
          'secteur',
          'statutWatchlist',
          'mm',
          'macd',
          'bol',
          'signalTechnique',
          'valorisation',
          'signalFondamental',
        ].includes(key)
      ) {
        return value !== 'Tous';
      }
      if (key === 'rsiMin') return value !== '' && value !== '0';
      if (key === 'rsiMax') return value !== '' && value !== '100';
      return value !== '';
    }
  ).length;

  const updateMarketFilter = (key, value) =>
    setMarketFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', 'Marchés (Actions & Obligations)']} />

      <div>
        <h2
          className="text-xl font-bold"
          style={{ ...F_DISPLAY, color: C.ink }}
        >
          Vues des Marchés
        </h2>
        <div className="text-xs mt-1" style={{ color: C.sub, ...F_BODY }}>
          Données intrajournalières enrichies et filtrage automatique selon les
          informations de marché, les indicateurs techniques et les critères
          fondamentaux disponibles.
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1.5">
          {['Action', 'Obligation'].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setMarketFilters(defaultMarketFilters);
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: tab === t ? C.navy : '#F0F1F5',
                color: tab === t ? '#fff' : C.sub,
              }}
            >
              {t === 'Action' ? 'Actions' : 'Obligations'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1.5">
            {['Tous', 'BRVM', 'NGX', 'GSE'].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMarche(m);
                  setMarketFilters(defaultMarketFilters);
                }}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: marche === m ? C.navy : '#F0F1F5',
                  color: marche === m ? '#fff' : C.sub,
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <Badge tone="gold">{rows.length} instrument(s)</Badge>
          <Badge tone={activeMarketFilterCount > 0 ? 'teal' : 'slate'}>
            {activeMarketFilterCount} filtre(s) actif(s)
          </Badge>
        </div>
      </div>

      <Card className="p-0 overflow-hidden" style={{ borderColor: C.navy }}>
        <div className="p-4" style={{ background: '#EFF3FB' }}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold" style={{ color: C.ink }}>
                Filtres automatiques — application instantanée
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: C.sub }}>
                Marché : cours, volume, variation et watchlist. Analyse :
                indicateurs techniques et fondamentaux disponibles.
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeMarketFilterCount > 0 && (
                <button
                  type="button"
                  onClick={() => setMarketFilters(defaultMarketFilters)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                  style={{
                    borderColor: C.line,
                    color: C.navy,
                    background: '#fff',
                  }}
                >
                  Réinitialiser
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowMarketFilters((visible) => !visible)}
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                style={{
                  borderColor: C.line,
                  color: C.navy,
                  background: '#fff',
                }}
              >
                {showMarketFilters
                  ? 'Masquer les filtres ↑'
                  : 'Afficher les filtres ↓'}
              </button>
            </div>
          </div>

          {showMarketFilters && (
            <div
              className="mt-4 p-4 rounded-xl border"
              style={{ borderColor: '#D8DFEF', background: '#fff' }}
            >
              <div className="grid grid-cols-5 gap-3">
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Instrument
                  </label>
                  <input
                    type="text"
                    value={marketFilters.recherche}
                    onChange={(e) =>
                      updateMarketFilter('recherche', e.target.value)
                    }
                    placeholder="Rechercher…"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Secteur
                  </label>
                  <select
                    value={marketFilters.secteur}
                    onChange={(e) =>
                      updateMarketFilter('secteur', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {secteurs.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Volume minimum
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={marketFilters.volumeMin}
                    onChange={(e) =>
                      updateMarketFilter('volumeMin', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Var. minimum (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={marketFilters.variationMin}
                    onChange={(e) =>
                      updateMarketFilter('variationMin', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Var. maximum (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={marketFilters.variationMax}
                    onChange={(e) =>
                      updateMarketFilter('variationMax', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>

                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Cours minimum
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={marketFilters.coursMin}
                    onChange={(e) =>
                      updateMarketFilter('coursMin', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Cours maximum
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={marketFilters.coursMax}
                    onChange={(e) =>
                      updateMarketFilter('coursMax', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Statut watchlist
                  </label>
                  <select
                    value={marketFilters.statutWatchlist}
                    onChange={(e) =>
                      updateMarketFilter('statutWatchlist', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {['Tous', 'Ajoutés', 'Non ajoutés'].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    MM
                  </label>
                  <select
                    value={marketFilters.mm}
                    onChange={(e) => updateMarketFilter('mm', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {['Tous', 'Haussière', 'Neutre', 'Baissière'].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    MACD
                  </label>
                  <select
                    value={marketFilters.macd}
                    onChange={(e) => updateMarketFilter('macd', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {macdOptions.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    RSI minimum
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={marketFilters.rsiMin}
                    onChange={(e) =>
                      updateMarketFilter('rsiMin', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    RSI maximum
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={marketFilters.rsiMax}
                    onChange={(e) =>
                      updateMarketFilter('rsiMax', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    BOL
                  </label>
                  <select
                    value={marketFilters.bol}
                    onChange={(e) => updateMarketFilter('bol', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {bolOptions.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Signal technique
                  </label>
                  <select
                    value={marketFilters.signalTechnique}
                    onChange={(e) =>
                      updateMarketFilter('signalTechnique', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {signauxTechniques.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    PER maximum
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={marketFilters.perMax}
                    onChange={(e) =>
                      updateMarketFilter('perMax', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>

                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Rentabilité min. (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={marketFilters.rentabiliteMin}
                    onChange={(e) =>
                      updateMarketFilter('rentabiliteMin', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    EVOL minimum (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={marketFilters.evolMin}
                    onChange={(e) =>
                      updateMarketFilter('evolMin', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Valorisation
                  </label>
                  <select
                    value={marketFilters.valorisation}
                    onChange={(e) =>
                      updateMarketFilter('valorisation', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {valorisations.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Signal fondamental
                  </label>
                  <select
                    value={marketFilters.signalFondamental}
                    onChange={(e) =>
                      updateMarketFilter('signalFondamental', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {signauxFondamentaux.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 1480 }}>
            <thead style={{ background: '#FAFAFC' }}>
              <tr>
                <Th>Instrument</Th>
                <Th>Marché</Th>
                <Th>Cours</Th>
                <Th>Volume</Th>
                <Th>Var %</Th>
                <Th>Var</Th>
                <Th>Cours min</Th>
                <Th>Cours max</Th>
                <Th>Watchlist</Th>
                <Th></Th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-8 text-sm"
                    style={{ color: C.sub }}
                  >
                    Aucun instrument ne satisfait l'ensemble des filtres
                    automatiques.
                  </td>
                </tr>
              )}

              {rows.map((m, i) => {
                const dejaAjoute = watchlistTitles.includes(m.nom);
                const cloturePrecedente =
                  m.variation === -100
                    ? m.cours
                    : m.cours / (1 + m.variation / 100);
                const variationMonetaire = m.cours - cloturePrecedente;
                const variationPositive = variationMonetaire >= 0;

                return (
                  <tr
                    key={m.nom}
                    style={{
                      borderTop: `1px solid ${C.line}`,
                      background: i % 2 ? '#FCFCFD' : '#fff',
                    }}
                  >
                    <Td className="font-semibold whitespace-nowrap">{m.nom}</Td>

                    <Td>
                      <Badge tone="navy">{m.marche}</Badge>
                    </Td>

                    <Td mono className="whitespace-nowrap">
                      {fmtPrice(m.cours)} {m.devise}
                    </Td>

                    <Td mono className="whitespace-nowrap">
                      {fmt(m.volumeJour)}
                    </Td>

                    <Td>
                      <Pct v={m.variation} />
                    </Td>

                    <Td mono className="whitespace-nowrap">
                      <span
                        style={{
                          color: variationPositive ? C.teal : C.coral,
                          fontWeight: 600,
                        }}
                      >
                        {variationPositive ? '+' : ''}
                        {fmtPrice(variationMonetaire)} {m.devise}
                      </span>
                    </Td>

                    <Td mono className="whitespace-nowrap">
                      {fmtPrice(m.coursMin)} {m.devise}
                    </Td>

                    <Td mono className="whitespace-nowrap">
                      {fmtPrice(m.coursMax)} {m.devise}
                    </Td>

                    <Td>
                      <button
                        type="button"
                        disabled={dejaAjoute}
                        onClick={() => onAddWatch(m.nom)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap"
                        style={{
                          background: dejaAjoute ? '#EEF0F4' : '#FBF1DD',
                          color: dejaAjoute ? C.sub : '#8A6A16',
                          cursor: dejaAjoute ? 'default' : 'pointer',
                          opacity: dejaAjoute ? 0.75 : 1,
                        }}
                      >
                        <Star
                          size={13}
                          fill={dejaAjoute ? 'currentColor' : 'none'}
                        />
                        {dejaAjoute ? 'Ajouté' : 'Add Watch'}
                      </button>
                    </Td>

                    <Td>
                      <button
                        onClick={() =>
                          go('profondeur', {
                            marche: m.marche,
                            instrument: m.nom,
                          })
                        }
                        className="text-xs font-semibold whitespace-nowrap"
                        style={{ color: C.navy }}
                      >
                        Profondeur de marché →
                      </button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ProfondeurMarche({ ctx, go, mode = 'gestionnaire', goClient }) {
  const m =
    MARKETS_DATA.find((x) => x.nom === ctx?.instrument) || MARKETS_DATA[0];
  const { asks, bids } = orderBookDemo(m);
  const execs = executionsDemo(m);
  const espaceClient = mode === 'client';
  const portefeuillesCompatibles = espaceClient
    ? CLIENT_GESTION_LIBRE.portefeuilles.filter(
        (portefeuille) => portefeuille.marche === m.marche
      )
    : [];

  return (
    <div className="space-y-4">
      {espaceClient ? (
        <ClientBreadcrumb
          items={['Espace Client', 'Marchés & investir', 'Profondeur', m.nom]}
        />
      ) : (
        <Breadcrumb items={['Accueil', 'Marchés', m.nom]} />
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            {m.nom}
          </h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge tone="navy">{m.marche}</Badge>
            <span className="text-sm" style={F_MONO}>
              {fmtPrice(m.cours)} {m.devise}
            </span>
            <Pct v={m.variation} />
            {espaceClient && portefeuillesCompatibles.length > 0 && (
              <Badge tone="gold">
                {portefeuillesCompatibles.length} SGI compatibles
              </Badge>
            )}
          </div>
        </div>

        {espaceClient ? (
          <div className="flex items-center gap-2 flex-wrap">
            <Btn tone="ghost" onClick={() => goClient?.('client-invest')}>
              Retour aux marchés
            </Btn>
            <Btn
              onClick={() =>
                goClient?.('client-invest', {
                  instrument: m.nom,
                  marche: m.marche,
                })
              }
            >
              Préparer un ordre
            </Btn>
          </div>
        ) : (
          <Btn
            tone="ghost"
            onClick={() =>
              go('carnet', { marche: m.marche, instrument: m.nom })
            }
          >
            Voir le carnet d'ordres interne
          </Btn>
        )}
      </div>

      {espaceClient && (
        <Card className="p-4" style={{ borderColor: '#D8DFEF' }}>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div
                className="text-[10px] uppercase font-semibold"
                style={{ color: C.sub }}
              >
                Marché
              </div>
              <div className="text-sm font-semibold mt-1">{m.marche}</div>
            </div>
            <div>
              <div
                className="text-[10px] uppercase font-semibold"
                style={{ color: C.sub }}
              >
                SGI compatible
              </div>
              <div className="text-sm font-semibold mt-1">
                {portefeuillesCompatibles.length > 0
                  ? portefeuillesCompatibles.map((pf) => pf.sgi).join(' · ')
                  : 'Aucune SGI compatible'}
              </div>
            </div>
            <div>
              <div
                className="text-[10px] uppercase font-semibold"
                style={{ color: C.sub }}
              >
                Portefeuille
              </div>
              <div className="text-sm font-semibold mt-1">
                {portefeuillesCompatibles.length > 0
                  ? portefeuillesCompatibles.map((pf) => pf.nom).join(' · ')
                  : '—'}
              </div>
            </div>
            <div>
              <div
                className="text-[10px] uppercase font-semibold"
                style={{ color: C.sub }}
              >
                Devise de négociation
              </div>
              <div className="text-sm font-semibold mt-1" style={F_MONO}>
                {m.devise}
              </div>
            </div>
          </div>
          <div className="text-[10px] mt-3" style={{ color: C.sub }}>
            La profondeur ci-dessous est informative. Le passage d'ordre reste
            soumis à la liquidité disponible, aux titres disponibles à la vente
            et aux contrôles de la SGI sélectionnée.
          </div>
        </Card>
      )}

      <Card className="p-5">
        <Eyebrow>Profondeur du marché — ordres d'achat et de vente</Eyebrow>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <div
              className="text-xs font-semibold mb-1"
              style={{ color: C.teal }}
            >
              Achats (bid)
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <Th>Prix</Th>
                  <Th>Quantité</Th>
                </tr>
              </thead>
              <tbody>
                {bids.map((b, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                    <Td mono>
                      <span style={{ color: C.teal }}>{b.prix}</span>
                    </Td>
                    <Td mono>{b.qte}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div
              className="text-xs font-semibold mb-1"
              style={{ color: C.coral }}
            >
              Ventes (ask)
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <Th>Prix</Th>
                  <Th>Quantité</Th>
                </tr>
              </thead>
              <tbody>
                {asks.map((a, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                    <Td mono>
                      <span style={{ color: C.coral }}>{a.prix}</span>
                    </Td>
                    <Td mono>{a.qte}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <Eyebrow>Exécutions du jour — volume cumulé</Eyebrow>
        <table className="w-full mt-1">
          <thead>
            <tr>
              <Th>Heure</Th>
              <Th>Sens</Th>
              <Th>Quantité</Th>
              <Th>Prix</Th>
              <Th>Volume cumulé</Th>
            </tr>
          </thead>
          <tbody>
            {execs.map((e, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                <Td mono>{e.heure}</Td>
                <Td>
                  <Badge tone={e.sens === 'Achat' ? 'teal' : 'coral'}>
                    {e.sens}
                  </Badge>
                </Td>
                <Td mono>{e.qte}</Td>
                <Td mono>
                  {e.prix} {m.devise}
                </Td>
                <Td mono>{e.cumule}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Watchlist({ go, watchlistTitles, onRemoveWatch }) {
  const now = new Date();
  const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(now.getDate()).padStart(2, '0')}`;
  const dateLabel = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(now);

  const defaultDailyFilters = {
    marche: 'Tous',
    secteur: 'Tous',
    mm: 'Tous',
    macd: 'Tous',
    rsiMin: '0',
    rsiMax: '100',
    bol: 'Tous',
    signalTechnique: 'Tous',
    perMax: '',
    rentabiliteMin: '',
    evolMin: '',
    valorisation: 'Tous',
    signalFondamental: 'Tous',
  };
  const [dailyFilters, setDailyFilters] = useState(defaultDailyFilters);
  const [showDailyFilters, setShowDailyFilters] = useState(true);

  const dailyRows = buildWatchlistJournaliere(dateKey);
  const staticRows = watchlistTitles
    .map(buildStaticWatchlistRow)
    .filter(Boolean);

  const marches = ['Tous', ...new Set(dailyRows.map((r) => r.marche))];
  const secteurs = ['Tous', ...new Set(dailyRows.map((r) => r.secteur))];
  const macdOptions = [
    'Tous',
    ...new Set(dailyRows.map((r) => r.technique.macd)),
  ];
  const bolOptions = [
    'Tous',
    ...new Set(dailyRows.map((r) => r.technique.bol)),
  ];
  const signauxTechniques = [
    'Tous',
    ...new Set(dailyRows.map((r) => r.technique.signal)),
  ];
  const valorisations = [
    'Tous',
    ...new Set(dailyRows.map((r) => r.fondamentale.valo)),
  ];
  const signauxFondamentaux = [
    'Tous',
    ...new Set(dailyRows.map((r) => r.fondamentale.signal)),
  ];

  const mmDirection = (mm) =>
    mm.includes('>') ? 'Haussière' : mm.includes('<') ? 'Baissière' : 'Neutre';

  const rowsJour = dailyRows.filter((r) => {
    const perMax =
      dailyFilters.perMax === '' ? null : Number(dailyFilters.perMax);
    const rentabiliteMin =
      dailyFilters.rentabiliteMin === ''
        ? null
        : Number(dailyFilters.rentabiliteMin);
    const evolMin =
      dailyFilters.evolMin === '' ? null : Number(dailyFilters.evolMin);
    const rsiMin = Number(dailyFilters.rsiMin || 0);
    const rsiMax = Number(dailyFilters.rsiMax || 100);

    return (
      (dailyFilters.marche === 'Tous' || r.marche === dailyFilters.marche) &&
      (dailyFilters.secteur === 'Tous' || r.secteur === dailyFilters.secteur) &&
      (dailyFilters.mm === 'Tous' ||
        mmDirection(r.technique.mm) === dailyFilters.mm) &&
      (dailyFilters.macd === 'Tous' ||
        r.technique.macd === dailyFilters.macd) &&
      r.technique.rsi >= rsiMin &&
      r.technique.rsi <= rsiMax &&
      (dailyFilters.bol === 'Tous' || r.technique.bol === dailyFilters.bol) &&
      (dailyFilters.signalTechnique === 'Tous' ||
        r.technique.signal === dailyFilters.signalTechnique) &&
      (perMax === null || r.fondamentale.per <= perMax) &&
      (rentabiliteMin === null ||
        parsePctNumber(r.fondamentale.rentabilite) >= rentabiliteMin) &&
      (evolMin === null || parsePctNumber(r.fondamentale.evol) >= evolMin) &&
      (dailyFilters.valorisation === 'Tous' ||
        r.fondamentale.valo === dailyFilters.valorisation) &&
      (dailyFilters.signalFondamental === 'Tous' ||
        r.fondamentale.signal === dailyFilters.signalFondamental)
    );
  });

  const activeFilterCount = Object.entries(dailyFilters).filter(
    ([key, value]) => {
      if (
        [
          'marche',
          'secteur',
          'mm',
          'macd',
          'bol',
          'signalTechnique',
          'valorisation',
          'signalFondamental',
        ].includes(key)
      ) {
        return value !== 'Tous';
      }
      if (key === 'rsiMin') return value !== '0';
      if (key === 'rsiMax') return value !== '100';
      return value !== '';
    }
  ).length;

  const updateDailyFilter = (key, value) =>
    setDailyFilters((current) => ({ ...current, [key]: value }));

  const toneSignalJour = (signal) => {
    if (signal === 'Surveiller achat') return 'teal';
    if (signal === 'Attendre confirmation') return 'gold';
    if (signal === 'Écarter / alléger') return 'coral';
    return 'slate';
  };

  const toneSignalFondamental = (signal) => {
    if (signal === 'Acheter') return 'teal';
    if (signal === 'Vendre') return 'coral';
    return 'gold';
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={['Accueil', 'Watchlist']} />

      <div>
        <h2
          className="text-xl font-bold"
          style={{ ...F_DISPLAY, color: C.ink }}
        >
          Watchlist — sélection fondamentale &amp; technique
        </h2>
        <div className="text-xs mt-1" style={{ color: C.sub, ...F_BODY }}>
          Une liste stratégique alimentée depuis la page Marchés et une
          sélection journalière filtrée automatiquement selon vos critères
          d'analyse.
        </div>
      </div>

      <Card className="p-0 overflow-hidden" style={{ borderColor: C.gold }}>
        <div
          className="p-5 flex items-start justify-between gap-4"
          style={{ background: '#FBF7EE' }}
        >
          <div>
            <Eyebrow>Watchlist statique — conviction fondamentale</Eyebrow>
            <div className="text-sm font-semibold" style={{ color: C.ink }}>
              Valeurs ajoutées depuis « Marchés — Actions &amp; Obligations »
            </div>
            <div className="text-xs mt-1" style={{ color: C.sub }}>
              Utilisez le bouton « Add Watch » sur la page Marchés pour ajouter
              une valeur, puis supprimez-la directement dans ce tableau.
            </div>
          </div>
          <Badge tone="gold">{staticRows.length} valeur(s)</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 1510 }}>
            <thead style={{ background: '#FAFAFC' }}>
              <tr>
                <Th>Instrument</Th>
                <Th>Marché</Th>
                <Th>Secteur</Th>
                <Th>PER</Th>
                <Th>Total return YTD</Th>
                <Th>EVOL</Th>
                <Th>Valorisation</Th>
                <Th>Signal fondamental</Th>
                <Th>Consulter</Th>
                <Th>Supprimer</Th>
              </tr>
            </thead>
            <tbody>
              {staticRows.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="text-center py-8 text-sm"
                    style={{ color: C.sub }}
                  >
                    La watchlist statique est vide. Ajoutez un actif depuis la
                    page Marchés — Actions &amp; Obligations.
                  </td>
                </tr>
              )}
              {staticRows.map((r, i) => (
                <tr
                  key={r.titre}
                  style={{
                    borderTop: `1px solid ${C.line}`,
                    background: i % 2 ? '#FCFCFD' : '#fff',
                  }}
                >
                  <Td className="font-semibold whitespace-nowrap">{r.titre}</Td>
                  <Td>
                    <Badge tone="navy">{r.marche}</Badge>
                  </Td>
                  <Td className="whitespace-nowrap">{r.secteur}</Td>
                  <Td mono>
                    {r.fondamentale.per == null
                      ? 'N/D'
                      : `${r.fondamentale.per.toFixed(1)}x`}
                  </Td>
                  <Td mono>{r.fondamentale.rentabilite}</Td>
                  <Td mono>{r.fondamentale.evol}</Td>
                  <Td className="whitespace-nowrap">{r.fondamentale.valo}</Td>
                  <Td>
                    <Badge tone={toneSignalFondamental(r.fondamentale.signal)}>
                      {r.fondamentale.signal}
                    </Badge>
                  </Td>
                  <Td>
                    <button
                      onClick={() =>
                        go('profondeur', {
                          marche: r.marche,
                          instrument: r.titre,
                        })
                      }
                      className="text-xs font-semibold whitespace-nowrap"
                      style={{ color: C.navy }}
                    >
                      Voir le marché →
                    </button>
                  </Td>
                  <Td>
                    <button
                      type="button"
                      onClick={() => onRemoveWatch(r.titre)}
                      title={`Supprimer ${r.titre} de la watchlist`}
                      aria-label={`Supprimer ${r.titre} de la watchlist`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold"
                      style={{ background: '#FBE9E7', color: C.coral }}
                    >
                      <X size={13} /> Retirer
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        className="p-0 overflow-hidden flex flex-col"
        style={{
          borderColor: C.navy,
          height: 'clamp(620px, calc(100vh - 110px), 780px)',
        }}
      >
        <div
          className="p-5 shrink-0"
          style={{
            background: '#EFF3FB',
            maxHeight: showDailyFilters ? '52%' : 'auto',
            overflowY: showDailyFilters ? 'auto' : 'visible',
            overscrollBehavior: 'contain',
            scrollbarGutter: 'stable',
          }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Eyebrow>Watchlist journalière — signaux de marché</Eyebrow>
              <div className="text-sm font-semibold" style={{ color: C.ink }}>
                Classement du {dateLabel}
              </div>
              <div className="text-xs mt-1" style={{ color: C.sub }}>
                Les filtres s'appliquent instantanément à tous les indicateurs
                techniques et fondamentaux, sans bouton de validation.
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Badge tone="navy">Actualisation quotidienne</Badge>
              <Badge tone="gold">{rowsJour.length} valeur(s)</Badge>
              <Badge tone={activeFilterCount > 0 ? 'teal' : 'slate'}>
                {activeFilterCount} filtre(s) actif(s)
              </Badge>
              <button
                type="button"
                onClick={() => setShowDailyFilters((visible) => !visible)}
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                style={{
                  borderColor: C.line,
                  color: C.navy,
                  background: '#fff',
                }}
              >
                {showDailyFilters
                  ? 'Masquer les filtres ↑'
                  : 'Afficher les filtres ↓'}
              </button>
            </div>
          </div>

          {showDailyFilters && (
            <div
              className="mt-4 p-4 rounded-xl border"
              style={{ borderColor: '#D8DFEF', background: '#fff' }}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: C.ink }}
                  >
                    Filtres automatiques — application instantanée
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDailyFilters(defaultDailyFilters)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                  style={{
                    borderColor: C.line,
                    color: C.navy,
                    background: '#fff',
                  }}
                >
                  Réinitialiser les filtres
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3">
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Bourse
                  </label>
                  <select
                    value={dailyFilters.marche}
                    onChange={(e) =>
                      updateDailyFilter('marche', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {marches.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Secteur
                  </label>
                  <select
                    value={dailyFilters.secteur}
                    onChange={(e) =>
                      updateDailyFilter('secteur', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {secteurs.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    MM
                  </label>
                  <select
                    value={dailyFilters.mm}
                    onChange={(e) => updateDailyFilter('mm', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {['Tous', 'Haussière', 'Neutre', 'Baissière'].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    MACD
                  </label>
                  <select
                    value={dailyFilters.macd}
                    onChange={(e) => updateDailyFilter('macd', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {macdOptions.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    BOL
                  </label>
                  <select
                    value={dailyFilters.bol}
                    onChange={(e) => updateDailyFilter('bol', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {bolOptions.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    RSI minimum
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={dailyFilters.rsiMin}
                    onChange={(e) =>
                      updateDailyFilter('rsiMin', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    RSI maximum
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={dailyFilters.rsiMax}
                    onChange={(e) =>
                      updateDailyFilter('rsiMax', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Signal technique
                  </label>
                  <select
                    value={dailyFilters.signalTechnique}
                    onChange={(e) =>
                      updateDailyFilter('signalTechnique', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {signauxTechniques.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    PER maximum
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={dailyFilters.perMax}
                    onChange={(e) =>
                      updateDailyFilter('perMax', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Rentabilité min. (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={dailyFilters.rentabiliteMin}
                    onChange={(e) =>
                      updateDailyFilter('rentabiliteMin', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>

                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    EVOL minimum (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={dailyFilters.evolMin}
                    onChange={(e) =>
                      updateDailyFilter('evolMin', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Valorisation
                  </label>
                  <select
                    value={dailyFilters.valorisation}
                    onChange={(e) =>
                      updateDailyFilter('valorisation', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {valorisations.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Signal fondamental
                  </label>
                  <select
                    value={dailyFilters.signalFondamental}
                    onChange={(e) =>
                      updateDailyFilter('signalFondamental', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {signauxFondamentaux.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className="flex-1 min-h-0 overflow-auto"
          style={{
            overscrollBehavior: 'contain',
            scrollbarGutter: 'stable',
          }}
        >
          <table className="w-full" style={{ minWidth: 2200 }}>
            <thead
              style={{
                background: '#FAFAFC',
                position: 'sticky',
                top: 0,
                zIndex: 2,
              }}
            >
              <tr>
                <Th>Rang</Th>
                <Th>Instrument</Th>
                <Th>Marché</Th>
                <Th>Secteur</Th>
                <Th>Cours</Th>
                <Th>Variation jour</Th>
                <Th>MM</Th>
                <Th>MACD</Th>
                <Th>RSI</Th>
                <Th>BOL</Th>
                <Th>Score technique</Th>
                <Th>PER</Th>
                <Th>Rentabilité</Th>
                <Th>EVOL</Th>
                <Th>VALO</Th>
                <Th>Signal fondamental</Th>
                <Th>Score fondamental</Th>
                <Th>Score combiné</Th>
                <Th>Signal du jour</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {rowsJour.length === 0 && (
                <tr>
                  <td
                    colSpan={20}
                    className="text-center py-8 text-sm"
                    style={{ color: C.sub }}
                  >
                    Aucune valeur ne satisfait l'ensemble des filtres
                    automatiques.
                  </td>
                </tr>
              )}
              {rowsJour.map((r, i) => (
                <tr
                  key={r.titre}
                  style={{
                    borderTop: `1px solid ${C.line}`,
                    background: i % 2 ? '#FCFCFD' : '#fff',
                  }}
                >
                  <Td mono>
                    <span className="font-bold" style={{ color: C.gold }}>
                      #{i + 1}
                    </span>
                  </Td>
                  <Td className="font-semibold whitespace-nowrap">{r.titre}</Td>
                  <Td>
                    <Badge tone="navy">{r.marche}</Badge>
                  </Td>
                  <Td className="whitespace-nowrap">{r.secteur}</Td>
                  <Td mono className="whitespace-nowrap">
                    {r.cours} {r.devise}
                  </Td>
                  <Td>
                    <Pct v={r.variationJour} />
                  </Td>
                  <Td mono className="whitespace-nowrap">
                    {r.technique.mm}
                  </Td>
                  <Td className="whitespace-nowrap">{r.technique.macd}</Td>
                  <Td mono>{r.technique.rsi}</Td>
                  <Td className="whitespace-nowrap">{r.technique.bol}</Td>
                  <Td mono>{r.scoreTechnique}/100</Td>
                  <Td mono>{r.fondamentale.per.toFixed(1)}x</Td>
                  <Td mono>{r.fondamentale.rentabilite}</Td>
                  <Td mono>{r.fondamentale.evol}</Td>
                  <Td className="whitespace-nowrap">{r.fondamentale.valo}</Td>
                  <Td>
                    <Badge tone={toneSignalFondamental(r.fondamentale.signal)}>
                      {r.fondamentale.signal}
                    </Badge>
                  </Td>
                  <Td mono>{r.scoreFondamental}/100</Td>
                  <Td>
                    <Badge
                      tone={
                        r.scoreCombine >= 78
                          ? 'teal'
                          : r.scoreCombine >= 63
                          ? 'gold'
                          : r.scoreCombine < 48
                          ? 'coral'
                          : 'slate'
                      }
                    >
                      {r.scoreCombine}/100
                    </Badge>
                  </Td>
                  <Td>
                    <Badge tone={toneSignalJour(r.signalJour)}>
                      {r.signalJour}
                    </Badge>
                  </Td>
                  <Td>
                    <button
                      onClick={() =>
                        go('profondeur', {
                          marche: r.marche,
                          instrument: r.titre,
                        })
                      }
                      className="text-xs font-semibold whitespace-nowrap"
                      style={{ color: C.navy }}
                    >
                      Analyser →
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function RecosActions({ go }) {
  const [filtreSens, setFiltreSens] = useState('Tous');
  const rows = RECOS.filter(
    (r) => filtreSens === 'Tous' || r.sens === filtreSens
  );
  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', 'Recommandations actions']} />
      <div className="flex items-center justify-between">
        <h2
          className="text-xl font-bold"
          style={{ ...F_DISPLAY, color: C.ink }}
        >
          Recommandations — marché actions
        </h2>
        <div className="flex gap-1.5">
          {['Tous', 'Achat', 'Vente', 'Conserver'].map((s) => (
            <button
              key={s}
              onClick={() => setFiltreSens(s)}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: filtreSens === s ? C.navy : '#F0F1F5',
                color: filtreSens === s ? '#fff' : C.sub,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {rows.map((r) => (
          <Card key={r.titre} className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold" style={F_DISPLAY}>
                {r.titre}
              </span>
              <Badge
                tone={
                  r.sens === 'Achat'
                    ? 'teal'
                    : r.sens === 'Vente'
                    ? 'coral'
                    : 'slate'
                }
              >
                {r.sens}
              </Badge>
            </div>
            <div className="text-xs mb-3" style={{ color: C.sub }}>
              {r.marche} · {r.secteur}
            </div>
            <div className="flex justify-between text-sm mb-1" style={F_MONO}>
              <span>
                Cours {r.cours} {r.devise}
              </span>
              <span style={{ color: C.gold }}>Objectif {r.objectif}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <Badge tone={r.conviction === 'Forte' ? 'navy' : 'slate'}>
                Conviction {r.conviction}
              </Badge>
              {r.sens !== 'Conserver' && (
                <button
                  onClick={() =>
                    go('alloc-criteres', { sens: r.sens, instrument: r.titre })
                  }
                  className="text-xs font-semibold"
                  style={{ color: C.navy }}
                >
                  Passage groupé →
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RecoAlloc({ go }) {
  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', "Recommandation d'allocation"]} />
      <h2 className="text-xl font-bold" style={{ ...F_DISPLAY, color: C.ink }}>
        Recommandation d'allocation aux portefeuilles clients
      </h2>
      <Card className="p-0 overflow-hidden">
        <table className="w-full">
          <thead style={{ background: '#FAFAFC' }}>
            <tr>
              <Th>Client</Th>
              <Th>Actuel</Th>
              <Th>Cible</Th>
              <Th>Écart</Th>
              <Th>Action suggérée</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map((c, i) => {
              const ecart = c.alloc['Actions'] - c.cible['Actions'];
              return (
                <tr
                  key={c.id}
                  style={{
                    borderTop: `1px solid ${C.line}`,
                    background: i % 2 ? '#FCFCFD' : '#fff',
                  }}
                >
                  <Td className="font-semibold">{c.nom}</Td>
                  <Td mono>{c.alloc['Actions']}% Actions</Td>
                  <Td mono>{c.cible['Actions']}% Actions</Td>
                  <Td>
                    {ecart > 0 ? (
                      <Badge tone="coral">+{ecart} pts</Badge>
                    ) : (
                      <Badge tone="teal">{ecart} pts</Badge>
                    )}
                  </Td>
                  <Td>
                    {ecart > 3
                      ? 'Réduire Actions'
                      : ecart < -3
                      ? 'Renforcer Actions'
                      : 'Aucune'}
                  </Td>
                  <Td>
                    {Math.abs(ecart) > 3 && (
                      <button
                        onClick={() =>
                          go('alloc-criteres', {
                            sens: ecart > 0 ? 'Vente' : 'Achat',
                          })
                        }
                        className="text-xs font-semibold"
                        style={{ color: C.navy }}
                      >
                        Appliquer →
                      </button>
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function AllocCriteres({ initialSens, initialInstrument }) {
  const [type, setType] = useState('Actions');
  const [sens, setSens] = useState(initialSens || 'Achat');
  const [marche, setMarche] = useState('Tous');
  const [typePortefeuille, setTypePortefeuille] = useState('Tous');
  const [instrument, setInstrument] = useState(
    initialInstrument && INSTRUMENTS.includes(initialInstrument)
      ? initialInstrument
      : 'Aucun'
  );
  const [operateur, setOperateur] = useState('<');
  const [seuil, setSeuil] = useState(10);
  const [ordreType, setOrdreType] = useState('Ordre au marché');
  const [montantOrdre, setMontantOrdre] = useState(1_000_000);
  const [pourcentageOrdre, setPourcentageOrdre] = useState(10);
  const [applique, setApplique] = useState(false);

  const results = CLIENTS.filter((c) => {
    const matchMarche = marche === 'Tous' || c.marche === marche;
    const matchInstrument =
      instrument === 'Aucun' ||
      compareOp(exposureOf(c.id, instrument), operateur, Number(seuil));
    const matchTypePortefeuille =
      typePortefeuille === 'Tous' ||
      (PROFILE_TYPE_LABEL[c.type] || c.type) === typePortefeuille;
    return matchMarche && matchInstrument && matchTypePortefeuille;
  });

  const projection = (c) => {
    const valeurActuelle = (c.encours * c.alloc[type]) / 100;
    const delta = sens === 'Achat' ? montantOrdre : -montantOrdre;
    const nouvellePct = ((valeurActuelle + delta) / c.encours) * 100;
    return {
      ecartActuel: c.alloc[type] - c.cible[type],
      ecartProjete: nouvellePct - c.cible[type],
      nouvellePct,
    };
  };

  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', 'Allocation par critères']} />
      <h2 className="text-xl font-bold" style={{ ...F_DISPLAY, color: C.ink }}>
        Allocation par critères
      </h2>
      <Card className="p-4 grid grid-cols-4 gap-4">
        <div>
          <label
            className="text-xs font-semibold block mb-1"
            style={{ color: C.sub }}
          >
            Type d'instrument
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border text-sm"
            style={{ borderColor: C.line }}
          >
            <option>Actions</option>
            <option>Obl. souveraines</option>
            <option>Obl. privées</option>
          </select>
        </div>
        <div>
          <label
            className="text-xs font-semibold block mb-1"
            style={{ color: C.sub }}
          >
            Sens
          </label>
          <select
            value={sens}
            onChange={(e) => setSens(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border text-sm"
            style={{ borderColor: C.line }}
          >
            <option>Achat</option>
            <option>Vente</option>
          </select>
        </div>
        <div>
          <label
            className="text-xs font-semibold block mb-1"
            style={{ color: C.sub }}
          >
            Marché boursier
          </label>
          <select
            value={marche}
            onChange={(e) => setMarche(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border text-sm"
            style={{ borderColor: C.line }}
          >
            <option>Tous</option>
            <option>BRVM</option>
            <option>NGX</option>
            <option>GSE</option>
          </select>
        </div>
        <div>
          <label
            className="text-xs font-semibold block mb-1"
            style={{ color: C.sub }}
          >
            Type de portefeuille
          </label>
          <select
            value={typePortefeuille}
            onChange={(e) => setTypePortefeuille(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border text-sm"
            style={{ borderColor: C.line }}
          >
            <option>Tous</option>
            <option>Particulier</option>
            <option>Institutionnel</option>
          </select>
        </div>
      </Card>

      <Card className="p-4">
        <Eyebrow>Filtre par instrument et seuil d'exposition</Eyebrow>
        <div className="grid grid-cols-4 gap-4 mt-1">
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Instrument (action / obligation)
            </label>
            <select
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line }}
            >
              <option>Aucun</option>
              {INSTRUMENTS.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Opérateur de comparaison
            </label>
            <select
              value={operateur}
              onChange={(e) => setOperateur(e.target.value)}
              disabled={instrument === 'Aucun'}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{
                borderColor: C.line,
                opacity: instrument === 'Aucun' ? 0.5 : 1,
              }}
            >
              <option value="<">{'< (inférieur à)'}</option>
              <option value="=">{'= (égal à)'}</option>
              <option value=">">{'> (supérieur à)'}</option>
            </select>
          </div>
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Seuil d'exposition par portefeuille (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={seuil}
              onChange={(e) => setSeuil(e.target.value)}
              disabled={instrument === 'Aucun'}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{
                borderColor: C.line,
                opacity: instrument === 'Aucun' ? 0.5 : 1,
                ...F_MONO,
              }}
            />
          </div>
          <div className="flex items-end gap-2">
            {instrument !== 'Aucun' && (
              <Badge tone="navy">
                Exposition {instrument} {operateur} {seuil}%
              </Badge>
            )}
            <Badge tone="gold">{results.length} portefeuille(s)</Badge>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <table className="w-full">
          <thead style={{ background: '#FAFAFC' }}>
            <tr>
              <Th>Client</Th>
              <Th>Marché</Th>
              <Th>Type</Th>
              <Th>Écart actuel {type}</Th>
              {instrument !== 'Aucun' && <Th>Exposition {instrument}</Th>}
              <Th>Écart après ordre</Th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 && (
              <tr>
                <td
                  colSpan={instrument !== 'Aucun' ? 6 : 5}
                  className="text-center py-6 text-sm"
                  style={{ color: C.sub }}
                >
                  Aucun portefeuille ne correspond à ces critères.
                </td>
              </tr>
            )}
            {results.map((c, i) => {
              const p = projection(c);
              return (
                <tr
                  key={c.id}
                  style={{
                    borderTop: `1px solid ${C.line}`,
                    background: i % 2 ? '#FCFCFD' : '#fff',
                  }}
                >
                  <Td className="font-semibold">{c.nom}</Td>
                  <Td>
                    <Badge tone="navy">{c.marche}</Badge>
                  </Td>
                  <Td>
                    <Badge tone="slate">
                      {PROFILE_TYPE_LABEL[c.type] || c.type}
                    </Badge>
                  </Td>
                  <Td mono>{p.ecartActuel.toFixed(1)} pts</Td>
                  {instrument !== 'Aucun' && (
                    <Td mono>{exposureOf(c.id, instrument)}%</Td>
                  )}
                  <Td mono>
                    <Badge
                      tone={Math.abs(p.ecartProjete) > 3 ? 'coral' : 'teal'}
                    >
                      {p.ecartProjete > 0 ? '+' : ''}
                      {p.ecartProjete.toFixed(1)} pts
                    </Badge>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Card className="p-4">
        <Eyebrow>Passage d'ordre groupé</Eyebrow>
        <div className="flex items-end gap-4 mt-1 flex-wrap">
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Type d'ordre
            </label>
            <select
              value={ordreType}
              onChange={(e) => setOrdreType(e.target.value)}
              className="px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line }}
            >
              <option>Ordre au marché</option>
              <option>Ordre limite</option>
              <option>Meilleure limite</option>
            </select>
          </div>
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Pourcentage de liquidité de l'ordre par portefeuille
            </label>
            <input
              type="number"
              min="0"
              step="1"
              max="100"
              value={pourcentageOrdre}
              onChange={(e) => setPourcentageOrdre(Number(e.target.value))}
              className="px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line, ...F_MONO }}
            />
          </div>
          <Btn onClick={() => setApplique(true)}>Appliquer</Btn>
          {applique && results.length > 0 && (
            <Badge tone="teal">
              {results.length} ordre(s) de {sens} lancé(s) en {ordreType} sur{' '}
              {results.length} portefeuille(s)
            </Badge>
          )}
          {applique && results.length === 0 && (
            <Badge tone="coral">Aucun portefeuille éligible à traiter</Badge>
          )}
        </div>
      </Card>
    </div>
  );
}

function Alertes({ go }) {
  const [filtreType, setFiltreType] = useState('Tous');
  const typesDisponibles = ['Tous', ...new Set(ALERTES.map((a) => a.type))];
  const alertesFiltrees = ALERTES.filter(
    (a) => filtreType === 'Tous' || a.type === filtreType
  );

  const toneType = (type) => {
    if (type === 'Allocation') return 'navy';
    if (type === 'Rendement') return 'gold';
    if (type === 'Risque') return 'coral';
    return 'slate';
  };

  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', 'Alertes']} />

      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Alertes de seuil — allocation, rendement & risque
          </h2>
          <div className="text-xs mt-1" style={{ color: C.sub, ...F_BODY }}>
            Filtrez les alertes suivant leur type pour cibler les contrôles à
            traiter.
          </div>
        </div>

        <div className="flex items-end gap-3 flex-wrap">
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Type d'alerte
            </label>
            <select
              value={filtreType}
              onChange={(e) => setFiltreType(e.target.value)}
              className="min-w-[180px] px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line, background: '#fff', ...F_BODY }}
            >
              {typesDisponibles.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <Badge tone="gold">{alertesFiltrees.length} alerte(s)</Badge>
          {filtreType !== 'Tous' && (
            <button
              onClick={() => setFiltreType('Tous')}
              className="px-3 py-2 rounded-xl border text-xs font-semibold"
              style={{ borderColor: C.line, color: C.navy, background: '#fff' }}
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full">
          <thead style={{ background: '#FAFAFC' }}>
            <tr>
              <Th>Client</Th>
              <Th>Type</Th>
              <Th>Actif</Th>
              <Th>Écart</Th>
              <Th>Marché</Th>
              <Th>Sévérité</Th>
              <Th>Depuis</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {alertesFiltrees.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-8 text-sm"
                  style={{ color: C.sub, ...F_BODY }}
                >
                  Aucune alerte ne correspond au type sélectionné.
                </td>
              </tr>
            )}

            {alertesFiltrees.map((a, i) => (
              <tr
                key={`${a.client}-${a.type}-${a.actif}-${i}`}
                style={{
                  borderTop: `1px solid ${C.line}`,
                  background: i % 2 ? '#FCFCFD' : '#fff',
                }}
              >
                <Td className="font-semibold">{a.client}</Td>
                <Td>
                  <Badge tone={toneType(a.type)}>{a.type}</Badge>
                </Td>
                <Td>{a.actif}</Td>
                <Td>{a.ecart}</Td>
                <Td>
                  <Badge tone="navy">{a.marche}</Badge>
                </Td>
                <Td>
                  <Badge
                    tone={
                      a.severite === 'Haute'
                        ? 'coral'
                        : a.severite === 'Moyenne'
                        ? 'gold'
                        : 'slate'
                    }
                  >
                    {a.severite}
                  </Badge>
                </Td>
                <Td>{a.depuis}</Td>
                <Td>
                  <button
                    onClick={() =>
                      go('reequilibrage', { client: a.client, actif: a.actif })
                    }
                    className="text-xs font-semibold"
                    style={{ color: C.navy }}
                  >
                    Rééquilibrer →
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Reequilibrage({ initial, devise = 'XOF' }) {
  const initialClient = CLIENTS.find(
    (c) => c.id === initial?.client || c.nom === initial?.client
  );
  const initialBesoins = initialClient
    ? besoinsReequilibrageClient(initialClient)
    : [];

  const [clientSelectionneId, setClientSelectionneId] = useState(
    initialClient?.id || null
  );
  const [actifSelectionne, setActifSelectionne] = useState(
    initialBesoins.some((b) => b.actif === initial?.actif)
      ? initial.actif
      : initialBesoins[0]?.actif || null
  );
  const [ordresParActif, setOrdresParActif] = useState({});
  const [filtreClient, setFiltreClient] = useState('');
  const [filtreTypePortefeuille, setFiltreTypePortefeuille] = useState('Tous');

  const tousPortefeuillesAvecBesoins = CLIENTS.map((client) => ({
    client,
    besoins: besoinsReequilibrageClient(client),
  })).filter((ligne) => ligne.besoins.length > 0);

  const typesPortefeuilleDisponibles = [
    'Tous',
    ...new Set(
      tousPortefeuillesAvecBesoins.map(
        ({ client }) => PROFILE_TYPE_LABEL[client.type] || client.type
      )
    ),
  ];

  const portefeuillesAvecBesoins = tousPortefeuillesAvecBesoins.filter(
    ({ client }) => {
      const nomCorrespond = client.nom
        .toLowerCase()
        .includes(filtreClient.trim().toLowerCase());
      const typeLibelle = PROFILE_TYPE_LABEL[client.type] || client.type;
      const typeCorrespond =
        filtreTypePortefeuille === 'Tous' ||
        typeLibelle === filtreTypePortefeuille;

      return nomCorrespond && typeCorrespond;
    }
  );

  const clientSelectionne = CLIENTS.find(
    (client) => client.id === clientSelectionneId
  );
  const besoinsSelectionnes = clientSelectionne
    ? besoinsReequilibrageClient(clientSelectionne)
    : [];

  const filtresActifs =
    Number(Boolean(filtreClient.trim())) +
    Number(filtreTypePortefeuille !== 'Tous');

  const reinitialiserFiltres = () => {
    setFiltreClient('');
    setFiltreTypePortefeuille('Tous');
  };

  const totalPropositions = portefeuillesAvecBesoins.reduce(
    (somme, ligne) => somme + ligne.besoins.length,
    0
  );
  const montantTotalAReallouer = portefeuillesAvecBesoins.reduce(
    (somme, ligne) =>
      somme +
      ligne.besoins.reduce(
        (total, besoin) =>
          total + convertCurrency(besoin.montant, ligne.client.devise, devise),
        0
      ),
    0
  );

  const ouvrirPortefeuille = (client, actif = null) => {
    const besoins = besoinsReequilibrageClient(client);
    setClientSelectionneId(client.id);
    setActifSelectionne(
      besoins.some((besoin) => besoin.actif === actif)
        ? actif
        : besoins[0]?.actif || null
    );
    setOrdresParActif({});
  };

  const afficherToutesLesPropositions = () => {
    setClientSelectionneId(null);
    setActifSelectionne(null);
    setOrdresParActif({});
  };

  const construireOrdres = (client, besoin) => {
    const operation = besoin.sens === 'Renforcer' ? 'Achat' : 'Vente';

    if (besoin.actif === 'Actions') {
      let candidats =
        besoin.sens === 'Réduire'
          ? RECOS.filter(
              (reco) =>
                reco.marche === client.marche &&
                exposureOf(client.id, reco.titre) > 0
            ).sort(
              (a, b) => scoreTechniqueWatchlist(a) - scoreTechniqueWatchlist(b)
            )
          : RECOS.filter(
              (reco) => reco.marche === client.marche && reco.sens === 'Achat'
            ).sort(
              (a, b) => scoreTechniqueWatchlist(b) - scoreTechniqueWatchlist(a)
            );

      if (candidats.length === 0 && besoin.sens === 'Renforcer') {
        candidats = RECOS.filter((reco) => reco.sens === 'Achat').sort(
          (a, b) => scoreTechniqueWatchlist(b) - scoreTechniqueWatchlist(a)
        );
      }

      const selection = candidats.slice(0, 2);
      if (selection.length === 0) return [];

      const montantParOrdreClient = besoin.montant / selection.length;
      return selection.map((reco) => {
        const montantDansDeviseInstrument = convertCurrency(
          montantParOrdreClient,
          client.devise,
          reco.devise
        );

        return {
          titre: reco.titre,
          operation,
          marche: reco.marche,
          devise: reco.devise,
          prix: reco.cours,
          quantite: Math.max(
            1,
            Math.round(montantDansDeviseInstrument / reco.cours)
          ),
          montant: Math.round(montantDansDeviseInstrument),
        };
      });
    }

    if (
      besoin.actif === 'Obl. souveraines' ||
      besoin.actif === 'Obl. privées'
    ) {
      let candidats = MARKETS_DATA.filter(
        (instrument) =>
          instrument.type === 'Obligation' &&
          instrument.marche === client.marche
      );
      if (candidats.length === 0) {
        candidats = MARKETS_DATA.filter(
          (instrument) => instrument.type === 'Obligation'
        );
      }

      const instrument = candidats[0];
      if (!instrument) return [];

      const montantDansDeviseInstrument = convertCurrency(
        besoin.montant,
        client.devise,
        instrument.devise
      );

      return [
        {
          titre: instrument.nom,
          operation,
          marche: instrument.marche,
          devise: instrument.devise,
          prix: instrument.cours,
          quantite: Math.max(
            1,
            Math.round(montantDansDeviseInstrument / instrument.cours)
          ),
          montant: Math.round(montantDansDeviseInstrument),
        },
      ];
    }

    return [
      {
        titre: 'Compte espèces / support monétaire',
        operation:
          besoin.sens === 'Renforcer'
            ? 'Constitution de liquidité'
            : 'Réinvestissement',
        marche: client.marche,
        devise: client.devise,
        prix: null,
        quantite: null,
        montant: besoin.montant,
      },
    ];
  };

  const genererOrdres = (client, besoin) => {
    setActifSelectionne(besoin.actif);
    setOrdresParActif((courant) => ({
      ...courant,
      [besoin.actif]: construireOrdres(client, besoin),
    }));
  };

  const tonePriorite = (priorite) => {
    if (priorite === 'Haute') return 'coral';
    if (priorite === 'Moyenne') return 'gold';
    return 'slate';
  };

  if (!clientSelectionne) {
    return (
      <div className="space-y-5">
        <Breadcrumb items={['Accueil', 'Rééquilibrage']} />

        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Rééquilibrage — propositions pour tous les portefeuilles
          </h2>
          <div className="text-xs mt-1" style={{ color: C.sub, ...F_BODY }}>
            Seuls les écarts strictement supérieurs à {SEUIL_REEQUILIBRAGE}{' '}
            points par rapport à l'allocation cible sont considérés comme
            nécessitant un rééquilibrage.
          </div>
        </div>

        <Card className="p-4" style={{ borderColor: C.navy }}>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="grid grid-cols-2 gap-3 flex-1 min-w-[520px]">
              <div>
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{ color: C.sub }}
                >
                  Nom du client
                </label>
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                  style={{ borderColor: C.line, background: '#fff' }}
                >
                  <Search size={14} color={C.sub} />
                  <input
                    type="text"
                    value={filtreClient}
                    onChange={(e) => setFiltreClient(e.target.value)}
                    placeholder="Rechercher un client…"
                    className="w-full text-sm outline-none"
                    style={F_BODY}
                  />
                </div>
              </div>

              <div>
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{ color: C.sub }}
                >
                  Type de portefeuille
                </label>
                <select
                  value={filtreTypePortefeuille}
                  onChange={(e) => setFiltreTypePortefeuille(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                  style={{ borderColor: C.line, background: '#fff', ...F_BODY }}
                >
                  {typesPortefeuilleDisponibles.map((type) => (
                    <option key={type} value={type}>
                      {type === 'Tous' ? 'Tous les types' : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Badge tone="navy">Devise principale : {devise}</Badge>
              <Badge tone="gold">
                {portefeuillesAvecBesoins.length} portefeuille(s)
              </Badge>
              <Badge tone={filtresActifs > 0 ? 'teal' : 'slate'}>
                {filtresActifs} filtre(s) actif(s)
              </Badge>
              {filtresActifs > 0 && (
                <button
                  type="button"
                  onClick={reinitialiserFiltres}
                  className="px-3 py-2 rounded-xl border text-xs font-semibold"
                  style={{
                    borderColor: C.line,
                    color: C.navy,
                    background: '#fff',
                  }}
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </div>
          <div className="text-[11px] mt-3" style={{ color: C.sub }}>
            Les filtres s'appliquent instantanément aux portefeuilles qui
            dépassent le seuil de rééquilibrage.
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-xs" style={{ color: C.sub }}>
              Portefeuilles à rééquilibrer
            </div>
            <div className="text-2xl font-bold mt-1" style={F_DISPLAY}>
              {portefeuillesAvecBesoins.length}
            </div>
            <div className="text-xs mt-1" style={{ color: C.sub }}>
              sur {tousPortefeuillesAvecBesoins.length} portefeuille(s) à
              traiter
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs" style={{ color: C.sub }}>
              Propositions affichées
            </div>
            <div className="text-2xl font-bold mt-1" style={F_DISPLAY}>
              {totalPropositions}
            </div>
            <div className="text-xs mt-1" style={{ color: C.sub }}>
              après application des filtres
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs" style={{ color: C.sub }}>
              Montants indicatifs à réallouer
            </div>
            <div className="text-xl font-bold mt-1" style={F_DISPLAY}>
              {fmt(Math.round(montantTotalAReallouer))} {devise}
            </div>
            <div className="text-xs mt-1" style={{ color: C.sub }}>
              Conversion dans la devise principale sélectionnée sur l'accueil
            </div>
          </Card>
        </div>

        {tousPortefeuillesAvecBesoins.length === 0 && (
          <Card className="p-8 text-center">
            <Badge tone="teal">Toutes les allocations sont conformes</Badge>
            <div className="text-sm mt-3" style={{ color: C.sub }}>
              Aucun portefeuille ne dépasse le seuil de rééquilibrage.
            </div>
          </Card>
        )}

        {tousPortefeuillesAvecBesoins.length > 0 &&
          portefeuillesAvecBesoins.length === 0 && (
            <Card className="p-8 text-center">
              <Badge tone="gold">Aucun résultat</Badge>
              <div className="text-sm mt-3" style={{ color: C.sub }}>
                Aucun portefeuille à rééquilibrer ne correspond au nom ou au
                type sélectionné.
              </div>
              <div className="mt-3">
                <Btn tone="ghost" onClick={reinitialiserFiltres}>
                  Réinitialiser les filtres
                </Btn>
              </div>
            </Card>
          )}

        {portefeuillesAvecBesoins.map(({ client, besoins }) => (
          <Card
            key={client.id}
            className="p-0 overflow-hidden"
            style={{ borderColor: C.gold }}
          >
            <div
              className="p-4 flex items-center justify-between gap-4"
              style={{ background: '#FBF7EE' }}
            >
              <div>
                <div
                  className="text-base font-bold"
                  style={{ ...F_DISPLAY, color: C.ink }}
                >
                  {client.nom}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge tone="navy">
                    {client.marche} · {client.devise}
                  </Badge>
                  <Badge tone="slate">
                    {PROFILE_TYPE_LABEL[client.type] || client.type}
                  </Badge>
                  <Badge tone="slate">{client.profilRisque}</Badge>
                  <Badge tone="gold">{besoins.length} proposition(s)</Badge>
                </div>
              </div>
              <button
                type="button"
                onClick={() => ouvrirPortefeuille(client, besoins[0]?.actif)}
                className="px-3 py-2 rounded-xl text-xs font-semibold"
                style={{ background: C.navy, color: '#fff', ...F_BODY }}
              >
                Ouvrir le détail →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 1180 }}>
                <thead style={{ background: '#FAFAFC' }}>
                  <tr>
                    <Th>Classe d'actifs</Th>
                    <Th>Répartition par classe d'actifs</Th>
                    <Th>Allocation cible</Th>
                    <Th>Écart</Th>
                    <Th>Action proposée</Th>
                    <Th>Montant indicatif ({devise})</Th>
                    <Th>Priorité</Th>
                    <Th>Proposition</Th>
                  </tr>
                </thead>
                <tbody>
                  {besoins.map((besoin, index) => (
                    <tr
                      key={besoin.actif}
                      style={{
                        borderTop: `1px solid ${C.line}`,
                        background: index % 2 ? '#FCFCFD' : '#fff',
                      }}
                    >
                      <Td className="font-semibold whitespace-nowrap">
                        {besoin.actif}
                      </Td>
                      <Td mono>{besoin.actuel.toFixed(1)}%</Td>
                      <Td mono>{besoin.cible.toFixed(1)}%</Td>
                      <Td mono>
                        <Badge tone="coral">
                          {besoin.ecart > 0 ? '+' : ''}
                          {besoin.ecart.toFixed(1)} pts
                        </Badge>
                      </Td>
                      <Td>
                        <Badge
                          tone={besoin.sens === 'Renforcer' ? 'teal' : 'coral'}
                        >
                          {besoin.sens}
                        </Badge>
                      </Td>
                      <Td mono className="whitespace-nowrap">
                        <div className="font-semibold">
                          {fmt(
                            Math.round(
                              convertCurrency(
                                besoin.montant,
                                client.devise,
                                devise
                              )
                            )
                          )}{' '}
                          {devise}
                        </div>
                        {client.devise !== devise && (
                          <div
                            className="text-[10px] mt-0.5"
                            style={{ color: C.sub, ...F_BODY }}
                          >
                            {fmt(besoin.montant)} {client.devise} avant
                            conversion
                          </div>
                        )}
                      </Td>
                      <Td>
                        <Badge tone={tonePriorite(besoin.priorite)}>
                          {besoin.priorite}
                        </Badge>
                      </Td>
                      <Td>
                        <span className="text-xs" style={{ color: C.sub }}>
                          {propositionReequilibrage(besoin)}
                        </span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={['Accueil', 'Rééquilibrage', clientSelectionne.nom]} />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Proposition de rééquilibrage — {clientSelectionne.nom}
          </h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge tone="navy">
              {clientSelectionne.marche} · {clientSelectionne.devise}
            </Badge>
            <Badge tone="slate">
              {PROFILE_TYPE_LABEL[clientSelectionne.type] ||
                clientSelectionne.type}
            </Badge>
            <Badge tone="slate">{clientSelectionne.profilRisque}</Badge>
            <Badge tone="gold">Affichage : {devise}</Badge>
            <Badge tone="gold">
              {besoinsSelectionnes.length} écart(s) à traiter
            </Badge>
          </div>
        </div>
        <Btn tone="ghost" onClick={afficherToutesLesPropositions}>
          Voir toutes les propositions
        </Btn>
      </div>

      {besoinsSelectionnes.length === 0 ? (
        <Card className="p-8 text-center" style={{ borderColor: C.teal }}>
          <Badge tone="teal">Allocation conforme</Badge>
          <div className="text-sm mt-3" style={{ color: C.sub }}>
            Ce portefeuille ne présente aucun écart supérieur à{' '}
            {SEUIL_REEQUILIBRAGE} points.
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-3">
            {Object.keys(clientSelectionne.alloc).map((actif) => {
              const besoin = besoinsSelectionnes.find(
                (item) => item.actif === actif
              );
              const selectionne = actifSelectionne === actif;

              return (
                <Card
                  key={actif}
                  onClick={
                    besoin
                      ? () => {
                          setActifSelectionne(actif);
                        }
                      : undefined
                  }
                  className="p-4"
                  style={{
                    borderColor: selectionne
                      ? C.gold
                      : besoin
                      ? C.coral
                      : C.line,
                    borderWidth: selectionne ? 2 : 1,
                    opacity: besoin ? 1 : 0.75,
                  }}
                >
                  <div
                    className="text-xs font-semibold mb-1"
                    style={{ color: C.sub }}
                  >
                    {actif}
                  </div>
                  <div className="text-lg font-bold mb-1" style={F_DISPLAY}>
                    {clientSelectionne.alloc[actif]}%
                  </div>
                  {besoin ? (
                    <Badge tone="coral">
                      {besoin.ecart > 0 ? '+' : ''}
                      {besoin.ecart.toFixed(1)} pts vs cible
                    </Badge>
                  ) : (
                    <Badge tone="teal">Conforme</Badge>
                  )}
                </Card>
              );
            })}
          </div>

          <div className="space-y-4">
            {besoinsSelectionnes.map((besoin) => {
              const ordres = ordresParActif[besoin.actif];
              const selectionne = actifSelectionne === besoin.actif;

              return (
                <Card
                  key={besoin.actif}
                  className="p-5"
                  style={{
                    borderColor: selectionne ? C.gold : C.line,
                    borderWidth: selectionne ? 2 : 1,
                  }}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <Eyebrow>Recommandation — {besoin.actif}</Eyebrow>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          tone={besoin.sens === 'Renforcer' ? 'teal' : 'coral'}
                        >
                          {besoin.sens}
                        </Badge>
                        <Badge tone={tonePriorite(besoin.priorite)}>
                          Priorité {besoin.priorite}
                        </Badge>
                        <span className="text-xs" style={{ color: C.sub }}>
                          Actuel {besoin.actuel}% · Cible {besoin.cible}% ·
                          Écart {besoin.ecart > 0 ? '+' : ''}
                          {besoin.ecart.toFixed(1)} pts
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs" style={{ color: C.sub }}>
                        Montant indicatif à réallouer
                      </div>
                      <div className="text-lg font-bold" style={F_DISPLAY}>
                        {fmt(
                          Math.round(
                            convertCurrency(
                              besoin.montant,
                              clientSelectionne.devise,
                              devise
                            )
                          )
                        )}{' '}
                        {devise}
                      </div>
                      {clientSelectionne.devise !== devise && (
                        <div
                          className="text-[10px] mt-0.5"
                          style={{ color: C.sub }}
                        >
                          {fmt(besoin.montant)} {clientSelectionne.devise} avant
                          conversion
                        </div>
                      )}
                    </div>
                  </div>

                  <p
                    className="text-sm mt-3"
                    style={{ color: C.ink, ...F_BODY }}
                  >
                    {propositionReequilibrage(besoin)}
                  </p>

                  <div className="mt-3">
                    <Btn
                      onClick={() => genererOrdres(clientSelectionne, besoin)}
                    >
                      Générer les ordres proposés
                    </Btn>
                  </div>

                  {ordres && ordres.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full" style={{ minWidth: 850 }}>
                        <thead style={{ background: '#FAFAFC' }}>
                          <tr>
                            <Th>Instrument / support</Th>
                            <Th>Opération</Th>
                            <Th>Marché</Th>
                            <Th>Montant indicatif ({devise})</Th>
                            <Th>Quantité</Th>
                            <Th>Prix indicatif</Th>
                          </tr>
                        </thead>
                        <tbody>
                          {ordres.map((ordre, index) => (
                            <tr
                              key={`${besoin.actif}-${ordre.titre}-${index}`}
                              style={{
                                borderTop: `1px solid ${C.line}`,
                                background: index % 2 ? '#FCFCFD' : '#fff',
                              }}
                            >
                              <Td className="font-semibold whitespace-nowrap">
                                {ordre.titre}
                              </Td>
                              <Td>
                                <Badge
                                  tone={
                                    ordre.operation === 'Achat' ||
                                    ordre.operation ===
                                      'Constitution de liquidité'
                                      ? 'teal'
                                      : 'coral'
                                  }
                                >
                                  {ordre.operation}
                                </Badge>
                              </Td>
                              <Td>
                                <Badge tone="navy">{ordre.marche}</Badge>
                              </Td>
                              <Td mono className="whitespace-nowrap">
                                <div className="font-semibold">
                                  {fmt(
                                    Math.round(
                                      convertCurrency(
                                        ordre.montant,
                                        ordre.devise,
                                        devise
                                      )
                                    )
                                  )}{' '}
                                  {devise}
                                </div>
                                {ordre.devise !== devise && (
                                  <div
                                    className="text-[10px] mt-0.5"
                                    style={{ color: C.sub, ...F_BODY }}
                                  >
                                    {fmt(ordre.montant)} {ordre.devise} en
                                    devise de négociation
                                  </div>
                                )}
                              </Td>
                              <Td mono>{ordre.quantite ?? '—'}</Td>
                              <Td mono className="whitespace-nowrap">
                                {ordre.prix == null
                                  ? '—'
                                  : `${fmtPrice(ordre.prix)} ${ordre.devise}`}
                              </Td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {ordres && ordres.length === 0 && (
                    <div className="text-xs mt-3" style={{ color: C.sub }}>
                      Aucun instrument de démonstration suffisamment pertinent
                      n'est disponible pour produire un ordre automatique sur
                      cette classe d'actifs.
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function MoneyManagement({ go, devise = 'XOF' }) {
  const [filtreClient, setFiltreClient] = useState('');
  const [filtreMarche, setFiltreMarche] = useState('Tous');
  const [filtreType, setFiltreType] = useState('Tous');
  const [filtreProfil, setFiltreProfil] = useState('Tous');
  const [filtreStatut, setFiltreStatut] = useState('Tous');
  const [filtreEncoursMin, setFiltreEncoursMin] = useState('');
  const [filtreLiquiditeActuelleMin, setFiltreLiquiditeActuelleMin] =
    useState('');
  const [filtreEntrees30JMin, setFiltreEntrees30JMin] = useState('');
  const [filtreSorties30JMin, setFiltreSorties30JMin] = useState('');
  const [filtrePrevisionnelMin, setFiltrePrevisionnelMin] = useState('');
  const [dimensionLiquidite, setDimensionLiquidite] = useState('Devise');
  const [triFluxRevenus, setTriFluxRevenus] = useState('desc');
  const [clientLiquiditeSelectionneId, setClientLiquiditeSelectionneId] =
    useState(CLIENTS[0]?.id || '');
  const [vueLiquiditeDetail, setVueLiquiditeDetail] = useState('origines');

  const SEUIL_ECART_LIQUIDITE = 3;
  const dateReference = new Date(2026, 7, 7);
  const finHorizon = new Date(dateReference);
  finHorizon.setDate(finHorizon.getDate() + 30);

  const formatDateFR = (date) =>
    new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);

  const fluxDividendesCoupons = UPCOMING_CASHFLOWS.flatMap((flux) => {
    const dateFlux = parseFR(flux.echeance);
    if (dateFlux < dateReference || dateFlux > finHorizon) return [];

    const noms = flux.portefeuilles
      .split(',')
      .map((nom) => nom.trim())
      .filter(Boolean);
    const montantParPortefeuille =
      noms.length > 0 ? flux.montant / noms.length : 0;

    return noms
      .map((nom) => CLIENTS.find((client) => client.nom === nom))
      .filter(Boolean)
      .map((client) => ({
        id: `cashflow-${flux.titre}-${client.id}-${flux.echeance}`,
        clientId: client.id,
        client: client.nom,
        date: flux.echeance,
        dateObj: dateFlux,
        nature: flux.type,
        libelle: flux.titre,
        sens: 'Entrée',
        montant: montantParPortefeuille,
        devise: flux.devise,
        statut: 'Prévu',
      }));
  });

  const fluxOrdresOuverts = ORDERS.filter((ordre) =>
    ['En cours', 'En attente'].includes(ordre.statut)
  ).map((ordre, index) => {
    const client = CLIENTS.find((item) => item.nom === ordre.pf);
    const dateFlux = new Date(dateReference);
    dateFlux.setDate(dateFlux.getDate() + 2 + index);

    return {
      id: `ordre-${ordre.id}`,
      clientId: client?.id || null,
      client: ordre.pf,
      date: formatDateFR(dateFlux),
      dateObj: dateFlux,
      nature: "Règlement d'ordre",
      libelle: `${ordre.sens} ${ordre.titre}`,
      sens: ordre.sens === 'Achat' ? 'Sortie' : 'Entrée',
      montant: ordre.qte * ordre.prix,
      devise: ordre.devise,
      statut: ordre.statut,
    };
  });

  const flux30J = [...fluxDividendesCoupons, ...fluxOrdresOuverts].sort(
    (a, b) => a.dateObj - b.dateObj
  );

  const synthesePortefeuilles = CLIENTS.map((client) => {
    const liquiditeActuelle =
      (client.encours * Number(client.alloc.Liquidité || 0)) / 100;
    const liquiditeCible =
      (client.encours * Number(client.cible.Liquidité || 0)) / 100;
    const fluxClient = flux30J.filter((flux) => flux.clientId === client.id);
    const encaissements30J = fluxClient
      .filter((flux) => flux.sens === 'Entrée')
      .reduce(
        (somme, flux) =>
          somme + convertCurrency(flux.montant, flux.devise, client.devise),
        0
      );
    const decaissements30J = fluxClient
      .filter((flux) => flux.sens === 'Sortie')
      .reduce(
        (somme, flux) =>
          somme + convertCurrency(flux.montant, flux.devise, client.devise),
        0
      );
    const liquiditePrevisionnelle =
      liquiditeActuelle + encaissements30J - decaissements30J;
    const ratioActuel = (liquiditeActuelle / client.encours) * 100;
    const ratioCible = Number(client.cible.Liquidité || 0);
    const ratioPrevisionnel = (liquiditePrevisionnelle / client.encours) * 100;
    const ecartPts = ratioPrevisionnel - ratioCible;

    let statut = 'Conforme';
    if (ecartPts < -SEUIL_ECART_LIQUIDITE) statut = 'Critique';
    else if (ecartPts < 0) statut = 'Sous cible';
    else if (ecartPts > SEUIL_ECART_LIQUIDITE) statut = 'Surplus';

    const montantVersCible = Math.abs(liquiditePrevisionnelle - liquiditeCible);
    const action =
      statut === 'Critique'
        ? 'Reconstituer rapidement la poche de liquidité'
        : statut === 'Sous cible'
        ? 'Sécuriser les prochains flux et réduire les décaissements non prioritaires'
        : statut === 'Surplus'
        ? "Réinvestir l'excédent selon l'allocation cible et les opportunités validées"
        : 'Maintenir la position et surveiller les échéances à 30 jours';

    return {
      client,
      liquiditeActuelle,
      liquiditeCible,
      liquiditePrevisionnelle,
      encaissements30J,
      decaissements30J,
      ratioActuel,
      ratioCible,
      ratioPrevisionnel,
      ecartPts,
      montantVersCible,
      statut,
      action,
    };
  });

  const marches = ['Tous', ...new Set(CLIENTS.map((client) => client.marche))];
  const types = [
    'Tous',
    ...new Set(
      CLIENTS.map((client) => PROFILE_TYPE_LABEL[client.type] || client.type)
    ),
  ];
  const profils = [
    'Tous',
    ...new Set(CLIENTS.map((client) => client.profilRisque)),
  ];
  const statuts = ['Tous', 'Critique', 'Sous cible', 'Conforme', 'Surplus'];

  const lignesFiltrees = synthesePortefeuilles.filter(
    ({
      client,
      statut,
      liquiditeActuelle,
      encaissements30J,
      decaissements30J,
      liquiditePrevisionnelle,
    }) => {
      const typeClient = PROFILE_TYPE_LABEL[client.type] || client.type;
      const encoursVue = convertCurrency(client.encours, client.devise, devise);
      const liquiditeActuelleVue = convertCurrency(
        liquiditeActuelle,
        client.devise,
        devise
      );
      const entrees30JVue = convertCurrency(
        encaissements30J,
        client.devise,
        devise
      );
      const sorties30JVue = convertCurrency(
        decaissements30J,
        client.devise,
        devise
      );
      const previsionnelVue = convertCurrency(
        liquiditePrevisionnelle,
        client.devise,
        devise
      );

      const seuilEncours =
        filtreEncoursMin === '' ? null : Number(filtreEncoursMin);
      const seuilLiquiditeActuelle =
        filtreLiquiditeActuelleMin === ''
          ? null
          : Number(filtreLiquiditeActuelleMin);
      const seuilEntrees30J =
        filtreEntrees30JMin === '' ? null : Number(filtreEntrees30JMin);
      const seuilSorties30J =
        filtreSorties30JMin === '' ? null : Number(filtreSorties30JMin);
      const seuilPrevisionnel =
        filtrePrevisionnelMin === '' ? null : Number(filtrePrevisionnelMin);

      return (
        client.nom.toLowerCase().includes(filtreClient.trim().toLowerCase()) &&
        (filtreMarche === 'Tous' || client.marche === filtreMarche) &&
        (filtreType === 'Tous' || typeClient === filtreType) &&
        (filtreProfil === 'Tous' || client.profilRisque === filtreProfil) &&
        (filtreStatut === 'Tous' || statut === filtreStatut) &&
        (seuilEncours === null || encoursVue > seuilEncours) &&
        (seuilLiquiditeActuelle === null ||
          liquiditeActuelleVue > seuilLiquiditeActuelle) &&
        (seuilEntrees30J === null || entrees30JVue > seuilEntrees30J) &&
        (seuilSorties30J === null || sorties30JVue > seuilSorties30J) &&
        (seuilPrevisionnel === null || previsionnelVue > seuilPrevisionnel)
      );
    }
  );

  const clientsFiltresIds = new Set(
    lignesFiltrees.map(({ client }) => client.id)
  );
  const fluxFiltres = flux30J.filter((flux) =>
    clientsFiltresIds.has(flux.clientId)
  );

  const fluxRevenusFiltres = fluxFiltres.filter((flux) =>
    ['Dividende', 'Coupon'].includes(flux.nature)
  );

  const pointsRevenusPortefeuilles = fluxRevenusFiltres.map((flux) => ({
    x: Math.max(0, Math.round((flux.dateObj - dateReference) / 86_400_000)),
    y: flux.client,
    titre: flux.libelle,
    type: flux.nature,
    montant: flux.montant,
    devise: flux.devise,
    echeance: flux.date,
  }));

  const revenusGenerauxParEvenement = {};
  fluxRevenusFiltres.forEach((flux) => {
    const cle = `${flux.nature}-${flux.libelle}-${flux.date}`;
    if (!revenusGenerauxParEvenement[cle]) {
      revenusGenerauxParEvenement[cle] = {
        x: Math.max(0, Math.round((flux.dateObj - dateReference) / 86_400_000)),
        y: 'Général',
        titre: flux.libelle,
        type: flux.nature,
        montant: 0,
        devise,
        echeance: flux.date,
      };
    }
    revenusGenerauxParEvenement[cle].montant += convertCurrency(
      flux.montant,
      flux.devise,
      devise
    );
  });

  const pointsRevenus = [
    ...pointsRevenusPortefeuilles,
    ...Object.values(revenusGenerauxParEvenement),
  ];
  const dividendePointsMoney = pointsRevenus.filter(
    (point) => point.type === 'Dividende'
  );
  const couponPointsMoney = pointsRevenus.filter(
    (point) => point.type === 'Coupon'
  );

  const totalRevenus30J = fluxRevenusFiltres.reduce(
    (somme, flux) => somme + convertCurrency(flux.montant, flux.devise, devise),
    0
  );
  const revenusParPortefeuille = fluxRevenusFiltres.reduce((acc, flux) => {
    acc[flux.client] =
      (acc[flux.client] || 0) +
      convertCurrency(flux.montant, flux.devise, devise);
    return acc;
  }, {});
  const lignesRevenusTriees = Object.entries(revenusParPortefeuille).sort(
    (a, b) => (triFluxRevenus === 'desc' ? b[1] - a[1] : a[1] - b[1])
  );

  const totalEncours = lignesFiltrees.reduce(
    (somme, ligne) =>
      somme +
      convertCurrency(ligne.client.encours, ligne.client.devise, devise),
    0
  );
  const totalLiquiditeActuelle = lignesFiltrees.reduce(
    (somme, ligne) =>
      somme +
      convertCurrency(ligne.liquiditeActuelle, ligne.client.devise, devise),
    0
  );
  const totalLiquiditePrevisionnelle = lignesFiltrees.reduce(
    (somme, ligne) =>
      somme +
      convertCurrency(
        ligne.liquiditePrevisionnelle,
        ligne.client.devise,
        devise
      ),
    0
  );
  const totalEntrees30J = fluxFiltres
    .filter((flux) => flux.sens === 'Entrée')
    .reduce(
      (somme, flux) =>
        somme + convertCurrency(flux.montant, flux.devise, devise),
      0
    );
  const totalSorties30J = fluxFiltres
    .filter((flux) => flux.sens === 'Sortie')
    .reduce(
      (somme, flux) =>
        somme + convertCurrency(flux.montant, flux.devise, devise),
      0
    );
  const ratioLiquiditeGlobal =
    totalEncours > 0 ? (totalLiquiditeActuelle / totalEncours) * 100 : 0;
  const ratioLiquiditePrevisionnel =
    totalEncours > 0 ? (totalLiquiditePrevisionnelle / totalEncours) * 100 : 0;
  const portefeuillesSousCible = lignesFiltrees.filter((ligne) =>
    ['Critique', 'Sous cible'].includes(ligne.statut)
  ).length;

  const filtresActifs =
    Number(Boolean(filtreClient.trim())) +
    Number(filtreMarche !== 'Tous') +
    Number(filtreType !== 'Tous') +
    Number(filtreProfil !== 'Tous') +
    Number(filtreStatut !== 'Tous') +
    Number(filtreEncoursMin !== '') +
    Number(filtreLiquiditeActuelleMin !== '') +
    Number(filtreEntrees30JMin !== '') +
    Number(filtreSorties30JMin !== '') +
    Number(filtrePrevisionnelMin !== '');

  const reinitialiserFiltres = () => {
    setFiltreClient('');
    setFiltreMarche('Tous');
    setFiltreType('Tous');
    setFiltreProfil('Tous');
    setFiltreStatut('Tous');
    setFiltreEncoursMin('');
    setFiltreLiquiditeActuelleMin('');
    setFiltreEntrees30JMin('');
    setFiltreSorties30JMin('');
    setFiltrePrevisionnelMin('');
  };

  const toneStatut = (statut) => {
    if (statut === 'Critique') return 'coral';
    if (statut === 'Sous cible') return 'gold';
    if (statut === 'Surplus') return 'navy';
    return 'teal';
  };

  const regroupementLiquidite = (() => {
    const map = {};
    lignesFiltrees.forEach((ligne) => {
      const client = ligne.client;
      const cle =
        dimensionLiquidite === 'Devise'
          ? client.devise
          : dimensionLiquidite === 'Marché'
          ? client.marche
          : dimensionLiquidite === 'Profil de risque'
          ? client.profilRisque
          : PROFILE_TYPE_LABEL[client.type] || client.type;
      const montant = convertCurrency(
        ligne.liquiditeActuelle,
        client.devise,
        devise
      );
      map[cle] = (map[cle] || 0) + montant;
    });
    const total = Object.values(map).reduce(
      (somme, montant) => somme + montant,
      0
    );
    return Object.entries(map)
      .map(([name, montant]) => ({
        name,
        montant,
        devise,
        value: total > 0 ? Math.round((montant / total) * 100) : 0,
      }))
      .sort((a, b) => b.montant - a.montant);
  })();

  const repartitionMontants = (total, definitions) => {
    let cumule = 0;
    return definitions.map((definition, index) => {
      const dernier = index === definitions.length - 1;
      const montant = dernier
        ? Math.max(0, total - cumule)
        : Math.round((total * definition.poids) / 100);
      cumule += montant;
      return { ...definition, montant };
    });
  };

  const detailLiquiditeParClient = synthesePortefeuilles.map((ligne, index) => {
    const client = ligne.client;
    const total = Math.max(0, ligne.liquiditeActuelle);
    const decalageDepot = 6 + (index % 17);
    const dateDernierDepot = new Date(dateReference);
    dateDernierDepot.setDate(dateDernierDepot.getDate() - decalageDepot);

    const origines = repartitionMontants(total, [
      {
        numero: '1',
        libelle: 'Dépôt d’ouverture',
        description:
          'Liquidité issue de l’ouverture récente du compte / premier investissement.',
        responsable: 'Chargé de clientèle',
        poids: 8,
      },
      {
        numero: '2',
        libelle: 'Dernier dépôt',
        description:
          'Dernier versement enregistré hors opportunité spécifique.',
        responsable: 'Système',
        poids: 18,
      },
      {
        numero: '3',
        libelle: 'Amortissements ESV',
        description:
          'Capital remboursé sur les titres détenus arrivant à échéance partielle ou totale.',
        responsable: 'Système',
        poids: 16,
      },
      {
        numero: '4',
        libelle: 'Intérêts / coupons ESV',
        description: 'Intérêts encaissés sur les titres détenus.',
        responsable: 'Système',
        poids: 8,
      },
      {
        numero: '5',
        libelle: 'Dividendes',
        description:
          'Liquidité provenant des dividendes crédités sur le compte.',
        responsable: 'Système',
        poids: 12,
      },
      {
        numero: '6',
        libelle: 'Cession de titre — retrait',
        description:
          'Produit de cession destiné à un retrait demandé par le client.',
        responsable: 'Gestionnaire de portefeuille',
        poids: 8,
      },
      {
        numero: '7',
        libelle: 'Cession de titre — réinvestissement',
        description: 'Produit de cession destiné à être réinvesti.',
        responsable: 'Gestionnaire de portefeuille',
        poids: 18,
      },
      {
        numero: '8',
        libelle: 'Part à ne pas réinvestir',
        description:
          'Montant que le client demande de conserver durablement en espèces.',
        responsable: 'Chargé de clientèle',
        poids: 4,
      },
      {
        numero: '9',
        libelle: 'Dépôt pour opération primaire',
        description:
          'Dépôt réalisé pour une opportunité spécifique sur le marché primaire.',
        responsable: 'Chargé de clientèle',
        poids: 8,
      },
    ]);

    const affectations = repartitionMontants(total, [
      {
        numero: '11',
        libelle: 'Retrait en cours',
        groupe: 'Bloquée / réservée',
        responsable: 'Chargé de clientèle / Trésorerie',
        poids: 7,
      },
      {
        numero: '12',
        libelle: 'Autre liquidité à investir',
        groupe: 'À investir',
        responsable: 'Système',
        poids: 18,
      },
      {
        numero: '13',
        libelle: 'Achat marché monétaire — OAT',
        groupe: 'Bloquée / réservée',
        responsable: 'Gestionnaire de portefeuille',
        poids: 8,
      },
      {
        numero: '14',
        libelle: 'Achat marché monétaire — BAT',
        groupe: 'Bloquée / réservée',
        responsable: 'Gestionnaire de portefeuille',
        poids: 7,
      },
      {
        numero: '15',
        libelle: 'Achat marché financier — OPV / APE',
        groupe: 'Bloquée / réservée',
        responsable: 'Gestionnaire de portefeuille',
        poids: 10,
      },
      {
        numero: '16',
        libelle: 'Achat marché financier — Actions',
        groupe: 'Bloquée / réservée',
        responsable: 'Gestionnaire de portefeuille',
        poids: 12,
      },
      {
        numero: '17',
        libelle: 'ESV — Amortissements bloqués',
        groupe: 'Bloquée / réservée',
        responsable: 'Chargé de clientèle',
        poids: 6,
      },
      {
        numero: '18',
        libelle: 'ESV — Intérêts bloqués',
        groupe: 'Bloquée / réservée',
        responsable: 'Chargé de clientèle',
        poids: 5,
      },
      {
        numero: '19',
        libelle: 'ESV — Dividendes bloqués',
        groupe: 'Bloquée / réservée',
        responsable: 'Chargé de clientèle',
        poids: 4,
      },
      {
        numero: '20',
        libelle: 'Ne pas réinvestir',
        groupe: 'Bloquée / réservée',
        responsable: 'Chargé de clientèle',
        poids: 5,
      },
      {
        numero: '21',
        libelle: 'Liquidité disponible',
        groupe: 'Disponible',
        responsable: 'Système',
        poids: 18,
      },
    ]);

    const sommeGroupe = (groupe) =>
      affectations
        .filter((item) => item.groupe === groupe)
        .reduce((somme, item) => somme + item.montant, 0);

    const actionsActuelles = Number(client.alloc.Actions || 0);
    const actionsCibles = Number(client.cible.Actions || 0);
    const obligationsActuelles =
      Number(client.alloc['Obl. souveraines'] || 0) +
      Number(client.alloc['Obl. privées'] || 0);
    const obligationsCibles =
      Number(client.cible['Obl. souveraines'] || 0) +
      Number(client.cible['Obl. privées'] || 0);
    const ecartActions = actionsCibles - actionsActuelles;
    const ecartObligations = obligationsCibles - obligationsActuelles;

    return {
      ...ligne,
      dateDernierDepot: formatDateFR(dateDernierDepot),
      montantDernierDepot:
        origines.find((item) => item.numero === '2')?.montant || 0,
      origines,
      affectations,
      totalOrigines: origines.reduce((somme, item) => somme + item.montant, 0),
      liquiditeBloquee: sommeGroupe('Bloquée / réservée'),
      autreLiquiditeAInvestir: sommeGroupe('À investir'),
      liquiditeDisponibleNette: sommeGroupe('Disponible'),
      ecartActions,
      ecartObligations,
      montantCorrectionActions: Math.round(
        (client.encours * Math.abs(ecartActions)) / 100
      ),
      montantCorrectionObligations: Math.round(
        (client.encours * Math.abs(ecartObligations)) / 100
      ),
      rendement: Number(client.rentabilite || 0),
    };
  });

  const detailsFiltres = detailLiquiditeParClient.filter((detail) =>
    clientsFiltresIds.has(detail.client.id)
  );
  const detailLiquiditeSelectionne =
    detailsFiltres.find(
      (detail) => detail.client.id === clientLiquiditeSelectionneId
    ) ||
    detailsFiltres[0] ||
    null;

  const roleTone = (responsable) => {
    if (responsable.includes('Gestionnaire')) return 'navy';
    if (responsable.includes('Chargé')) return 'gold';
    if (responsable.includes('Trésorerie')) return 'coral';
    return 'teal';
  };

  const montantDetailEnDeviseVue = (montant, client) =>
    convertCurrency(montant, client.devise, devise);

  const actionsLiquidite = lignesFiltrees
    .filter((ligne) => ligne.statut !== 'Conforme')
    .sort((a, b) => {
      const ordre = { Critique: 0, 'Sous cible': 1, Surplus: 2 };
      return (ordre[a.statut] ?? 9) - (ordre[b.statut] ?? 9);
    });

  const filtresMontantsMoneyManagement = [
    {
      key: 'encours',
      label: 'Encours (supérieur à)',
      value: filtreEncoursMin,
      setter: setFiltreEncoursMin,
    },
    {
      key: 'liquidite-actuelle',
      label: 'Liquidité actuelle (supérieur à)',
      value: filtreLiquiditeActuelleMin,
      setter: setFiltreLiquiditeActuelleMin,
    },
    {
      key: 'entrees-30j',
      label: 'Entrées 30 j (supérieur à)',
      value: filtreEntrees30JMin,
      setter: setFiltreEntrees30JMin,
    },
    {
      key: 'sorties-30j',
      label: 'Sorties 30 j (supérieur à)',
      value: filtreSorties30JMin,
      setter: setFiltreSorties30JMin,
    },
    {
      key: 'previsionnel',
      label: 'Liquidité prévisionnelle (supérieur à)',
      value: filtrePrevisionnelMin,
      setter: setFiltrePrevisionnelMin,
    },
  ];

  return (
    <div className="space-y-5">
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
        <Badge tone="navy">Devise principale : {devise}</Badge>
      </div>

      <Card className="p-4" style={{ borderColor: C.navy }}>
        <div className="grid grid-cols-5 gap-3">
          <div>
            <label
              className="text-[11px] font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Client
            </label>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl border"
              style={{ borderColor: C.line }}
            >
              <Search size={14} color={C.sub} />
              <input
                value={filtreClient}
                onChange={(e) => setFiltreClient(e.target.value)}
                placeholder="Rechercher…"
                className="w-full text-xs outline-none"
                style={F_BODY}
              />
            </div>
          </div>
          <div>
            <label
              className="text-[11px] font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Marché
            </label>
            <select
              value={filtreMarche}
              onChange={(e) => setFiltreMarche(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-xs"
              style={{ borderColor: C.line }}
            >
              {marches.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-[11px] font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Type de portefeuille
            </label>
            <select
              value={filtreType}
              onChange={(e) => setFiltreType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-xs"
              style={{ borderColor: C.line }}
            >
              {types.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-[11px] font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Profil de risque
            </label>
            <select
              value={filtreProfil}
              onChange={(e) => setFiltreProfil(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-xs"
              style={{ borderColor: C.line }}
            >
              {profils.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-[11px] font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Statut liquidité
            </label>
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-xs"
              style={{ borderColor: C.line }}
            >
              {statuts.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.line}` }}>
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
                principale de vue : {devise}.
              </div>
            </div>
            <Badge tone="navy">Seuils en {devise}</Badge>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {filtresMontantsMoneyManagement.map((filtre) => (
              <div key={filtre.key}>
                <label
                  className="text-[11px] font-semibold block mb-1"
                  style={{ color: C.sub }}
                >
                  {filtre.label}
                </label>
                <div
                  className="flex items-center rounded-xl border overflow-hidden"
                  style={{ borderColor: C.line, background: '#fff' }}
                >
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={filtre.value}
                    onChange={(e) => filtre.setter(e.target.value)}
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
                    {devise}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
          <div className="text-[11px]" style={{ color: C.sub }}>
            Les mêmes filtres pilotent les positions, les flux, les répartitions
            et les actions de liquidité.
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={filtresActifs > 0 ? 'teal' : 'slate'}>
              {filtresActifs} filtre(s) actif(s)
            </Badge>
            <Badge tone="gold">{lignesFiltrees.length} portefeuille(s)</Badge>
            {filtresActifs > 0 && (
              <button
                type="button"
                onClick={reinitialiserFiltres}
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                style={{ borderColor: C.line, color: C.navy }}
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Eyebrow>1. Synthèse consolidée de la liquidité</Eyebrow>
            <div className="text-xs" style={{ color: C.sub }}>
              Vue immédiate de la capacité de trésorerie actuelle et
              prévisionnelle des portefeuilles filtrés.
            </div>
          </div>
          <Badge tone={portefeuillesSousCible > 0 ? 'coral' : 'teal'}>
            {portefeuillesSousCible} sous cible
          </Badge>
        </div>
        <div className="grid grid-cols-5 gap-3">
          <Card className="p-4">
            <div className="text-xs" style={{ color: C.sub }}>
              Liquidité disponible
            </div>
            <div className="text-xl font-bold mt-1" style={F_DISPLAY}>
              {fmt(Math.round(totalLiquiditeActuelle))} {devise}
            </div>
            <div className="text-[11px] mt-1" style={{ color: C.sub }}>
              {ratioLiquiditeGlobal.toFixed(1)}% de l'encours
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs" style={{ color: C.sub }}>
              Encaissements à 30 j
            </div>
            <div
              className="text-xl font-bold mt-1"
              style={{ ...F_DISPLAY, color: C.teal }}
            >
              +{fmt(Math.round(totalEntrees30J))} {devise}
            </div>
            <div className="text-[11px] mt-1" style={{ color: C.sub }}>
              Dividendes, coupons et flux entrants
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs" style={{ color: C.sub }}>
              Décaissements à 30 j
            </div>
            <div
              className="text-xl font-bold mt-1"
              style={{ ...F_DISPLAY, color: C.coral }}
            >
              -{fmt(Math.round(totalSorties30J))} {devise}
            </div>
            <div className="text-[11px] mt-1" style={{ color: C.sub }}>
              Ordres ouverts et règlements attendus
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs" style={{ color: C.sub }}>
              Liquidité prévisionnelle
            </div>
            <div className="text-xl font-bold mt-1" style={F_DISPLAY}>
              {fmt(Math.round(totalLiquiditePrevisionnelle))} {devise}
            </div>
            <div className="text-[11px] mt-1" style={{ color: C.sub }}>
              {ratioLiquiditePrevisionnel.toFixed(1)}% de l'encours
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs" style={{ color: C.sub }}>
              Portefeuilles à surveiller
            </div>
            <div
              className="text-2xl font-bold mt-1"
              style={{
                ...F_DISPLAY,
                color: portefeuillesSousCible > 0 ? C.coral : C.teal,
              }}
            >
              {portefeuillesSousCible}
            </div>
            <div className="text-[11px] mt-1" style={{ color: C.sub }}>
              Sous la cible après flux à 30 jours
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <Eyebrow>2. Anatomie de la liquidité des comptes clients</Eyebrow>
            <div className="text-xs max-w-4xl" style={{ color: C.sub }}>
              Lecture opérationnelle inspirée de la fiche de suivi : origine des
              fonds, affectations / blocages, liquidité réellement mobilisable,
              correction des écarts au profil et rendement du portefeuille.
            </div>
          </div>
          <Badge tone="gold">
            Rubriques 1 à 26 · responsabilités intégrées
          </Badge>
        </div>

        <div className="grid grid-cols-12 gap-4 items-start">
          <Card className="col-span-4 p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <div
                  className="text-sm font-bold"
                  style={{ ...F_DISPLAY, color: C.ink }}
                >
                  Comptes clients
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: C.sub }}>
                  Sélectionnez un compte pour analyser la provenance et
                  l'affectation de sa liquidité.
                </div>
              </div>
              <Badge tone="navy">{detailsFiltres.length}</Badge>
            </div>

            <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
              {detailsFiltres.length === 0 && (
                <div
                  className="text-xs py-5 text-center"
                  style={{ color: C.sub }}
                >
                  Aucun compte ne correspond aux filtres.
                </div>
              )}
              {detailsFiltres.map((detail) => {
                const actif =
                  detailLiquiditeSelectionne?.client.id === detail.client.id;
                const librePct =
                  detail.liquiditeActuelle > 0
                    ? ((detail.autreLiquiditeAInvestir +
                        detail.liquiditeDisponibleNette) /
                        detail.liquiditeActuelle) *
                      100
                    : 0;
                return (
                  <button
                    key={detail.client.id}
                    type="button"
                    onClick={() =>
                      setClientLiquiditeSelectionneId(detail.client.id)
                    }
                    className="w-full p-3 rounded-xl border text-left transition-colors"
                    style={{
                      borderColor: actif ? C.navy : C.line,
                      background: actif ? '#EFF3FB' : '#fff',
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div
                          className="text-xs font-bold truncate"
                          style={{ color: C.ink }}
                        >
                          {detail.client.nom}
                        </div>
                        <div
                          className="text-[10px] mt-0.5"
                          style={{ color: C.sub }}
                        >
                          {detail.client.marche} · {detail.client.profilRisque}{' '}
                          · {detail.client.devise}
                        </div>
                      </div>
                      <Badge tone={toneStatut(detail.statut)}>
                        {detail.statut}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div>
                        <div
                          className="text-[9px] uppercase font-semibold"
                          style={{ color: C.sub }}
                        >
                          Liquidité
                        </div>
                        <div
                          className="text-[11px] font-semibold mt-0.5"
                          style={F_MONO}
                        >
                          {fmt(Math.round(detail.liquiditeActuelle))}{' '}
                          {detail.client.devise}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="text-[9px] uppercase font-semibold"
                          style={{ color: C.sub }}
                        >
                          Mobilisable
                        </div>
                        <div
                          className="text-[11px] font-semibold mt-0.5"
                          style={{ ...F_MONO, color: C.teal }}
                        >
                          {librePct.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    <div
                      className="h-1.5 rounded-full mt-2"
                      style={{ background: '#EEF0F4' }}
                    >
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${Math.min(100, librePct)}%`,
                          background: C.teal,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="col-span-8 space-y-3">
            {detailLiquiditeSelectionne ? (
              <>
                <Card className="p-4" style={{ borderColor: C.navy }}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div
                        className="text-lg font-bold"
                        style={{ ...F_DISPLAY, color: C.ink }}
                      >
                        {detailLiquiditeSelectionne.client.nom}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge tone="navy">
                          {detailLiquiditeSelectionne.client.marche} ·{' '}
                          {detailLiquiditeSelectionne.client.devise}
                        </Badge>
                        <Badge tone="slate">
                          {detailLiquiditeSelectionne.client.profilRisque}
                        </Badge>
                        <Badge
                          tone={toneStatut(detailLiquiditeSelectionne.statut)}
                        >
                          {detailLiquiditeSelectionne.statut}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-[10px] uppercase font-semibold"
                        style={{ color: C.sub }}
                      >
                        Liquidité globale du compte (10)
                      </div>
                      <div className="text-xl font-bold mt-1" style={F_DISPLAY}>
                        {fmt(
                          Math.round(
                            detailLiquiditeSelectionne.liquiditeActuelle
                          )
                        )}{' '}
                        {detailLiquiditeSelectionne.client.devise}
                      </div>
                      {detailLiquiditeSelectionne.client.devise !== devise && (
                        <div
                          className="text-[10px] mt-0.5"
                          style={{ color: C.sub, ...F_MONO }}
                        >
                          ≈{' '}
                          {fmt(
                            Math.round(
                              montantDetailEnDeviseVue(
                                detailLiquiditeSelectionne.liquiditeActuelle,
                                detailLiquiditeSelectionne.client
                              )
                            )
                          )}{' '}
                          {devise}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-4">
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: '#F7F8FB' }}
                    >
                      <div
                        className="text-[9px] uppercase font-semibold"
                        style={{ color: C.sub }}
                      >
                        Dernier dépôt (2)
                      </div>
                      <div className="text-xs font-semibold mt-1">
                        {detailLiquiditeSelectionne.dateDernierDepot}
                      </div>
                      <div
                        className="text-[11px] font-bold mt-1"
                        style={{ ...F_MONO, color: C.navy }}
                      >
                        {fmt(
                          Math.round(
                            detailLiquiditeSelectionne.montantDernierDepot
                          )
                        )}{' '}
                        {detailLiquiditeSelectionne.client.devise}
                      </div>
                    </div>
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: '#FBE9E7' }}
                    >
                      <div
                        className="text-[9px] uppercase font-semibold"
                        style={{ color: C.coral }}
                      >
                        Bloquée / réservée
                      </div>
                      <div className="text-xs font-bold mt-1" style={F_MONO}>
                        {fmt(detailLiquiditeSelectionne.liquiditeBloquee)}{' '}
                        {detailLiquiditeSelectionne.client.devise}
                      </div>
                    </div>
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: '#FBF1DD' }}
                    >
                      <div
                        className="text-[9px] uppercase font-semibold"
                        style={{ color: '#8A6A16' }}
                      >
                        Autre liquidité à investir (12)
                      </div>
                      <div className="text-xs font-bold mt-1" style={F_MONO}>
                        {fmt(
                          detailLiquiditeSelectionne.autreLiquiditeAInvestir
                        )}{' '}
                        {detailLiquiditeSelectionne.client.devise}
                      </div>
                    </div>
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: '#E4F5EF' }}
                    >
                      <div
                        className="text-[9px] uppercase font-semibold"
                        style={{ color: C.teal }}
                      >
                        Liquidité disponible (21)
                      </div>
                      <div className="text-xs font-bold mt-1" style={F_MONO}>
                        {fmt(
                          detailLiquiditeSelectionne.liquiditeDisponibleNette
                        )}{' '}
                        {detailLiquiditeSelectionne.client.devise}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {[
                      ['origines', 'Origine des fonds · 1–10'],
                      ['affectations', 'Bloquée & disponible · 11–21'],
                      ['profil', 'Écart profil & rendement · 22–26'],
                    ].map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setVueLiquiditeDetail(id)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{
                          background:
                            vueLiquiditeDetail === id ? C.navy : '#F0F1F5',
                          color: vueLiquiditeDetail === id ? '#fff' : C.sub,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {vueLiquiditeDetail === 'origines' && (
                    <div className="grid grid-cols-5 gap-4 items-start">
                      <div className="col-span-2">
                        <Donut
                          data={detailLiquiditeSelectionne.origines.map(
                            (item) => ({
                              name: item.libelle,
                              value:
                                detailLiquiditeSelectionne.totalOrigines > 0
                                  ? Number(
                                      (
                                        (item.montant /
                                          detailLiquiditeSelectionne.totalOrigines) *
                                        100
                                      ).toFixed(1)
                                    )
                                  : 0,
                              montant: item.montant,
                              devise: detailLiquiditeSelectionne.client.devise,
                            })
                          )}
                          size={210}
                        />
                        <Legende
                          data={detailLiquiditeSelectionne.origines.map(
                            (item) => ({
                              name: item.libelle,
                              value:
                                detailLiquiditeSelectionne.totalOrigines > 0
                                  ? Number(
                                      (
                                        (item.montant /
                                          detailLiquiditeSelectionne.totalOrigines) *
                                        100
                                      ).toFixed(1)
                                    )
                                  : 0,
                              montant: item.montant,
                              devise: detailLiquiditeSelectionne.client.devise,
                            })
                          )}
                        />
                        <div
                          className="text-[10px] text-center mt-2"
                          style={{ color: C.sub }}
                        >
                          Somme des sources = liquidité globale (10)
                        </div>
                      </div>
                      <div className="col-span-3 grid grid-cols-2 gap-2">
                        {detailLiquiditeSelectionne.origines.map((item) => (
                          <div
                            key={item.numero}
                            className="p-3 rounded-xl border"
                            style={{ borderColor: C.line }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div
                                className="text-[11px] font-bold"
                                style={{ color: C.ink }}
                              >
                                {item.numero}. {item.libelle}
                              </div>
                              <Badge tone={roleTone(item.responsable)}>
                                {item.responsable}
                              </Badge>
                            </div>
                            <div
                              className="text-sm font-bold mt-2"
                              style={F_MONO}
                            >
                              {fmt(item.montant)}{' '}
                              {detailLiquiditeSelectionne.client.devise}
                            </div>
                            <div
                              className="text-[9px] mt-1 leading-relaxed"
                              style={{ color: C.sub }}
                            >
                              {item.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {vueLiquiditeDetail === 'affectations' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          {
                            label: 'Bloquée / réservée',
                            montant:
                              detailLiquiditeSelectionne.liquiditeBloquee,
                            tone: C.coral,
                            bg: '#FBE9E7',
                          },
                          {
                            label: 'À investir',
                            montant:
                              detailLiquiditeSelectionne.autreLiquiditeAInvestir,
                            tone: '#8A6A16',
                            bg: '#FBF1DD',
                          },
                          {
                            label: 'Disponible',
                            montant:
                              detailLiquiditeSelectionne.liquiditeDisponibleNette,
                            tone: C.teal,
                            bg: '#E4F5EF',
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="p-3 rounded-xl"
                            style={{ background: item.bg }}
                          >
                            <div
                              className="text-[10px] uppercase font-semibold"
                              style={{ color: item.tone }}
                            >
                              {item.label}
                            </div>
                            <div
                              className="text-lg font-bold mt-1"
                              style={{ ...F_DISPLAY, color: C.ink }}
                            >
                              {fmt(item.montant)}{' '}
                              {detailLiquiditeSelectionne.client.devise}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {detailLiquiditeSelectionne.affectations.map((item) => {
                          const pct =
                            detailLiquiditeSelectionne.liquiditeActuelle > 0
                              ? (item.montant /
                                  detailLiquiditeSelectionne.liquiditeActuelle) *
                                100
                              : 0;
                          const couleur =
                            item.groupe === 'Disponible'
                              ? C.teal
                              : item.groupe === 'À investir'
                              ? C.gold
                              : C.coral;
                          return (
                            <div
                              key={item.numero}
                              className="p-3 rounded-xl border"
                              style={{ borderColor: C.line }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div
                                    className="text-[11px] font-bold"
                                    style={{ color: C.ink }}
                                  >
                                    {item.numero}. {item.libelle}
                                  </div>
                                  <div
                                    className="text-[9px] mt-0.5"
                                    style={{ color: C.sub }}
                                  >
                                    {item.groupe}
                                  </div>
                                </div>
                                <Badge tone={roleTone(item.responsable)}>
                                  {item.responsable}
                                </Badge>
                              </div>
                              <div className="flex items-end justify-between gap-2 mt-2">
                                <div
                                  className="text-sm font-bold"
                                  style={F_MONO}
                                >
                                  {fmt(item.montant)}{' '}
                                  {detailLiquiditeSelectionne.client.devise}
                                </div>
                                <div
                                  className="text-[10px] font-semibold"
                                  style={{ color: couleur, ...F_MONO }}
                                >
                                  {pct.toFixed(1)}%
                                </div>
                              </div>
                              <div
                                className="h-1.5 rounded-full mt-2"
                                style={{ background: '#EEF0F4' }}
                              >
                                <div
                                  className="h-1.5 rounded-full"
                                  style={{
                                    width: `${Math.min(100, pct)}%`,
                                    background: couleur,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {vueLiquiditeDetail === 'profil' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          {
                            numero: '22 / 24',
                            actif: 'Actions',
                            ecart: detailLiquiditeSelectionne.ecartActions,
                            montant:
                              detailLiquiditeSelectionne.montantCorrectionActions,
                          },
                          {
                            numero: '23 / 25',
                            actif: 'Obligations',
                            ecart: detailLiquiditeSelectionne.ecartObligations,
                            montant:
                              detailLiquiditeSelectionne.montantCorrectionObligations,
                          },
                        ].map((item) => (
                          <div
                            key={item.actif}
                            className="p-4 rounded-xl border"
                            style={{ borderColor: C.line }}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-xs font-bold">
                                {item.numero}. Correction écart — {item.actif}
                              </div>
                              <Badge tone="teal">Système</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-4">
                              <div>
                                <div
                                  className="text-[9px] uppercase font-semibold"
                                  style={{ color: C.sub }}
                                >
                                  Écart à corriger
                                </div>
                                <div
                                  className="text-xl font-bold mt-1"
                                  style={{
                                    ...F_DISPLAY,
                                    color:
                                      item.ecart > 0
                                        ? C.teal
                                        : item.ecart < 0
                                        ? C.coral
                                        : C.sub,
                                  }}
                                >
                                  {item.ecart > 0 ? '+' : ''}
                                  {item.ecart.toFixed(1)} pts
                                </div>
                                <div
                                  className="text-[10px] mt-1"
                                  style={{ color: C.sub }}
                                >
                                  {item.ecart > 0
                                    ? `Renforcer ${item.actif.toLowerCase()}`
                                    : item.ecart < 0
                                    ? `Réduire ${item.actif.toLowerCase()}`
                                    : 'Allocation déjà alignée'}
                                </div>
                              </div>
                              <div>
                                <div
                                  className="text-[9px] uppercase font-semibold"
                                  style={{ color: C.sub }}
                                >
                                  Valeur correspondante
                                </div>
                                <div
                                  className="text-sm font-bold mt-2"
                                  style={F_MONO}
                                >
                                  {fmt(item.montant)}{' '}
                                  {detailLiquiditeSelectionne.client.devise}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div
                          className="p-4 rounded-xl"
                          style={{ background: '#EFF3FB' }}
                        >
                          <div
                            className="text-[10px] uppercase font-semibold"
                            style={{ color: C.sub }}
                          >
                            26. Rendement du portefeuille
                          </div>
                          <div className="mt-1">
                            <Pct v={detailLiquiditeSelectionne.rendement} />
                          </div>
                          <div className="mt-2">
                            <Badge tone="teal">Système</Badge>
                          </div>
                        </div>
                        <div
                          className="p-4 rounded-xl"
                          style={{ background: '#F7F8FB' }}
                        >
                          <div
                            className="text-[10px] uppercase font-semibold"
                            style={{ color: C.sub }}
                          >
                            Liquidité cible
                          </div>
                          <div
                            className="text-lg font-bold mt-1"
                            style={F_DISPLAY}
                          >
                            {detailLiquiditeSelectionne.ratioCible.toFixed(1)}%
                          </div>
                        </div>
                        <div
                          className="p-4 rounded-xl"
                          style={{ background: '#F7F8FB' }}
                        >
                          <div
                            className="text-[10px] uppercase font-semibold"
                            style={{ color: C.sub }}
                          >
                            Liquidité prévisionnelle
                          </div>
                          <div
                            className="text-lg font-bold mt-1"
                            style={F_DISPLAY}
                          >
                            {detailLiquiditeSelectionne.ratioPrevisionnel.toFixed(
                              1
                            )}
                            %
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                <Card className="p-4" style={{ background: '#FAFAFC' }}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div
                        className="text-xs font-bold"
                        style={{ color: C.ink }}
                      >
                        Circuit de responsabilité
                      </div>
                      <div
                        className="text-[10px] mt-1 max-w-2xl"
                        style={{ color: C.sub }}
                      >
                        La fiche source distingue les données saisies par les
                        équipes et les rubriques calculées automatiquement. Le
                        Chef Service Informatique coordonne l’implémentation de
                        ces rubriques dans le système.
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge tone="gold">Chargé de clientèle</Badge>
                      <Badge tone="navy">Gestionnaire de portefeuille</Badge>
                      <Badge tone="coral">Trésorerie</Badge>
                      <Badge tone="teal">Système</Badge>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card
                className="p-8 text-center text-sm"
                style={{ color: C.sub }}
              >
                Sélectionnez un portefeuille pour afficher son anatomie de
                liquidité.
              </Card>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <Eyebrow>3. Position de liquidité par portefeuille</Eyebrow>
          <div className="text-xs" style={{ color: C.sub }}>
            Contrôle de la poche espèces actuelle, de la cible et de la position
            prévisionnelle après les flux connus.
          </div>
        </div>
        <Card className="p-0 overflow-hidden">
          <div
            className="overflow-auto"
            style={{
              maxHeight: 430,
              overscrollBehavior: 'contain',
              scrollbarGutter: 'stable',
            }}
          >
            <table className="w-full" style={{ minWidth: 1580 }}>
              <thead
                style={{
                  background: '#FAFAFC',
                  position: 'sticky',
                  top: 0,
                  zIndex: 4,
                  boxShadow: `0 1px 0 ${C.line}`,
                }}
              >
                <tr>
                  <Th>Client</Th>
                  <Th>Marché</Th>
                  <Th>Type / Profil</Th>
                  <Th>Encours</Th>
                  <Th>Liquidité actuelle</Th>
                  <Th>Cible</Th>
                  <Th>Entrées 30 j</Th>
                  <Th>Sorties 30 j</Th>
                  <Th>Prévisionnel</Th>
                  <Th>Écart vs cible</Th>
                  <Th>Statut</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {lignesFiltrees.length === 0 && (
                  <tr>
                    <td
                      colSpan={12}
                      className="text-center py-8 text-sm"
                      style={{ color: C.sub }}
                    >
                      Aucun portefeuille ne correspond aux critères
                      sélectionnés.
                    </td>
                  </tr>
                )}
                {lignesFiltrees.map((ligne, index) => {
                  const client = ligne.client;
                  return (
                    <tr
                      key={client.id}
                      style={{
                        borderTop: `1px solid ${C.line}`,
                        background: index % 2 ? '#FCFCFD' : '#fff',
                      }}
                    >
                      <Td className="font-semibold whitespace-nowrap">
                        {client.nom}
                      </Td>
                      <Td>
                        <Badge tone="navy">
                          {client.marche} · {client.devise}
                        </Badge>
                      </Td>
                      <Td>
                        <div className="text-xs font-semibold">
                          {PROFILE_TYPE_LABEL[client.type] || client.type}
                        </div>
                        <div
                          className="text-[10px] mt-0.5"
                          style={{ color: C.sub }}
                        >
                          {client.profilRisque}
                        </div>
                      </Td>
                      <Td mono className="whitespace-nowrap">
                        {fmt(client.encours)} {client.devise}
                      </Td>
                      <Td mono className="whitespace-nowrap">
                        <div>
                          {fmt(Math.round(ligne.liquiditeActuelle))}{' '}
                          {client.devise}
                        </div>
                        <div className="text-[10px]" style={{ color: C.sub }}>
                          {ligne.ratioActuel.toFixed(1)}%
                        </div>
                      </Td>
                      <Td mono>{ligne.ratioCible.toFixed(1)}%</Td>
                      <Td mono className="whitespace-nowrap">
                        <span style={{ color: C.teal }}>
                          +{fmt(Math.round(ligne.encaissements30J))}{' '}
                          {client.devise}
                        </span>
                      </Td>
                      <Td mono className="whitespace-nowrap">
                        <span style={{ color: C.coral }}>
                          -{fmt(Math.round(ligne.decaissements30J))}{' '}
                          {client.devise}
                        </span>
                      </Td>
                      <Td mono className="whitespace-nowrap">
                        <div className="font-semibold">
                          {fmt(Math.round(ligne.liquiditePrevisionnelle))}{' '}
                          {client.devise}
                        </div>
                        <div className="text-[10px]" style={{ color: C.sub }}>
                          {ligne.ratioPrevisionnel.toFixed(1)}%
                        </div>
                      </Td>
                      <Td mono>
                        <span
                          style={{
                            color: ligne.ecartPts < 0 ? C.coral : C.teal,
                            fontWeight: 700,
                          }}
                        >
                          {ligne.ecartPts > 0 ? '+' : ''}
                          {ligne.ecartPts.toFixed(1)} pts
                        </span>
                      </Td>
                      <Td>
                        <Badge tone={toneStatut(ligne.statut)}>
                          {ligne.statut}
                        </Badge>
                      </Td>
                      <Td>
                        <button
                          type="button"
                          onClick={() => go('client', { clientId: client.id })}
                          className="text-xs font-semibold whitespace-nowrap"
                          style={{ color: C.navy }}
                        >
                          Ouvrir →
                        </button>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <Eyebrow>4. Échéancier des flux de trésorerie — 30 jours</Eyebrow>
            <div className="text-xs" style={{ color: C.sub }}>
              Anticipation des dividendes, coupons et règlements d'ordres
              susceptibles de modifier la liquidité disponible.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="teal">
              Entrées : {fmt(Math.round(totalEntrees30J))} {devise}
            </Badge>
            <Badge tone="coral">
              Sorties : {fmt(Math.round(totalSorties30J))} {devise}
            </Badge>
          </div>
        </div>
        <Card className="p-0 overflow-hidden">
          <table className="w-full">
            <thead style={{ background: '#FAFAFC' }}>
              <tr>
                <Th>Date</Th>
                <Th>Client</Th>
                <Th>Nature</Th>
                <Th>Détail</Th>
                <Th>Sens</Th>
                <Th>Montant d'origine</Th>
                <Th>Éq. {devise}</Th>
                <Th>Statut</Th>
              </tr>
            </thead>
            <tbody>
              {fluxFiltres.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-7 text-sm"
                    style={{ color: C.sub }}
                  >
                    Aucun flux connu sur les 30 prochains jours pour cette
                    sélection.
                  </td>
                </tr>
              )}
              {fluxFiltres.map((flux, index) => (
                <tr
                  key={flux.id}
                  style={{
                    borderTop: `1px solid ${C.line}`,
                    background: index % 2 ? '#FCFCFD' : '#fff',
                  }}
                >
                  <Td mono>{flux.date}</Td>
                  <Td className="font-semibold whitespace-nowrap">
                    {flux.client}
                  </Td>
                  <Td>{flux.nature}</Td>
                  <Td className="whitespace-nowrap">{flux.libelle}</Td>
                  <Td>
                    <Badge tone={flux.sens === 'Entrée' ? 'teal' : 'coral'}>
                      {flux.sens}
                    </Badge>
                  </Td>
                  <Td mono className="whitespace-nowrap">
                    {fmt(Math.round(flux.montant))} {flux.devise}
                  </Td>
                  <Td mono className="whitespace-nowrap">
                    {fmt(
                      Math.round(
                        convertCurrency(flux.montant, flux.devise, devise)
                      )
                    )}{' '}
                    {devise}
                  </Td>
                  <Td>
                    <Badge tone={flux.statut === 'Prévu' ? 'slate' : 'gold'}>
                      {flux.statut}
                    </Badge>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5">
            <Eyebrow>
              Tombées de revenus financiers — coupons &amp; dividendes
            </Eyebrow>
            <div
              className="flex items-center gap-4 text-xs mb-2 flex-wrap"
              style={{ color: C.sub }}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: C.teal }}
                />
                Dividende
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: C.gold }}
                />
                Coupon
              </span>
              <span>Jours à venir dans l'horizon de 30 jours</span>
            </div>

            {pointsRevenus.length === 0 ? (
              <div
                className="h-[280px] flex items-center justify-center text-sm"
                style={{ color: C.sub }}
              >
                Aucune tombée de coupon ou dividende pour cette sélection.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <ScatterChart
                  margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
                >
                  <CartesianGrid stroke={C.line} />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Échéance"
                    unit=" j"
                    domain={[0, 30]}
                    tick={{ fontSize: 11, fill: C.sub }}
                  />
                  <YAxis
                    type="category"
                    dataKey="y"
                    name="Portefeuille"
                    tick={{ fontSize: 11, fill: C.sub }}
                    width={140}
                  />
                  <ZAxis range={[90, 90]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const point = payload[0].payload;
                      return (
                        <div
                          style={{
                            background: '#fff',
                            border: `1px solid ${C.line}`,
                            borderRadius: 10,
                            padding: 8,
                            fontSize: 12,
                          }}
                        >
                          <div className="font-semibold">{point.titre}</div>
                          <div>
                            {point.type} · {fmt(Math.round(point.montant))}{' '}
                            {point.devise}
                          </div>
                          <div style={{ color: C.sub }}>{point.echeance}</div>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={dividendePointsMoney} fill={C.teal} />
                  <Scatter data={couponPointsMoney} fill={C.gold} />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <Eyebrow>
                  Revenus financiers attendus — synthèse 30 jours
                </Eyebrow>
                <div className="text-xs" style={{ color: C.sub }}>
                  Agrégation des coupons et dividendes déjà présents dans
                  l'échéancier ci-dessus, sans double comptabilisation.
                </div>
              </div>
              <div
                className="p-3 rounded-xl border text-right shrink-0"
                style={{ borderColor: C.gold }}
              >
                <div className="text-xs" style={{ color: C.sub }}>
                  Total coupons + dividendes
                </div>
                <div className="text-lg font-bold" style={F_DISPLAY}>
                  {fmt(Math.round(totalRevenus30J))} {devise}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mb-3">
              <span className="text-xs font-semibold" style={{ color: C.sub }}>
                Trier :
              </span>
              <button
                type="button"
                onClick={() => setTriFluxRevenus('desc')}
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                style={{
                  background: triFluxRevenus === 'desc' ? C.navy : '#fff',
                  color: triFluxRevenus === 'desc' ? '#fff' : C.ink,
                  borderColor: C.line,
                }}
              >
                Décroissant
              </button>
              <button
                type="button"
                onClick={() => setTriFluxRevenus('asc')}
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                style={{
                  background: triFluxRevenus === 'asc' ? C.navy : '#fff',
                  color: triFluxRevenus === 'asc' ? '#fff' : C.ink,
                  borderColor: C.line,
                }}
              >
                Croissant
              </button>
            </div>

            <div className="max-h-[280px] overflow-auto">
              <table className="w-full">
                <thead style={{ background: '#FAFAFC' }}>
                  <tr>
                    <Th>Portefeuille</Th>
                    <Th>Coupons + dividendes à 30 j</Th>
                  </tr>
                </thead>
                <tbody>
                  {lignesRevenusTriees.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="text-center text-xs py-4"
                        style={{ color: C.sub }}
                      >
                        Aucun revenu financier attendu sur les 30 prochains
                        jours.
                      </td>
                    </tr>
                  )}
                  {lignesRevenusTriees.map(([nom, montant]) => (
                    <tr key={nom} style={{ borderTop: `1px solid ${C.line}` }}>
                      <Td className="font-semibold">{nom}</Td>
                      <Td mono>
                        {fmt(Math.round(montant))} {devise}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <Eyebrow>5. Répartition et concentration de la liquidité</Eyebrow>
            <div className="text-xs" style={{ color: C.sub }}>
              Analyse de la liquidité disponible selon les principales
              dimensions déjà utilisées dans la plateforme.
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {[
              'Devise',
              'Marché',
              'Profil de risque',
              'Type de portefeuille',
            ].map((dimension) => (
              <button
                key={dimension}
                type="button"
                onClick={() => setDimensionLiquidite(dimension)}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background:
                    dimensionLiquidite === dimension ? C.navy : '#F0F1F5',
                  color: dimensionLiquidite === dimension ? '#fff' : C.sub,
                }}
              >
                {dimension}
              </button>
            ))}
          </div>
        </div>
        <Card className="p-5">
          <div className="grid grid-cols-2 gap-6 items-center">
            <div>
              <Donut data={regroupementLiquidite} size={210} />
            </div>
            <div>
              <div className="text-xs mb-3" style={{ color: C.sub }}>
                Liquidité actuelle ventilée par{' '}
                {dimensionLiquidite.toLowerCase()}.
              </div>
              <Legende data={regroupementLiquidite} />
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <Eyebrow>6. Actions de gestion de liquidité</Eyebrow>
            <div className="text-xs" style={{ color: C.sub }}>
              Liste priorisée des portefeuilles nécessitant une reconstitution
              de cash ou un réinvestissement de l'excédent.
            </div>
          </div>
          <Badge
            tone={
              actionsLiquidite.some((ligne) => ligne.statut === 'Critique')
                ? 'coral'
                : 'gold'
            }
          >
            {actionsLiquidite.length} action(s)
          </Badge>
        </div>
        <Card className="p-0 overflow-hidden">
          <table className="w-full">
            <thead style={{ background: '#FAFAFC' }}>
              <tr>
                <Th>Client</Th>
                <Th>Statut</Th>
                <Th>Liquidité prév.</Th>
                <Th>Cible</Th>
                <Th>Montant à ajuster ({devise})</Th>
                <Th>Action suggérée</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {actionsLiquidite.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-7 text-sm"
                    style={{ color: C.sub }}
                  >
                    Aucune action de liquidité n'est requise pour les
                    portefeuilles filtrés.
                  </td>
                </tr>
              )}
              {actionsLiquidite.map((ligne, index) => {
                const client = ligne.client;
                const ecartAllocationLiquidite = Math.abs(
                  Number(client.alloc.Liquidité || 0) -
                    Number(client.cible.Liquidité || 0)
                );
                return (
                  <tr
                    key={client.id}
                    style={{
                      borderTop: `1px solid ${C.line}`,
                      background: index % 2 ? '#FCFCFD' : '#fff',
                    }}
                  >
                    <Td className="font-semibold whitespace-nowrap">
                      {client.nom}
                    </Td>
                    <Td>
                      <Badge tone={toneStatut(ligne.statut)}>
                        {ligne.statut}
                      </Badge>
                    </Td>
                    <Td mono>{ligne.ratioPrevisionnel.toFixed(1)}%</Td>
                    <Td mono>{ligne.ratioCible.toFixed(1)}%</Td>
                    <Td mono className="whitespace-nowrap">
                      {fmt(
                        Math.round(
                          convertCurrency(
                            ligne.montantVersCible,
                            client.devise,
                            devise
                          )
                        )
                      )}{' '}
                      {devise}
                    </Td>
                    <Td>
                      <span className="text-xs" style={{ color: C.sub }}>
                        {ligne.action}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        {ecartAllocationLiquidite > SEUIL_REEQUILIBRAGE && (
                          <button
                            type="button"
                            onClick={() =>
                              go('reequilibrage', {
                                client: client.id,
                                actif: 'Liquidité',
                              })
                            }
                            className="text-xs font-semibold"
                            style={{ color: C.coral }}
                          >
                            Rééquilibrer →
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => go('client', { clientId: client.id })}
                          className="text-xs font-semibold"
                          style={{ color: C.navy }}
                        >
                          Portefeuille →
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}

function AnalysePortefeuille({ devise = 'XOF' }) {
  const [tab, setTab] = useState('Devises');
  const totalRef = CLIENTS.reduce(
    (s, c) => s + convertCurrency(c.encours, c.devise, devise),
    0
  );
  const shocks = [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10];

  const devisesEtrangeres = [...new Set(CLIENTS.map((c) => c.devise))].filter(
    (d) => d !== 'XOF'
  );
  const [paire, setPaire] = useState(devisesEtrangeres[0]);
  const [chocManuel, setChocManuel] = useState(0);
  const expoPaire = CLIENTS.filter((c) => c.devise === paire).reduce(
    (s, c) => s + convertCurrency(c.encours, c.devise, devise),
    0
  );
  const baseHorsPaire = totalRef - expoPaire;
  const scatterDataPaire = shocks.map((shock) => ({
    shock,
    valeur: Math.round(baseHorsPaire + expoPaire * (1 + shock / 100)),
  }));
  const valeurSimulee = Math.round(
    baseHorsPaire + expoPaire * (1 + chocManuel / 100)
  );

  const [chocs, setChocs] = useState(
    Object.fromEntries(STRESS_SCENARIOS.map((s) => [s.nom, s.chocDefaut]))
  );
  const [corrDim, setCorrDim] = useState('Secteurs');
  const [secteurChoc, setSecteurChoc] = useState(CORR_SECTEURS_LABELS[0]);
  const [pctChocSecteur, setPctChocSecteur] = useState(20);
  const corrLabels =
    corrDim === 'Secteurs' ? CORR_SECTEURS_LABELS : CORR_PAYS_LABELS;
  const corrHist = corrDim === 'Secteurs' ? CORR_SECTEURS_HIST : CORR_PAYS_HIST;
  const corrCriseBase =
    corrDim === 'Secteurs' ? CORR_SECTEURS_CRISE : CORR_PAYS_CRISE;
  const indexChoc =
    corrDim === 'Secteurs' ? CORR_SECTEURS_LABELS.indexOf(secteurChoc) : -1;
  const corrCrise = corrCriseBase.map((row, ri) =>
    row.map((v, ci) => {
      if (indexChoc < 0 || ri === ci) return v;
      if (ri === indexChoc || ci === indexChoc)
        return Math.min(0.98, v + (pctChocSecteur / 100) * 0.5);
      return v;
    })
  );

  const [pctPosition, setPctPosition] = useState(20);
  const [pctVolumeMax, setPctVolumeMax] = useState(5);
  const advActionsRef = VOLUME_JOUR.filter((v) => v.type === 'Action').reduce(
    (s, v) => s + convertCurrency(v.volume, v.devise, devise),
    0
  );
  const positionActionsRef =
    (totalRef * ASSET_MIX.find((a) => a.name === 'Actions').value) / 100;
  const montantACeder = (positionActionsRef * pctPosition) / 100;
  const capaciteJour = (advActionsRef * pctVolumeMax) / 100;
  const joursNecessaires =
    capaciteJour > 0 ? Math.ceil(montantACeder / capaciteJour) : null;

  const [anciennete, setAnciennete] = useState(5);
  const [volumeTraiteM, setVolumeTraiteM] = useState(50);
  const [tailleM, setTailleM] = useState(20);
  const decoteAge = Math.min(anciennete * 0.05, 8);
  const decoteVolume = Math.min(30 / (volumeTraiteM + 1), 6);
  const decoteTaille = Math.min(tailleM * 0.3, 10);
  const decoteTotale = Math.min(decoteAge + decoteVolume + decoteTaille, 25);
  const impactDecote = Math.round(tailleM * 1_000_000 * (decoteTotale / 100));

  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', 'Analyse portefeuille']} />
      <h2 className="text-xl font-bold" style={{ ...F_DISPLAY, color: C.ink }}>
        Analyse portefeuille
      </h2>
      <div className="flex gap-1.5">
        {['Devises', 'Corrélations', 'Stress test'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: tab === t ? C.navy : '#F0F1F5',
              color: tab === t ? '#fff' : C.sub,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Devises' && (
        <>
          <Card className="p-5">
            <Eyebrow>Allocation du portefeuille par devise</Eyebrow>
            <div className="grid grid-cols-2 gap-4 items-center mt-2">
              <div className="flex justify-center">
                <Donut data={CURRENCY_MIX} size={160} />
              </div>
              <Legende data={CURRENCY_MIX} />
            </div>
          </Card>

          <Card className="p-5">
            <Eyebrow>Simulation — variation d'une paire de devises</Eyebrow>
            <div className="flex items-end gap-4 mt-2 mb-3 flex-wrap">
              <div>
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{ color: C.sub }}
                >
                  Paire simulée
                </label>
                <select
                  value={paire}
                  onChange={(e) => setPaire(e.target.value)}
                  className="px-3 py-2 rounded-xl border text-sm"
                  style={{ borderColor: C.line }}
                >
                  {devisesEtrangeres.map((d) => (
                    <option key={d} value={d}>
                      {d} / XOF
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{ color: C.sub }}
                >
                  Choc appliqué : {chocManuel > 0 ? '+' : ''}
                  {chocManuel}%
                </label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={chocManuel}
                  onChange={(e) => setChocManuel(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div
                className="p-3 rounded-xl border text-right"
                style={{ borderColor: C.gold }}
              >
                <div className="text-xs" style={{ color: C.sub }}>
                  Valeur simulée
                </div>
                <div className="text-lg font-bold" style={F_DISPLAY}>
                  {fmt(valeurSimulee)} {devise}
                </div>
                <Pct v={((valeurSimulee - totalRef) / totalRef) * 100} />
              </div>
            </div>
            <div className="text-xs mb-2" style={{ color: C.sub }}>
              Exposition simulée : {fmt(Math.round(expoPaire))} {devise} sur{' '}
              {fmt(Math.round(totalRef))} {devise} détenus en {paire}.
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <ScatterChart
                margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
              >
                <CartesianGrid stroke={C.line} />
                <XAxis
                  type="number"
                  dataKey="shock"
                  name={`Choc ${paire}/XOF`}
                  unit="%"
                  tick={{ fontSize: 11, fill: C.sub }}
                />
                <YAxis
                  type="number"
                  dataKey="valeur"
                  name={`Valeur (${devise})`}
                  tick={{ fontSize: 11, fill: C.sub }}
                  tickFormatter={(v) => fmt(v)}
                />
                <ZAxis range={[80, 80]} />
                <Tooltip
                  formatter={(v, n) =>
                    n === 'valeur'
                      ? [`${fmt(v)} ${devise}`, 'Valeur']
                      : [`${v}%`, 'Choc FX']
                  }
                  contentStyle={{
                    borderRadius: 10,
                    fontSize: 12,
                    border: `1px solid ${C.line}`,
                  }}
                />
                <Scatter data={scatterDataPaire} fill={C.navy} />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}

      {tab === 'Corrélations' && (
        <Card className="p-5">
          <Eyebrow>Corrélation des actifs — historique vs en crise</Eyebrow>
          <div className="flex gap-1.5 mt-2 mb-4">
            {['Secteurs', 'Pays'].map((d) => (
              <button
                key={d}
                onClick={() => setCorrDim(d)}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: corrDim === d ? C.navy : '#F0F1F5',
                  color: corrDim === d ? '#fff' : C.sub,
                }}
              >
                {d}
              </button>
            ))}
          </div>
          {corrDim === 'Secteurs' && (
            <div
              className="flex items-end gap-4 mb-4 p-3 rounded-xl border flex-wrap"
              style={{ borderColor: C.gold }}
            >
              <div>
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{ color: C.sub }}
                >
                  Secteur en choc
                </label>
                <select
                  value={secteurChoc}
                  onChange={(e) => setSecteurChoc(e.target.value)}
                  className="px-3 py-2 rounded-xl border text-sm"
                  style={{ borderColor: C.line }}
                >
                  {CORR_SECTEURS_LABELS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[220px]">
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{ color: C.sub }}
                >
                  Baisse simulée du secteur : -{pctChocSecteur}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  value={pctChocSecteur}
                  onChange={(e) => setPctChocSecteur(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="text-xs" style={{ color: C.sub, maxWidth: 220 }}>
                Effet appliqué à la matrice "En crise" : les corrélations du
                secteur {secteurChoc} avec les autres secteurs augmentent avec
                l'ampleur du choc.
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-8">
            {[
              ['Historique', corrHist],
              ['En crise', corrCrise],
            ].map(([titre, matrix]) => (
              <div key={titre}>
                <div
                  className="text-sm font-semibold mb-2"
                  style={{ color: C.sub }}
                >
                  {titre}
                </div>
                <table style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <td></td>
                      {corrLabels.map((l) => (
                        <td
                          key={l}
                          className="text-center"
                          style={{
                            fontSize: 11,
                            color: C.sub,
                            ...F_BODY,
                            padding: 4,
                          }}
                        >
                          {l.slice(0, 5)}
                        </td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {corrLabels.map((rowLabel, ri) => (
                      <tr key={rowLabel}>
                        <td
                          className="whitespace-nowrap pr-2"
                          style={{ fontSize: 11, color: C.sub, ...F_BODY }}
                        >
                          {rowLabel}
                        </td>
                        {matrix[ri].map((v, ci) => (
                          <td
                            key={ci}
                            className="text-center"
                            style={{
                              width: 42,
                              height: 36,
                              fontSize: 11,
                              background: `rgba(214,86,74,${v})`,
                              color: v > 0.5 ? '#fff' : C.ink,
                              ...F_MONO,
                            }}
                          >
                            {v.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <div className="text-xs mt-3" style={{ color: C.sub }}>
            Les corrélations tendent à augmenter en période de crise ("flight to
            correlation"), réduisant les bénéfices de diversification au moment
            où ils seraient les plus utiles.
          </div>
        </Card>
      )}

      {tab === 'Stress test' && (
        <>
          <Card className="p-5">
            <Eyebrow>
              Impact de scénarios de stress sur le portefeuille général
            </Eyebrow>
            <div className="text-xs mb-2" style={{ color: C.sub }}>
              Ajustez le paramètre de choc de chaque scénario pour observer
              l'effet sur la valorisation générale.
            </div>
            <div className="space-y-4 mt-2">
              {STRESS_SCENARIOS.map((s) => {
                const choc = chocs[s.nom];
                const impactPct = choc * s.sensibilite;
                const impactValeur = Math.round((totalRef * impactPct) / 100);
                return (
                  <div
                    key={s.nom}
                    className="p-3 rounded-xl border"
                    style={{ borderColor: C.line }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div
                          className="text-sm font-semibold"
                          style={{ color: C.ink, ...F_BODY }}
                        >
                          {s.nom}
                        </div>
                        <div className="text-xs" style={{ color: C.sub }}>
                          Zone impactée : {s.zone}
                        </div>
                      </div>
                      <div className="text-right">
                        <Pct v={impactPct} />
                        <div
                          className="text-xs"
                          style={{ ...F_MONO, color: C.sub }}
                        >
                          {fmt(impactValeur)} {devise}
                        </div>
                      </div>
                    </div>
                    <label
                      className="text-xs font-semibold block mb-1"
                      style={{ color: C.sub }}
                    >
                      Choc simulé : {choc > 0 ? '+' : ''}
                      {choc} {s.unite}
                    </label>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      step="1"
                      value={choc}
                      onChange={(e) =>
                        setChocs({ ...chocs, [s.nom]: Number(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <Eyebrow>
              Risque de liquidité — portefeuille général (Actions)
            </Eyebrow>
            <div className="text-xs mb-3" style={{ color: C.sub }}>
              Nombre de jours nécessaires pour céder la position sans dépasser
              une part donnée du volume moyen quotidien traité sur les marchés
              actions.
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{ color: C.sub }}
                >
                  Part de la position à céder : {pctPosition}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={pctPosition}
                  onChange={(e) => setPctPosition(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{ color: C.sub }}
                >
                  Volume quotidien max. mobilisable : {pctVolumeMax}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={pctVolumeMax}
                  onChange={(e) => setPctVolumeMax(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div
                className="p-3 rounded-xl border"
                style={{ borderColor: C.line }}
              >
                <div className="text-xs" style={{ color: C.sub }}>
                  Montant à céder
                </div>
                <div className="font-semibold" style={F_MONO}>
                  {fmt(Math.round(montantACeder))} {devise}
                </div>
              </div>
              <div
                className="p-3 rounded-xl border"
                style={{ borderColor: C.line }}
              >
                <div className="text-xs" style={{ color: C.sub }}>
                  Capacité journalière mobilisable
                </div>
                <div className="font-semibold" style={F_MONO}>
                  {fmt(Math.round(capaciteJour))} {devise}
                </div>
              </div>
              <div
                className="p-3 rounded-xl border"
                style={{ borderColor: C.gold }}
              >
                <div className="text-xs" style={{ color: C.sub }}>
                  Jours nécessaires
                </div>
                <div className="text-lg font-bold" style={F_DISPLAY}>
                  {joursNecessaires ?? '—'} j
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <Eyebrow>
              Risque de liquidité — Obligations (décote selon ancienneté, volume
              et taille)
            </Eyebrow>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{ color: C.sub }}
                >
                  Ancienneté du dernier prix (jours)
                </label>
                <input
                  type="number"
                  min="0"
                  value={anciennete}
                  onChange={(e) => setAnciennete(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                  style={{ borderColor: C.line, ...F_MONO }}
                />
              </div>
              <div>
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{ color: C.sub }}
                >
                  Volume traité (M {devise})
                </label>
                <input
                  type="number"
                  min="0"
                  value={volumeTraiteM}
                  onChange={(e) => setVolumeTraiteM(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                  style={{ borderColor: C.line, ...F_MONO }}
                />
              </div>
              <div>
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{ color: C.sub }}
                >
                  Taille de la position (M {devise})
                </label>
                <input
                  type="number"
                  min="0"
                  value={tailleM}
                  onChange={(e) => setTailleM(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                  style={{ borderColor: C.line, ...F_MONO }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div
                className="p-3 rounded-xl border"
                style={{ borderColor: C.gold }}
              >
                <div className="text-xs" style={{ color: C.sub }}>
                  Décote de liquidité estimée
                </div>
                <div className="text-lg font-bold" style={F_DISPLAY}>
                  {decoteTotale.toFixed(1)}%
                </div>
                <div className="text-xs mt-1" style={{ color: C.sub }}>
                  Ancienneté {decoteAge.toFixed(1)} pts · Volume{' '}
                  {decoteVolume.toFixed(1)} pts · Taille{' '}
                  {decoteTaille.toFixed(1)} pts
                </div>
              </div>
              <div
                className="p-3 rounded-xl border"
                style={{ borderColor: C.line }}
              >
                <div className="text-xs" style={{ color: C.sub }}>
                  Impact estimé sur la position
                </div>
                <div className="font-semibold" style={F_MONO}>
                  {fmt(impactDecote)} {devise}
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

const DECISIONS_COMITE_STORAGE_KEY = 'afrimarket-decisions-comite-v1';

const instrumentsPourDecision = (typeInstrument) => {
  if (typeInstrument === 'Actions') return ACTIONS_LIST;
  if (typeInstrument === 'Obl. souveraines') {
    return MARKETS_DATA.filter(
      (instrument) =>
        instrument.type === 'Obligation' &&
        instrument.nom.toLowerCase().includes('trésor')
    ).map((instrument) => instrument.nom);
  }
  return MARKETS_DATA.filter(
    (instrument) =>
      instrument.type === 'Obligation' &&
      !instrument.nom.toLowerCase().includes('trésor')
  ).map((instrument) => instrument.nom);
};

const prixDecisionPourInstrument = (instrument) => {
  const marche = MARKETS_DATA.find((item) => item.nom === instrument);
  const recommandation = RECOS.find((item) => item.titre === instrument);
  const cours = Number(marche?.cours ?? recommandation?.cours ?? 0);
  const objectif = Number(recommandation?.objectif ?? cours);

  return {
    prixMin: cours > 0 ? String(Number((cours * 0.98).toFixed(2))) : '',
    prixMax: cours > 0 ? String(Number((cours * 1.02).toFixed(2))) : '',
    prixObjectif: objectif > 0 ? String(objectif) : '',
  };
};

const nouvelleAllocationDecision = () => {
  const typeInstrument = 'Actions';
  const instrument = instrumentsPourDecision(typeInstrument)[0] || '';
  return {
    typeInstrument,
    sens: 'Achat',
    marche: 'Tous',
    typePortefeuille: 'Tous',
    instrument,
    operateur: '<',
    seuil: '10',
    typeOrdre: 'Ordre au marché',
    ...prixDecisionPourInstrument(instrument),
  };
};

const lireDecisionsComite = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(DECISIONS_COMITE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const sauvegarderDecisionsComite = (decisions) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      DECISIONS_COMITE_STORAGE_KEY,
      JSON.stringify(decisions)
    );
  } catch {
    // Les décisions restent disponibles pendant la session si le stockage est bloqué.
  }
};

const portefeuillesEligiblesDecision = (allocation) =>
  CLIENTS.filter((client) => {
    const correspondMarche =
      allocation.marche === 'Tous' || client.marche === allocation.marche;
    const typeLibelle = PROFILE_TYPE_LABEL[client.type] || client.type;
    const correspondType =
      allocation.typePortefeuille === 'Tous' ||
      typeLibelle === allocation.typePortefeuille;
    const exposition = exposureOf(client.id, allocation.instrument);
    const correspondExposition = compareOp(
      exposition,
      allocation.operateur,
      Number(allocation.seuil || 0)
    );

    return correspondMarche && correspondType && correspondExposition;
  });

function PriseDecisions({ go }) {
  const [allocationCourante, setAllocationCourante] = useState(() =>
    nouvelleAllocationDecision()
  );
  const [allocations, setAllocations] = useState([]);
  const [decisionsEnregistrees, setDecisionsEnregistrees] = useState(() =>
    lireDecisionsComite()
  );
  const [message, setMessage] = useState(null);

  const instrumentsDisponibles = instrumentsPourDecision(
    allocationCourante.typeInstrument
  );
  const eligiblesCourants = portefeuillesEligiblesDecision(allocationCourante);

  const mettreAJour = (champ, valeur) => {
    setMessage(null);
    setAllocationCourante((courante) => {
      if (champ === 'typeInstrument') {
        const instrument = instrumentsPourDecision(valeur)[0] || '';
        return {
          ...courante,
          typeInstrument: valeur,
          instrument,
          ...prixDecisionPourInstrument(instrument),
        };
      }

      if (champ === 'instrument') {
        return {
          ...courante,
          instrument: valeur,
          ...prixDecisionPourInstrument(valeur),
        };
      }

      return { ...courante, [champ]: valeur };
    });
  };

  const verifierAllocation = (allocation) => {
    if (!allocation.instrument) {
      return "Sélectionnez un instrument avant d'ajouter l'allocation.";
    }

    const seuil = Number(allocation.seuil);
    if (!Number.isFinite(seuil) || seuil < 0 || seuil > 100) {
      return "Le seuil d'exposition doit être compris entre 0 et 100 %.";
    }

    const prixMin = Number(allocation.prixMin);
    const prixMax = Number(allocation.prixMax);
    const prixObjectif = Number(allocation.prixObjectif);
    if (
      !Number.isFinite(prixMin) ||
      !Number.isFinite(prixMax) ||
      !Number.isFinite(prixObjectif) ||
      prixMin < 0 ||
      prixMax < 0 ||
      prixObjectif < 0
    ) {
      return 'Renseignez des prix minimum, maximum et objectif valides.';
    }
    if (prixMin > prixMax) {
      return 'Le prix minimum ne peut pas être supérieur au prix maximum.';
    }

    return null;
  };

  const ajouterAllocation = () => {
    const erreur = verifierAllocation(allocationCourante);
    if (erreur) {
      setMessage({ tone: 'coral', texte: erreur });
      return;
    }

    const eligibles = portefeuillesEligiblesDecision(allocationCourante);
    const allocation = {
      ...allocationCourante,
      id: `ALLOC-${Date.now()}-${allocations.length + 1}`,
      seuil: Number(allocationCourante.seuil),
      prixMin: Number(allocationCourante.prixMin),
      prixMax: Number(allocationCourante.prixMax),
      prixObjectif: Number(allocationCourante.prixObjectif),
      portefeuillesEligibles: eligibles.map((client) => client.nom),
    };

    setAllocations((courantes) => [...courantes, allocation]);
    setAllocationCourante(nouvelleAllocationDecision());
    setMessage({
      tone: 'teal',
      texte: `Allocation ajoutée au tableau (${eligibles.length} portefeuille(s) concerné(s)).`,
    });
  };

  const supprimerAllocation = (id) => {
    setAllocations((courantes) =>
      courantes.filter((allocation) => allocation.id !== id)
    );
    setMessage(null);
  };

  const enregistrerDecisions = () => {
    if (allocations.length === 0) {
      setMessage({
        tone: 'coral',
        texte:
          "Ajoutez au moins une allocation avant d'enregistrer les décisions.",
      });
      return;
    }

    const date = new Date();
    const portefeuilleDistincts = [
      ...new Set(
        allocations.flatMap(
          (allocation) => allocation.portefeuillesEligibles || []
        )
      ),
    ];
    const decision = {
      id: `DEC-${date.getFullYear()}${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}${String(date.getDate()).padStart(2, '0')}-${String(
        date.getHours()
      ).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(
        date.getSeconds()
      ).padStart(2, '0')}`,
      creeLe: date.toISOString(),
      libelleDate: new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date),
      allocations,
      nombrePortefeuilles: portefeuilleDistincts.length,
    };

    const prochaines = [decision, ...decisionsEnregistrees];
    setDecisionsEnregistrees(prochaines);
    sauvegarderDecisionsComite(prochaines);
    setAllocations([]);
    setAllocationCourante(nouvelleAllocationDecision());
    setMessage({
      tone: 'teal',
      texte: `${decision.id} enregistrée avec ${decision.allocations.length} allocation(s).`,
    });
  };

  const reutiliserDecision = (decision) => {
    const reprises = decision.allocations.map((allocation, index) => ({
      ...allocation,
      id: `ALLOC-${Date.now()}-${index + 1}`,
    }));
    setAllocations(reprises);
    setMessage({
      tone: 'gold',
      texte: `${decision.id} a été rechargée dans le tableau de préparation.`,
    });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const supprimerDecision = (id) => {
    const prochaines = decisionsEnregistrees.filter(
      (decision) => decision.id !== id
    );
    setDecisionsEnregistrees(prochaines);
    sauvegarderDecisionsComite(prochaines);
    setMessage({ tone: 'gold', texte: `${id} a été supprimée.` });
  };

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          'Accueil',
          'Rapport de comité de gestion',
          'Prise de décisions',
        ]}
      />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Prise de décisions — allocations d'investissement compilées
          </h2>
          <div className="text-xs mt-1" style={{ color: C.sub, ...F_BODY }}>
            Préparez plusieurs règles d'allocation, ajoutez-les au tableau puis
            enregistrez l'ensemble comme une décision de comité réutilisable.
          </div>
        </div>
        <Btn tone="ghost" onClick={() => go('comite')}>
          Retour au rapport
        </Btn>
      </div>

      {message && (
        <Card
          className="p-3"
          style={{
            borderColor: message.tone === 'coral' ? C.coral : C.gold,
            background:
              message.tone === 'coral'
                ? '#FBE9E7'
                : message.tone === 'teal'
                ? '#E4F5EF'
                : '#FBF1DD',
          }}
        >
          <div
            className="text-sm font-semibold"
            style={{
              color:
                message.tone === 'coral'
                  ? C.coral
                  : message.tone === 'teal'
                  ? C.teal
                  : '#8A6A16',
            }}
          >
            {message.texte}
          </div>
        </Card>
      )}

      <Card className="p-5" style={{ borderColor: C.navy }}>
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div>
            <Eyebrow>Nouvelle allocation d'investissement</Eyebrow>
            <div className="text-xs" style={{ color: C.sub }}>
              Les portefeuilles concernés sont recalculés automatiquement selon
              le marché, le type de portefeuille et le seuil d'exposition.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="navy">
              {eligiblesCourants.length} portefeuille(s) éligible(s)
            </Badge>
            <Badge tone="gold">
              {allocations.length} allocation(s) ajoutée(s)
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Type d'instrument
            </label>
            <select
              value={allocationCourante.typeInstrument}
              onChange={(e) => mettreAJour('typeInstrument', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line }}
            >
              <option>Actions</option>
              <option>Obl. souveraines</option>
              <option>Obl. privées</option>
            </select>
          </div>

          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Sens
            </label>
            <select
              value={allocationCourante.sens}
              onChange={(e) => mettreAJour('sens', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line }}
            >
              <option>Achat</option>
              <option>Vente</option>
            </select>
          </div>

          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Marché boursier
            </label>
            <select
              value={allocationCourante.marche}
              onChange={(e) => mettreAJour('marche', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line }}
            >
              <option>Tous</option>
              <option>BRVM</option>
              <option>NGX</option>
              <option>GSE</option>
            </select>
          </div>

          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Type de portefeuille
            </label>
            <select
              value={allocationCourante.typePortefeuille}
              onChange={(e) => mettreAJour('typePortefeuille', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line }}
            >
              <option>Tous</option>
              <option>Particulier</option>
              <option>Institutionnel</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4">
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Instrument (action / obligation)
            </label>
            <select
              value={allocationCourante.instrument}
              onChange={(e) => mettreAJour('instrument', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line }}
            >
              {instrumentsDisponibles.length === 0 && (
                <option value="">Aucun instrument</option>
              )}
              {instrumentsDisponibles.map((instrument) => (
                <option key={instrument}>{instrument}</option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Opérateur de comparaison
            </label>
            <select
              value={allocationCourante.operateur}
              onChange={(e) => mettreAJour('operateur', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line }}
            >
              <option value="<">{'< (inférieur à)'}</option>
              <option value="=">{'= (égal à)'}</option>
              <option value=">">{'> (supérieur à)'}</option>
            </select>
          </div>

          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Seuil d'exposition par portefeuille (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={allocationCourante.seuil}
              onChange={(e) => mettreAJour('seuil', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line, ...F_MONO }}
            />
          </div>

          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Type d'ordre
            </label>
            <select
              value={allocationCourante.typeOrdre}
              onChange={(e) => mettreAJour('typeOrdre', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line }}
            >
              <option>Ordre au marché</option>
              <option>Ordre limite</option>
              <option>Meilleure limite</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4 items-end">
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Prix min
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={allocationCourante.prixMin}
              onChange={(e) => mettreAJour('prixMin', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line, ...F_MONO }}
            />
          </div>
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Prix Max
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={allocationCourante.prixMax}
              onChange={(e) => mettreAJour('prixMax', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line, ...F_MONO }}
            />
          </div>
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Prix Objectif
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={allocationCourante.prixObjectif}
              onChange={(e) => mettreAJour('prixObjectif', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line, ...F_MONO }}
            />
          </div>
          <div className="flex items-center justify-end">
            <Btn onClick={ajouterAllocation}>Ajouter allocation</Btn>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl" style={{ background: '#EFF3FB' }}>
          <div className="text-xs font-semibold" style={{ color: C.ink }}>
            Portefeuilles actuellement concernés
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {eligiblesCourants.length === 0 ? (
              <span className="text-xs" style={{ color: C.sub }}>
                Aucun portefeuille ne satisfait les critères actuels.
              </span>
            ) : (
              eligiblesCourants.map((client) => (
                <Badge key={client.id} tone="slate">
                  {client.nom}
                </Badge>
              ))
            )}
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div
          className="p-4 flex items-center justify-between gap-3"
          style={{ background: '#FBF7EE' }}
        >
          <div>
            <Eyebrow>Tableau de préparation des décisions</Eyebrow>
            <div className="text-xs" style={{ color: C.sub }}>
              Chaque ligne représente une allocation qui sera compilée dans la
              décision finale.
            </div>
          </div>
          <button
            type="button"
            onClick={enregistrerDecisions}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: C.gold, color: '#fff', ...F_BODY }}
          >
            Enregistrer Décisions
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 2450 }}>
            <thead style={{ background: '#FAFAFC' }}>
              <tr>
                <Th>#</Th>
                <Th>Type d'instrument</Th>
                <Th>Sens</Th>
                <Th>Marché boursier</Th>
                <Th>Type de portefeuille</Th>
                <Th>Instrument (action / obligation)</Th>
                <Th>Opérateur de comparaison</Th>
                <Th>Seuil d'exposition par portefeuille (%)</Th>
                <Th>Type d'ordre</Th>
                <Th>Prix min</Th>
                <Th>Prix Max</Th>
                <Th>Prix Objectif</Th>
                <Th>Portefeuilles concernés</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {allocations.length === 0 && (
                <tr>
                  <td
                    colSpan={14}
                    className="text-center py-8 text-sm"
                    style={{ color: C.sub }}
                  >
                    Aucune allocation ajoutée. Remplissez le formulaire puis
                    cliquez sur « Ajouter allocation ».
                  </td>
                </tr>
              )}
              {allocations.map((allocation, index) => (
                <tr
                  key={allocation.id}
                  style={{
                    borderTop: `1px solid ${C.line}`,
                    background: index % 2 ? '#FCFCFD' : '#fff',
                  }}
                >
                  <Td mono>{index + 1}</Td>
                  <Td className="whitespace-nowrap">
                    {allocation.typeInstrument}
                  </Td>
                  <Td>
                    <Badge
                      tone={allocation.sens === 'Achat' ? 'teal' : 'coral'}
                    >
                      {allocation.sens}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge tone="navy">{allocation.marche}</Badge>
                  </Td>
                  <Td className="whitespace-nowrap">
                    {allocation.typePortefeuille}
                  </Td>
                  <Td className="font-semibold whitespace-nowrap">
                    {allocation.instrument}
                  </Td>
                  <Td mono>{allocation.operateur}</Td>
                  <Td mono>{allocation.seuil}%</Td>
                  <Td className="whitespace-nowrap">{allocation.typeOrdre}</Td>
                  <Td mono>{fmtPrice(allocation.prixMin)}</Td>
                  <Td mono>{fmtPrice(allocation.prixMax)}</Td>
                  <Td mono>{fmtPrice(allocation.prixObjectif)}</Td>
                  <Td>
                    <div className="text-xs" style={{ color: C.sub }}>
                      {allocation.portefeuillesEligibles.length > 0
                        ? `${
                            allocation.portefeuillesEligibles.length
                          } — ${allocation.portefeuillesEligibles.join(', ')}`
                        : 'Aucun'}
                    </div>
                  </Td>
                  <Td>
                    <button
                      type="button"
                      onClick={() => supprimerAllocation(allocation.id)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold"
                      style={{ background: '#FBE9E7', color: C.coral }}
                    >
                      Retirer
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3
            className="text-lg font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Décisions enregistrées pour utilisation ultérieure
          </h3>
        </div>
        <Badge tone="gold">{decisionsEnregistrees.length} décision(s)</Badge>
      </div>

      {decisionsEnregistrees.length === 0 && (
        <Card className="p-8 text-center">
          <Badge tone="slate">Aucune décision enregistrée</Badge>
          <div className="text-sm mt-3" style={{ color: C.sub }}>
            Les décisions compilées apparaîtront ici après enregistrement.
          </div>
        </Card>
      )}

      {decisionsEnregistrees.map((decision) => (
        <Card
          key={decision.id}
          className="p-0 overflow-hidden"
          style={{ borderColor: C.gold }}
        >
          <div
            className="p-4 flex items-center justify-between gap-4 flex-wrap"
            style={{ background: '#FBF7EE' }}
          >
            <div>
              <div
                className="text-base font-bold"
                style={{ ...F_DISPLAY, color: C.ink }}
              >
                {decision.id}
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge tone="gold">
                  {decision.allocations.length} allocation(s)
                </Badge>
                <Badge tone="navy">
                  {decision.nombrePortefeuilles} portefeuille(s)
                </Badge>
                <span className="text-xs" style={{ color: C.sub }}>
                  {decision.libelleDate}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Btn tone="ghost" onClick={() => reutiliserDecision(decision)}>
                Réutiliser
              </Btn>
              <button
                type="button"
                onClick={() => supprimerDecision(decision.id)}
                className="px-3 py-2 rounded-xl text-xs font-semibold"
                style={{ background: '#FBE9E7', color: C.coral }}
              >
                Supprimer
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: 2200 }}>
              <thead style={{ background: '#FAFAFC' }}>
                <tr>
                  <Th>Type d'instrument</Th>
                  <Th>Sens</Th>
                  <Th>Marché boursier</Th>
                  <Th>Type de portefeuille</Th>
                  <Th>Instrument (action / obligation)</Th>
                  <Th>Opérateur</Th>
                  <Th>Seuil (%)</Th>
                  <Th>Type d'ordre</Th>
                  <Th>Prix min</Th>
                  <Th>Prix Max</Th>
                  <Th>Prix Objectif</Th>
                  <Th>Portefeuilles concernés</Th>
                </tr>
              </thead>
              <tbody>
                {decision.allocations.map((allocation, index) => (
                  <tr
                    key={`${decision.id}-${allocation.id || index}`}
                    style={{
                      borderTop: `1px solid ${C.line}`,
                      background: index % 2 ? '#FCFCFD' : '#fff',
                    }}
                  >
                    <Td className="whitespace-nowrap">
                      {allocation.typeInstrument}
                    </Td>
                    <Td>
                      <Badge
                        tone={allocation.sens === 'Achat' ? 'teal' : 'coral'}
                      >
                        {allocation.sens}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge tone="navy">{allocation.marche}</Badge>
                    </Td>
                    <Td className="whitespace-nowrap">
                      {allocation.typePortefeuille}
                    </Td>
                    <Td className="font-semibold whitespace-nowrap">
                      {allocation.instrument}
                    </Td>
                    <Td mono>{allocation.operateur}</Td>
                    <Td mono>{allocation.seuil}%</Td>
                    <Td className="whitespace-nowrap">
                      {allocation.typeOrdre}
                    </Td>
                    <Td mono>{fmtPrice(allocation.prixMin)}</Td>
                    <Td mono>{fmtPrice(allocation.prixMax)}</Td>
                    <Td mono>{fmtPrice(allocation.prixObjectif)}</Td>
                    <Td>
                      <span className="text-xs" style={{ color: C.sub }}>
                        {(allocation.portefeuillesEligibles || []).join(', ') ||
                          'Aucun'}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </div>
  );
}

function Comite({ devise = 'XOF', go }) {
  const [filtreBourse, setFiltreBourse] = useState('Toutes');
  const [filtreSecteur, setFiltreSecteur] = useState('Tous');
  const totalRef = CLIENTS.reduce(
    (s, c) => s + convertCurrency(c.encours, c.devise, devise),
    0
  );
  const boursesDisponibles = ['Toutes', ...new Set(RECOS.map((r) => r.marche))];
  const secteursDisponibles = ['Tous', ...new Set(RECOS.map((r) => r.secteur))];
  const recommandationsFiltrees = RECOS.filter(
    (r) =>
      (filtreBourse === 'Toutes' || r.marche === filtreBourse) &&
      (filtreSecteur === 'Tous' || r.secteur === filtreSecteur)
  );
  const previsionTresorerie30j = UPCOMING_CASHFLOWS.filter((c) => {
    const j = joursDepuisAujourdhui(c.echeance);
    return j >= 0 && j <= 30;
  }).reduce((s, c) => s + convertCurrency(c.montant, c.devise, devise), 0);
  return (
    <div className="space-y-6">
      <Breadcrumb items={['Accueil', 'Rapport de comité de gestion']} />
      <div className="flex items-center justify-between">
        <h2
          className="text-xl font-bold"
          style={{ ...F_DISPLAY, color: C.ink }}
        >
          Rapport de comité de gestion — Juillet 2026
        </h2>
        <div className="flex items-center gap-2">
          <Btn onClick={() => go('decisions-comite')}>Prise de décisions</Btn>
          <Btn tone="gold">Editer</Btn>
        </div>
      </div>

      <Card
        className="p-0 overflow-hidden"
        style={{ borderColor: C.gold, background: '#FBF7EE' }}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={16} color={C.navy} />
            <span
              className="text-sm font-semibold"
              style={{ color: C.ink, ...F_BODY }}
            >
              Encours total sous gestion
            </span>
          </div>
          <span
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.navy }}
          >
            {fmt(Math.round(totalRef))} {devise}
          </span>
        </div>
        <div
          className="p-4 flex items-center justify-between"
          style={{ borderTop: `1px solid ${C.gold}` }}
        >
          <div className="flex items-center gap-2">
            <Droplets size={16} color={C.gold} />
            <span
              className="text-sm font-semibold"
              style={{ color: C.ink, ...F_BODY }}
            >
              Prévision de trésorerie — dividendes &amp; coupons attendus dans
              le mois
            </span>
          </div>
          <span className="text-lg font-bold" style={F_DISPLAY}>
            {fmt(Math.round(previsionTresorerie30j))} {devise}
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <Eyebrow>Rendement de la période</Eyebrow>
          <div className="flex items-end gap-6 mt-2">
            <div>
              <div className="text-xs" style={{ color: C.sub }}>
                Performance gestionnaire
              </div>
              <div className="text-2xl font-bold" style={F_DISPLAY}>
                +2.4%
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: C.sub }}>
                Rentabilité générale
              </div>
              <div className="text-2xl font-bold" style={F_DISPLAY}>
                +1.9%
              </div>
            </div>
          </div>
          <div className="text-xs mt-2" style={{ color: C.sub }}>
            Dispersion clients : de -1.4% (Emeka Okafor) à +4.6% (Ama Boateng)
          </div>
        </Card>
        <Card className="p-5">
          <Eyebrow>Écarts sur les autres types d'actifs</Eyebrow>
          <div className="space-y-2 mt-2 text-sm" style={F_BODY}>
            <div className="flex justify-between">
              <span>Obl. souveraines</span>
              <Badge tone="teal">-1 pt vs cible (conforme)</Badge>
            </div>
            <div className="flex justify-between">
              <span>Obl. privées</span>
              <Badge tone="gold">+3 pts vs cible</Badge>
            </div>
            <div className="flex justify-between">
              <span>Liquidité</span>
              <Badge tone="teal">Conforme</Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-3">
          <div>
            <Eyebrow>Recommandations d'achat / vente — tous marchés</Eyebrow>
            <div className="text-xs" style={{ color: C.sub, ...F_BODY }}>
              Synthèse des signaux techniques et fondamentaux présentée au
              comité.
            </div>
          </div>
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <label
                className="text-xs font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Bourse
              </label>
              <select
                value={filtreBourse}
                onChange={(e) => setFiltreBourse(e.target.value)}
                className="px-3 py-2 rounded-xl border text-sm"
                style={{ borderColor: C.line, ...F_BODY }}
              >
                {boursesDisponibles.map((bourse) => (
                  <option key={bourse}>{bourse}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="text-xs font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Secteur
              </label>
              <select
                value={filtreSecteur}
                onChange={(e) => setFiltreSecteur(e.target.value)}
                className="px-3 py-2 rounded-xl border text-sm"
                style={{ borderColor: C.line, ...F_BODY }}
              >
                {secteursDisponibles.map((secteur) => (
                  <option key={secteur}>{secteur}</option>
                ))}
              </select>
            </div>
            <Badge tone="gold">
              {recommandationsFiltrees.length} valeur(s)
            </Badge>
          </div>
        </div>

        <div
          className="overflow-x-auto rounded-xl border"
          style={{ borderColor: C.line }}
        >
          <table className="w-full" style={{ minWidth: 1740 }}>
            <thead style={{ background: '#FAFAFC' }}>
              <tr>
                <th
                  rowSpan={2}
                  className="text-left text-[11px] uppercase tracking-wider font-semibold py-2 px-3"
                  style={{ color: C.sub, ...F_BODY }}
                >
                  Titre
                </th>
                <th
                  rowSpan={2}
                  className="text-left text-[11px] uppercase tracking-wider font-semibold py-2 px-3"
                  style={{ color: C.sub, ...F_BODY }}
                >
                  Recommandation
                </th>
                <th
                  rowSpan={2}
                  className="text-left text-[11px] uppercase tracking-wider font-semibold py-2 px-3"
                  style={{ color: C.sub, ...F_BODY }}
                >
                  Prix min
                </th>
                <th
                  rowSpan={2}
                  className="text-left text-[11px] uppercase tracking-wider font-semibold py-2 px-3"
                  style={{ color: C.sub, ...F_BODY }}
                >
                  Prix max
                </th>
                <th
                  colSpan={5}
                  className="text-center text-[11px] uppercase tracking-wider font-semibold py-2 px-3"
                  style={{ color: C.navy, background: '#EFF3FB', ...F_BODY }}
                >
                  Analyse technique
                </th>
                <th
                  colSpan={5}
                  className="text-center text-[11px] uppercase tracking-wider font-semibold py-2 px-3"
                  style={{ color: '#8A6A16', background: '#FBF7EE', ...F_BODY }}
                >
                  Analyse fondamentale
                </th>
              </tr>
              <tr>
                <Th>MM</Th>
                <Th>MACD</Th>
                <Th>RSI</Th>
                <Th>BOL</Th>
                <Th>Signal technique</Th>
                <Th>PER</Th>
                <Th>Rentabilité</Th>
                <Th>EVOL</Th>
                <Th>VALO</Th>
                <Th>Signal fondamental</Th>
              </tr>
            </thead>
            <tbody>
              {recommandationsFiltrees.length === 0 && (
                <tr>
                  <td
                    colSpan={16}
                    className="text-center text-sm py-6"
                    style={{ color: C.sub, ...F_BODY }}
                  >
                    Aucune recommandation ne correspond à cette combinaison de
                    filtres.
                  </td>
                </tr>
              )}
              {recommandationsFiltrees.map((r, i) => (
                <tr
                  key={r.titre}
                  style={{
                    borderTop: `1px solid ${C.line}`,
                    background: i % 2 ? '#FCFCFD' : '#fff',
                  }}
                >
                  <Td className="font-semibold whitespace-nowrap">{r.titre}</Td>
                  <Td>
                    <Badge tone="navy">{r.marche}</Badge>
                  </Td>
                  <Td className="whitespace-nowrap">{r.secteur}</Td>
                  <Td>
                    <Badge
                      tone={
                        r.sens === 'Achat'
                          ? 'teal'
                          : r.sens === 'Vente'
                          ? 'coral'
                          : 'slate'
                      }
                    >
                      {r.sens}
                    </Badge>
                  </Td>
                  <Td mono className="whitespace-nowrap">
                    {Math.min(r.cours, r.objectif)} {r.devise}
                  </Td>
                  <Td mono className="whitespace-nowrap">
                    {Math.max(r.cours, r.objectif)} {r.devise}
                  </Td>
                  <Td mono className="whitespace-nowrap">
                    {r.technique.mm}
                  </Td>
                  <Td className="whitespace-nowrap">{r.technique.macd}</Td>
                  <Td mono>{r.technique.rsi}</Td>
                  <Td className="whitespace-nowrap">{r.technique.bol}</Td>
                  <Td>
                    <Badge
                      tone={
                        r.technique.signal === 'Acheter'
                          ? 'teal'
                          : r.technique.signal === 'Vendre'
                          ? 'coral'
                          : r.technique.signal === 'Alléger'
                          ? 'gold'
                          : 'slate'
                      }
                    >
                      {r.technique.signal}
                    </Badge>
                  </Td>
                  <Td mono>{r.fondamentale.per.toFixed(1)}x</Td>
                  <Td mono>{r.fondamentale.rentabilite}</Td>
                  <Td mono>{r.fondamentale.evol}</Td>
                  <Td className="whitespace-nowrap">{r.fondamentale.valo}</Td>
                  <Td>
                    <Badge
                      tone={
                        r.fondamentale.signal === 'Acheter' ? 'teal' : 'coral'
                      }
                    >
                      {r.fondamentale.signal}
                    </Badge>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-5">
        <Eyebrow>
          Impact des recommandations du comité précédent sur la gestion
        </Eyebrow>
        <table className="w-full mt-1">
          <thead>
            <tr>
              <Th>Thème</Th>
              <Th>Portefeuilles</Th>
              <Th>Impact mesuré</Th>
              <Th>Statut</Th>
            </tr>
          </thead>
          <tbody>
            {IMPACT_COMITE.map((r) => (
              <tr key={r.theme} style={{ borderTop: `1px solid ${C.line}` }}>
                <Td className="font-semibold">{r.theme}</Td>
                <Td>{r.pf}</Td>
                <Td>
                  <Pct v={parseFloat(r.impact)} />
                </Td>
                <Td>
                  <Badge tone={r.statut === 'Appliqué' ? 'teal' : 'gold'}>
                    {r.statut}
                  </Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-5">
        <Eyebrow>Contribution sectorielle à la valorisation générale</Eyebrow>
        <div className="grid grid-cols-2 gap-6 items-center">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={SECTOR_CONTRIB}
                dataKey="valeur"
                nameKey="name"
                innerRadius={55}
                outerRadius={100}
                paddingAngle={2}
                label={({ name, valeur, pct }) =>
                  `${name} · ${valeur} M · ${pct}%`
                }
              >
                {SECTOR_CONTRIB.map((_, i) => (
                  <Cell
                    key={i}
                    fill={PALETTE[i % PALETTE.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, n, p) => [
                  `${v} M XOF (${p.payload.pct}%)`,
                  p.payload.name,
                ]}
                contentStyle={{
                  borderRadius: 10,
                  fontSize: 12,
                  border: `1px solid ${C.line}`,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {SECTOR_CONTRIB.map((s, i) => (
              <div
                key={s.name}
                className="flex items-center justify-between text-sm"
                style={F_BODY}
              >
                <span
                  className="flex items-center gap-2"
                  style={{ color: C.ink }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: PALETTE[i % PALETTE.length] }}
                  />
                  {s.name}
                </span>
                <span
                  className="font-semibold"
                  style={{ ...F_MONO, color: C.sub }}
                >
                  {s.valeur} M XOF · {s.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <Eyebrow>Exposition générale du gestionnaire</Eyebrow>
        <div className="grid grid-cols-2 gap-6 mt-2">
          {[
            ["Type d'actif", ASSET_MIX],
            ['Marché / devise', MARKET_MIX],
            ['Pays', COUNTRY_MIX],
            ['Secteur', SECTOR_MIX],
          ].map(([t, d]) => {
            const data = d.map((s) => ({
              ...s,
              valeurM: Math.round((totalRef * s.value) / 100 / 1_000_000),
            }));
            return (
              <div key={t}>
                <div
                  className="text-xs font-semibold mb-2"
                  style={{ color: C.sub }}
                >
                  {t}
                </div>
                <div className="grid grid-cols-2 gap-3 items-center">
                  <ResponsiveContainer width="100%" height={170}>
                    <PieChart>
                      <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={32}
                        outerRadius={62}
                        paddingAngle={2}
                        label={({ value }) => `${value}%`}
                      >
                        {data.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PALETTE[i % PALETTE.length]}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v, n, p) => [
                          `${p.payload.valeurM} M ${devise} (${v}%)`,
                          p.payload.name,
                        ]}
                        contentStyle={{
                          borderRadius: 10,
                          fontSize: 11,
                          border: `1px solid ${C.line}`,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1">
                    {data.map((s, i) => (
                      <div
                        key={s.name}
                        className="flex items-center justify-between text-xs"
                        style={F_BODY}
                      >
                        <span
                          className="flex items-center gap-1.5"
                          style={{ color: C.ink }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: PALETTE[i % PALETTE.length] }}
                          />
                          {s.name}
                        </span>
                        <span
                          className="font-semibold"
                          style={{ ...F_MONO, color: C.sub }}
                        >
                          {s.valeurM} M · {s.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* --------------------------- ESPACE CLIENT LIBRE --------------------------- */
function ClientBreadcrumb({ items }) {
  return (
    <div
      className="flex items-center gap-1.5 text-sm mb-4 flex-wrap"
      style={{ color: C.sub, ...F_BODY }}
    >
      <Home size={13} />
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight size={13} />}
          <span
            style={{
              color: index === items.length - 1 ? C.ink : C.sub,
              fontWeight: index === items.length - 1 ? 600 : 500,
            }}
          >
            {item}
          </span>
        </span>
      ))}
    </div>
  );
}

function ClientDashboard({ goClient, devise, onDeviseChange, orders }) {
  const portefeuilles = CLIENT_GESTION_LIBRE.portefeuilles;
  const nombreSgi = new Set(
    portefeuilles.map((portefeuille) => portefeuille.sgi)
  ).size;
  const nombrePays = new Set(
    portefeuilles.map((portefeuille) => portefeuille.pays)
  ).size;
  const [allocationActifSelectionne, setAllocationActifSelectionne] =
    useState(null);
  const [allocationPaysSelectionne, setAllocationPaysSelectionne] =
    useState(null);
  const patrimoine = portefeuilles.reduce(
    (somme, portefeuille) =>
      somme + clientPortfolioValueIn(portefeuille, devise),
    0
  );
  const liquiditeTotale = portefeuilles.reduce(
    (somme, portefeuille) => somme + clientCashIn(portefeuille, devise),
    0
  );
  const liquiditeReservee = portefeuilles.reduce(
    (somme, portefeuille) =>
      somme + clientReservedCashIn(portefeuille, orders, devise),
    0
  );
  const liquiditeDisponible = portefeuilles.reduce(
    (somme, portefeuille) =>
      somme + clientAvailableCashIn(portefeuille, orders, devise),
    0
  );
  const perfPonderee =
    patrimoine > 0
      ? portefeuilles.reduce(
          (somme, portefeuille) =>
            somme +
            clientPortfolioValueIn(portefeuille, devise) *
              Number(portefeuille.perfYtd || 0),
          0
        ) / patrimoine
      : 0;

  const allocationMap = {
    Actions: 0,
    Obligations: 0,
    Liquidité: liquiditeTotale,
  };
  portefeuilles.forEach((portefeuille) => {
    portefeuille.lignes.forEach((ligne) => {
      const classe = clientAssetClass(ligne.instrument);
      allocationMap[classe] += convertCurrency(
        clientLineValue(ligne),
        portefeuille.devise,
        devise
      );
    });
  });
  const allocation = Object.entries(allocationMap).map(([name, montant]) => ({
    name,
    montant,
    value:
      patrimoine > 0 ? Number(((montant / patrimoine) * 100).toFixed(1)) : 0,
    devise,
  }));

  const montantActifDansPortefeuille = (portefeuille, classeActif) => {
    if (classeActif === 'Liquidité') {
      return convertCurrency(
        portefeuille.compteEspeces,
        portefeuille.devise,
        devise
      );
    }

    return portefeuille.lignes
      .filter((ligne) => clientAssetClass(ligne.instrument) === classeActif)
      .reduce(
        (somme, ligne) =>
          somme +
          convertCurrency(clientLineValue(ligne), portefeuille.devise, devise),
        0
      );
  };

  const construireRepartitionAllocation = (
    keyFn,
    classeActif,
    filtre = () => true
  ) => {
    const map = {};
    portefeuilles.filter(filtre).forEach((portefeuille) => {
      const montant = montantActifDansPortefeuille(portefeuille, classeActif);
      if (montant <= 0) return;
      const key = keyFn(portefeuille);
      map[key] = (map[key] || 0) + montant;
    });
    const total = Object.values(map).reduce(
      (somme, montant) => somme + montant,
      0
    );
    return Object.entries(map)
      .map(([name, montant]) => ({
        name,
        montant,
        value: total > 0 ? Number(((montant / total) * 100).toFixed(1)) : 0,
        devise,
      }))
      .sort((a, b) => b.montant - a.montant);
  };

  const allocationParPays = allocationActifSelectionne
    ? construireRepartitionAllocation(
        (portefeuille) => portefeuille.pays,
        allocationActifSelectionne
      )
    : [];

  const allocationParSgi =
    allocationActifSelectionne && allocationPaysSelectionne
      ? construireRepartitionAllocation(
          (portefeuille) => portefeuille.sgi,
          allocationActifSelectionne,
          (portefeuille) => portefeuille.pays === allocationPaysSelectionne
        )
      : [];

  const choisirActifAllocation = (part) => {
    setAllocationActifSelectionne(part.name);
    setAllocationPaysSelectionne(null);
  };

  const niveauAllocation = allocationPaysSelectionne
    ? 'sgi'
    : allocationActifSelectionne
    ? 'pays'
    : 'actif';

  const allocationAffichee =
    niveauAllocation === 'sgi'
      ? allocationParSgi
      : niveauAllocation === 'pays'
      ? allocationParPays
      : allocation;

  const titreAllocation =
    niveauAllocation === 'sgi'
      ? `Allocation par SGI — ${allocationPaysSelectionne}`
      : niveauAllocation === 'pays'
      ? `Allocation par pays — ${allocationActifSelectionne}`
      : "Allocation par type d'actif";

  const montantTotalAllocation = allocationAffichee.reduce(
    (somme, part) => somme + Number(part.montant || 0),
    0
  );

  const libelleMontantTotalAllocation =
    niveauAllocation === 'sgi'
      ? `Total ${allocationActifSelectionne} · ${allocationPaysSelectionne}`
      : niveauAllocation === 'pays'
      ? `Total ${allocationActifSelectionne}`
      : 'Patrimoine consolidé';

  const sousTitreAllocation =
    niveauAllocation === 'sgi'
      ? `${allocationActifSelectionne} · ${allocationPaysSelectionne}`
      : niveauAllocation === 'pays'
      ? `Répartition de ${allocationActifSelectionne} par pays`
      : "Cliquez sur un type d'actif pour afficher sa répartition par pays.";

  const gererClicAllocation =
    niveauAllocation === 'actif'
      ? choisirActifAllocation
      : niveauAllocation === 'pays'
      ? (part) => setAllocationPaysSelectionne(part.name)
      : undefined;

  const revenirAllocation = () => {
    if (allocationPaysSelectionne) {
      setAllocationPaysSelectionne(null);
      return;
    }
    if (allocationActifSelectionne) {
      setAllocationActifSelectionne(null);
    }
  };

  const ordresOuverts = orders.filter((ordre) =>
    ['En attente', 'En cours'].includes(ordre.statut)
  ).length;
  const revenus30j = CLIENT_CASHFLOWS.reduce(
    (somme, flux) => somme + convertCurrency(flux.montant, flux.devise, devise),
    0
  );

  return (
    <div className="space-y-5">
      <ClientBreadcrumb items={['Espace Client', 'Vue consolidée']} />

      <MarketTicker
        onViewAll={() => goClient('client-markets')}
        onInstrumentClick={(m) =>
          goClient('client-market-depth', {
            instrument: m.nom,
            marche: m.marche,
          })
        }
      />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Eyebrow>Gestion libre multi-SGI</Eyebrow>
          <h2
            className="text-2xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Bonjour {CLIENT_GESTION_LIBRE.nom}
          </h2>
          <div className="text-sm mt-1" style={{ color: C.sub }}>
            Une vue unique de vos portefeuilles détenus auprès de plusieurs SGI
            sur les marchés financier africains.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: C.sub }}>
            Devise consolidée
          </span>
          <select
            value={devise}
            onChange={(e) => onDeviseChange(e.target.value)}
            className="px-3 py-2 rounded-xl border text-sm"
            style={{ borderColor: C.line, background: '#fff' }}
          >
            {Object.keys(FX).map((code) => (
              <option key={code}>{code}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs" style={{ color: C.sub }}>
            Patrimoine consolidé
          </div>
          <div className="text-xl font-bold mt-1" style={F_DISPLAY}>
            {fmt(Math.round(patrimoine))} {devise}
          </div>
          <div className="text-[10px] mt-1" style={{ color: C.sub }}>
            {portefeuilles.length} portefeuilles · {nombreSgi} SGI ·{' '}
            {nombrePays} pays
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs" style={{ color: C.sub }}>
            Performance YTD pondérée
          </div>
          <div className="mt-1">
            <Pct v={perfPonderee} />
          </div>
          <div className="text-[10px] mt-2" style={{ color: C.sub }}>
            Pondération par la valeur de chaque portefeuille
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs" style={{ color: C.sub }}>
            Liquidité disponible
          </div>
          <div className="text-xl font-bold mt-1" style={F_DISPLAY}>
            {fmt(Math.round(liquiditeDisponible))} {devise}
          </div>
          <div className="text-[10px] mt-1" style={{ color: C.sub }}>
            {patrimoine > 0
              ? ((liquiditeDisponible / patrimoine) * 100).toFixed(1)
              : '0.0'}
            % du patrimoine · {fmt(Math.round(liquiditeReservee))} {devise}{' '}
            réservé(s)
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs" style={{ color: C.sub }}>
            Revenus & ordres à suivre
          </div>
          <div className="flex items-end justify-between gap-2 mt-1">
            <div className="text-lg font-bold" style={F_DISPLAY}>
              {fmt(Math.round(revenus30j))} {devise}
            </div>
            <Badge tone={ordresOuverts > 0 ? 'gold' : 'teal'}>
              {ordresOuverts} ordre(s)
            </Badge>
          </div>
          <div className="text-[10px] mt-1" style={{ color: C.sub }}>
            Revenus financiers attendus dans les prochaines échéances
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-0 overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <Eyebrow>Mes portefeuilles par SGI</Eyebrow>
              <div className="text-xs" style={{ color: C.sub }}>
                Valeur, performance et liquidité consolidées par intermédiaire.
              </div>
            </div>
            <button
              onClick={() => goClient('client-portfolios')}
              className="text-xs font-semibold"
              style={{ color: C.navy }}
            >
              Voir le détail →
            </button>
          </div>
          <table className="w-full">
            <thead style={{ background: '#FAFAFC' }}>
              <tr>
                <Th>SGI / pays</Th>
                <Th>Marché</Th>
                <Th>Valeur</Th>
                <Th>Perf. YTD</Th>
                <Th>Liquidité</Th>
              </tr>
            </thead>
            <tbody>
              {portefeuilles.map((portefeuille) => (
                <tr
                  key={portefeuille.id}
                  style={{ borderTop: `1px solid ${C.line}` }}
                >
                  <Td>
                    <div className="font-semibold">{portefeuille.sgi}</div>
                    <div className="text-xs" style={{ color: C.sub }}>
                      {portefeuille.pays}
                    </div>
                  </Td>
                  <Td>
                    <Badge tone="navy">
                      {portefeuille.marche} · {portefeuille.devise}
                    </Badge>
                  </Td>
                  <Td mono>
                    {fmt(
                      Math.round(clientPortfolioValueIn(portefeuille, devise))
                    )}{' '}
                    {devise}
                  </Td>
                  <Td>
                    <Pct v={portefeuille.perfYtd} />
                  </Td>
                  <Td mono>
                    {fmt(Math.round(clientCashIn(portefeuille, devise)))}{' '}
                    {devise}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Eyebrow>Allocation consolidée</Eyebrow>
              <div className="text-xs font-semibold" style={{ color: C.ink }}>
                {titreAllocation}
              </div>
              <div
                className="text-[10px] mt-0.5"
                style={{ color: C.sub, ...F_BODY }}
              >
                {sousTitreAllocation}
              </div>
            </div>
            {niveauAllocation !== 'actif' && (
              <button
                type="button"
                onClick={revenirAllocation}
                className="text-[10px] font-semibold whitespace-nowrap px-2.5 py-1.5 rounded-lg border"
                style={{
                  color: C.navy,
                  borderColor: C.line,
                  background: '#fff',
                }}
              >
                ← Retour
              </button>
            )}
          </div>

          <div
            className="mt-3 px-3 py-2.5 rounded-xl border flex items-end justify-between gap-3"
            style={{ borderColor: C.line, background: '#FAFAFC' }}
          >
            <div>
              <div
                className="text-[10px] font-semibold uppercase tracking-wide"
                style={{ color: C.sub, ...F_BODY }}
              >
                {libelleMontantTotalAllocation}
              </div>
              <div
                className="text-lg font-bold mt-0.5"
                style={{ color: C.ink, ...F_DISPLAY }}
              >
                {fmt(Math.round(montantTotalAllocation))} {devise}
              </div>
            </div>
            <Badge tone="navy">100% du niveau</Badge>
          </div>

          <div className="mt-3">
            {allocationAffichee.length > 0 ? (
              <>
                <Donut
                  data={allocationAffichee}
                  size={150}
                  onSliceClick={gererClicAllocation}
                />
                <Legende data={allocationAffichee} />
              </>
            ) : (
              <div
                className="text-xs py-6 text-center"
                style={{ color: C.sub }}
              >
                Aucune exposition disponible pour cette sélection.
              </div>
            )}
          </div>

          <div
            className="mt-3 pt-3 flex items-center justify-between gap-2 text-[10px]"
            style={{
              borderTop: `1px solid ${C.line}`,
              color: C.sub,
              ...F_BODY,
            }}
          >
            <span>
              {niveauAllocation === 'actif'
                ? "Niveau 1/3 · Type d'actif"
                : niveauAllocation === 'pays'
                ? 'Niveau 2/3 · Pays'
                : 'Niveau 3/3 · SGI'}
            </span>
            {niveauAllocation !== 'sgi' && (
              <span>Cliquez sur une part pour approfondir</span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ClientPortfolios({ devise, orders }) {
  const portefeuilles = CLIENT_GESTION_LIBRE.portefeuilles;
  const [paysFiltre, setPaysFiltre] = useState('Tous');

  const paysDisponibles = [
    'Tous',
    ...new Set(
      portefeuilles
        .map((portefeuille) => portefeuille.pays)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, 'fr'))
    ),
  ];

  const portefeuillesFiltres = portefeuilles.filter(
    (portefeuille) => paysFiltre === 'Tous' || portefeuille.pays === paysFiltre
  );

  return (
    <div className="space-y-5">
      <ClientBreadcrumb items={['Espace Client', 'Mes portefeuilles & SGI']} />
      <div>
        <h2
          className="text-xl font-bold"
          style={{ ...F_DISPLAY, color: C.ink }}
        >
          Mes portefeuilles & SGI
        </h2>
        <div className="text-xs mt-1" style={{ color: C.sub }}>
          Une fiche par compte-titres afin de conserver la vision de
          l'intermédiaire, de la devise et du marché d'origine, avec distinction
          entre espèces disponibles et espèces déjà mobilisées par des achats
          non exécutés.
        </div>
      </div>

      <Card className="p-4" style={{ borderColor: '#D8DFEF' }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="min-w-[240px]">
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Filtrer les portefeuilles par pays
            </label>
            <select
              value={paysFiltre}
              onChange={(e) => setPaysFiltre(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line, background: '#fff', ...F_BODY }}
            >
              {paysDisponibles.map((pays) => (
                <option key={pays} value={pays}>
                  {pays === 'Tous' ? 'Tous les pays' : pays}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone={paysFiltre === 'Tous' ? 'slate' : 'gold'}>
              {paysFiltre === 'Tous' ? 'Tous les pays' : paysFiltre}
            </Badge>
            <Badge tone="navy">
              {portefeuillesFiltres.length} portefeuille(s)
            </Badge>
            <Badge tone="teal">
              {new Set(portefeuillesFiltres.map((p) => p.sgi)).size} SGI
            </Badge>
            {paysFiltre !== 'Tous' && (
              <button
                type="button"
                onClick={() => setPaysFiltre('Tous')}
                className="px-3 py-2 rounded-xl border text-xs font-semibold"
                style={{
                  borderColor: C.line,
                  color: C.navy,
                  background: '#fff',
                  ...F_BODY,
                }}
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        <div className="text-[11px] mt-3" style={{ color: C.sub, ...F_BODY }}>
          Le filtre agit uniquement sur vos propres comptes de Gestion libre et
          conserve les montants dans la devise native de chaque portefeuille,
          avec l'équivalent dans la devise de vue lorsque nécessaire.
        </div>
      </Card>

      {portefeuillesFiltres.length === 0 && (
        <Card className="p-6 text-center">
          <div className="text-sm font-semibold" style={{ color: C.ink }}>
            Aucun portefeuille pour ce pays
          </div>
          <div className="text-xs mt-1" style={{ color: C.sub }}>
            Sélectionnez un autre pays ou réinitialisez le filtre.
          </div>
        </Card>
      )}

      {portefeuillesFiltres.map((portefeuille) => {
        const total = clientPortfolioValue(portefeuille);
        const liquiditeTotale = Number(portefeuille.compteEspeces || 0);
        const liquiditeReservee = clientReservedCash(portefeuille, orders);
        const liquiditeDisponible = clientAvailableCash(portefeuille, orders);
        const ordresAchatOuverts = orders.filter(
          (ordre) =>
            ordre.portefeuilleId === portefeuille.id &&
            ordre.sens === 'Achat' &&
            CLIENT_OPEN_ORDER_STATUSES.includes(ordre.statut)
        ).length;
        const ordresVenteOuverts = orders.filter(
          (ordre) =>
            ordre.portefeuilleId === portefeuille.id &&
            ordre.sens === 'Vente' &&
            CLIENT_OPEN_ORDER_STATUSES.includes(ordre.statut)
        ).length;

        return (
          <Card
            key={portefeuille.id}
            className="p-0 overflow-hidden"
            style={{ borderColor: C.gold }}
          >
            <div
              className="p-4 flex items-start justify-between gap-4"
              style={{ background: '#FBF7EE' }}
            >
              <div>
                <div className="text-base font-bold" style={F_DISPLAY}>
                  {portefeuille.nom}
                </div>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <Badge tone="navy">{portefeuille.sgi}</Badge>
                  <Badge tone="slate">{portefeuille.pays}</Badge>
                  <Badge tone="slate">
                    {portefeuille.marche} · {portefeuille.devise}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: C.sub }}>
                  Valeur du portefeuille
                </div>
                <div className="text-lg font-bold" style={F_DISPLAY}>
                  {fmt(Math.round(total))} {portefeuille.devise}
                </div>
                {portefeuille.devise !== devise && (
                  <div className="text-[10px]" style={{ color: C.sub }}>
                    ≈{' '}
                    {fmt(
                      Math.round(clientPortfolioValueIn(portefeuille, devise))
                    )}{' '}
                    {devise}
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ background: '#FAFAFC' }}>
                  <tr>
                    <Th>Instrument</Th>
                    <Th>Classe</Th>
                    <Th>Quantité</Th>
                    <Th>PRU</Th>
                    <Th>Cours</Th>
                    <Th>Valeur</Th>
                    <Th>Plus/Moins-value</Th>
                    <Th>Poids</Th>
                  </tr>
                </thead>
                <tbody>
                  {portefeuille.lignes.map((ligne) => {
                    const marche = clientMarket(ligne.instrument);
                    const cours = Number(marche?.cours || ligne.pru);
                    const valeur = clientLineValue(ligne);
                    const perf =
                      ligne.pru > 0
                        ? ((cours - ligne.pru) / ligne.pru) * 100
                        : 0;
                    return (
                      <tr
                        key={ligne.instrument}
                        style={{ borderTop: `1px solid ${C.line}` }}
                      >
                        <Td className="font-semibold">{ligne.instrument}</Td>
                        <Td>
                          <Badge tone="slate">
                            {clientAssetClass(ligne.instrument)}
                          </Badge>
                        </Td>
                        <Td mono>{fmt(ligne.qte)}</Td>
                        <Td mono>
                          {fmtPrice(ligne.pru)} {portefeuille.devise}
                        </Td>
                        <Td mono>
                          {fmtPrice(cours)} {portefeuille.devise}
                        </Td>
                        <Td mono>
                          {fmt(Math.round(valeur))} {portefeuille.devise}
                        </Td>
                        <Td>
                          <Pct v={perf} />
                        </Td>
                        <Td mono>
                          {total > 0
                            ? ((valeur / total) * 100).toFixed(1)
                            : '0.0'}
                          %
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div
              className="p-4"
              style={{
                borderTop: `1px solid ${C.line}`,
                background: '#FCFCFD',
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <Eyebrow>Compte espèces</Eyebrow>
                  <div className="text-[11px]" style={{ color: C.sub }}>
                    La liquidité disponible est immédiatement investissable. La
                    liquidité réservée correspond aux ordres d'achat ouverts
                    mais pas encore exécutés.
                  </div>
                </div>
                <Badge tone="navy">
                  {total > 0
                    ? ((liquiditeTotale / total) * 100).toFixed(1)
                    : '0.0'}
                  % du portefeuille
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div
                  className="p-3 rounded-xl border"
                  style={{ borderColor: '#CFE9DF', background: '#F3FBF8' }}
                >
                  <div
                    className="text-[11px] font-semibold"
                    style={{ color: C.teal }}
                  >
                    Liquidité disponible
                  </div>
                  <div
                    className="text-lg font-bold mt-1"
                    style={{ ...F_DISPLAY, color: C.ink }}
                  >
                    {fmt(Math.round(liquiditeDisponible))} {portefeuille.devise}
                  </div>
                  <div className="text-[10px] mt-1" style={{ color: C.sub }}>
                    Montant utilisable pour de nouveaux investissements
                  </div>
                </div>

                <div
                  className="p-3 rounded-xl border"
                  style={{ borderColor: '#EAD9AD', background: '#FFFBF1' }}
                >
                  <div
                    className="text-[11px] font-semibold"
                    style={{ color: '#8A6A16' }}
                  >
                    Liquidité réservée
                  </div>
                  <div
                    className="text-lg font-bold mt-1"
                    style={{ ...F_DISPLAY, color: C.ink }}
                  >
                    {fmt(Math.round(liquiditeReservee))} {portefeuille.devise}
                  </div>
                  <div className="text-[10px] mt-1" style={{ color: C.sub }}>
                    {ordresAchatOuverts} ordre(s) d'achat ouvert(s)
                  </div>
                </div>

                <div
                  className="p-3 rounded-xl border"
                  style={{ borderColor: C.line, background: '#fff' }}
                >
                  <div
                    className="text-[11px] font-semibold"
                    style={{ color: C.navy }}
                  >
                    Liquidité totale
                  </div>
                  <div
                    className="text-lg font-bold mt-1"
                    style={{ ...F_DISPLAY, color: C.ink }}
                  >
                    {fmt(Math.round(liquiditeTotale))} {portefeuille.devise}
                  </div>
                  <div className="text-[10px] mt-1" style={{ color: C.sub }}>
                    Disponible + réservée
                  </div>
                </div>
              </div>

              {ordresVenteOuverts > 0 && (
                <div
                  className="text-[10px] mt-3 p-2.5 rounded-xl"
                  style={{ background: '#EFF3FB', color: C.sub }}
                >
                  {ordresVenteOuverts} ordre(s) de vente ouvert(s) : les titres
                  concernés sont réservés, mais ils ne diminuent pas le compte
                  espèces tant que la vente n'est pas exécutée.
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function ClientInvest({ goClient, onCreateOrder, orders, initialInstrument }) {
  const instrumentInitial = clientMarket(initialInstrument) || MARKETS_DATA[0];
  const [instrument, setInstrument] = useState(instrumentInitial.nom);
  const marche = clientMarket(instrument) || MARKETS_DATA[0];
  const portefeuillesEligibles = CLIENT_GESTION_LIBRE.portefeuilles.filter(
    (portefeuille) => portefeuille.marche === marche.marche
  );
  const [portefeuilleId, setPortefeuilleId] = useState(
    portefeuillesEligibles[0]?.id || ''
  );
  const [sens, setSens] = useState('Achat');
  const [qte, setQte] = useState(100);
  const [typeOrdre, setTypeOrdre] = useState('Ordre limite');
  const [prixLimite, setPrixLimite] = useState(marche.cours);
  const [message, setMessage] = useState('');

  const portefeuilleCourant =
    portefeuillesEligibles.find((p) => p.id === portefeuilleId) ||
    portefeuillesEligibles[0];

  const changerInstrument = (nom) => {
    const nouveauMarche = clientMarket(nom);
    setInstrument(nom);
    setPrixLimite(Number(nouveauMarche?.cours || 0));
    const premier = CLIENT_GESTION_LIBRE.portefeuilles.find(
      (portefeuille) => portefeuille.marche === nouveauMarche?.marche
    );
    setPortefeuilleId(premier?.id || '');
    setMessage('');
  };

  const prixEstime =
    typeOrdre === 'Ordre au marché' ? marche.cours : Number(prixLimite || 0);
  const montantEstime = Number(qte || 0) * prixEstime;
  const position =
    portefeuilleCourant?.lignes.find((ligne) => ligne.instrument === instrument)
      ?.qte || 0;
  const cashTotal = portefeuilleCourant?.compteEspeces || 0;
  const cashReserve = portefeuilleCourant
    ? clientReservedCash(portefeuilleCourant, orders)
    : 0;
  const cash = portefeuilleCourant
    ? clientAvailableCash(portefeuilleCourant, orders)
    : 0;
  const achatPossible = sens !== 'Achat' || montantEstime <= cash;
  const ventePossible = sens !== 'Vente' || Number(qte || 0) <= position;
  const ordreValide =
    Boolean(portefeuilleCourant) &&
    Number(qte) > 0 &&
    prixEstime > 0 &&
    achatPossible &&
    ventePossible;

  const envoyerOrdre = () => {
    if (!ordreValide) {
      setMessage(
        sens === 'Achat' && !achatPossible
          ? 'Liquidité insuffisante sur le compte espèces de cette SGI.'
          : sens === 'Vente' && !ventePossible
          ? 'Quantité à vendre supérieure à la position disponible.'
          : "Vérifiez les paramètres de l'ordre."
      );
      return;
    }
    onCreateOrder({
      portefeuilleId: portefeuilleCourant.id,
      instrument,
      marche: marche.marche,
      devise: marche.devise,
      sens,
      qte: Number(qte),
      typeOrdre,
      prix: prixEstime,
      statut: 'En attente',
    });
    goClient('client-orders');
  };

  return (
    <div className="space-y-5">
      <ClientBreadcrumb items={['Espace Client', 'Marchés & investir']} />
      <div>
        <h2
          className="text-xl font-bold"
          style={{ ...F_DISPLAY, color: C.ink }}
        >
          Marchés & investir
        </h2>
        <div className="text-xs mt-1" style={{ color: C.sub }}>
          Sélectionnez un actif : la plateforme rattache automatiquement l'ordre
          à votre portefeuille et à votre SGI du marché concerné.
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-0 overflow-hidden">
          <div className="p-4">
            <Eyebrow>Instruments accessibles via vos SGI</Eyebrow>
          </div>
          <table className="w-full">
            <thead style={{ background: '#FAFAFC' }}>
              <tr>
                <Th>Instrument</Th>
                <Th>Marché</Th>
                <Th>Cours</Th>
                <Th>Variation</Th>
                <Th>Portefeuille / SGI</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {MARKETS_DATA.map((item) => {
                const pfsCompatibles =
                  CLIENT_GESTION_LIBRE.portefeuilles.filter(
                    (portefeuille) => portefeuille.marche === item.marche
                  );
                return (
                  <tr
                    key={item.nom}
                    style={{
                      borderTop: `1px solid ${C.line}`,
                      background: item.nom === instrument ? '#FBF7EE' : '#fff',
                    }}
                  >
                    <Td className="font-semibold">{item.nom}</Td>
                    <Td>
                      <Badge tone="navy">{item.marche}</Badge>
                    </Td>
                    <Td mono>
                      {fmtPrice(item.cours)} {item.devise}
                    </Td>
                    <Td>
                      <Pct v={item.variation} />
                    </Td>
                    <Td>
                      <div className="text-xs font-semibold">
                        {pfsCompatibles.length > 0
                          ? `${pfsCompatibles.length} SGI compatibles`
                          : '—'}
                      </div>
                      <div className="text-[10px]" style={{ color: C.sub }}>
                        {pfsCompatibles.length > 0
                          ? pfsCompatibles.map((pf) => pf.sgi).join(' · ')
                          : 'Aucun compte compatible'}
                      </div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3 flex-wrap">
                        <button
                          type="button"
                          onClick={() =>
                            goClient('client-market-depth', {
                              instrument: item.nom,
                              marche: item.marche,
                            })
                          }
                          className="text-xs font-semibold whitespace-nowrap"
                          style={{ color: C.indigo }}
                        >
                          Profondeur →
                        </button>
                        <button
                          type="button"
                          onClick={() => changerInstrument(item.nom)}
                          className="text-xs font-semibold whitespace-nowrap"
                          style={{ color: C.navy }}
                        >
                          Préparer un ordre →
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <Card className="p-5" style={{ borderColor: C.gold }}>
          <Eyebrow>Ticket d'ordre</Eyebrow>

          <label
            className="text-xs font-semibold block mb-1"
            style={{ color: C.sub }}
          >
            Instrument
          </label>
          <select
            value={instrument}
            onChange={(e) => changerInstrument(e.target.value)}
            className="w-full mb-3 px-3 py-2 rounded-xl border text-sm"
            style={{ borderColor: C.line }}
          >
            {MARKETS_DATA.map((item) => (
              <option key={item.nom}>{item.nom}</option>
            ))}
          </select>

          <label
            className="text-xs font-semibold block mb-1"
            style={{ color: C.sub }}
          >
            Portefeuille / SGI
          </label>
          <select
            value={portefeuilleCourant?.id || ''}
            onChange={(e) => setPortefeuilleId(e.target.value)}
            className="w-full mb-3 px-3 py-2 rounded-xl border text-sm"
            style={{ borderColor: C.line }}
          >
            {portefeuillesEligibles.map((portefeuille) => (
              <option key={portefeuille.id} value={portefeuille.id}>
                {portefeuille.sgi} — {portefeuille.nom}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {['Achat', 'Vente'].map((value) => (
              <button
                key={value}
                onClick={() => {
                  setSens(value);
                  setMessage('');
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold"
                style={{
                  background:
                    sens === value
                      ? value === 'Achat'
                        ? C.teal
                        : C.coral
                      : '#EEF0F4',
                  color: sens === value ? '#fff' : C.sub,
                }}
              >
                {value}
              </button>
            ))}
          </div>

          <label
            className="text-xs font-semibold block mb-1"
            style={{ color: C.sub }}
          >
            Type d'ordre
          </label>
          <select
            value={typeOrdre}
            onChange={(e) => setTypeOrdre(e.target.value)}
            className="w-full mb-3 px-3 py-2 rounded-xl border text-sm"
            style={{ borderColor: C.line }}
          >
            <option>Ordre au marché</option>
            <option>Ordre limite</option>
          </select>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label
                className="text-xs font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Quantité
              </label>
              <input
                type="number"
                min="1"
                value={qte}
                onChange={(e) => setQte(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border text-sm"
                style={{ borderColor: C.line, ...F_MONO }}
              />
            </div>
            <div>
              <label
                className="text-xs font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Prix limite
              </label>
              <input
                type="number"
                step="0.01"
                disabled={typeOrdre === 'Ordre au marché'}
                value={prixLimite}
                onChange={(e) => setPrixLimite(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border text-sm"
                style={{
                  borderColor: C.line,
                  opacity: typeOrdre === 'Ordre au marché' ? 0.55 : 1,
                  ...F_MONO,
                }}
              />
            </div>
          </div>

          <div
            className="p-3 rounded-xl text-xs mb-3"
            style={{ background: '#EFF3FB', color: C.ink }}
          >
            <div className="flex justify-between">
              <span>Montant estimé</span>
              <b style={F_MONO}>
                {fmt(Math.round(montantEstime))} {marche.devise}
              </b>
            </div>
            <div className="flex justify-between mt-1">
              <span>Liquidité disponible</span>
              <span style={F_MONO}>
                {fmt(Math.round(cash))}{' '}
                {portefeuilleCourant?.devise || marche.devise}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Liquidité réservée</span>
              <span style={F_MONO}>
                {fmt(Math.round(cashReserve))}{' '}
                {portefeuilleCourant?.devise || marche.devise}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Liquidité totale</span>
              <span style={F_MONO}>
                {fmt(Math.round(cashTotal))}{' '}
                {portefeuilleCourant?.devise || marche.devise}
              </span>
            </div>
            {sens === 'Vente' && (
              <div className="flex justify-between mt-1">
                <span>Position disponible</span>
                <span style={F_MONO}>{fmt(position)} titre(s)</span>
              </div>
            )}
          </div>

          {message && (
            <div
              className="text-xs p-2.5 rounded-xl mb-3"
              style={{ background: '#FBE9E7', color: C.coral }}
            >
              {message}
            </div>
          )}

          <Btn onClick={envoyerOrdre}>
            Envoyer l'ordre à {portefeuilleCourant?.sgi || 'la SGI'}
          </Btn>
          <div className="text-[10px] mt-2" style={{ color: C.sub }}>
            Prototype : l'ordre est enregistré dans l'espace client. En
            production, l'envoi devra être confirmé par l'API ou le workflow de
            la SGI concernée.
          </div>
        </Card>
      </div>
    </div>
  );
}

function ClientMarkets({
  goClient,
  watchlistTitles,
  onAddWatch,
  onRemoveWatch,
}) {
  const [typeActif, setTypeActif] = useState('Action');
  const [marche, setMarche] = useState('Tous');
  const [recherche, setRecherche] = useState('');
  const [secteur, setSecteur] = useState('Tous');

  const univers = MARKETS_DATA.filter(
    (item) =>
      item.type === typeActif && (marche === 'Tous' || item.marche === marche)
  ).map((item) => ({ ...item, secteur: clientSector(item.nom) }));

  const secteurs = ['Tous', ...new Set(univers.map((item) => item.secteur))];
  const rows = univers.filter(
    (item) =>
      item.nom.toLowerCase().includes(recherche.toLowerCase()) &&
      (secteur === 'Tous' || item.secteur === secteur)
  );

  const changerType = (value) => {
    setTypeActif(value);
    setSecteur('Tous');
  };
  const changerMarche = (value) => {
    setMarche(value);
    setSecteur('Tous');
  };

  return (
    <div className="space-y-5">
      <ClientBreadcrumb items={['Espace Client', 'Vues  des Marchés']} />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Vues des Marchés
          </h2>
          <div className="text-xs mt-1" style={{ color: C.sub }}>
            Consultez les instruments accessibles via vos SGI, ajoutez-les à
            votre watchlist personnelle, ouvrez la profondeur de marché ou
            préparez un ordre.
          </div>
        </div>
        <Badge tone="gold">{rows.length} instrument(s)</Badge>
      </div>

      <Card className="p-4" style={{ borderColor: '#D8DFEF' }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <div
                className="text-[10px] uppercase font-semibold mb-1"
                style={{ color: C.sub }}
              >
                Type d'actif
              </div>
              <div className="flex gap-1.5">
                {['Action', 'Obligation'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => changerType(type)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: typeActif === type ? C.navy : '#F0F1F5',
                      color: typeActif === type ? '#fff' : C.sub,
                    }}
                  >
                    {type === 'Action' ? 'Actions' : 'Obligations'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div
                className="text-[10px] uppercase font-semibold mb-1"
                style={{ color: C.sub }}
              >
                Marché
              </div>
              <div className="flex gap-1.5">
                {['Tous', 'BRVM', 'NGX', 'GSE'].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => changerMarche(code)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: marche === code ? C.navy : '#F0F1F5',
                      color: marche === code ? '#fff' : C.sub,
                    }}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 min-w-[390px]">
            <div>
              <label
                className="text-[10px] uppercase font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Secteur
              </label>
              <select
                value={secteur}
                onChange={(e) => setSecteur(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs"
                style={{ borderColor: C.line, background: '#fff' }}
              >
                {secteurs.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="text-[10px] uppercase font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Instrument
              </label>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                style={{ borderColor: C.line }}
              >
                <Search size={13} color={C.sub} />
                <input
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder="Rechercher…"
                  className="w-full text-xs outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 1450 }}>
            <thead style={{ background: '#FAFAFC' }}>
              <tr>
                <Th>Instrument</Th>
                <Th>Secteur</Th>
                <Th>Marché</Th>
                <Th>Cours</Th>
                <Th>Volume jour</Th>
                <Th>Var %</Th>
                <Th>Cours min</Th>
                <Th>Cours max</Th>
                <Th>SGI accessibles</Th>
                <Th>Watchlist</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center py-8 text-sm"
                    style={{ color: C.sub }}
                  >
                    Aucun instrument ne correspond aux filtres sélectionnés.
                  </td>
                </tr>
              )}
              {rows.map((item, index) => {
                const compatibles = CLIENT_GESTION_LIBRE.portefeuilles.filter(
                  (pf) => pf.marche === item.marche
                );
                const suivi = watchlistTitles.includes(item.nom);
                return (
                  <tr
                    key={item.nom}
                    style={{
                      borderTop: `1px solid ${C.line}`,
                      background: index % 2 ? '#FCFCFD' : '#fff',
                    }}
                  >
                    <Td className="font-semibold whitespace-nowrap">
                      {item.nom}
                    </Td>
                    <Td>{item.secteur}</Td>
                    <Td>
                      <Badge tone="navy">{item.marche}</Badge>
                    </Td>
                    <Td mono className="whitespace-nowrap">
                      {fmtPrice(item.cours)} {item.devise}
                    </Td>
                    <Td mono>{fmt(item.volumeJour)}</Td>
                    <Td>
                      <Pct v={item.variation} />
                    </Td>
                    <Td mono>
                      {fmtPrice(item.coursMin)} {item.devise}
                    </Td>
                    <Td mono>
                      {fmtPrice(item.coursMax)} {item.devise}
                    </Td>
                    <Td>
                      <div className="font-semibold text-xs">
                        {compatibles.length} SGI
                      </div>
                      <div
                        className="text-[10px] mt-0.5"
                        style={{ color: C.sub }}
                      >
                        {compatibles.map((pf) => pf.sgi).join(' · ')}
                      </div>
                    </Td>
                    <Td>
                      <button
                        type="button"
                        onClick={() =>
                          suivi ? onRemoveWatch(item.nom) : onAddWatch(item.nom)
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap"
                        style={{
                          background: suivi ? '#E4F5EF' : '#FBF1DD',
                          color: suivi ? C.teal : '#8A6A16',
                        }}
                      >
                        <Star
                          size={13}
                          fill={suivi ? 'currentColor' : 'none'}
                        />
                        {suivi ? 'Suivi' : 'Ajouter'}
                      </button>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            goClient('client-market-depth', {
                              instrument: item.nom,
                              marche: item.marche,
                            })
                          }
                          className="text-xs font-semibold"
                          style={{ color: C.indigo }}
                        >
                          Profondeur →
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            goClient('client-invest', {
                              instrument: item.nom,
                              marche: item.marche,
                            })
                          }
                          className="text-xs font-semibold"
                          style={{ color: C.navy }}
                        >
                          Préparer un ordre →
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="text-[10px]" style={{ color: C.sub }}>
        Les cours et profondeurs sont des données de démonstration dans ce
        prototype. L'accès à un instrument est déterminé par l'existence d'au
        moins un compte SGI compatible avec son marché.
      </div>
    </div>
  );
}

function ClientWatchlist({
  goClient,
  watchlistTitles,
  onAddWatch,
  onRemoveWatch,
}) {
  const now = new Date();
  const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(now.getDate()).padStart(2, '0')}`;
  const dateLabel = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(now);

  const defaultDailyFilters = {
    marche: 'Tous',
    secteur: 'Tous',
    mm: 'Tous',
    macd: 'Tous',
    rsiMin: '0',
    rsiMax: '100',
    bol: 'Tous',
    signalTechnique: 'Tous',
    perMax: '',
    rentabiliteMin: '',
    evolMin: '',
    valorisation: 'Tous',
    signalFondamental: 'Tous',
  };
  const [dailyFilters, setDailyFilters] = useState(defaultDailyFilters);
  const [showDailyFilters, setShowDailyFilters] = useState(true);

  const marchesClient = new Set(
    CLIENT_GESTION_LIBRE.portefeuilles.map(
      (portefeuille) => portefeuille.marche
    )
  );

  const staticRows = watchlistTitles
    .map((titre) => {
      const row = buildStaticWatchlistRow(titre);
      const market = clientMarket(titre);
      if (!row || !market || !marchesClient.has(market.marche)) return null;
      return {
        ...row,
        type: market.type,
        cours: market.cours,
        variation: market.variation,
        devise: market.devise,
        compatibles: CLIENT_GESTION_LIBRE.portefeuilles.filter(
          (pf) => pf.marche === market.marche
        ),
      };
    })
    .filter(Boolean);

  const dailyRows = buildWatchlistJournaliere(dateKey)
    .filter((row) => marchesClient.has(row.marche))
    .map((row) => ({
      ...row,
      compatibles: CLIENT_GESTION_LIBRE.portefeuilles.filter(
        (pf) => pf.marche === row.marche
      ),
    }));

  const marches = ['Tous', ...new Set(dailyRows.map((r) => r.marche))];
  const secteurs = ['Tous', ...new Set(dailyRows.map((r) => r.secteur))];
  const macdOptions = [
    'Tous',
    ...new Set(dailyRows.map((r) => r.technique.macd)),
  ];
  const bolOptions = [
    'Tous',
    ...new Set(dailyRows.map((r) => r.technique.bol)),
  ];
  const signauxTechniques = [
    'Tous',
    ...new Set(dailyRows.map((r) => r.technique.signal)),
  ];
  const valorisations = [
    'Tous',
    ...new Set(dailyRows.map((r) => r.fondamentale.valo)),
  ];
  const signauxFondamentaux = [
    'Tous',
    ...new Set(dailyRows.map((r) => r.fondamentale.signal)),
  ];

  const mmDirection = (mm) =>
    mm.includes('>') ? 'Haussière' : mm.includes('<') ? 'Baissière' : 'Neutre';

  const rowsJour = dailyRows.filter((r) => {
    const perMax =
      dailyFilters.perMax === '' ? null : Number(dailyFilters.perMax);
    const rentabiliteMin =
      dailyFilters.rentabiliteMin === ''
        ? null
        : Number(dailyFilters.rentabiliteMin);
    const evolMin =
      dailyFilters.evolMin === '' ? null : Number(dailyFilters.evolMin);
    const rsiMin = Number(dailyFilters.rsiMin || 0);
    const rsiMax = Number(dailyFilters.rsiMax || 100);

    return (
      (dailyFilters.marche === 'Tous' || r.marche === dailyFilters.marche) &&
      (dailyFilters.secteur === 'Tous' || r.secteur === dailyFilters.secteur) &&
      (dailyFilters.mm === 'Tous' ||
        mmDirection(r.technique.mm) === dailyFilters.mm) &&
      (dailyFilters.macd === 'Tous' ||
        r.technique.macd === dailyFilters.macd) &&
      r.technique.rsi >= rsiMin &&
      r.technique.rsi <= rsiMax &&
      (dailyFilters.bol === 'Tous' || r.technique.bol === dailyFilters.bol) &&
      (dailyFilters.signalTechnique === 'Tous' ||
        r.technique.signal === dailyFilters.signalTechnique) &&
      (perMax === null || r.fondamentale.per <= perMax) &&
      (rentabiliteMin === null ||
        parsePctNumber(r.fondamentale.rentabilite) >= rentabiliteMin) &&
      (evolMin === null || parsePctNumber(r.fondamentale.evol) >= evolMin) &&
      (dailyFilters.valorisation === 'Tous' ||
        r.fondamentale.valo === dailyFilters.valorisation) &&
      (dailyFilters.signalFondamental === 'Tous' ||
        r.fondamentale.signal === dailyFilters.signalFondamental)
    );
  });

  const activeFilterCount = Object.entries(dailyFilters).filter(
    ([key, value]) => {
      if (
        [
          'marche',
          'secteur',
          'mm',
          'macd',
          'bol',
          'signalTechnique',
          'valorisation',
          'signalFondamental',
        ].includes(key)
      ) {
        return value !== 'Tous';
      }
      if (key === 'rsiMin') return value !== '0';
      if (key === 'rsiMax') return value !== '100';
      return value !== '';
    }
  ).length;

  const updateDailyFilter = (key, value) =>
    setDailyFilters((current) => ({ ...current, [key]: value }));

  const toneSignalJour = (signal) => {
    if (signal === 'Surveiller achat') return 'teal';
    if (signal === 'Attendre confirmation') return 'gold';
    if (signal === 'Écarter / alléger') return 'coral';
    return 'slate';
  };

  const toneSignalFondamental = (signal) => {
    if (signal === 'Acheter') return 'teal';
    if (signal === 'Vendre') return 'coral';
    return 'gold';
  };

  return (
    <div className="space-y-6">
      <ClientBreadcrumb items={['Espace Client', 'Watchlist']} />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Watchlist — sélection fondamentale &amp; signaux de marché
          </h2>
          <div className="text-xs mt-1" style={{ color: C.sub, ...F_BODY }}>
            Une watchlist statique que vous construisez vous-même et une
            watchlist journalière recalculée selon les signaux de marché
            disponibles sur les places accessibles via vos SGI.
          </div>
        </div>
        <Btn tone="ghost" onClick={() => goClient('client-markets')}>
          Ajouter depuis les marchés
        </Btn>
      </div>

      <Card className="p-0 overflow-hidden" style={{ borderColor: C.gold }}>
        <div
          className="p-5 flex items-start justify-between gap-4"
          style={{ background: '#FBF7EE' }}
        >
          <div>
            <Eyebrow>Watchlist statique — conviction fondamentale</Eyebrow>
            <div className="text-sm font-semibold" style={{ color: C.ink }}>
              Votre sélection personnelle de titres à suivre dans la durée
            </div>
            <div className="text-xs mt-1" style={{ color: C.sub }}>
              Elle est alimentée depuis « Marchés — Actions &amp; Obligations ».
              Les titres restent enregistrés jusqu'à ce que vous décidiez de les
              retirer.
            </div>
          </div>
          <Badge tone="gold">{staticRows.length} valeur(s)</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 1780 }}>
            <thead style={{ background: '#FAFAFC' }}>
              <tr>
                <Th>Instrument</Th>
                <Th>Marché</Th>
                <Th>Secteur</Th>
                <Th>Cours</Th>
                <Th>Var. jour</Th>
                <Th>PER</Th>
                <Th>Total return YTD</Th>
                <Th>EVOL</Th>
                <Th>Valorisation</Th>
                <Th>Signal fondamental</Th>
                <Th>SGI accessibles</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {staticRows.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="text-center py-9 text-sm"
                    style={{ color: C.sub }}
                  >
                    Votre watchlist statique est vide. Ajoutez un actif depuis «
                    Marchés — Actions &amp; Obligations ».
                  </td>
                </tr>
              )}
              {staticRows.map((r, i) => (
                <tr
                  key={r.titre}
                  style={{
                    borderTop: `1px solid ${C.line}`,
                    background: i % 2 ? '#FCFCFD' : '#fff',
                  }}
                >
                  <Td className="font-semibold whitespace-nowrap">{r.titre}</Td>
                  <Td>
                    <Badge tone="navy">{r.marche}</Badge>
                  </Td>
                  <Td className="whitespace-nowrap">{r.secteur}</Td>
                  <Td mono className="whitespace-nowrap">
                    {fmtPrice(r.cours)} {r.devise}
                  </Td>
                  <Td>
                    <Pct v={r.variation} />
                  </Td>
                  <Td mono>
                    {r.fondamentale.per == null
                      ? 'N/D'
                      : `${r.fondamentale.per.toFixed(1)}x`}
                  </Td>
                  <Td mono>{r.fondamentale.rentabilite}</Td>
                  <Td mono>{r.fondamentale.evol}</Td>
                  <Td className="whitespace-nowrap">{r.fondamentale.valo}</Td>
                  <Td>
                    <Badge tone={toneSignalFondamental(r.fondamentale.signal)}>
                      {r.fondamentale.signal}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="text-xs font-semibold">
                      {r.compatibles.length} SGI
                    </div>
                    <div className="text-[10px]" style={{ color: C.sub }}>
                      {r.compatibles.map((pf) => pf.sgi).join(' · ')}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() =>
                          goClient('client-market-depth', {
                            instrument: r.titre,
                            marche: r.marche,
                          })
                        }
                        className="text-xs font-semibold"
                        style={{ color: C.indigo }}
                      >
                        Profondeur →
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          goClient('client-invest', {
                            instrument: r.titre,
                            marche: r.marche,
                          })
                        }
                        className="text-xs font-semibold"
                        style={{ color: C.navy }}
                      >
                        Investir →
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveWatch(r.titre)}
                        className="inline-flex items-center gap-1 text-xs font-semibold"
                        style={{ color: C.coral }}
                      >
                        <X size={12} /> Retirer
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        className="p-0 overflow-hidden flex flex-col"
        style={{
          borderColor: C.navy,
          height: 'clamp(650px, calc(100vh - 100px), 830px)',
        }}
      >
        <div
          className="p-5 shrink-0"
          style={{
            background: '#EFF3FB',
            maxHeight: showDailyFilters ? '52%' : 'auto',
            overflowY: showDailyFilters ? 'auto' : 'visible',
            overscrollBehavior: 'contain',
            scrollbarGutter: 'stable',
          }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Eyebrow>Watchlist journalière — signaux de marché</Eyebrow>
              <div className="text-sm font-semibold" style={{ color: C.ink }}>
                Classement du {dateLabel}
              </div>
              <div className="text-xs mt-1" style={{ color: C.sub }}>
                Classement automatique des titres accessibles sur vos marchés.
                Cette liste ne modifie pas votre watchlist statique tant que
                vous n'ajoutez pas explicitement un titre.
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Badge tone="navy">Actualisation quotidienne</Badge>
              <Badge tone="gold">{rowsJour.length} valeur(s)</Badge>
              <Badge tone={activeFilterCount > 0 ? 'teal' : 'slate'}>
                {activeFilterCount} filtre(s) actif(s)
              </Badge>
              <button
                type="button"
                onClick={() => setShowDailyFilters((visible) => !visible)}
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                style={{
                  borderColor: C.line,
                  color: C.navy,
                  background: '#fff',
                }}
              >
                {showDailyFilters
                  ? 'Masquer les filtres ↑'
                  : 'Afficher les filtres ↓'}
              </button>
            </div>
          </div>

          {showDailyFilters && (
            <div
              className="mt-4 p-4 rounded-xl border"
              style={{ borderColor: '#D8DFEF', background: '#fff' }}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: C.ink }}
                  >
                    Filtres automatiques — application instantanée
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: C.sub }}>
                    Technique, fondamentale, marché et secteur.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDailyFilters(defaultDailyFilters)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                  style={{
                    borderColor: C.line,
                    color: C.navy,
                    background: '#fff',
                  }}
                >
                  Réinitialiser les filtres
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3">
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Bourse
                  </label>
                  <select
                    value={dailyFilters.marche}
                    onChange={(e) =>
                      updateDailyFilter('marche', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {marches.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Secteur
                  </label>
                  <select
                    value={dailyFilters.secteur}
                    onChange={(e) =>
                      updateDailyFilter('secteur', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {secteurs.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    MM
                  </label>
                  <select
                    value={dailyFilters.mm}
                    onChange={(e) => updateDailyFilter('mm', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {['Tous', 'Haussière', 'Neutre', 'Baissière'].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    MACD
                  </label>
                  <select
                    value={dailyFilters.macd}
                    onChange={(e) => updateDailyFilter('macd', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {macdOptions.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    BOL
                  </label>
                  <select
                    value={dailyFilters.bol}
                    onChange={(e) => updateDailyFilter('bol', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {bolOptions.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    RSI minimum
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={dailyFilters.rsiMin}
                    onChange={(e) =>
                      updateDailyFilter('rsiMin', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    RSI maximum
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={dailyFilters.rsiMax}
                    onChange={(e) =>
                      updateDailyFilter('rsiMax', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Signal technique
                  </label>
                  <select
                    value={dailyFilters.signalTechnique}
                    onChange={(e) =>
                      updateDailyFilter('signalTechnique', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {signauxTechniques.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    PER maximum
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={dailyFilters.perMax}
                    onChange={(e) =>
                      updateDailyFilter('perMax', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Rentabilité min. (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={dailyFilters.rentabiliteMin}
                    onChange={(e) =>
                      updateDailyFilter('rentabiliteMin', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>

                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    EVOL minimum (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={dailyFilters.evolMin}
                    onChange={(e) =>
                      updateDailyFilter('evolMin', e.target.value)
                    }
                    placeholder="Sans limite"
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line, ...F_MONO }}
                  />
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Valorisation
                  </label>
                  <select
                    value={dailyFilters.valorisation}
                    onChange={(e) =>
                      updateDailyFilter('valorisation', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {valorisations.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-[11px] font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Signal fondamental
                  </label>
                  <select
                    value={dailyFilters.signalFondamental}
                    onChange={(e) =>
                      updateDailyFilter('signalFondamental', e.target.value)
                    }
                    className="w-full px-2.5 py-2 rounded-xl border text-xs"
                    style={{ borderColor: C.line }}
                  >
                    {signauxFondamentaux.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className="flex-1 min-h-0 overflow-auto"
          style={{
            overscrollBehavior: 'contain',
            scrollbarGutter: 'stable',
          }}
        >
          <table className="w-full" style={{ minWidth: 2450 }}>
            <thead
              style={{
                background: '#FAFAFC',
                position: 'sticky',
                top: 0,
                zIndex: 2,
              }}
            >
              <tr>
                <Th>Rang</Th>
                <Th>Instrument</Th>
                <Th>Marché</Th>
                <Th>Secteur</Th>
                <Th>Cours</Th>
                <Th>Variation jour</Th>
                <Th>MM</Th>
                <Th>MACD</Th>
                <Th>RSI</Th>
                <Th>BOL</Th>
                <Th>Score technique</Th>
                <Th>PER</Th>
                <Th>Rentabilité</Th>
                <Th>EVOL</Th>
                <Th>VALO</Th>
                <Th>Signal fondamental</Th>
                <Th>Score fondamental</Th>
                <Th>Score combiné</Th>
                <Th>Signal du jour</Th>
                <Th>SGI</Th>
                <Th>Watchlist statique</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rowsJour.length === 0 && (
                <tr>
                  <td
                    colSpan={22}
                    className="text-center py-8 text-sm"
                    style={{ color: C.sub }}
                  >
                    Aucune valeur ne satisfait l'ensemble des filtres
                    automatiques.
                  </td>
                </tr>
              )}
              {rowsJour.map((r, i) => {
                const dejaAjoute = watchlistTitles.includes(r.titre);
                return (
                  <tr
                    key={r.titre}
                    style={{
                      borderTop: `1px solid ${C.line}`,
                      background: i % 2 ? '#FCFCFD' : '#fff',
                    }}
                  >
                    <Td mono>
                      <span className="font-bold" style={{ color: C.gold }}>
                        #{i + 1}
                      </span>
                    </Td>
                    <Td className="font-semibold whitespace-nowrap">
                      {r.titre}
                    </Td>
                    <Td>
                      <Badge tone="navy">{r.marche}</Badge>
                    </Td>
                    <Td className="whitespace-nowrap">{r.secteur}</Td>
                    <Td mono className="whitespace-nowrap">
                      {fmtPrice(r.cours)} {r.devise}
                    </Td>
                    <Td>
                      <Pct v={r.variationJour} />
                    </Td>
                    <Td mono className="whitespace-nowrap">
                      {r.technique.mm}
                    </Td>
                    <Td className="whitespace-nowrap">{r.technique.macd}</Td>
                    <Td mono>{r.technique.rsi}</Td>
                    <Td className="whitespace-nowrap">{r.technique.bol}</Td>
                    <Td mono>{r.scoreTechnique}/100</Td>
                    <Td mono>{r.fondamentale.per.toFixed(1)}x</Td>
                    <Td mono>{r.fondamentale.rentabilite}</Td>
                    <Td mono>{r.fondamentale.evol}</Td>
                    <Td className="whitespace-nowrap">{r.fondamentale.valo}</Td>
                    <Td>
                      <Badge
                        tone={toneSignalFondamental(r.fondamentale.signal)}
                      >
                        {r.fondamentale.signal}
                      </Badge>
                    </Td>
                    <Td mono>{r.scoreFondamental}/100</Td>
                    <Td>
                      <Badge
                        tone={
                          r.scoreCombine >= 78
                            ? 'teal'
                            : r.scoreCombine >= 63
                            ? 'gold'
                            : r.scoreCombine < 48
                            ? 'coral'
                            : 'slate'
                        }
                      >
                        {r.scoreCombine}/100
                      </Badge>
                    </Td>
                    <Td>
                      <Badge tone={toneSignalJour(r.signalJour)}>
                        {r.signalJour}
                      </Badge>
                    </Td>
                    <Td>
                      <div className="text-xs font-semibold">
                        {r.compatibles.length} SGI
                      </div>
                      <div
                        className="text-[10px] whitespace-nowrap"
                        style={{ color: C.sub }}
                      >
                        {r.compatibles.map((pf) => pf.sgi).join(' · ')}
                      </div>
                    </Td>
                    <Td>
                      <button
                        type="button"
                        onClick={() =>
                          dejaAjoute
                            ? onRemoveWatch(r.titre)
                            : onAddWatch(r.titre)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap"
                        style={{
                          background: dejaAjoute ? '#EEF0F4' : '#FBF1DD',
                          color: dejaAjoute ? C.sub : '#8A6A16',
                        }}
                      >
                        <Star
                          size={13}
                          fill={dejaAjoute ? 'currentColor' : 'none'}
                        />
                        {dejaAjoute ? 'Retirer' : 'Ajouter'}
                      </button>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            goClient('client-market-depth', {
                              instrument: r.titre,
                              marche: r.marche,
                            })
                          }
                          className="text-xs font-semibold"
                          style={{ color: C.indigo }}
                        >
                          Analyser →
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            goClient('client-invest', {
                              instrument: r.titre,
                              marche: r.marche,
                            })
                          }
                          className="text-xs font-semibold"
                          style={{ color: C.navy }}
                        >
                          Investir →
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="text-[10px]" style={{ color: C.sub }}>
        Les scores et signaux de cette maquette sont calculés à partir des
        données de démonstration disponibles. En production, la watchlist
        journalière devra être alimentée par les données de marché et
        indicateurs réels du backend.
      </div>
    </div>
  );
}

function ClientAvis({ orders, devise }) {
  const [dateDebut, setDateDebut] = useState('');
  const [filtreMarche, setFiltreMarche] = useState('Tous');
  const [filtreSgi, setFiltreSgi] = useState('Toutes');
  const [filtreSens, setFiltreSens] = useState('Tous');

  const baremes = {
    BRVM: { tauxComSgi: 0.008, tauxIrvm: 0, tauxTaf: 0.18, tauxFraisChange: 0 },
    NGX: { tauxComSgi: 0.007, tauxIrvm: 0, tauxTaf: 0.075, tauxFraisChange: 0 },
    GSE: {
      tauxComSgi: 0.007,
      tauxIrvm: 0,
      tauxTaf: 0.15,
      tauxFraisChange: 0.004,
    },
  };

  const avis = orders
    .filter((ordre) => ordre.statut === 'Exécuté')
    .map((ordre) => {
      const portefeuille = CLIENT_GESTION_LIBRE.portefeuilles.find(
        (pf) => pf.id === ordre.portefeuilleId
      );
      const avisBase = {
        id: `AV-${ordre.id.replace('CL-ORD-', '')}`,
        client: CLIENT_GESTION_LIBRE.nom,
        titre: ordre.instrument,
        sens: ordre.sens,
        qte: ordre.qte,
        prix: ordre.prix,
        marche: ordre.marche,
        devise: ordre.devise,
        date: ordre.date,
        frais: baremes[ordre.marche] || baremes.BRVM,
      };
      return {
        ...avisBase,
        portefeuille,
        details: calculerAvis(avisBase),
      };
    });

  const sgiDisponibles = [
    'Toutes',
    ...new Set(avis.map((item) => item.portefeuille?.sgi).filter(Boolean)),
  ];

  const rows = avis.filter((item) => {
    const correspondDate =
      !dateDebut || parseFR(item.date) >= new Date(`${dateDebut}T00:00:00`);
    return (
      correspondDate &&
      (filtreMarche === 'Tous' || item.marche === filtreMarche) &&
      (filtreSgi === 'Toutes' || item.portefeuille?.sgi === filtreSgi) &&
      (filtreSens === 'Tous' || item.sens === filtreSens)
    );
  });

  const totalFraisVue = rows.reduce(
    (sum, item) =>
      sum + convertCurrency(item.details.totalFrais, item.devise, devise),
    0
  );
  const montantBrutVue = rows.reduce(
    (sum, item) =>
      sum + convertCurrency(item.details.montantBrut, item.devise, devise),
    0
  );

  const reinitialiser = () => {
    setDateDebut('');
    setFiltreMarche('Tous');
    setFiltreSgi('Toutes');
    setFiltreSens('Tous');
  };

  return (
    <div className="space-y-5">
      <ClientBreadcrumb
        items={['Espace Client', "Avis d'opéré — vue générale"]}
      />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Avis d'opéré — vue générale
          </h2>
          <div className="text-xs mt-1" style={{ color: C.sub }}>
            Vos opérations exécutées uniquement, consolidées sur l'ensemble de
            vos SGI. Les ordres en attente restent disponibles dans « Mes ordres
            ».
          </div>
        </div>
        <Badge tone="gold">{rows.length} avis</Badge>
      </div>

      <Card className="p-4" style={{ borderColor: C.navy }}>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label
              className="text-[10px] uppercase font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Depuis le
            </label>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-xs"
              style={{ borderColor: C.line }}
            />
          </div>
          <div>
            <label
              className="text-[10px] uppercase font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Marché
            </label>
            <select
              value={filtreMarche}
              onChange={(e) => setFiltreMarche(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-xs"
              style={{ borderColor: C.line }}
            >
              {['Tous', 'BRVM', 'NGX', 'GSE'].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-[10px] uppercase font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              SGI
            </label>
            <select
              value={filtreSgi}
              onChange={(e) => setFiltreSgi(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-xs"
              style={{ borderColor: C.line }}
            >
              {sgiDisponibles.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-[10px] uppercase font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Sens
            </label>
            <div className="flex gap-1.5">
              {['Tous', 'Achat', 'Vente'].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFiltreSens(value)}
                  className="flex-1 px-2 py-2 rounded-xl text-xs font-semibold"
                  style={{
                    background: filtreSens === value ? C.navy : '#F0F1F5',
                    color: filtreSens === value ? '#fff' : C.sub,
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>
        {(dateDebut ||
          filtreMarche !== 'Tous' ||
          filtreSgi !== 'Toutes' ||
          filtreSens !== 'Tous') && (
          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={reinitialiser}
              className="text-xs font-semibold"
              style={{ color: C.navy }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-xs" style={{ color: C.sub }}>
            Opérations exécutées
          </div>
          <div className="text-2xl font-bold mt-1" style={F_DISPLAY}>
            {rows.length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs" style={{ color: C.sub }}>
            Montant brut · équiv. {devise}
          </div>
          <div className="text-lg font-bold mt-1" style={F_DISPLAY}>
            {fmt(Math.round(montantBrutVue))} {devise}
          </div>
          <div className="text-[10px] mt-1" style={{ color: C.sub }}>
            Conversion dans la devise de vue
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs" style={{ color: C.sub }}>
            Frais cumulés · équiv. {devise}
          </div>
          <div
            className="text-lg font-bold mt-1"
            style={{ ...F_DISPLAY, color: C.gold }}
          >
            {fmt(Math.round(totalFraisVue))} {devise}
          </div>
          <div className="text-[10px] mt-1" style={{ color: C.sub }}>
            Barèmes de démonstration · conversion dans la devise de vue
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 2050 }}>
            <thead style={{ background: '#FAFAFC' }}>
              <tr>
                <Th>Réf.</Th>
                <Th>Date</Th>
                <Th>SGI</Th>
                <Th>Portefeuille</Th>
                <Th>Titre</Th>
                <Th>Sens</Th>
                <Th>Qté</Th>
                <Th>Prix exéc.</Th>
                <Th>Montant brut</Th>
                <Th>Com. SGI</Th>
                <Th>IRVM</Th>
                <Th>TAF</Th>
                <Th>Frais change</Th>
                <Th>Total frais</Th>
                <Th>Montant débité</Th>
                <Th>Montant crédité</Th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={16}
                    className="text-center py-10 text-sm"
                    style={{ color: C.sub }}
                  >
                    Aucun avis d'opéré exécuté ne correspond à ces critères.
                  </td>
                </tr>
              )}
              {rows.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    borderTop: `1px solid ${C.line}`,
                    background: index % 2 ? '#FCFCFD' : '#fff',
                  }}
                >
                  <Td mono>{item.id}</Td>
                  <Td>{item.date}</Td>
                  <Td>
                    <div className="font-semibold whitespace-nowrap">
                      {item.portefeuille?.sgi || '—'}
                    </div>
                    <div className="text-[10px]" style={{ color: C.sub }}>
                      {item.marche}
                    </div>
                  </Td>
                  <Td className="whitespace-nowrap">
                    {item.portefeuille?.nom || '—'}
                  </Td>
                  <Td className="font-semibold whitespace-nowrap">
                    {item.titre}
                  </Td>
                  <Td>
                    <Badge tone={item.sens === 'Achat' ? 'teal' : 'coral'}>
                      {item.sens}
                    </Badge>
                  </Td>
                  <Td mono>{fmt(item.qte)}</Td>
                  <Td mono>
                    {fmtPrice(item.prix)} {item.devise}
                  </Td>
                  <Td mono>
                    {fmtPrice(item.details.montantBrut)} {item.devise}
                  </Td>
                  <Td mono>
                    {fmtPrice(item.details.comSgi)} {item.devise}
                  </Td>
                  <Td mono>
                    {fmtPrice(item.details.irvm)} {item.devise}
                  </Td>
                  <Td mono>
                    {fmtPrice(item.details.taf)} {item.devise}
                  </Td>
                  <Td mono>
                    {fmtPrice(item.details.fraisChange)} {item.devise}
                  </Td>
                  <Td mono>
                    <span style={{ color: C.gold, fontWeight: 700 }}>
                      {fmtPrice(item.details.totalFrais)} {item.devise}
                    </span>
                  </Td>
                  <Td mono>
                    {item.details.montantDebite > 0 ? (
                      <span style={{ color: C.coral, fontWeight: 700 }}>
                        {fmtPrice(item.details.montantDebite)} {item.devise}
                      </span>
                    ) : (
                      '—'
                    )}
                  </Td>
                  <Td mono>
                    {item.details.montantCredite > 0 ? (
                      <span style={{ color: C.teal, fontWeight: 700 }}>
                        {fmtPrice(item.details.montantCredite)} {item.devise}
                      </span>
                    ) : (
                      '—'
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="text-[10px]" style={{ color: C.sub }}>
        Les frais affichés sont des paramètres de démonstration. En production,
        les avis devront reprendre les frais et taxes effectivement communiqués
        par chaque SGI.
      </div>
    </div>
  );
}

function ClientOrders({ orders }) {
  return (
    <div className="space-y-5">
      <ClientBreadcrumb items={['Espace Client', 'Mes ordres']} />
      <div className="flex items-end justify-between">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Mes ordres
          </h2>
          <div className="text-xs mt-1" style={{ color: C.sub }}>
            Suivi transversal de vos instructions, quelle que soit la SGI.
          </div>
        </div>
        <Badge tone="gold">{orders.length} ordre(s)</Badge>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full">
          <thead style={{ background: '#FAFAFC' }}>
            <tr>
              <Th>Référence</Th>
              <Th>Date</Th>
              <Th>SGI</Th>
              <Th>Instrument</Th>
              <Th>Sens</Th>
              <Th>Quantité</Th>
              <Th>Prix</Th>
              <Th>Type</Th>
              <Th>Statut</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ordre) => {
              const pf = CLIENT_GESTION_LIBRE.portefeuilles.find(
                (portefeuille) => portefeuille.id === ordre.portefeuilleId
              );
              return (
                <tr key={ordre.id} style={{ borderTop: `1px solid ${C.line}` }}>
                  <Td mono>{ordre.id}</Td>
                  <Td>{ordre.date}</Td>
                  <Td>
                    <div className="font-semibold">{pf?.sgi || '—'}</div>
                    <div className="text-[10px]" style={{ color: C.sub }}>
                      {ordre.marche}
                    </div>
                  </Td>
                  <Td className="font-semibold">{ordre.instrument}</Td>
                  <Td>
                    <Badge tone={ordre.sens === 'Achat' ? 'teal' : 'coral'}>
                      {ordre.sens}
                    </Badge>
                  </Td>
                  <Td mono>{fmt(ordre.qte)}</Td>
                  <Td mono>
                    {fmtPrice(ordre.prix)} {ordre.devise}
                  </Td>
                  <Td>{ordre.typeOrdre}</Td>
                  <Td>
                    <Badge
                      tone={
                        ordre.statut === 'Exécuté'
                          ? 'teal'
                          : ordre.statut === 'Annulé'
                          ? 'coral'
                          : 'gold'
                      }
                    >
                      {ordre.statut}
                    </Badge>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function ClientCashflows({ devise, orders = [] }) {
  const portefeuilles = CLIENT_GESTION_LIBRE.portefeuilles;
  const [filtrePays, setFiltrePays] = useState('Tous');
  const [filtreMarche, setFiltreMarche] = useState('Tous');
  const [filtreSgi, setFiltreSgi] = useState('Toutes');
  const [filtreEncoursMin, setFiltreEncoursMin] = useState('');
  const [filtreLiquiditeActuelleMin, setFiltreLiquiditeActuelleMin] =
    useState('');
  const [filtreEntrees30JMin, setFiltreEntrees30JMin] = useState('');
  const [filtreSorties30JMin, setFiltreSorties30JMin] = useState('');
  const [filtrePrevisionnelMin, setFiltrePrevisionnelMin] = useState('');
  const [
    portefeuilleLiquiditeSelectionneId,
    setPortefeuilleLiquiditeSelectionneId,
  ] = useState(portefeuilles[0]?.id || '');
  const [vueLiquiditeDetail, setVueLiquiditeDetail] = useState('origines');

  const dateReference = new Date(2026, 7, 13);
  const finHorizon = new Date(dateReference);
  finHorizon.setDate(finHorizon.getDate() + 30);

  const formatDateFR = (date) =>
    new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);

  const fluxRevenus30J = CLIENT_CASHFLOWS.flatMap((flux) => {
    const dateFlux = parseFR(flux.date);
    if (dateFlux < dateReference || dateFlux > finHorizon) return [];
    const pf = portefeuilles.find(
      (portefeuille) => portefeuille.id === flux.portefeuilleId
    );
    if (!pf) return [];
    return [
      {
        id: flux.id,
        portefeuilleId: pf.id,
        date: flux.date,
        dateObj: dateFlux,
        nature: flux.type,
        libelle: flux.instrument,
        sens: 'Entrée',
        montant: flux.montant,
        devise: flux.devise,
        statut: flux.statut,
      },
    ];
  });

  const fluxOrdres30J = orders
    .filter((ordre) => CLIENT_OPEN_ORDER_STATUSES.includes(ordre.statut))
    .map((ordre, index) => {
      const pf = portefeuilles.find(
        (portefeuille) => portefeuille.id === ordre.portefeuilleId
      );
      const dateFlux = new Date(dateReference);
      dateFlux.setDate(dateFlux.getDate() + 2 + index);
      return {
        id: `forecast-${ordre.id}`,
        portefeuilleId: ordre.portefeuilleId,
        date: formatDateFR(dateFlux),
        dateObj: dateFlux,
        nature: "Règlement d'ordre",
        libelle: `${ordre.sens} ${ordre.instrument}`,
        sens: ordre.sens === 'Achat' ? 'Sortie' : 'Entrée',
        montant: Number(ordre.qte || 0) * Number(ordre.prix || 0),
        devise: ordre.devise || pf?.devise || devise,
        statut: ordre.statut,
      };
    });

  const flux30J = [...fluxRevenus30J, ...fluxOrdres30J].sort(
    (a, b) => a.dateObj - b.dateObj
  );

  const synthesePortefeuilles = portefeuilles.map((portefeuille) => {
    const encours = clientPortfolioValue(portefeuille);
    const liquiditeActuelle = Number(portefeuille.compteEspeces || 0);
    const fluxPf = flux30J.filter(
      (flux) => flux.portefeuilleId === portefeuille.id
    );
    const entrees30J = fluxPf
      .filter((flux) => flux.sens === 'Entrée')
      .reduce(
        (somme, flux) =>
          somme +
          convertCurrency(flux.montant, flux.devise, portefeuille.devise),
        0
      );
    const sorties30J = fluxPf
      .filter((flux) => flux.sens === 'Sortie')
      .reduce(
        (somme, flux) =>
          somme +
          convertCurrency(flux.montant, flux.devise, portefeuille.devise),
        0
      );
    const liquiditePrevisionnelle = Math.max(
      0,
      liquiditeActuelle + entrees30J - sorties30J
    );
    const liquiditeReservee = clientReservedCash(portefeuille, orders);
    const liquiditeDisponibleOrdres = clientAvailableCash(portefeuille, orders);

    return {
      portefeuille,
      encours,
      liquiditeActuelle,
      liquiditeReservee,
      liquiditeDisponibleOrdres,
      entrees30J,
      sorties30J,
      liquiditePrevisionnelle,
      ratioLiquidite: encours > 0 ? (liquiditeActuelle / encours) * 100 : 0,
      ratioPrevisionnel:
        encours > 0 ? (liquiditePrevisionnelle / encours) * 100 : 0,
    };
  });

  const paysDisponibles = [
    'Tous',
    ...new Set(portefeuilles.map((portefeuille) => portefeuille.pays)),
  ];
  const marchesDisponibles = [
    'Tous',
    ...new Set(portefeuilles.map((portefeuille) => portefeuille.marche)),
  ];
  const sgisDisponibles = [
    'Toutes',
    ...new Set(
      portefeuilles
        .filter(
          (portefeuille) =>
            (filtrePays === 'Tous' || portefeuille.pays === filtrePays) &&
            (filtreMarche === 'Tous' || portefeuille.marche === filtreMarche)
        )
        .map((portefeuille) => portefeuille.sgi)
    ),
  ];

  const lignesFiltrees = synthesePortefeuilles.filter((ligne) => {
    const { portefeuille } = ligne;
    const encoursVue = convertCurrency(
      ligne.encours,
      portefeuille.devise,
      devise
    );
    const liquiditeVue = convertCurrency(
      ligne.liquiditeActuelle,
      portefeuille.devise,
      devise
    );
    const entreesVue = convertCurrency(
      ligne.entrees30J,
      portefeuille.devise,
      devise
    );
    const sortiesVue = convertCurrency(
      ligne.sorties30J,
      portefeuille.devise,
      devise
    );
    const previsionnelVue = convertCurrency(
      ligne.liquiditePrevisionnelle,
      portefeuille.devise,
      devise
    );

    const seuilEncours =
      filtreEncoursMin === '' ? null : Number(filtreEncoursMin);
    const seuilLiquidite =
      filtreLiquiditeActuelleMin === ''
        ? null
        : Number(filtreLiquiditeActuelleMin);
    const seuilEntrees =
      filtreEntrees30JMin === '' ? null : Number(filtreEntrees30JMin);
    const seuilSorties =
      filtreSorties30JMin === '' ? null : Number(filtreSorties30JMin);
    const seuilPrevisionnel =
      filtrePrevisionnelMin === '' ? null : Number(filtrePrevisionnelMin);

    return (
      (filtrePays === 'Tous' || portefeuille.pays === filtrePays) &&
      (filtreMarche === 'Tous' || portefeuille.marche === filtreMarche) &&
      (filtreSgi === 'Toutes' || portefeuille.sgi === filtreSgi) &&
      (seuilEncours === null || encoursVue > seuilEncours) &&
      (seuilLiquidite === null || liquiditeVue > seuilLiquidite) &&
      (seuilEntrees === null || entreesVue > seuilEntrees) &&
      (seuilSorties === null || sortiesVue > seuilSorties) &&
      (seuilPrevisionnel === null || previsionnelVue > seuilPrevisionnel)
    );
  });

  const idsFiltres = new Set(
    lignesFiltrees.map((ligne) => ligne.portefeuille.id)
  );
  const fluxFiltres = flux30J.filter((flux) =>
    idsFiltres.has(flux.portefeuilleId)
  );
  const revenusFiltres = CLIENT_CASHFLOWS.filter((flux) =>
    idsFiltres.has(flux.portefeuilleId)
  );

  const totalEncours = lignesFiltrees.reduce(
    (somme, ligne) =>
      somme + convertCurrency(ligne.encours, ligne.portefeuille.devise, devise),
    0
  );
  const totalCash = lignesFiltrees.reduce(
    (somme, ligne) =>
      somme +
      convertCurrency(
        ligne.liquiditeActuelle,
        ligne.portefeuille.devise,
        devise
      ),
    0
  );
  const totalCashReserve = lignesFiltrees.reduce(
    (somme, ligne) =>
      somme +
      convertCurrency(
        ligne.liquiditeReservee,
        ligne.portefeuille.devise,
        devise
      ),
    0
  );
  const totalEntrees30J = lignesFiltrees.reduce(
    (somme, ligne) =>
      somme +
      convertCurrency(ligne.entrees30J, ligne.portefeuille.devise, devise),
    0
  );
  const totalSorties30J = lignesFiltrees.reduce(
    (somme, ligne) =>
      somme +
      convertCurrency(ligne.sorties30J, ligne.portefeuille.devise, devise),
    0
  );
  const totalPrevisionnel = lignesFiltrees.reduce(
    (somme, ligne) =>
      somme +
      convertCurrency(
        ligne.liquiditePrevisionnelle,
        ligne.portefeuille.devise,
        devise
      ),
    0
  );
  const totalRevenus = revenusFiltres.reduce(
    (somme, flux) => somme + convertCurrency(flux.montant, flux.devise, devise),
    0
  );

  const filtresActifs =
    Number(filtrePays !== 'Tous') +
    Number(filtreMarche !== 'Tous') +
    Number(filtreSgi !== 'Toutes') +
    Number(filtreEncoursMin !== '') +
    Number(filtreLiquiditeActuelleMin !== '') +
    Number(filtreEntrees30JMin !== '') +
    Number(filtreSorties30JMin !== '') +
    Number(filtrePrevisionnelMin !== '');

  const reinitialiserFiltres = () => {
    setFiltrePays('Tous');
    setFiltreMarche('Tous');
    setFiltreSgi('Toutes');
    setFiltreEncoursMin('');
    setFiltreLiquiditeActuelleMin('');
    setFiltreEntrees30JMin('');
    setFiltreSorties30JMin('');
    setFiltrePrevisionnelMin('');
  };

  const filtresMontants = [
    {
      key: 'encours',
      label: 'Encours (supérieur à)',
      value: filtreEncoursMin,
      setter: setFiltreEncoursMin,
    },
    {
      key: 'liquidite',
      label: 'Liquidité actuelle (supérieur à)',
      value: filtreLiquiditeActuelleMin,
      setter: setFiltreLiquiditeActuelleMin,
    },
    {
      key: 'entrees',
      label: 'Entrées 30 j (supérieur à)',
      value: filtreEntrees30JMin,
      setter: setFiltreEntrees30JMin,
    },
    {
      key: 'sorties',
      label: 'Sorties 30 j (supérieur à)',
      value: filtreSorties30JMin,
      setter: setFiltreSorties30JMin,
    },
    {
      key: 'previsionnel',
      label: 'Liquidité prévisionnelle (supérieur à)',
      value: filtrePrevisionnelMin,
      setter: setFiltrePrevisionnelMin,
    },
  ];

  const repartitionMontants = (total, definitions) => {
    let cumule = 0;
    return definitions.map((definition, index) => {
      const dernier = index === definitions.length - 1;
      const montant = dernier
        ? Math.max(0, total - cumule)
        : Math.round((total * definition.poids) / 100);
      cumule += montant;
      return { ...definition, montant };
    });
  };

  const detailsLiquidite = synthesePortefeuilles.map((ligne, index) => {
    const portefeuille = ligne.portefeuille;
    const total = Math.max(0, ligne.liquiditeActuelle);
    const dateDernierDepot = new Date(dateReference);
    dateDernierDepot.setDate(dateDernierDepot.getDate() - (5 + (index % 19)));

    const origines = repartitionMontants(total, [
      {
        numero: '1',
        libelle: 'Dépôt d’ouverture',
        description:
          'Liquidité issue de l’ouverture du compte ou du premier investissement.',
        responsable: 'Client / SGI',
        poids: 8,
      },
      {
        numero: '2',
        libelle: 'Dernier dépôt',
        description: 'Dernier versement enregistré sur le compte espèces.',
        responsable: 'Système',
        poids: 18,
      },
      {
        numero: '3',
        libelle: 'Amortissements ESV',
        description:
          'Capital remboursé sur les titres arrivant à échéance partielle ou totale.',
        responsable: 'Système',
        poids: 16,
      },
      {
        numero: '4',
        libelle: 'Intérêts / coupons ESV',
        description: 'Intérêts et coupons crédités sur le compte.',
        responsable: 'Système',
        poids: 8,
      },
      {
        numero: '5',
        libelle: 'Dividendes',
        description: 'Liquidité issue des dividendes encaissés.',
        responsable: 'Système',
        poids: 12,
      },
      {
        numero: '6',
        libelle: 'Cession de titre — retrait',
        description: 'Produit de cession destiné à un retrait de fonds.',
        responsable: 'Client',
        poids: 8,
      },
      {
        numero: '7',
        libelle: 'Cession de titre — réinvestissement',
        description:
          'Produit de cession que vous destinez à un nouvel investissement.',
        responsable: 'Client',
        poids: 18,
      },
      {
        numero: '8',
        libelle: 'Part à ne pas réinvestir',
        description:
          'Montant que vous souhaitez conserver durablement en espèces.',
        responsable: 'Client',
        poids: 4,
      },
      {
        numero: '9',
        libelle: 'Dépôt pour opération primaire',
        description:
          'Dépôt réalisé pour une opportunité spécifique sur le marché primaire.',
        responsable: 'Client',
        poids: 8,
      },
    ]);

    const ordresAchatOuverts = orders.filter(
      (ordre) =>
        ordre.portefeuilleId === portefeuille.id &&
        ordre.sens === 'Achat' &&
        CLIENT_OPEN_ORDER_STATUSES.includes(ordre.statut)
    );
    const reserveActions = ordresAchatOuverts
      .filter(
        (ordre) =>
          (clientMarket(ordre.instrument)?.type || 'Action') === 'Action'
      )
      .reduce(
        (somme, ordre) =>
          somme + Number(ordre.qte || 0) * Number(ordre.prix || 0),
        0
      );
    const reserveObligations = ordresAchatOuverts
      .filter((ordre) => clientMarket(ordre.instrument)?.type === 'Obligation')
      .reduce(
        (somme, ordre) =>
          somme + Number(ordre.qte || 0) * Number(ordre.prix || 0),
        0
      );
    const reserveOrdres = Math.min(total, reserveActions + reserveObligations);

    const definitionsFixes = [
      {
        numero: '11',
        libelle: 'Retrait en cours',
        groupe: 'Bloquée / réservée',
        responsable: 'Client / SGI',
        poids: 4,
      },
      {
        numero: '12',
        libelle: 'Autre liquidité à investir',
        groupe: 'À investir',
        responsable: 'Système',
        poids: 18,
      },
      {
        numero: '13',
        libelle: 'Achat marché monétaire — OAT',
        groupe: 'Bloquée / réservée',
        responsable: 'Client',
        poids: 6,
      },
      {
        numero: '14',
        libelle: 'Achat marché monétaire — BAT',
        groupe: 'Bloquée / réservée',
        responsable: 'Client',
        poids: 5,
      },
      {
        numero: '15',
        libelle: 'Achat marché financier — OPV / APE',
        groupe: 'Bloquée / réservée',
        responsable: 'Client',
        poids: 5,
      },
      {
        numero: '17',
        libelle: 'ESV — Amortissements bloqués',
        groupe: 'Bloquée / réservée',
        responsable: 'Client / SGI',
        poids: 4,
      },
      {
        numero: '18',
        libelle: 'ESV — Intérêts bloqués',
        groupe: 'Bloquée / réservée',
        responsable: 'Client / SGI',
        poids: 3,
      },
      {
        numero: '19',
        libelle: 'ESV — Dividendes bloqués',
        groupe: 'Bloquée / réservée',
        responsable: 'Client / SGI',
        poids: 3,
      },
      {
        numero: '20',
        libelle: 'Ne pas réinvestir',
        groupe: 'Bloquée / réservée',
        responsable: 'Client',
        poids: 4,
      },
    ];

    const poidsTotalFixe = definitionsFixes.reduce(
      (somme, item) => somme + item.poids,
      0
    );
    const montantFixeTheorique = (total * poidsTotalFixe) / 100;
    const capaciteFixe = Math.max(0, total - reserveOrdres);
    const facteur =
      montantFixeTheorique > 0
        ? Math.min(1, capaciteFixe / montantFixeTheorique)
        : 1;
    const affectationsFixes = definitionsFixes.map((item) => ({
      ...item,
      montant: Math.round(((total * item.poids) / 100) * facteur),
    }));

    const reserveObligationsAffectee = Math.min(
      reserveObligations,
      Math.max(
        0,
        total - affectationsFixes.reduce((s, item) => s + item.montant, 0)
      )
    );
    const reserveActionsAffectee = Math.min(
      reserveActions,
      Math.max(
        0,
        total -
          affectationsFixes.reduce((s, item) => s + item.montant, 0) -
          reserveObligationsAffectee
      )
    );

    const affectationsSansDisponible = [
      ...affectationsFixes.map((item) =>
        item.numero === '13'
          ? { ...item, montant: item.montant + reserveObligationsAffectee }
          : item
      ),
      {
        numero: '16',
        libelle: 'Achat marché financier — Actions',
        groupe: 'Bloquée / réservée',
        responsable: 'Client',
        montant: reserveActionsAffectee,
        reel: true,
      },
    ].sort((a, b) => Number(a.numero) - Number(b.numero));

    const montantAvantDisponible = affectationsSansDisponible.reduce(
      (somme, item) => somme + item.montant,
      0
    );
    const liquiditeDisponible = Math.max(0, total - montantAvantDisponible);
    const affectations = [
      ...affectationsSansDisponible,
      {
        numero: '21',
        libelle: 'Liquidité disponible',
        groupe: 'Disponible',
        responsable: 'Système',
        montant: liquiditeDisponible,
      },
    ];

    const sommeGroupe = (groupe) =>
      affectations
        .filter((item) => item.groupe === groupe)
        .reduce((somme, item) => somme + item.montant, 0);

    const valeurPortefeuille = clientPortfolioValue(portefeuille);
    const valeurActions = portefeuille.lignes
      .filter((position) => clientAssetClass(position.instrument) === 'Actions')
      .reduce((somme, position) => somme + clientLineValue(position), 0);
    const valeurObligations = portefeuille.lignes
      .filter(
        (position) => clientAssetClass(position.instrument) === 'Obligations'
      )
      .reduce((somme, position) => somme + clientLineValue(position), 0);
    const actionsActuelles =
      valeurPortefeuille > 0 ? (valeurActions / valeurPortefeuille) * 100 : 0;
    const obligationsActuelles =
      valeurPortefeuille > 0
        ? (valeurObligations / valeurPortefeuille) * 100
        : 0;
    const cibleIndicative = { Actions: 55, Obligations: 35, Liquidite: 10 };
    const ecartActions = cibleIndicative.Actions - actionsActuelles;
    const ecartObligations = cibleIndicative.Obligations - obligationsActuelles;

    return {
      ...ligne,
      dateDernierDepot: formatDateFR(dateDernierDepot),
      montantDernierDepot:
        origines.find((item) => item.numero === '2')?.montant || 0,
      origines,
      affectations,
      totalOrigines: origines.reduce((somme, item) => somme + item.montant, 0),
      liquiditeBloquee: sommeGroupe('Bloquée / réservée'),
      autreLiquiditeAInvestir: sommeGroupe('À investir'),
      liquiditeDisponibleNette: sommeGroupe('Disponible'),
      actionsActuelles,
      obligationsActuelles,
      cibleIndicative,
      ecartActions,
      ecartObligations,
      montantCorrectionActions:
        (valeurPortefeuille * Math.abs(ecartActions)) / 100,
      montantCorrectionObligations:
        (valeurPortefeuille * Math.abs(ecartObligations)) / 100,
      rendement: Number(portefeuille.perfYtd || 0),
    };
  });

  const detailsFiltres = detailsLiquidite.filter((detail) =>
    idsFiltres.has(detail.portefeuille.id)
  );
  const detailSelectionne =
    detailsFiltres.find(
      (detail) => detail.portefeuille.id === portefeuilleLiquiditeSelectionneId
    ) ||
    detailsFiltres[0] ||
    null;

  const roleTone = (responsable) => {
    if (responsable.includes('Client')) return 'gold';
    if (responsable.includes('SGI')) return 'navy';
    return 'teal';
  };

  const originesDonut = detailSelectionne
    ? detailSelectionne.origines.map((item) => ({
        name: item.libelle,
        montant: item.montant,
        devise: detailSelectionne.portefeuille.devise,
        value:
          detailSelectionne.totalOrigines > 0
            ? Number(
                (
                  (item.montant / detailSelectionne.totalOrigines) *
                  100
                ).toFixed(1)
              )
            : 0,
      }))
    : [];

  return (
    <div className="space-y-5">
      <ClientBreadcrumb items={['Espace Client', 'Liquidité & revenus']} />
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Liquidité & revenus
          </h2>
          <div className="text-xs mt-1 max-w-4xl" style={{ color: C.sub }}>
            Pilotez la liquidité de vos propres comptes SGI, distinguez ce qui
            est disponible, réservé ou destiné à être investi, et anticipez les
            entrées et sorties des 30 prochains jours.
          </div>
        </div>
        <Badge tone="navy">Devise de vue : {devise}</Badge>
      </div>

      <Card className="p-4" style={{ borderColor: C.navy }}>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label
              className="text-[11px] font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Pays
            </label>
            <select
              value={filtrePays}
              onChange={(e) => {
                setFiltrePays(e.target.value);
                setFiltreSgi('Toutes');
              }}
              className="w-full px-3 py-2 rounded-xl border text-xs"
              style={{ borderColor: C.line }}
            >
              {paysDisponibles.map((value) => (
                <option key={value} value={value}>
                  {value === 'Tous' ? 'Tous les pays' : value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-[11px] font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Marché
            </label>
            <select
              value={filtreMarche}
              onChange={(e) => {
                setFiltreMarche(e.target.value);
                setFiltreSgi('Toutes');
              }}
              className="w-full px-3 py-2 rounded-xl border text-xs"
              style={{ borderColor: C.line }}
            >
              {marchesDisponibles.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-[11px] font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              SGI
            </label>
            <select
              value={filtreSgi}
              onChange={(e) => setFiltreSgi(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-xs"
              style={{ borderColor: C.line }}
            >
              {sgisDisponibles.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.line}` }}>
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <div>
              <div className="text-xs font-semibold" style={{ color: C.ink }}>
                Seuils financiers
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: C.sub }}>
                Les cinq seuils sont comparés après conversion dans votre devise
                de vue : {devise}.
              </div>
            </div>
            <Badge tone="navy">Seuils en {devise}</Badge>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {filtresMontants.map((filtre) => (
              <div key={filtre.key}>
                <label
                  className="text-[11px] font-semibold block mb-1"
                  style={{ color: C.sub }}
                >
                  {filtre.label}
                </label>
                <div
                  className="flex items-center rounded-xl border overflow-hidden"
                  style={{ borderColor: C.line, background: '#fff' }}
                >
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={filtre.value}
                    onChange={(e) => filtre.setter(e.target.value)}
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
                    {devise}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
          <div className="text-[11px]" style={{ color: C.sub }}>
            Ces filtres pilotent les comptes espèces, le prévisionnel, les
            revenus attendus et l’anatomie détaillée de votre liquidité.
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={filtresActifs > 0 ? 'teal' : 'slate'}>
              {filtresActifs} filtre(s) actif(s)
            </Badge>
            <Badge tone="gold">{lignesFiltrees.length} compte(s) SGI</Badge>
            {filtresActifs > 0 && (
              <button
                type="button"
                onClick={reinitialiserFiltres}
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                style={{ borderColor: C.line, color: C.navy }}
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <Eyebrow>1. Synthèse de votre liquidité</Eyebrow>
            <div className="text-xs" style={{ color: C.sub }}>
              Vue consolidée de vos comptes SGI après application des filtres.
            </div>
          </div>
          <Badge tone="slate">
            Réservée aujourd’hui : {fmt(Math.round(totalCashReserve))} {devise}
          </Badge>
        </div>
        <div className="grid grid-cols-5 gap-3">
          <Card className="p-4">
            <div className="text-xs" style={{ color: C.sub }}>
              Encours actuel
            </div>
            <div className="text-xl font-bold mt-1" style={F_DISPLAY}>
              {fmt(Math.round(totalEncours))} {devise}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs" style={{ color: C.sub }}>
              Liquidité actuelle
            </div>
            <div className="text-xl font-bold mt-1" style={F_DISPLAY}>
              {fmt(Math.round(totalCash))} {devise}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs" style={{ color: C.sub }}>
              Entrées à 30 j
            </div>
            <div
              className="text-xl font-bold mt-1"
              style={{ ...F_DISPLAY, color: C.teal }}
            >
              +{fmt(Math.round(totalEntrees30J))} {devise}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs" style={{ color: C.sub }}>
              Sorties à 30 j
            </div>
            <div
              className="text-xl font-bold mt-1"
              style={{ ...F_DISPLAY, color: C.coral }}
            >
              -{fmt(Math.round(totalSorties30J))} {devise}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs" style={{ color: C.sub }}>
              Liquidité prévisionnelle
            </div>
            <div className="text-xl font-bold mt-1" style={F_DISPLAY}>
              {fmt(Math.round(totalPrevisionnel))} {devise}
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <Eyebrow>2. Anatomie de la liquidité de vos comptes SGI</Eyebrow>
            <div className="text-xs max-w-4xl" style={{ color: C.sub }}>
              Origine des fonds, sommes réservées ou à investir, liquidité
              réellement mobilisable et lecture indicative de l’écart
              d’allocation de chaque portefeuille.
            </div>
          </div>
          <Badge tone="gold">
            Rubriques 1 à 26 adaptées à la gestion libre
          </Badge>
        </div>

        <div className="grid grid-cols-12 gap-4 items-start">
          <Card className="col-span-4 p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <div
                  className="text-sm font-bold"
                  style={{ ...F_DISPLAY, color: C.ink }}
                >
                  Vos comptes / SGI
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: C.sub }}>
                  Sélectionnez un portefeuille pour analyser sa trésorerie.
                </div>
              </div>
              <Badge tone="navy">{detailsFiltres.length}</Badge>
            </div>

            <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
              {detailsFiltres.length === 0 && (
                <div
                  className="text-xs py-5 text-center"
                  style={{ color: C.sub }}
                >
                  Aucun compte ne correspond aux filtres.
                </div>
              )}
              {detailsFiltres.map((detail) => {
                const actif =
                  detailSelectionne?.portefeuille.id === detail.portefeuille.id;
                return (
                  <button
                    key={detail.portefeuille.id}
                    type="button"
                    onClick={() =>
                      setPortefeuilleLiquiditeSelectionneId(
                        detail.portefeuille.id
                      )
                    }
                    className="w-full p-3 rounded-xl border text-left transition-colors"
                    style={{
                      borderColor: actif ? C.navy : C.line,
                      background: actif ? '#EFF3FB' : '#fff',
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div
                          className="text-xs font-bold truncate"
                          style={{ color: C.ink }}
                        >
                          {detail.portefeuille.sgi}
                        </div>
                        <div
                          className="text-[10px] mt-0.5 truncate"
                          style={{ color: C.sub }}
                        >
                          {detail.portefeuille.nom}
                        </div>
                      </div>
                      <Badge tone="navy">{detail.portefeuille.marche}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div>
                        <div
                          className="text-[9px] uppercase font-semibold"
                          style={{ color: C.sub }}
                        >
                          Liquidité
                        </div>
                        <div
                          className="text-[11px] font-semibold mt-0.5"
                          style={F_MONO}
                        >
                          {fmt(Math.round(detail.liquiditeActuelle))}{' '}
                          {detail.portefeuille.devise}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="text-[9px] uppercase font-semibold"
                          style={{ color: C.sub }}
                        >
                          Prévisionnel 30 j
                        </div>
                        <div
                          className="text-[11px] font-semibold mt-0.5"
                          style={{ ...F_MONO, color: C.teal }}
                        >
                          {fmt(Math.round(detail.liquiditePrevisionnelle))}{' '}
                          {detail.portefeuille.devise}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="col-span-8 p-5">
            {!detailSelectionne ? (
              <div
                className="py-12 text-center text-sm"
                style={{ color: C.sub }}
              >
                Sélectionnez un compte pour afficher son analyse de liquidité.
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div
                      className="text-base font-bold"
                      style={{ ...F_DISPLAY, color: C.ink }}
                    >
                      {detailSelectionne.portefeuille.sgi}
                    </div>
                    <div className="text-xs mt-1" style={{ color: C.sub }}>
                      {detailSelectionne.portefeuille.nom} ·{' '}
                      {detailSelectionne.portefeuille.pays} ·{' '}
                      {detailSelectionne.portefeuille.marche} ·{' '}
                      {detailSelectionne.portefeuille.devise}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-[10px] uppercase font-semibold"
                      style={{ color: C.sub }}
                    >
                      Liquidité actuelle
                    </div>
                    <div className="text-lg font-bold mt-0.5" style={F_MONO}>
                      {fmt(Math.round(detailSelectionne.liquiditeActuelle))}{' '}
                      {detailSelectionne.portefeuille.devise}
                    </div>
                    {detailSelectionne.portefeuille.devise !== devise && (
                      <div className="text-[10px]" style={{ color: C.sub }}>
                        ≈{' '}
                        {fmt(
                          Math.round(
                            convertCurrency(
                              detailSelectionne.liquiditeActuelle,
                              detailSelectionne.portefeuille.devise,
                              devise
                            )
                          )
                        )}{' '}
                        {devise}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-1.5 mt-4 flex-wrap">
                  {[
                    ['origines', 'Origine des fonds · 1–10'],
                    ['affectations', 'Bloquée & disponible · 11–21'],
                    ['profil', 'Écart allocation & rendement · 22–26'],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setVueLiquiditeDetail(id)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{
                        background:
                          vueLiquiditeDetail === id ? C.navy : '#F0F1F5',
                        color: vueLiquiditeDetail === id ? '#fff' : C.sub,
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {vueLiquiditeDetail === 'origines' && (
                  <div className="mt-4 grid grid-cols-5 gap-4">
                    <div className="col-span-2">
                      <div
                        className="p-3 rounded-xl border mb-3"
                        style={{ borderColor: C.line, background: '#FAFAFC' }}
                      >
                        <div className="text-[10px]" style={{ color: C.sub }}>
                          Dernier dépôt estimé
                        </div>
                        <div className="text-sm font-semibold mt-1">
                          {detailSelectionne.dateDernierDepot}
                        </div>
                        <div
                          className="text-sm font-bold mt-1"
                          style={{ ...F_MONO, color: C.navy }}
                        >
                          {fmt(
                            Math.round(detailSelectionne.montantDernierDepot)
                          )}{' '}
                          {detailSelectionne.portefeuille.devise}
                        </div>
                      </div>
                      <Donut data={originesDonut} size={190} />
                      <Legende data={originesDonut} />
                    </div>
                    <div className="col-span-3 grid grid-cols-2 gap-2">
                      {detailSelectionne.origines.map((item) => (
                        <div
                          key={item.numero}
                          className="p-3 rounded-xl border"
                          style={{ borderColor: C.line }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className="text-[10px] font-bold"
                              style={{ color: C.gold, ...F_MONO }}
                            >
                              #{item.numero}
                            </span>
                            <Badge tone={roleTone(item.responsable)}>
                              {item.responsable}
                            </Badge>
                          </div>
                          <div className="text-xs font-bold mt-2">
                            {item.libelle}
                          </div>
                          <div
                            className="text-sm font-semibold mt-1"
                            style={F_MONO}
                          >
                            {fmt(Math.round(item.montant))}{' '}
                            {detailSelectionne.portefeuille.devise}
                          </div>
                          <div
                            className="text-[10px] mt-1 leading-relaxed"
                            style={{ color: C.sub }}
                          >
                            {item.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {vueLiquiditeDetail === 'affectations' && (
                  <div className="mt-4">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div
                        className="p-3 rounded-xl border"
                        style={{
                          borderColor: '#F3C4BF',
                          background: '#FFF7F6',
                        }}
                      >
                        <div className="text-[10px]" style={{ color: C.sub }}>
                          Bloquée / réservée
                        </div>
                        <div
                          className="text-base font-bold mt-1"
                          style={{ ...F_MONO, color: C.coral }}
                        >
                          {fmt(Math.round(detailSelectionne.liquiditeBloquee))}{' '}
                          {detailSelectionne.portefeuille.devise}
                        </div>
                      </div>
                      <div
                        className="p-3 rounded-xl border"
                        style={{
                          borderColor: '#E6D4AC',
                          background: '#FFFBF2',
                        }}
                      >
                        <div className="text-[10px]" style={{ color: C.sub }}>
                          Autre liquidité à investir
                        </div>
                        <div
                          className="text-base font-bold mt-1"
                          style={{ ...F_MONO, color: C.gold }}
                        >
                          {fmt(
                            Math.round(
                              detailSelectionne.autreLiquiditeAInvestir
                            )
                          )}{' '}
                          {detailSelectionne.portefeuille.devise}
                        </div>
                      </div>
                      <div
                        className="p-3 rounded-xl border"
                        style={{
                          borderColor: '#B9E2D5',
                          background: '#F5FCF9',
                        }}
                      >
                        <div className="text-[10px]" style={{ color: C.sub }}>
                          Liquidité disponible
                        </div>
                        <div
                          className="text-base font-bold mt-1"
                          style={{ ...F_MONO, color: C.teal }}
                        >
                          {fmt(
                            Math.round(
                              detailSelectionne.liquiditeDisponibleNette
                            )
                          )}{' '}
                          {detailSelectionne.portefeuille.devise}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {detailSelectionne.affectations.map((item) => {
                        const pct =
                          detailSelectionne.liquiditeActuelle > 0
                            ? (item.montant /
                                detailSelectionne.liquiditeActuelle) *
                              100
                            : 0;
                        const tone =
                          item.groupe === 'Disponible'
                            ? C.teal
                            : item.groupe === 'À investir'
                            ? C.gold
                            : C.coral;
                        return (
                          <div
                            key={item.numero}
                            className="p-3 rounded-xl border"
                            style={{ borderColor: C.line }}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className="text-[10px] font-bold"
                                    style={{ color: C.gold, ...F_MONO }}
                                  >
                                    #{item.numero}
                                  </span>
                                  <span className="text-xs font-bold">
                                    {item.libelle}
                                  </span>
                                  {item.reel && (
                                    <Badge tone="teal">
                                      Ordres ouverts réels
                                    </Badge>
                                  )}
                                </div>
                                <div className="mt-1">
                                  <Badge tone={roleTone(item.responsable)}>
                                    {item.responsable}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div
                                  className="text-xs font-semibold"
                                  style={F_MONO}
                                >
                                  {fmt(Math.round(item.montant))}{' '}
                                  {detailSelectionne.portefeuille.devise}
                                </div>
                                <div
                                  className="text-[10px] mt-0.5"
                                  style={{ color: C.sub }}
                                >
                                  {pct.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            <div
                              className="h-1.5 rounded-full mt-2"
                              style={{ background: '#EEF0F4' }}
                            >
                              <div
                                className="h-1.5 rounded-full"
                                style={{
                                  width: `${Math.min(100, pct)}%`,
                                  background: tone,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div
                      className="text-[10px] mt-3 p-3 rounded-xl"
                      style={{ background: '#EFF3FB', color: C.sub }}
                    >
                      Les réservations liées aux ordres d’achat ouverts sont
                      calculées à partir de vos ordres. Les autres
                      sous-rubriques restent une ventilation de démonstration
                      jusqu’au branchement des données détaillées de la SGI.
                    </div>
                  </div>
                )}

                {vueLiquiditeDetail === 'profil' && (
                  <div className="mt-4 space-y-4">
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: '#FBF7EE' }}
                    >
                      <div
                        className="text-xs font-semibold"
                        style={{ color: C.ink }}
                      >
                        Cible indicative de démonstration
                      </div>
                      <div
                        className="text-[10px] mt-1"
                        style={{ color: C.sub }}
                      >
                        55% Actions · 35% Obligations · 10% Liquidité. Cette
                        cible devra être remplacée par votre profil
                        d’investissement réel lorsqu’il sera disponible dans le
                        backend.
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          numeroPct: '22',
                          numeroValeur: '24',
                          nom: 'Actions',
                          actuel: detailSelectionne.actionsActuelles,
                          cible: detailSelectionne.cibleIndicative.Actions,
                          ecart: detailSelectionne.ecartActions,
                          montant: detailSelectionne.montantCorrectionActions,
                        },
                        {
                          numeroPct: '23',
                          numeroValeur: '25',
                          nom: 'Obligations',
                          actuel: detailSelectionne.obligationsActuelles,
                          cible: detailSelectionne.cibleIndicative.Obligations,
                          ecart: detailSelectionne.ecartObligations,
                          montant:
                            detailSelectionne.montantCorrectionObligations,
                        },
                      ].map((item) => (
                        <div
                          key={item.nom}
                          className="p-4 rounded-xl border"
                          style={{ borderColor: C.line }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-sm font-bold">{item.nom}</div>
                            <Badge tone={item.ecart >= 0 ? 'gold' : 'navy'}>
                              #{item.numeroPct} / #{item.numeroValeur}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                            <div>
                              <div
                                className="text-[9px] uppercase"
                                style={{ color: C.sub }}
                              >
                                Actuel
                              </div>
                              <div
                                className="text-sm font-semibold mt-1"
                                style={F_MONO}
                              >
                                {item.actuel.toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <div
                                className="text-[9px] uppercase"
                                style={{ color: C.sub }}
                              >
                                Cible
                              </div>
                              <div
                                className="text-sm font-semibold mt-1"
                                style={F_MONO}
                              >
                                {item.cible.toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <div
                                className="text-[9px] uppercase"
                                style={{ color: C.sub }}
                              >
                                Écart
                              </div>
                              <div
                                className="text-sm font-semibold mt-1"
                                style={{
                                  ...F_MONO,
                                  color:
                                    Math.abs(item.ecart) > 3 ? C.coral : C.teal,
                                }}
                              >
                                {item.ecart >= 0 ? '+' : ''}
                                {item.ecart.toFixed(1)} pts
                              </div>
                            </div>
                          </div>
                          <div
                            className="mt-3 pt-3 flex items-center justify-between text-xs"
                            style={{ borderTop: `1px solid ${C.line}` }}
                          >
                            <span style={{ color: C.sub }}>
                              Correction indicative
                            </span>
                            <span className="font-semibold" style={F_MONO}>
                              {fmt(Math.round(item.montant))}{' '}
                              {detailSelectionne.portefeuille.devise}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div
                        className="p-3 rounded-xl border"
                        style={{ borderColor: C.line }}
                      >
                        <div className="text-[10px]" style={{ color: C.sub }}>
                          Liquidité actuelle
                        </div>
                        <div className="text-sm font-bold mt-1" style={F_MONO}>
                          {detailSelectionne.ratioLiquidite.toFixed(1)}%
                        </div>
                      </div>
                      <div
                        className="p-3 rounded-xl border"
                        style={{ borderColor: C.line }}
                      >
                        <div className="text-[10px]" style={{ color: C.sub }}>
                          Liquidité prévisionnelle
                        </div>
                        <div className="text-sm font-bold mt-1" style={F_MONO}>
                          {detailSelectionne.ratioPrevisionnel.toFixed(1)}%
                        </div>
                      </div>
                      <div
                        className="p-3 rounded-xl border"
                        style={{ borderColor: C.line }}
                      >
                        <div className="text-[10px]" style={{ color: C.sub }}>
                          Rendement YTD · #26
                        </div>
                        <div className="mt-1">
                          <Pct v={detailSelectionne.rendement} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </section>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <Eyebrow>3. Comptes espèces par SGI</Eyebrow>
            <div className="text-[11px]" style={{ color: C.sub }}>
              Situation actuelle, réservations d’ordres et prévision à 30 jours.
            </div>
          </div>
          <Badge tone="gold">{lignesFiltrees.length} compte(s)</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 1250 }}>
            <thead style={{ background: '#FAFAFC' }}>
              <tr>
                <Th>SGI</Th>
                <Th>Pays / marché</Th>
                <Th>Encours actuel</Th>
                <Th>Liquidité actuelle</Th>
                <Th>Réservée</Th>
                <Th>Entrées 30 j</Th>
                <Th>Sorties 30 j</Th>
                <Th>Prévisionnel</Th>
              </tr>
            </thead>
            <tbody>
              {lignesFiltrees.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-7 text-sm"
                    style={{ color: C.sub }}
                  >
                    Aucun compte ne correspond aux critères sélectionnés.
                  </td>
                </tr>
              )}
              {lignesFiltrees.map((ligne) => {
                const pf = ligne.portefeuille;
                return (
                  <tr key={pf.id} style={{ borderTop: `1px solid ${C.line}` }}>
                    <Td className="font-semibold">{pf.sgi}</Td>
                    <Td>
                      {pf.pays} · {pf.marche}
                    </Td>
                    <Td mono>
                      {fmt(Math.round(ligne.encours))} {pf.devise}
                    </Td>
                    <Td mono>
                      {fmt(Math.round(ligne.liquiditeActuelle))} {pf.devise}
                    </Td>
                    <Td mono>
                      <span style={{ color: C.coral }}>
                        {fmt(Math.round(ligne.liquiditeReservee))} {pf.devise}
                      </span>
                    </Td>
                    <Td mono>
                      <span style={{ color: C.teal }}>
                        +{fmt(Math.round(ligne.entrees30J))} {pf.devise}
                      </span>
                    </Td>
                    <Td mono>
                      <span style={{ color: C.coral }}>
                        -{fmt(Math.round(ligne.sorties30J))} {pf.devise}
                      </span>
                    </Td>
                    <Td mono>
                      {fmt(Math.round(ligne.liquiditePrevisionnelle))}{' '}
                      {pf.devise}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <Eyebrow>4. Dividendes & coupons attendus</Eyebrow>
            <div className="text-[11px]" style={{ color: C.sub }}>
              Revenus financiers correspondant au périmètre filtré.
            </div>
          </div>
          <Badge tone="teal">
            {fmt(Math.round(totalRevenus))} {devise}
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 1050 }}>
            <thead style={{ background: '#FAFAFC' }}>
              <tr>
                <Th>Date</Th>
                <Th>SGI</Th>
                <Th>Instrument</Th>
                <Th>Nature</Th>
                <Th>Montant</Th>
                <Th>Équivalent {devise}</Th>
                <Th>Statut</Th>
              </tr>
            </thead>
            <tbody>
              {revenusFiltres.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-7 text-sm"
                    style={{ color: C.sub }}
                  >
                    Aucun dividende ou coupon ne correspond aux filtres.
                  </td>
                </tr>
              )}
              {revenusFiltres.map((flux) => {
                const pf = portefeuilles.find(
                  (portefeuille) => portefeuille.id === flux.portefeuilleId
                );
                return (
                  <tr
                    key={flux.id}
                    style={{ borderTop: `1px solid ${C.line}` }}
                  >
                    <Td>{flux.date}</Td>
                    <Td className="font-semibold">{pf?.sgi}</Td>
                    <Td>{flux.instrument}</Td>
                    <Td>
                      <Badge tone="teal">{flux.type}</Badge>
                    </Td>
                    <Td mono>
                      {fmt(Math.round(flux.montant))} {flux.devise}
                    </Td>
                    <Td mono>
                      {fmt(
                        Math.round(
                          convertCurrency(flux.montant, flux.devise, devise)
                        )
                      )}{' '}
                      {devise}
                    </Td>
                    <Td>
                      <Badge tone="gold">{flux.statut}</Badge>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4" style={{ borderColor: '#D8DFEF' }}>
        <div className="text-xs font-semibold" style={{ color: C.ink }}>
          Lecture du prévisionnel à 30 jours
        </div>
        <div className="text-[11px] mt-1" style={{ color: C.sub }}>
          Les entrées combinent les dividendes/coupons à recevoir et les ventes
          ouvertes ; les sorties correspondent aux achats ouverts. Les ordres
          restent soumis à leur exécution effective par la SGI. Le détail des
          rubriques 1 à 21 est une structure opérationnelle prête à recevoir les
          données réelles du backend.
        </div>
      </Card>
    </div>
  );
}
function ClientAnalysis({ devise }) {
  const portefeuilles = CLIENT_GESTION_LIBRE.portefeuilles;
  const [filtrePaysHistorique, setFiltrePaysHistorique] = useState('Tous');
  const [filtreSgiHistorique, setFiltreSgiHistorique] = useState('Toutes');
  const [dateDebutHistorique, setDateDebutHistorique] = useState(
    CLIENT_HISTORY[0]?.date || ''
  );

  const paysDisponiblesHistorique = [
    'Tous',
    ...new Set(portefeuilles.map((portefeuille) => portefeuille.pays)),
  ];
  const sgiDisponiblesHistorique = [
    'Toutes',
    ...new Set(
      portefeuilles
        .filter(
          (portefeuille) =>
            filtrePaysHistorique === 'Tous' ||
            portefeuille.pays === filtrePaysHistorique
        )
        .map((portefeuille) => portefeuille.sgi)
    ),
  ];

  const portefeuillesHistoriques = portefeuilles.filter(
    (portefeuille) =>
      (filtrePaysHistorique === 'Tous' ||
        portefeuille.pays === filtrePaysHistorique) &&
      (filtreSgiHistorique === 'Toutes' ||
        portefeuille.sgi === filtreSgiHistorique)
  );

  const patrimoine = portefeuilles.reduce(
    (somme, portefeuille) =>
      somme + clientPortfolioValueIn(portefeuille, devise),
    0
  );

  const pays = {};
  const secteurs = {};
  const lignes = [];
  let patrimoineInvesti = 0;

  portefeuilles.forEach((portefeuille) => {
    const valeurPf = clientPortfolioValueIn(portefeuille, devise);
    pays[portefeuille.pays] = (pays[portefeuille.pays] || 0) + valeurPf;

    portefeuille.lignes.forEach((ligne) => {
      const valeur = convertCurrency(
        clientLineValue(ligne),
        portefeuille.devise,
        devise
      );
      const secteur = clientSector(ligne.instrument);

      patrimoineInvesti += valeur;
      secteurs[secteur] = (secteurs[secteur] || 0) + valeur;
      lignes.push({
        instrument: ligne.instrument,
        sgi: portefeuille.sgi,
        valeur,
      });
    });
  });

  const topLignes = lignes.sort((a, b) => b.valeur - a.valeur).slice(0, 5);
  const expositionPays = Object.entries(pays).map(([name, montant]) => ({
    name,
    montant,
    value:
      patrimoine > 0 ? Number(((montant / patrimoine) * 100).toFixed(1)) : 0,
    devise,
  }));
  const expositionSectorielle = Object.entries(secteurs)
    .map(([name, montant]) => ({
      name,
      montant,
      value:
        patrimoineInvesti > 0
          ? Number(((montant / patrimoineInvesti) * 100).toFixed(1))
          : 0,
      devise,
    }))
    .sort((a, b) => b.montant - a.montant);
  const concentrationTop3 =
    patrimoine > 0
      ? (topLignes.slice(0, 3).reduce((s, ligne) => s + ligne.valeur, 0) /
          patrimoine) *
        100
      : 0;

  const pointsHistoriqueAffiches = CLIENT_HISTORY.map(
    (point, indexOriginal) => ({
      ...point,
      indexOriginal,
    })
  ).filter(
    (point) =>
      !dateDebutHistorique ||
      point.date.slice(0, 7) >= dateDebutHistorique.slice(0, 7)
  );
  const periodesHistorique = pointsHistoriqueAffiches.map(
    (point) => point.mois
  );
  const dateMinHistorique = CLIENT_HISTORY[0]?.date || '';
  const dateMaxHistorique = '2026-08-31';
  const libelleDebutHistorique =
    pointsHistoriqueAffiches[0]?.mois || CLIENT_HISTORY[0]?.mois || '—';
  const couleursHistorique = [
    C.gold,
    C.teal,
    C.indigo,
    C.coral,
    '#8B93A7',
    '#6D4C9F',
    '#2F80ED',
    '#9A6B2F',
  ];
  const formatCompact = (montant) =>
    new Intl.NumberFormat('fr-FR', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(Number(montant || 0));
  const formatMontantTooltip = (montant) =>
    `${fmt(Math.round(Number(montant || 0)))} ${devise}`;
  const seedTexte = (texte) =>
    String(texte)
      .split('')
      .reduce(
        (somme, caractere, index) =>
          somme + caractere.charCodeAt(0) * (index + 1),
        0
      );
  const indiceBase100 = (nom, index, famille = 'secteur') => {
    const seed = seedTexte(`${famille}-${nom}`);
    const tendance =
      famille === 'secteur'
        ? 0.32 + (seed % 7) * 0.07
        : 0.28 + (seed % 6) * 0.08;
    const volatilite =
      famille === 'secteur' ? 0.9 + (seed % 5) * 0.22 : 0.7 + (seed % 4) * 0.2;
    const phase = (seed % 11) * 0.31;
    const valeurBrute = (rang) =>
      100 +
      rang * tendance +
      Math.sin(rang * 0.86 + phase) * volatilite +
      Math.cos(rang * 0.41 + phase / 2) * volatilite * 0.45;
    return Number((100 + valeurBrute(index) - valeurBrute(0)).toFixed(2));
  };

  const secteursFiltresMontants = {};
  portefeuillesHistoriques.forEach((portefeuille) => {
    portefeuille.lignes.forEach((ligne) => {
      const secteur = clientSector(ligne.instrument);
      const valeur = convertCurrency(
        clientLineValue(ligne),
        portefeuille.devise,
        devise
      );
      secteursFiltresMontants[secteur] =
        (secteursFiltresMontants[secteur] || 0) + valeur;
    });
  });

  const seriesSecteurs = Object.entries(secteursFiltresMontants)
    .sort((a, b) => b[1] - a[1])
    .map(([name, montant], index) => ({
      name,
      montant,
      key: `secteur_${index}`,
      color: couleursHistorique[index % couleursHistorique.length],
    }));
  const [visibiliteSecteurs, setVisibiliteSecteurs] = useState(() => {
    const tousSecteurs = [
      ...new Set(
        portefeuilles.flatMap((portefeuille) =>
          portefeuille.lignes.map((ligne) => clientSector(ligne.instrument))
        )
      ),
    ];
    return {
      general: true,
      ...Object.fromEntries(tousSecteurs.map((secteur) => [secteur, true])),
    };
  });

  const historiqueSecteurs = periodesHistorique.map((mois, index) => {
    const indexOriginal =
      pointsHistoriqueAffiches[index]?.indexOriginal ?? index;
    const ligneHistorique = { mois };
    let investissementGeneralMontant = 0;

    seriesSecteurs.forEach((serie) => {
      const indice = indiceBase100(serie.name, index, 'secteur');
      const indiceFinal = indiceBase100(
        serie.name,
        periodesHistorique.length - 1,
        'secteur'
      );
      const montant =
        indiceFinal !== 0
          ? (serie.montant * indice) / indiceFinal
          : serie.montant;
      ligneHistorique[serie.key] = indice;
      ligneHistorique[`${serie.key}Montant`] = montant;
      investissementGeneralMontant += montant;
    });

    ligneHistorique.generalMontant = investissementGeneralMontant;
    return ligneHistorique;
  });
  const baseInvestissementGeneral = historiqueSecteurs[0]?.generalMontant || 1;
  historiqueSecteurs.forEach((ligneHistorique) => {
    ligneHistorique.general = Number(
      (
        (ligneHistorique.generalMontant / baseInvestissementGeneral) *
        100
      ).toFixed(2)
    );
  });

  const facteursFluxEspeces = [
    0, 0.045, -0.028, 0.062, -0.038, 0.024, 0.051, -0.044, 0.035, -0.021, 0.058,
    -0.017,
  ];
  historiqueSecteurs.forEach((ligneHistorique, index) => {
    const indexOriginal =
      pointsHistoriqueAffiches[index]?.indexOriginal ?? index;
    const facteurFlux = facteursFluxEspeces[indexOriginal] ?? 0;

    ligneHistorique.cashVariation = portefeuillesHistoriques.reduce(
      (somme, portefeuille) => {
        const cash = clientCashIn(portefeuille, devise);
        const seed = seedTexte(portefeuille.sgi);
        const amplitude = 0.82 + (seed % 5) * 0.09;
        const alternance = (seed + indexOriginal) % 4 === 0 ? -0.35 : 1;
        return somme + cash * facteurFlux * amplitude * alternance;
      },
      0
    );
  });

  const sgiFiltresMontants = {};
  portefeuillesHistoriques.forEach((portefeuille) => {
    const investissement = portefeuille.lignes.reduce(
      (somme, ligne) =>
        somme +
        convertCurrency(clientLineValue(ligne), portefeuille.devise, devise),
      0
    );
    const cash = clientCashIn(portefeuille, devise);
    if (!sgiFiltresMontants[portefeuille.sgi]) {
      sgiFiltresMontants[portefeuille.sgi] = {
        investissement: 0,
        cash: 0,
      };
    }
    sgiFiltresMontants[portefeuille.sgi].investissement += investissement;
    sgiFiltresMontants[portefeuille.sgi].cash += cash;
  });

  const seriesSgi = Object.entries(sgiFiltresMontants)
    .sort((a, b) => b[1].investissement - a[1].investissement)
    .map(([name, valeurs], index) => ({
      name,
      ...valeurs,
      key: `sgi_${index}`,
      cashKey: `sgi_cash_${index}`,
      color: couleursHistorique[index % couleursHistorique.length],
    }));
  const [visibiliteSgi, setVisibiliteSgi] = useState(() => ({
    general: true,
    ...Object.fromEntries(
      [...new Set(portefeuilles.map((portefeuille) => portefeuille.sgi))].map(
        (sgi) => [sgi, true]
      )
    ),
  }));

  const facteursSoldeCash = [
    0.8, 0.84, 0.79, 0.88, 0.91, 0.87, 0.94, 0.9, 0.96, 0.93, 0.98, 1,
  ];
  const historiqueSgi = periodesHistorique.map((mois, index) => {
    const indexOriginal =
      pointsHistoriqueAffiches[index]?.indexOriginal ?? index;
    const ligneHistorique = { mois };
    let investissementGeneralMontant = 0;

    seriesSgi.forEach((serie) => {
      const indice = indiceBase100(serie.name, index, 'sgi');
      const indiceFinal = indiceBase100(
        serie.name,
        periodesHistorique.length - 1,
        'sgi'
      );
      const montantInvesti =
        indiceFinal !== 0
          ? (serie.investissement * indice) / indiceFinal
          : serie.investissement;
      const seed = seedTexte(`cash-${serie.name}`);
      const modulation = 0.88 + (seed % 5) * 0.04;
      const facteurCash =
        1 + (facteursSoldeCash[indexOriginal] - 1) * modulation;
      const montantCash = serie.cash * facteurCash;

      ligneHistorique[serie.key] = indice;
      ligneHistorique[`${serie.key}Montant`] = montantInvesti;
      ligneHistorique[serie.cashKey] = montantCash;
      investissementGeneralMontant += montantInvesti;
    });

    ligneHistorique.generalMontant = investissementGeneralMontant;
    return ligneHistorique;
  });
  const baseGeneralSgi = historiqueSgi[0]?.generalMontant || 1;
  historiqueSgi.forEach((ligneHistorique) => {
    ligneHistorique.general = Number(
      ((ligneHistorique.generalMontant / baseGeneralSgi) * 100).toFixed(2)
    );
  });

  const metaGraphiqueSecteurs = {
    general: {
      label: 'Investissement général',
      type: 'base100',
      amountKey: 'generalMontant',
    },
    cashVariation: {
      label: 'Variation compte espèces',
      type: 'cashVariation',
    },
    ...Object.fromEntries(
      seriesSecteurs.map((serie) => [
        serie.key,
        {
          label: serie.name,
          type: 'base100',
          amountKey: `${serie.key}Montant`,
        },
      ])
    ),
  };

  const metaGraphiqueSgi = {
    general: {
      label: 'Investissement général',
      type: 'base100',
      amountKey: 'generalMontant',
    },
    ...Object.fromEntries(
      seriesSgi.flatMap((serie) => [
        [
          serie.key,
          {
            label: `${serie.name} · Investissement`,
            type: 'base100',
            amountKey: `${serie.key}Montant`,
          },
        ],
        [
          serie.cashKey,
          {
            label: `${serie.name} · Compte espèces`,
            type: 'cashBalance',
          },
        ],
      ])
    ),
  };

  const renderTooltipHistorique = (meta) =>
    function TooltipHistorique({ active, payload, label }) {
      if (!active || !payload?.length) return null;
      const point = payload[0]?.payload || {};
      const entrees = payload.filter((item) => meta[item.dataKey]);

      return (
        <div
          className="p-3 rounded-xl border bg-white shadow-sm"
          style={{ borderColor: C.line, minWidth: 210, ...F_BODY }}
        >
          <div className="text-xs font-bold mb-2" style={{ color: C.ink }}>
            {label}
          </div>
          <div className="space-y-2">
            {entrees.map((item) => {
              const info = meta[item.dataKey];
              if (!info) return null;
              return (
                <div key={item.dataKey} className="text-[11px]">
                  <div
                    className="flex items-center justify-between gap-3 font-semibold"
                    style={{ color: item.color || C.ink }}
                  >
                    <span>{info.label}</span>
                    {info.type === 'base100' ? (
                      <span style={F_MONO}>
                        Indice {Number(item.value).toFixed(2)}
                      </span>
                    ) : (
                      <span style={F_MONO}>
                        {info.type === 'cashVariation' && Number(item.value) > 0
                          ? '+'
                          : ''}
                        {formatMontantTooltip(item.value)}
                      </span>
                    )}
                  </div>
                  {info.type === 'base100' && (
                    <>
                      <div
                        className="flex items-center justify-between gap-3 mt-0.5"
                        style={{ color: C.sub }}
                      >
                        <span>Variation vs base 100</span>
                        <span style={F_MONO}>
                          {Number(item.value) - 100 >= 0 ? '+' : ''}
                          {(Number(item.value) - 100).toFixed(2)}%
                        </span>
                      </div>
                      <div
                        className="flex items-center justify-between gap-3 mt-0.5"
                        style={{ color: C.sub }}
                      >
                        <span>Montant</span>
                        <span style={F_MONO}>
                          {formatMontantTooltip(point[info.amountKey])}
                        </span>
                      </div>
                    </>
                  )}
                  {info.type === 'cashVariation' && (
                    <div className="mt-0.5" style={{ color: C.sub }}>
                      {Number(item.value) >= 0
                        ? 'Ajout net de liquidité'
                        : 'Retrait net de liquidité'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

  const TooltipSecteurs = renderTooltipHistorique(metaGraphiqueSecteurs);
  const TooltipSgi = renderTooltipHistorique(metaGraphiqueSgi);

  return (
    <div className="space-y-5">
      <ClientBreadcrumb items={['Espace Client', 'Performance & risque']} />
      <div>
        <h2
          className="text-xl font-bold"
          style={{ ...F_DISPLAY, color: C.ink }}
        >
          Performance & risque
        </h2>
        <div className="text-xs mt-1" style={{ color: C.sub }}>
          Analyse consolidée de votre patrimoine, indépendamment de la SGI qui
          détient chaque position.
        </div>
      </div>

      <Card className="p-4" style={{ borderColor: '#D8DFEF' }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <Eyebrow>Filtres des historiques</Eyebrow>
            <div className="text-xs" style={{ color: C.sub }}>
              Les deux graphiques utilisent le même périmètre pour comparer
              secteurs, SGI et mouvements de trésorerie.
            </div>
          </div>
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <label
                className="text-[10px] font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Date de début
              </label>
              <input
                type="date"
                min={dateMinHistorique}
                max={dateMaxHistorique}
                value={dateDebutHistorique}
                onChange={(e) => setDateDebutHistorique(e.target.value)}
                className="px-3 py-2 rounded-xl border text-xs min-w-[150px]"
                style={{ borderColor: C.line, background: '#fff', ...F_MONO }}
                aria-label="Date de début d'affichage des graphiques historiques"
              />
            </div>
            <div>
              <label
                className="text-[10px] font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Pays
              </label>
              <select
                value={filtrePaysHistorique}
                onChange={(e) => {
                  setFiltrePaysHistorique(e.target.value);
                  setFiltreSgiHistorique('Toutes');
                }}
                className="px-3 py-2 rounded-xl border text-xs min-w-[150px]"
                style={{ borderColor: C.line, background: '#fff' }}
              >
                {paysDisponiblesHistorique.map((paysOption) => (
                  <option key={paysOption}>{paysOption}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="text-[10px] font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Société de gestion / SGI
              </label>
              <select
                value={filtreSgiHistorique}
                onChange={(e) => setFiltreSgiHistorique(e.target.value)}
                className="px-3 py-2 rounded-xl border text-xs min-w-[190px]"
                style={{ borderColor: C.line, background: '#fff' }}
              >
                {sgiDisponiblesHistorique.map((sgiOption) => (
                  <option key={sgiOption}>{sgiOption}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {dateDebutHistorique !== dateMinHistorique && (
                <button
                  type="button"
                  onClick={() => setDateDebutHistorique(dateMinHistorique)}
                  className="px-3 py-2 rounded-xl border text-[10px] font-semibold"
                  style={{
                    borderColor: C.line,
                    color: C.navy,
                    background: '#fff',
                  }}
                >
                  Tout l'historique
                </button>
              )}
              <Badge tone="gold">
                Depuis {libelleDebutHistorique} ·{' '}
                {portefeuillesHistoriques.length} portefeuille(s) ·{' '}
                {seriesSgi.length} SGI
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 items-stretch">
        <Card className="p-5 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <Eyebrow>
                Historique par secteur — base 100 &amp; flux espèces
              </Eyebrow>
              <div className="text-[10px]" style={{ color: C.sub }}>
                Axe gauche : performance rebasée à 100 au début de la période ·
                Axe droit : apports (+) et retraits (−) de liquidité en {devise}
                .
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={historiqueSecteurs}
              margin={{ top: 12, right: 22, left: 4, bottom: 4 }}
            >
              <CartesianGrid stroke={C.line} vertical={false} />
              <XAxis
                dataKey="mois"
                tick={{ fontSize: 9, fill: C.sub }}
                axisLine={{ stroke: C.line }}
                tickLine={false}
                interval={1}
              />
              <YAxis
                yAxisId="base100"
                orientation="left"
                tick={{ fontSize: 9, fill: C.sub }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 3', 'dataMax + 3']}
                label={{
                  value: 'Base 100',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 9, fill: C.sub },
                }}
              />
              <YAxis
                yAxisId="cash"
                orientation="right"
                tick={{ fontSize: 9, fill: C.sub }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCompact}
                label={{
                  value: `Flux espèces (${devise})`,
                  angle: 90,
                  position: 'insideRight',
                  style: { fontSize: 9, fill: C.sub },
                }}
              />
              <Tooltip content={<TooltipSecteurs />} />
              {visibiliteSecteurs.general && (
                <Line
                  yAxisId="base100"
                  type="monotone"
                  dataKey="general"
                  name="Investissement général"
                  stroke={C.navy}
                  strokeWidth={2.8}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              )}
              {seriesSecteurs.map(
                (serie) =>
                  visibiliteSecteurs[serie.name] !== false && (
                    <Line
                      key={serie.key}
                      yAxisId="base100"
                      type="monotone"
                      dataKey={serie.key}
                      name={serie.name}
                      stroke={serie.color}
                      strokeWidth={1.9}
                      dot={{ r: 1.8 }}
                      activeDot={{ r: 4 }}
                      isAnimationActive={false}
                    />
                  )
              )}
              <Line
                yAxisId="cash"
                type="monotone"
                dataKey="cashVariation"
                name="Variation compte espèces"
                stroke={C.coral}
                strokeWidth={2}
                strokeDasharray="7 5"
                dot={{ r: 2.2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>

          <div
            className="flex items-center justify-center gap-x-4 gap-y-2 flex-wrap mt-2"
            style={F_BODY}
          >
            <button
              type="button"
              onClick={() =>
                setVisibiliteSecteurs((courant) => ({
                  ...courant,
                  general: !courant.general,
                }))
              }
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold"
              style={{
                color: C.ink,
                opacity: visibiliteSecteurs.general ? 1 : 0.35,
                textDecoration: visibiliteSecteurs.general
                  ? 'none'
                  : 'line-through',
              }}
            >
              <span
                className="inline-block w-4 rounded-full"
                style={{ height: 3, background: C.navy }}
              />
              Général
            </button>
            {seriesSecteurs.map((serie) => {
              const visible = visibiliteSecteurs[serie.name] !== false;
              return (
                <button
                  key={serie.key}
                  type="button"
                  onClick={() =>
                    setVisibiliteSecteurs((courant) => ({
                      ...courant,
                      [serie.name]: !visible,
                    }))
                  }
                  className="inline-flex items-center gap-1.5 text-[10px] font-semibold"
                  style={{
                    color: C.ink,
                    opacity: visible ? 1 : 0.35,
                    textDecoration: visible ? 'none' : 'line-through',
                  }}
                >
                  <span
                    className="inline-block w-4 rounded-full"
                    style={{ height: 3, background: serie.color }}
                  />
                  {serie.name}
                </button>
              );
            })}
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold"
              style={{ color: C.coral }}
            >
              <span
                className="inline-block w-4"
                style={{ borderTop: `2px dashed ${C.coral}` }}
              />
              Flux espèces
            </span>
          </div>
        </Card>

        <Card className="p-5 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <Eyebrow>
                Historique par SGI — base 100 &amp; comptes espèces
              </Eyebrow>
              <div className="text-[10px]" style={{ color: C.sub }}>
                Traits pleins : investissement rebasé à 100 au début de la
                période · Traits pointillés : solde du compte espèces de la même
                SGI en {devise}.
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={historiqueSgi}
              margin={{ top: 12, right: 22, left: 4, bottom: 4 }}
            >
              <CartesianGrid stroke={C.line} vertical={false} />
              <XAxis
                dataKey="mois"
                tick={{ fontSize: 9, fill: C.sub }}
                axisLine={{ stroke: C.line }}
                tickLine={false}
                interval={1}
              />
              <YAxis
                yAxisId="base100"
                orientation="left"
                tick={{ fontSize: 9, fill: C.sub }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 3', 'dataMax + 3']}
                label={{
                  value: 'Base 100',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 9, fill: C.sub },
                }}
              />
              <YAxis
                yAxisId="cash"
                orientation="right"
                tick={{ fontSize: 9, fill: C.sub }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCompact}
                label={{
                  value: `Compte espèces (${devise})`,
                  angle: 90,
                  position: 'insideRight',
                  style: { fontSize: 9, fill: C.sub },
                }}
              />
              <Tooltip content={<TooltipSgi />} />
              {visibiliteSgi.general && (
                <Line
                  yAxisId="base100"
                  type="monotone"
                  dataKey="general"
                  name="Investissement général"
                  stroke={C.navy}
                  strokeWidth={2.8}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              )}
              {seriesSgi.map(
                (serie) =>
                  visibiliteSgi[serie.name] !== false && (
                    <Line
                      key={serie.key}
                      yAxisId="base100"
                      type="monotone"
                      dataKey={serie.key}
                      name={`${serie.name} · Investissement`}
                      stroke={serie.color}
                      strokeWidth={1.9}
                      dot={{ r: 1.7 }}
                      activeDot={{ r: 4 }}
                      isAnimationActive={false}
                    />
                  )
              )}
              {seriesSgi.map(
                (serie) =>
                  visibiliteSgi[serie.name] !== false && (
                    <Line
                      key={serie.cashKey}
                      yAxisId="cash"
                      type="monotone"
                      dataKey={serie.cashKey}
                      name={`${serie.name} · Compte espèces`}
                      stroke={serie.color}
                      strokeWidth={1.7}
                      strokeDasharray="7 5"
                      dot={{ r: 1.7 }}
                      activeDot={{ r: 4 }}
                      isAnimationActive={false}
                    />
                  )
              )}
            </LineChart>
          </ResponsiveContainer>

          <div
            className="flex items-center justify-center gap-x-4 gap-y-2 flex-wrap mt-2"
            style={F_BODY}
          >
            <button
              type="button"
              onClick={() =>
                setVisibiliteSgi((courant) => ({
                  ...courant,
                  general: !courant.general,
                }))
              }
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold"
              style={{
                color: C.ink,
                opacity: visibiliteSgi.general ? 1 : 0.35,
                textDecoration: visibiliteSgi.general ? 'none' : 'line-through',
              }}
            >
              <span
                className="inline-block w-4 rounded-full"
                style={{ height: 3, background: C.navy }}
              />
              Général
            </button>
            {seriesSgi.map((serie) => {
              const visible = visibiliteSgi[serie.name] !== false;
              return (
                <button
                  key={serie.key}
                  type="button"
                  onClick={() =>
                    setVisibiliteSgi((courant) => ({
                      ...courant,
                      [serie.name]: !visible,
                    }))
                  }
                  className="inline-flex items-center gap-1.5 text-[10px] font-semibold"
                  style={{
                    color: C.ink,
                    opacity: visible ? 1 : 0.35,
                    textDecoration: visible ? 'none' : 'line-through',
                  }}
                  title="Afficher/masquer à la fois l'investissement et le compte espèces"
                >
                  <span className="inline-flex flex-col gap-[2px]">
                    <span
                      className="inline-block w-4 rounded-full"
                      style={{ height: 2, background: serie.color }}
                    />
                    <span
                      className="inline-block w-4"
                      style={{ borderTop: `1px dashed ${serie.color}` }}
                    />
                  </span>
                  {serie.name}
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <Eyebrow>Concentration</Eyebrow>
        <div className="grid grid-cols-4 gap-4 items-center">
          <div>
            <div className="text-xs" style={{ color: C.sub }}>
              Poids des 3 principales lignes
            </div>
            <div className="text-2xl font-bold mt-1" style={F_DISPLAY}>
              {concentrationTop3.toFixed(1)}%
            </div>
          </div>
          {topLignes.slice(0, 3).map((ligne) => (
            <div
              key={`${ligne.sgi}-${ligne.instrument}`}
              className="p-3 rounded-xl border"
              style={{ borderColor: C.line }}
            >
              <div className="text-xs font-semibold">{ligne.instrument}</div>
              <div className="text-[10px] mt-1" style={{ color: C.sub }}>
                {ligne.sgi}
              </div>
              <div className="text-sm font-bold mt-1" style={F_MONO}>
                {patrimoine > 0
                  ? ((ligne.valeur / patrimoine) * 100).toFixed(1)
                  : '0.0'}
                %
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <Eyebrow>Exposition géographique</Eyebrow>
          <Donut data={expositionPays} size={170} />
          <Legende data={expositionPays} />
        </Card>
        <Card className="p-5">
          <Eyebrow>Exposition sectorielle</Eyebrow>
          <div className="text-[10px] mb-1" style={{ color: C.sub }}>
            Répartition des actifs investis par secteur · hors liquidité
          </div>
          <Donut data={expositionSectorielle} size={170} />
          <Legende data={expositionSectorielle} />
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4">
          <Eyebrow>Principales positions consolidées</Eyebrow>
        </div>
        <table className="w-full">
          <thead style={{ background: '#FAFAFC' }}>
            <tr>
              <Th>Instrument</Th>
              <Th>SGI</Th>
              <Th>Valeur équiv. {devise}</Th>
              <Th>Poids patrimoine</Th>
            </tr>
          </thead>
          <tbody>
            {topLignes.map((ligne) => (
              <tr
                key={`${ligne.sgi}-${ligne.instrument}`}
                style={{ borderTop: `1px solid ${C.line}` }}
              >
                <Td className="font-semibold">{ligne.instrument}</Td>
                <Td>{ligne.sgi}</Td>
                <Td mono>
                  {fmt(Math.round(ligne.valeur))} {devise}
                </Td>
                <Td mono>
                  {patrimoine > 0
                    ? ((ligne.valeur / patrimoine) * 100).toFixed(1)
                    : '0.0'}
                  %
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
/* --------------------------------- APP --------------------------------- */
export default function App() {
  const [workspace, setWorkspace] = useState('gestionnaire');
  const [screen, setScreen] = useState('accueil');
  const [clientScreen, setClientScreen] = useState('client-dashboard');
  const [clientCtx, setClientCtx] = useState({});
  const [ctx, setCtx] = useState({});
  const [reportOpen, setReportOpen] = useState({});
  const [siteDevise, setSiteDevise] = useState('XOF');
  const [dark, setDark] = useState(false);
  const [clientOrders, setClientOrders] = useState(INITIAL_CLIENT_ORDERS);
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
  const openClient = (id, showReport = false) => {
    setScreen('client');
    setCtx({ clientId: id });
    setReportOpen({ notice: showReport });
    remonterEnHaut();
  };
  const report = () => setReportOpen({ notice: true });

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
                <span
                  className="text-sm font-bold"
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
                      (n.id === 'portefeuilles' && screen === 'client') ||
                      (n.id === 'marches' && screen === 'profondeur') ||
                      (n.id === 'comite' && screen === 'decisions-comite')
                    : clientScreen === n.id ||
                      (n.id === 'client-markets' &&
                        clientScreen === 'client-market-depth');
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
            {workspace === 'gestionnaire' && (
              <>
                {screen === 'accueil' && (
                  <Accueil
                    go={go}
                    openClient={openClient}
                    devise={siteDevise}
                    onDeviseChange={setSiteDevise}
                    dark={dark}
                    onToggleDark={() => setDark(!dark)}
                  />
                )}
                {screen === 'portefeuilles' && (
                  <Portefeuilles
                    go={go}
                    openClient={openClient}
                    initialFilter={ctx.filtre}
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
                {screen === 'carnet' && <Carnet initial={ctx} />}
                {screen === 'profondeur' && (
                  <ProfondeurMarche ctx={ctx} go={go} />
                )}
                {screen === 'avis' && <Avis />}
                {screen === 'marches' && (
                  <Marches
                    go={go}
                    watchlistTitles={watchlistTitles}
                    onAddWatch={addToWatchlist}
                  />
                )}
                {screen === 'watchlist' && (
                  <Watchlist
                    go={go}
                    watchlistTitles={watchlistTitles}
                    onRemoveWatch={removeFromWatchlist}
                  />
                )}
                {screen === 'recos-actions' && <RecosActions go={go} />}
                {screen === 'reco-alloc' && <RecoAlloc go={go} />}
                {screen === 'alloc-criteres' && (
                  <AllocCriteres
                    initialSens={ctx.sens}
                    initialInstrument={ctx.instrument}
                  />
                )}
                {screen === 'alertes' && <Alertes go={go} />}
                {screen === 'money-management' && (
                  <MoneyManagement go={go} devise={siteDevise} />
                )}
                {screen === 'reequilibrage' && (
                  <Reequilibrage initial={ctx} devise={siteDevise} />
                )}
                {screen === 'analyse' && (
                  <AnalysePortefeuille devise={siteDevise} />
                )}
                {screen === 'comite' && <Comite devise={siteDevise} go={go} />}
                {screen === 'decisions-comite' && <PriseDecisions go={go} />}
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
                {clientScreen === 'client-invest' && (
                  <ClientInvest
                    goClient={goClient}
                    onCreateOrder={createClientOrder}
                    orders={clientOrders}
                    initialInstrument={clientCtx.instrument}
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
              </>
            )}
          </main>
        </div>
      </div>
    </NavigationContext.Provider>
  );
}
