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

const CLIENTS = [
  {
    id: 'c1',
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

const PROFILE_TYPE_LABEL = {
  Privé: 'Particulier',
  Institutionnel: 'Institutionnel',
};
const PAYS_MARCHE = { "Côte d'Ivoire": 'BRVM', Nigeria: 'NGX', Ghana: 'GSE' };
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

const ASSET_MIX = [
  { name: 'Actions', value: 42 },
  { name: 'Obl. souveraines', value: 28 },
  { name: 'Obl. privées', value: 18 },
  { name: 'Liquidité', value: 12 },
];
const MARKET_MIX = [
  { name: 'BRVM (XOF)', value: 54 },
  { name: 'NGX (NGN)', value: 31 },
  { name: 'GSE (GHS)', value: 15 },
];
const COUNTRY_MIX = [
  { name: "Côte d'Ivoire", value: 39 },
  { name: 'Nigeria', value: 31 },
  { name: 'Sénégal', value: 15 },
  { name: 'Ghana', value: 15 },
];
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
const exposureOf = (clientId, instrument) =>
  EXPOSURE[clientId]?.[instrument] ?? 0;
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
    )}%) ; un point avec le client sur son horizon d'investissement est recommandé avant tout arbitrage supplémentaire.`;
  if (r >= 3)
    return `La rentabilité nette de la période est solide (+${r.toFixed(
      1
    )}%) ; une prise partielle de plus-value vers des actifs moins volatils (obligations, liquidité) peut être envisagée pour sécuriser le gain.`;
  return `La rentabilité nette de la période est modérée (+${r.toFixed(
    1
  )}%), en ligne avec le profil du portefeuille ; aucun arbitrage urgent lié au rendement n'est nécessaire à ce stade.`;
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
function Donut({ data, size = 150 }) {
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
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="none" />
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
          <span className="flex items-center gap-2 min-w-0" style={{ color: C.ink }}>
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

/* -------------------------------- SCREENS -------------------------------- */
function Accueil({
  go,
  openClient,
  devise,
  onDeviseChange,
  dark,
  onToggleDark,
}) {
  const [dim, setDim] = useState("Profil de risque");
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
      rendementPondere,
    };
  });

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
  const topMarches = [...MARKETS_DATA]
    .sort((a, b) => Math.abs(b.variation) - Math.abs(a.variation))
    .slice(0, 3);
  const tickerMarches = [...MARKETS_DATA].sort(
    (a, b) => b.variation - a.variation
  );

  return (
    <div className="space-y-6">
      <Breadcrumb items={['Accueil']} />

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-3">
          <Eyebrow>Vue des Marchés</Eyebrow>
          <button
            onClick={() => go('marches')}
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
                key={i}
                onClick={() =>
                  go('profondeur', { marche: m.marche, instrument: m.nom })
                }
                className="flex items-center gap-2 px-3 py-2 rounded-xl border shrink-0"
                style={{ borderColor: C.line }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: C.ink, ...F_BODY }}
                >
                  {m.nom}
                </span>
                <span className="text-xs" style={{ ...F_MONO, color: C.sub }}>
                  {m.cours} {m.devise} · {m.marche}
                </span>
                <Pct v={m.variation} />
              </button>
            ))}
          </div>
        </div>
      </Card>

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
            className="text-xs font-medium mb-1"
            style={{ color: C.sub, ...F_BODY }}
          >
            Encours total (éq. {devise})
          </div>
          <div
            className="text-2xl font-bold mb-1"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            {fmt(Math.round(totalRef))} {devise}
          </div>
          <Pct v={2.1} />
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

          <div className="text-[10px] mt-2" style={{ color: C.sub, ...F_BODY }}>
            3 marchés · 3 devises
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
                                  Aucun portefeuille ne correspond à ces critères.
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

function PortefeuilleDetail({ client, go, reportOpen, onGenerateReport }) {
  const data = Object.entries(client.alloc).map(([name, value]) => ({
    name,
    value,
  }));
  const besoinsReequilibrage = besoinsReequilibrageClient(client);
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
            Commentaire : la performance de la période reflète principalement le
            renforcement de la ligne Télécoms et l'encaissement d'un coupon
            obligataire ; l'écart d'allocation Actions reste au-dessus de la
            cible et justifie un arbitrage.
          </div>
          <div
            className="text-xs mt-2 p-3 rounded-xl"
            style={{ background: '#EFF3FB', color: C.ink }}
          >
            <b>Proposition (rentabilité) :</b> {rentabiliteComment(client)}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5">
          <Eyebrow>Allocation actuelle</Eyebrow>
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
          Marchés — Actions & Obligations
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

function ProfondeurMarche({ ctx, go }) {
  const m =
    MARKETS_DATA.find((x) => x.nom === ctx?.instrument) || MARKETS_DATA[0];
  const { asks, bids } = orderBookDemo(m);
  const execs = executionsDemo(m);
  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', 'Marchés', m.nom]} />
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            {m.nom}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge tone="navy">{m.marche}</Badge>
            <span className="text-sm" style={F_MONO}>
              {m.cours} {m.devise}
            </span>
            <Pct v={m.variation} />
          </div>
        </div>
        <Btn
          tone="ghost"
          onClick={() => go('carnet', { marche: m.marche, instrument: m.nom })}
        >
          Voir le carnet d'ordres interne
        </Btn>
      </div>

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
              Montant de l'ordre par portefeuille
            </label>
            <input
              type="number"
              min="0"
              step="10000"
              value={montantOrdre}
              onChange={(e) => setMontantOrdre(Number(e.target.value))}
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
                    <Th>Allocation actuelle</Th>
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

  const cashPoints = [];
  UPCOMING_CASHFLOWS.forEach((c) => {
    const x = joursDepuisAujourdhui(c.echeance);
    c.portefeuilles
      .split(', ')
      .forEach((p) => cashPoints.push({ x, y: p, ...c }));
    cashPoints.push({ x, y: 'Général', ...c });
  });
  const dividendePoints = cashPoints.filter((p) => p.type === 'Dividende');
  const couponPoints = cashPoints.filter((p) => p.type === 'Coupon');

  const [horizonJours, setHorizonJours] = useState(30);
  const [triOrdre, setTriOrdre] = useState('desc');
  const flowsDansHorizon = UPCOMING_CASHFLOWS.filter((c) => {
    const j = joursDepuisAujourdhui(c.echeance);
    return j >= 0 && j <= horizonJours;
  });
  const totalGeneralHorizon = flowsDansHorizon.reduce(
    (s, c) => s + convertCurrency(c.montant, c.devise, devise),
    0
  );
  const totalParPortefeuille = {};
  flowsDansHorizon.forEach((c) => {
    c.portefeuilles.split(', ').forEach((p) => {
      totalParPortefeuille[p] =
        (totalParPortefeuille[p] || 0) +
        convertCurrency(c.montant, c.devise, devise);
    });
  });
  const lignesTriees = Object.entries(totalParPortefeuille).sort((a, b) =>
    triOrdre === 'desc' ? b[1] - a[1] : a[1] - b[1]
  );

  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', 'Analyse portefeuille']} />
      <h2 className="text-xl font-bold" style={{ ...F_DISPLAY, color: C.ink }}>
        Analyse portefeuille
      </h2>
      <div className="flex gap-1.5">
        {['Devises', 'Corrélations', 'Stress test', 'Liquidité'].map((t) => (
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

      {tab === 'Liquidité' && (
        <>
          <Card className="p-5">
            <Eyebrow>
              Gestion de liquidité — points de coupons et dividendes par
              portefeuille &amp; en général
            </Eyebrow>
            <div
              className="flex items-center gap-4 text-xs mb-2"
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
              <span>Axe horizontal : jours à venir depuis aujourd'hui</span>
            </div>
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
                  formatter={(v, n, p) =>
                    n === 'x' ? [`${v} j`, 'Échéance'] : [v, n]
                  }
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const p = payload[0].payload;
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
                        <div className="font-semibold">{p.titre}</div>
                        <div>
                          {p.type} · {fmt(p.montant)} {p.devise}
                        </div>
                        <div style={{ color: C.sub }}>{p.echeance}</div>
                      </div>
                    );
                  }}
                />
                <Scatter data={dividendePoints} fill={C.teal} />
                <Scatter data={couponPoints} fill={C.gold} />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <Eyebrow>
              Somme totale attendue (coupons + dividendes) sur une période de
              prévision
            </Eyebrow>
            <div className="flex items-end gap-4 mt-2 mb-3 flex-wrap">
              <div>
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{ color: C.sub }}
                >
                  Horizon de prévision (jours)
                </label>
                <input
                  type="number"
                  min="1"
                  value={horizonJours}
                  onChange={(e) => setHorizonJours(Number(e.target.value))}
                  className="w-28 px-3 py-2 rounded-xl border text-sm"
                  style={{ borderColor: C.line, ...F_MONO }}
                />
              </div>
              <div
                className="p-3 rounded-xl border"
                style={{ borderColor: C.gold }}
              >
                <div className="text-xs" style={{ color: C.sub }}>
                  Total général attendu sous {horizonJours} j
                </div>
                <div className="text-lg font-bold" style={F_DISPLAY}>
                  {fmt(Math.round(totalGeneralHorizon))} {devise}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span
                  className="text-xs font-semibold"
                  style={{ color: C.sub }}
                >
                  Trier :
                </span>
                <button
                  onClick={() => setTriOrdre('desc')}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                  style={{
                    background: triOrdre === 'desc' ? C.navy : '#fff',
                    color: triOrdre === 'desc' ? '#fff' : C.ink,
                    borderColor: C.line,
                  }}
                >
                  Décroissant
                </button>
                <button
                  onClick={() => setTriOrdre('asc')}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                  style={{
                    background: triOrdre === 'asc' ? C.navy : '#fff',
                    color: triOrdre === 'asc' ? '#fff' : C.ink,
                    borderColor: C.line,
                  }}
                >
                  Croissant
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead style={{ background: '#FAFAFC' }}>
                <tr>
                  <Th>Portefeuille</Th>
                  <Th>Somme attendue sous {horizonJours} j</Th>
                </tr>
              </thead>
              <tbody>
                {lignesTriees.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="text-center text-xs py-4"
                      style={{ color: C.sub }}
                    >
                      Aucune tombée sur cet horizon.
                    </td>
                  </tr>
                )}
                {lignesTriees.map(([nom, montant]) => (
                  <tr key={nom} style={{ borderTop: `1px solid ${C.line}` }}>
                    <Td className="font-semibold">{nom}</Td>
                    <Td mono>
                      {fmt(Math.round(montant))} {devise}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <div className="text-xs mt-1" style={{ color: C.sub }}>
            Les décisions sont conservées dans le stockage local du navigateur.
          </div>
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

/* --------------------------------- APP --------------------------------- */
export default function App() {
  const [screen, setScreen] = useState('accueil');
  const [ctx, setCtx] = useState({});
  const [reportOpen, setReportOpen] = useState({});
  const [siteDevise, setSiteDevise] = useState('XOF');
  const [dark, setDark] = useState(false);
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

  const activeClient = ctx.clientId
    ? CLIENTS.find((c) => c.id === ctx.clientId)
    : null;

  return (
    <NavigationContext.Provider value={{ go }}>
      <div
        style={{
          background: C.bg,
          minHeight: '100vh',
          overflowX: 'hidden',
          ...F_BODY,
          filter: dark ? 'invert(1) hue-rotate(180deg)' : 'none',
        }}
      >
        <style>{FONTS}</style>
        <div className="flex">
          <aside
            className="w-64 shrink-0 min-h-screen p-5"
            style={{ background: C.navy }}
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
                  Management
                </div>
              </div>
            </div>
            <nav className="space-y-1">
              {NAV.map((n) => {
                const active =
                  screen === n.id ||
                  (n.id === 'portefeuilles' && screen === 'client') ||
                  (n.id === 'marches' && screen === 'profondeur') ||
                  (n.id === 'comite' && screen === 'decisions-comite');
                return (
                  <button
                    key={n.id}
                    onClick={() => go(n.id)}
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
              Marchés couverts : BRVM · NGX · GSE
              <br />
              Devise de référence : {siteDevise}
            </div>
          </aside>

          <main className="flex-1 p-8 min-w-0 overflow-x-hidden">
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
            {screen === 'profondeur' && <ProfondeurMarche ctx={ctx} go={go} />}
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
            {screen === 'reequilibrage' && (
              <Reequilibrage initial={ctx} devise={siteDevise} />
            )}
            {screen === 'analyse' && (
              <AnalysePortefeuille devise={siteDevise} />
            )}
            {screen === 'comite' && <Comite devise={siteDevise} go={go} />}
            {screen === 'decisions-comite' && <PriseDecisions go={go} />}
          </main>
        </div>
      </div>
    </NavigationContext.Provider>
  );
}