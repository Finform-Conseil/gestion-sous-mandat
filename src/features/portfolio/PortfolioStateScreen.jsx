import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownRight, ArrowUpRight, ChevronRight, Search } from 'lucide-react';
import { FX, fmt, fmtCompactMontant, fmtPrice } from '../../shared/lib/finance';
import { parseIsoLocalDate } from '../../shared/lib/dateUtils';
import { C, F_BODY, F_DISPLAY, F_MONO } from '../../shared/theme/theme';
import { Badge, Btn, Card, Eyebrow, Pct, Td, Th } from '../../shared/ui/UiAtoms';
import { Breadcrumb } from '../../shared/ui/Navigation';
import { Donut, Legende } from '../home/HomeWidgets';
import { CLIENTS } from './PortfolioUniverse';
import { HISTORY_PERIODS, buildCurrencyAumHistory } from './PortfolioAnalyticsData';
import { MARKETS_DATA } from '../markets/MarketDomainData';
import { ORDERS, ACTIONS_LIST, OBLIGATIONS_LIST, ENCAISSEMENTS, exposureOf, gsmListedAssetMetrics, rentabiliteComment, besoinsReequilibrageClient } from '../trading/TradingDomainData';
import { liquidityHistoryFactor } from '../money-management/LiquidityInfrastructure';
import { CESSION_NON_LISTED_BONDS, cessionNonListedPositionsForClient } from '../trading/CessionWorkflow';

const portfolioCurrencyEvolutionSeed = (value) =>
  String(value || '')
    .split('')
    .reduce(
      (total, char, index) =>
        total + char.charCodeAt(0) * (index + 5),
      0
    );

const portfolioHistoricalFxFactor = (
  fromCurrency,
  toCurrency,
  date,
  referenceDate
) => {
  if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
    return 1;
  }

  const situation = parseIsoLocalDate(date);
  const reference = parseIsoLocalDate(referenceDate);
  const monthsBack = Math.max(
    0,
    (reference - situation) / (86_400_000 * 30.4375)
  );
  const seed = portfolioCurrencyEvolutionSeed(
    `${fromCurrency}-${toCurrency}`
  );
  const phase = (seed % 19) / 4;
  const situationIndex =
    situation.getFullYear() * 12 + situation.getMonth();
  const referenceIndex =
    reference.getFullYear() * 12 + reference.getMonth();

  const cycle = (index) =>
    Math.sin(index * 0.47 + phase) * 0.026 +
    Math.cos(index * 0.21 + phase * 0.7) * 0.014;

  const monthlyTrend = ((seed % 9) - 4) * 0.00115;
  const factor = Math.exp(
    -monthlyTrend * monthsBack +
      cycle(situationIndex) -
      cycle(referenceIndex)
  );

  return Math.max(0.82, Math.min(1.18, factor));
};

const buildPortfolioCurrencyEvolution = (
  client,
  investmentCurrency,
  periods = HISTORY_PERIODS
) => {
  if (!client || !investmentCurrency || periods.length === 0) {
    return [];
  }

  const nationalCurrency = client.devise;
  const currentRate =
    Number(FX[investmentCurrency] || 1) /
    Number(FX[nationalCurrency] || 1);
  const referenceDate = periods[periods.length - 1]?.date;
  const currencyHistory = buildCurrencyAumHistory([client], periods);

  return currencyHistory.data.map((row) => {
    const investmentValue = Number(row[investmentCurrency] || 0);
    const fxFactor = portfolioHistoricalFxFactor(
      investmentCurrency,
      nationalCurrency,
      row.date,
      referenceDate
    );
    const historicalRate = currentRate * fxFactor;
    const nationalValue = investmentValue * historicalRate;

    return {
      date: row.date,
      mois: row.mois,
      investmentValue,
      nationalValue,
      fxRate: historicalRate,
    };
  });
};

const portfolioStateExplicitCmp = (
  client,
  title,
  currentPrice,
  fallbackKey
) => {
  const explicitPosition = Array.isArray(client?.positions)
    ? client.positions.find(
        (position) =>
          position?.instrument === title ||
          position?.titre === title ||
          position?.nom === title
      )
    : null;

  const explicitCmp =
    explicitPosition?.cmp ??
    explicitPosition?.coutMoyenPondere ??
    client?.cmp?.[title] ??
    client?.coutMoyenPondere?.[title];

  const numericExplicitCmp = Number(explicitCmp);
  if (
    Number.isFinite(numericExplicitCmp) &&
    numericExplicitCmp > 0
  ) {
    return numericExplicitCmp;
  }

  const seed = portfolioCurrencyEvolutionSeed(
    `${client?.id || 'client'}-${fallbackKey || title}-cmp-state`
  );
  const gap = ((seed % 17) - 8) / 100;

  return Math.max(
    0.000001,
    Number(currentPrice || 0) * (1 + gap)
  );
};

const portfolioStatePriceAtDate = (
  client,
  instrumentKey,
  currentPrice,
  date
) => {
  const referenceDate =
    HISTORY_PERIODS[HISTORY_PERIODS.length - 1]?.date ||
    date;

  const factor = liquidityHistoryFactor(
    `${client?.id || 'client'}-${instrumentKey}-historical-price`,
    date,
    referenceDate
  );

  return Math.max(
    0.000001,
    Number(currentPrice || 0) * factor
  );
};

const portfolioStateFxRateAtDate = (
  fromCurrency,
  toCurrency,
  date
) => {
  if (!fromCurrency || !toCurrency) return 1;
  if (fromCurrency === toCurrency) return 1;

  const referenceDate =
    HISTORY_PERIODS[HISTORY_PERIODS.length - 1]?.date ||
    date;

  const currentRate =
    Number(FX[fromCurrency] || 1) /
    Number(FX[toCurrency] || 1);

  return (
    currentRate *
    portfolioHistoricalFxFactor(
      fromCurrency,
      toCurrency,
      date,
      referenceDate
    )
  );
};

const portfolioStateNonListedForCurrency = (
  client,
  currency
) => {
  const explicitPositions = Array.isArray(
    client?.obligationsNonCotees
  )
    ? client.obligationsNonCotees
    : [];

  const explicit = explicitPositions.find(
    (position) =>
      (position?.devise || '') === currency
  );

  if (explicit) return explicit;

  const candidate =
    typeof CESSION_NON_LISTED_BONDS !== 'undefined'
      ? CESSION_NON_LISTED_BONDS.find(
          (instrument) => instrument.devise === currency
        )
      : null;

  return candidate || null;
};

const portfolioStateInstrumentCandidates = (
  currency,
  assetClass
) => {
  const listed = MARKETS_DATA.filter(
    (instrument) => instrument.devise === currency
  );

  if (assetClass === 'Actions') {
    return listed
      .filter((instrument) => instrument.type === 'Action')
      .map((instrument) => ({
        ...instrument,
        cotation: 'Coté',
        listed: true,
        assetLabel: 'Action',
      }));
  }

  if (assetClass === 'Obl. souveraines') {
    return listed
      .filter(
        (instrument) =>
          instrument.type === 'Obligation' &&
          /trésor|tresor|sovereign|government/i.test(
            instrument.nom
          )
      )
      .map((instrument) => ({
        ...instrument,
        cotation: 'Coté',
        listed: true,
        assetLabel: 'Obligation souveraine',
      }));
  }

  if (assetClass === 'Obl. privées') {
    const listedPrivate = listed
      .filter(
        (instrument) =>
          instrument.type === 'Obligation' &&
          !/trésor|tresor|sovereign|government/i.test(
            instrument.nom
          )
      )
      .map((instrument) => ({
        ...instrument,
        cotation: 'Coté',
        listed: true,
        assetLabel: 'Obligation privée',
      }));

    const nonListed =
      typeof CESSION_NON_LISTED_BONDS !== 'undefined'
        ? CESSION_NON_LISTED_BONDS.filter(
            (instrument) =>
              instrument.devise === currency
          ).map((instrument) => ({
            ...instrument,
            cotation: 'Non coté',
            listed: false,
            assetLabel: 'Obligation privée',
          }))
        : [];

    return [...listedPrivate, ...nonListed];
  }

  return [];
};

const buildPortfolioStateAtDate = (
  client,
  selectedDate
) => {
  if (!client || !selectedDate) {
    return {
      rows: [],
      totalLocal: 0,
      currencies: [],
      localCurrency: client?.devise || '—',
      selectedDate,
    };
  }

  if (
    client.dateEntree &&
    selectedDate < client.dateEntree
  ) {
    return {
      rows: [],
      totalLocal: 0,
      currencies: [],
      localCurrency: client.devise,
      selectedDate,
      beforeOpening: true,
    };
  }

  const localCurrency = client.devise;
  const referenceDate =
    HISTORY_PERIODS[HISTORY_PERIODS.length - 1]?.date ||
    selectedDate;

  const historicalPortfolioFactor =
    liquidityHistoryFactor(
      `${client.id}-${client.nom}-portfolio-state`,
      selectedDate,
      referenceDate
    );

  const totalLocal = Math.max(
    0,
    Number(client.encours || 0) *
      historicalPortfolioFactor
  );

  const exposures =
    client.expositionsDevises || {
      [localCurrency]: 100,
    };

  const allocation = {
    Actions: Math.max(
      0,
      Number(client.alloc?.Actions || 0)
    ),
    'Obl. souveraines': Math.max(
      0,
      Number(
        client.alloc?.['Obl. souveraines'] || 0
      )
    ),
    'Obl. privées': Math.max(
      0,
      Number(client.alloc?.['Obl. privées'] || 0)
    ),
    Liquidité: Math.max(
      0,
      Number(client.alloc?.Liquidité || 0)
    ),
  };

  const rows = [];

  const pushPosition = ({
    currency,
    currencyWeight,
    assetClass,
    assetWeight,
    instrument,
    targetLocalAmount,
    sequence,
  }) => {
    const fxAtDate = portfolioStateFxRateAtDate(
      currency,
      localCurrency,
      selectedDate
    );

    const targetInvestmentAmount =
      fxAtDate > 0
        ? targetLocalAmount / fxAtDate
        : targetLocalAmount;

    const isCash = assetClass === 'Liquidité';
    const title = isCash
      ? `Liquidité / support monétaire ${currency}`
      : instrument?.titre ||
        instrument?.nom ||
        `Exposition ${assetClass} ${currency}`;

    const listed =
      isCash
        ? false
        : instrument?.listed ??
          instrument?.cotation !== 'Non coté';

    const quotation =
      isCash
        ? 'Non coté'
        : listed
        ? 'Coté'
        : 'Non coté';

    const assetLabel = isCash
      ? 'Liquidité'
      : instrument?.assetLabel ||
        instrument?.type ||
        assetClass;

    const currentPrice = isCash
      ? 1
      : Number(
          instrument?.prixValorisation ??
            instrument?.cours ??
            instrument?.prix ??
            1
        );

    const historicalPrice = isCash
      ? 1
      : portfolioStatePriceAtDate(
          client,
          title,
          currentPrice,
          selectedDate
        );

    const explicitNonListed =
      quotation === 'Non coté' &&
      !isCash
        ? portfolioStateNonListedForCurrency(
            client,
            currency
          )
        : null;

    const cmpCandidate =
      Number(explicitNonListed?.cmp) > 0
        ? Number(explicitNonListed.cmp)
        : portfolioStateExplicitCmp(
            client,
            title,
            historicalPrice,
            `${currency}-${assetClass}-${sequence}`
          );

    const cmp = isCash ? 1 : cmpCandidate;

    const explicitQuantity =
      Number(explicitNonListed?.quantite) > 0 &&
      explicitNonListed?.titre === title
        ? Number(explicitNonListed.quantite)
        : null;

    const quantity =
      explicitQuantity ||
      Math.max(
        isCash ? 0.01 : 1,
        isCash
          ? targetInvestmentAmount
          : Math.floor(
              targetInvestmentAmount /
                Math.max(historicalPrice, 0.000001)
            )
      );

    const valueInvestment =
      quantity * historicalPrice;

    const acquisitionDate =
      client.dateEntree &&
      client.dateEntree <= selectedDate
        ? client.dateEntree
        : selectedDate;

    const fxAtAcquisition =
      portfolioStateFxRateAtDate(
        currency,
        localCurrency,
        acquisitionDate
      );

    const historicalCostInvestment =
      quantity * cmp;
    const valueLocal =
      valueInvestment * fxAtDate;
    const historicalCostLocal =
      historicalCostInvestment * fxAtAcquisition;

    const plusMinusInvestment =
      valueInvestment - historicalCostInvestment;
    const plusMinusLocal =
      valueLocal - historicalCostLocal;

    const returnInvestment =
      historicalCostInvestment > 0
        ? (plusMinusInvestment /
            historicalCostInvestment) *
          100
        : 0;

    const returnLocal =
      historicalCostLocal > 0
        ? (plusMinusLocal /
            historicalCostLocal) *
          100
        : 0;

    rows.push({
      id: `${client.id}-${currency}-${assetClass}-${sequence}-${title}`,
      typeActif: `${assetLabel} · ${quotation}`,
      assetLabel,
      quotation,
      title,
      quantity,
      cmp,
      currency,
      localCurrency,
      historicalPrice,
      plusMinusInvestment,
      plusMinusLocal,
      returnInvestment,
      returnLocal,
      weightingLocal:
        totalLocal > 0
          ? (valueLocal / totalLocal) * 100
          : 0,
      amountLocal: valueLocal,
      amountInvestment: valueInvestment,
      currencyWeight,
      assetWeight,
      source:
        instrument?.source ||
        (isCash
          ? 'Poche de liquidité'
          : 'Position de démonstration'),
    });
  };

  Object.entries(exposures).forEach(
    ([currency, currencyWeightRaw], currencyIndex) => {
      const currencyWeight = Math.max(
        0,
        Number(currencyWeightRaw || 0)
      );

      if (currencyWeight <= 0) return;

      const currencyLocalAmount =
        totalLocal * (currencyWeight / 100);

      const availableInstrumentCount =
        MARKETS_DATA.filter(
          (instrument) =>
            instrument.devise === currency
        ).length;

      const supportedBySecurities =
        availableInstrumentCount > 0;

      /*
       * Lorsque la maquette possède des instruments dans la devise, on
       * ventile la poche selon les classes d'actifs du client.
       * Pour USD/EUR, où aucun instrument n'existe encore dans le jeu de
       * données, une ligne monétaire agrégée matérialise l'exposition devise.
       */
      if (!supportedBySecurities) {
        pushPosition({
          currency,
          currencyWeight,
          assetClass: 'Liquidité',
          assetWeight: 100,
          instrument: {
            nom: `Exposition monétaire ${currency}`,
            cotation: 'Non coté',
            listed: false,
            assetLabel: 'Support monétaire',
            source:
              'Exposition devise sans instrument détaillé dans la maquette',
          },
          targetLocalAmount: currencyLocalAmount,
          sequence: currencyIndex,
        });
        return;
      }

      Object.entries(allocation).forEach(
        ([assetClass, assetWeightRaw], assetIndex) => {
          const assetWeight = Math.max(
            0,
            Number(assetWeightRaw || 0)
          );

          if (assetWeight <= 0) return;

          const targetLocalAmount =
            currencyLocalAmount *
            (assetWeight / 100);

          if (assetClass === 'Liquidité') {
            pushPosition({
              currency,
              currencyWeight,
              assetClass,
              assetWeight,
              instrument: null,
              targetLocalAmount,
              sequence: assetIndex,
            });
            return;
          }

          const candidates =
            portfolioStateInstrumentCandidates(
              currency,
              assetClass
            );

          if (candidates.length === 0) {
            /*
             * On évite d'inventer un titre précis lorsqu'aucun instrument
             * de la classe n'existe dans la maquette. Le montant reste
             * visible sous une ligne agrégée de portefeuille.
             */
            pushPosition({
              currency,
              currencyWeight,
              assetClass,
              assetWeight,
              instrument: {
                nom: `${assetClass} · exposition agrégée ${currency}`,
                cotation: 'Non coté',
                listed: false,
                assetLabel:
                  assetClass === 'Actions'
                    ? 'Actions'
                    : 'Obligations',
                source:
                  'Exposition agrégée faute de titre détaillé dans la maquette',
              },
              targetLocalAmount,
              sequence: assetIndex,
            });
            return;
          }

          /*
           * Deux titres maximum par classe/devise afin de garder l'état
           * lisible tout en matérialisant plusieurs lignes de portefeuille.
           */
          const selectedCandidates =
            candidates.slice(
              0,
              Math.min(2, candidates.length)
            );

          const candidateWeights =
            selectedCandidates.length === 1
              ? [1]
              : [0.58, 0.42];

          selectedCandidates.forEach(
            (instrument, instrumentIndex) => {
              pushPosition({
                currency,
                currencyWeight,
                assetClass,
                assetWeight,
                instrument,
                targetLocalAmount:
                  targetLocalAmount *
                  candidateWeights[instrumentIndex],
                sequence:
                  assetIndex * 10 + instrumentIndex,
              });
            }
          );
        }
      );
    }
  );

  const currencies = Array.from(
    new Set(rows.map((row) => row.currency))
  ).sort((a, b) => a.localeCompare(b, 'fr'));

  return {
    rows: rows
      .filter(
        (row) =>
          Number(row.amountLocal || 0) > 0 &&
          Number(row.quantity || 0) > 0
      )
      .sort((a, b) => {
        if (a.currency !== b.currency) {
          return a.currency.localeCompare(
            b.currency,
            'fr'
          );
        }
        return (
          Number(b.amountLocal || 0) -
          Number(a.amountLocal || 0)
        );
      }),
    totalLocal,
    currencies,
    localCurrency,
    selectedDate,
    beforeOpening: false,
  };
};

const buildPortfolioLiquidityByCurrencyAtDate = (
  client,
  selectedDate
) => {
  if (!client || !selectedDate) {
    return {
      rows: [],
      totalLocal: 0,
      reservedLocal: 0,
      availableLocal: 0,
      localCurrency: client?.devise || '—',
      selectedDate,
    };
  }

  if (
    client.dateEntree &&
    selectedDate < client.dateEntree
  ) {
    return {
      rows: [],
      totalLocal: 0,
      reservedLocal: 0,
      availableLocal: 0,
      localCurrency: client.devise,
      selectedDate,
      beforeOpening: true,
    };
  }

  const localCurrency = client.devise;
  const referenceDate =
    HISTORY_PERIODS[HISTORY_PERIODS.length - 1]?.date ||
    selectedDate;

  const portfolioFactor = liquidityHistoryFactor(
    `${client.id}-${client.nom}-portfolio-liquidity`,
    selectedDate,
    referenceDate
  );

  const currentLiquidityLocal =
    (Number(client.encours || 0) *
      Math.max(
        0,
        Number(client.alloc?.Liquidité || 0)
      )) /
    100;

  const historicalLiquidityLocal =
    currentLiquidityLocal * portfolioFactor;

  const exposures =
    client.expositionsDevises || {
      [localCurrency]: 100,
    };

  const explicitLiquidityByCurrency =
    client.liquiditeParDevise ||
    client.cashByCurrency ||
    client.liquiditeDevises ||
    null;

  const explicitReservedByCurrency =
    client.liquiditeReserveeParDevise ||
    client.reservedCashByCurrency ||
    client.cashReservedByCurrency ||
    null;

  const explicitAvailableByCurrency =
    client.liquiditeDisponibleParDevise ||
    client.availableCashByCurrency ||
    client.cashAvailableByCurrency ||
    null;

  const openOrderStatuses = new Set([
    'En cours',
    'En attente',
  ]);

  const selectedIsCurrentReference =
    selectedDate >= referenceDate;

  const rows = Object.entries(exposures)
    .filter(([, weight]) => Number(weight || 0) > 0)
    .map(([currency, weightRaw]) => {
      const weight = Math.max(
        0,
        Number(weightRaw || 0)
      );

      const fxAtDate =
        portfolioStateFxRateAtDate(
          currency,
          localCurrency,
          selectedDate
        );

      const defaultTotalLocal =
        historicalLiquidityLocal * (weight / 100);

      const defaultTotalCurrency =
        fxAtDate > 0
          ? defaultTotalLocal / fxAtDate
          : defaultTotalLocal;

      const explicitEntry =
        explicitLiquidityByCurrency?.[currency];

      const explicitTotal =
        typeof explicitEntry === 'number'
          ? Number(explicitEntry)
          : Number(
              explicitEntry?.total ??
                explicitEntry?.liquiditeTotale ??
                explicitEntry?.totalLiquidity
            );

      const totalCurrency =
        Number.isFinite(explicitTotal) &&
        explicitTotal >= 0
          ? explicitTotal
          : defaultTotalCurrency;

      const explicitReserved =
        Number(
          typeof explicitEntry === 'object'
            ? explicitEntry?.reservee ??
                explicitEntry?.liquiditeReservee ??
                explicitEntry?.reserved
            : explicitReservedByCurrency?.[currency]
        );

      const reservedFromOpenOrders =
        selectedIsCurrentReference
          ? ORDERS.filter(
              (order) =>
                order.pf === client.nom &&
                order.sens === 'Achat' &&
                order.devise === currency &&
                openOrderStatuses.has(order.statut)
            ).reduce(
              (sum, order) =>
                sum +
                Number(order.qte || 0) *
                  Number(order.prix || 0),
              0
            )
          : 0;

      const reservedCurrency = Math.min(
        totalCurrency,
        Math.max(
          0,
          Number.isFinite(explicitReserved)
            ? explicitReserved
            : reservedFromOpenOrders
        )
      );

      const explicitAvailable =
        Number(
          typeof explicitEntry === 'object'
            ? explicitEntry?.disponible ??
                explicitEntry?.liquiditeDisponible ??
                explicitEntry?.available
            : explicitAvailableByCurrency?.[currency]
        );

      const availableCurrency =
        Number.isFinite(explicitAvailable)
          ? Math.max(
              0,
              Math.min(
                totalCurrency,
                explicitAvailable
              )
            )
          : Math.max(
              0,
              totalCurrency - reservedCurrency
            );

      const totalLocal =
        totalCurrency * fxAtDate;
      const reservedLocal =
        reservedCurrency * fxAtDate;
      const availableLocal =
        availableCurrency * fxAtDate;

      return {
        currency,
        weight,
        fxAtDate,
        total: totalCurrency,
        reserved: reservedCurrency,
        available: availableCurrency,
        totalLocal,
        reservedLocal,
        availableLocal,
        reservationSource:
          Number.isFinite(explicitReserved)
            ? 'Donnée portefeuille'
            : reservedFromOpenOrders > 0
            ? 'Ordres d’achat ouverts'
            : selectedIsCurrentReference
            ? 'Aucune réservation ouverte'
            : 'Historique des réservations non renseigné',
      };
    })
    .sort(
      (a, b) =>
        Number(b.totalLocal || 0) -
        Number(a.totalLocal || 0)
    );

  return {
    rows,
    totalLocal: rows.reduce(
      (sum, row) =>
        sum + Number(row.totalLocal || 0),
      0
    ),
    reservedLocal: rows.reduce(
      (sum, row) =>
        sum + Number(row.reservedLocal || 0),
      0
    ),
    availableLocal: rows.reduce(
      (sum, row) =>
        sum + Number(row.availableLocal || 0),
      0
    ),
    localCurrency,
    selectedDate,
    beforeOpening: false,
  };
};

function PortfolioStateCompactTh({
  children,
  align = 'left',
}) {
  return (
    <th
      className="uppercase font-semibold align-bottom"
      style={{
        color: C.sub,
        ...F_BODY,
        fontSize: 8,
        lineHeight: 1.15,
        letterSpacing: '0.025em',
        padding: '7px 5px',
        textAlign: align,
        whiteSpace: 'nowrap',
        overflowWrap: 'normal',
      }}
    >
      {children}
    </th>
  );
}

function PortfolioStateCompactTd({
  children,
  mono = false,
  align = 'left',
  className = '',
}) {
  return (
    <td
      className={`align-middle ${className}`}
      style={{
        color: C.ink,
        ...(mono ? F_MONO : F_BODY),
        fontSize: 8.5,
        lineHeight: 1.2,
        padding: '6px 5px',
        textAlign: align,
        whiteSpace: mono ? 'nowrap' : 'normal',
        overflowWrap: mono ? 'normal' : 'break-word',
      }}
    >
      {children}
    </td>
  );
}

function Portefeuilles({ go, openClient, initialFilter }) {
  const [q, setQ] = useState('');
  const [vuePortefeuillesMode, setVuePortefeuillesMode] =
    useState('liste');
  const [evolutionClientId, setEvolutionClientId] = useState(
    CLIENTS[0]?.id || ''
  );
  const [evolutionDateDebut, setEvolutionDateDebut] = useState(
    HISTORY_PERIODS[0]?.date || ''
  );
  const [evolutionInvestmentCurrency, setEvolutionInvestmentCurrency] =
    useState('');
  const [evolutionDisplayMode, setEvolutionDisplayMode] =
    useState('comparaison');
  const [
    portfolioStateCurrencyFilter,
    setPortfolioStateCurrencyFilter,
  ] = useState('Toutes');

  const evolutionClient =
    CLIENTS.find((client) => client.id === evolutionClientId) ||
    CLIENTS[0] ||
    null;

  const evolutionInvestmentCurrencies = evolutionClient
    ? Object.entries(
        evolutionClient.expositionsDevises || {
          [evolutionClient.devise]: 100,
        }
      )
        .filter(([, weight]) => Number(weight || 0) > 0)
        .map(([currency]) => currency)
        .sort((a, b) => a.localeCompare(b, 'fr'))
    : [];

  const evolutionCurrencyActive =
    evolutionInvestmentCurrencies.includes(
      evolutionInvestmentCurrency
    )
      ? evolutionInvestmentCurrency
      : evolutionInvestmentCurrencies[0] || '';

  const evolutionExposurePct = evolutionClient
    ? Number(
        (
          evolutionClient.expositionsDevises || {
            [evolutionClient.devise]: 100,
          }
        )[evolutionCurrencyActive] || 0
      )
    : 0;

  const evolutionDateMinimum =
    HISTORY_PERIODS[0]?.date || '';
  const evolutionDateMaximum =
    HISTORY_PERIODS[HISTORY_PERIODS.length - 1]?.date || '';

  const evolutionRaw = buildPortfolioCurrencyEvolution(
    evolutionClient,
    evolutionCurrencyActive
  );

  const evolutionFiltered = evolutionRaw.filter(
    (point) =>
      !evolutionDateDebut || point.date >= evolutionDateDebut
  );

  const evolutionFirst =
    evolutionFiltered[0] || evolutionRaw[0] || null;
  const evolutionLast =
    evolutionFiltered[evolutionFiltered.length - 1] ||
    evolutionRaw[evolutionRaw.length - 1] ||
    null;

  const evolutionSeries =
    evolutionFirst
      ? evolutionFiltered.map((point) => ({
          ...point,
          nationalIndex:
            Number(evolutionFirst.nationalValue || 0) > 0
              ? Number(
                  (
                    (Number(point.nationalValue || 0) /
                      Number(evolutionFirst.nationalValue || 1)) *
                    100
                  ).toFixed(2)
                )
              : 100,
          investmentIndex:
            Number(evolutionFirst.investmentValue || 0) > 0
              ? Number(
                  (
                    (Number(point.investmentValue || 0) /
                      Number(
                        evolutionFirst.investmentValue || 1
                      )) *
                    100
                  ).toFixed(2)
                )
              : 100,
        }))
      : [];

  const pctChange = (start, end) =>
    Number(start || 0) > 0
      ? ((Number(end || 0) / Number(start || 1)) - 1) * 100
      : 0;

  const evolutionNationalChange = pctChange(
    evolutionFirst?.nationalValue,
    evolutionLast?.nationalValue
  );
  const evolutionInvestmentChange = pctChange(
    evolutionFirst?.investmentValue,
    evolutionLast?.investmentValue
  );
  const evolutionFxImpact =
    evolutionNationalChange - evolutionInvestmentChange;

  const evolutionNationalCurrency =
    evolutionClient?.devise || '—';

  const evolutionPeriodLabel =
    evolutionFiltered.length > 0
      ? `${new Date(
          `${evolutionFiltered[0].date}T00:00:00`
        ).toLocaleDateString('fr-FR')} → ${new Date(
          `${evolutionFiltered[
            evolutionFiltered.length - 1
          ].date}T00:00:00`
        ).toLocaleDateString('fr-FR')}`
      : 'Aucune donnée sur la période';

  const evolutionCurrencyWeightRows =
    evolutionClient
      ? Object.entries(
          evolutionClient.expositionsDevises || {
            [evolutionClient.devise]: 100,
          }
        )
          .filter(([, weight]) => Number(weight || 0) > 0)
          .sort((a, b) => Number(b[1]) - Number(a[1]))
      : [];

  const portfolioStateAtSelectedDate =
    buildPortfolioStateAtDate(
      evolutionClient,
      evolutionDateDebut
    );

  const portfolioLiquidityAtSelectedDate =
    buildPortfolioLiquidityByCurrencyAtDate(
      evolutionClient,
      evolutionDateDebut
    );

  const portfolioStateRows =
    portfolioStateCurrencyFilter === 'Toutes'
      ? portfolioStateAtSelectedDate.rows
      : portfolioStateAtSelectedDate.rows.filter(
          (row) =>
            row.currency ===
            portfolioStateCurrencyFilter
        );

  const portfolioStateTotalDisplayedLocal =
    portfolioStateRows.reduce(
      (sum, row) =>
        sum + Number(row.amountLocal || 0),
      0
    );

  const portfolioStatePmvDisplayedLocal =
    portfolioStateRows.reduce(
      (sum, row) =>
        sum + Number(row.plusMinusLocal || 0),
      0
    );

  const portfolioStateListedCount =
    portfolioStateRows.filter(
      (row) => row.quotation === 'Coté'
    ).length;

  const portfolioStateNonListedCount =
    portfolioStateRows.filter(
      (row) => row.quotation === 'Non coté'
    ).length;

  const portfolioStateDateLabel =
    evolutionDateDebut
      ? new Date(
          `${evolutionDateDebut}T00:00:00`
        ).toLocaleDateString('fr-FR')
      : '—';

  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', 'Vue Portefeuilles']} />

      <div className="flex items-center justify-between gap-4 flex-wrap">
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
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: C.navySoft }}
        >
          {[
            {
              id: 'liste',
              label: 'Liste des portefeuilles',
            },
            {
              id: 'evolution',
              label: 'Évolution des investissements',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setVuePortefeuillesMode(tab.id)}
              className="px-3 py-2 rounded-lg text-xs font-semibold"
              style={{
                background:
                  vuePortefeuillesMode === tab.id
                    ? C.card
                    : 'transparent',
                color:
                  vuePortefeuillesMode === tab.id
                    ? C.navy
                    : C.sub,
                boxShadow:
                  vuePortefeuillesMode === tab.id
                    ? '0 1px 4px rgba(15,27,51,0.10)'
                    : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {vuePortefeuillesMode === 'liste' && (
        <>
          <div className="flex items-center justify-end">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl border"
              style={{ borderColor: C.line }}
            >
              <Search size={14} color={C.sub} />
              <input name="gsm-portfoliostatescreen-1264" aria-label="Rechercher un client…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un client…"
                className="text-sm outline-none"
                style={F_BODY}
              />
            </div>
          </div>

          <Card className="p-0 overflow-hidden">
            <div
              className="overflow-auto"
              style={{
                maxHeight: 'calc(100vh - 290px)',
                minHeight: 360,
                scrollbarGutter: 'stable',
              }}
            >
              <table className="w-full">
                <thead
                  className="sticky top-0"
                  style={{
                    background: C.navySoft,
                    zIndex: 2,
                    boxShadow: `0 1px 0 ${C.line}`,
                  }}
                >
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
                    c.nom
                      .toLowerCase()
                      .includes(q.toLowerCase())
                  ).map((c, idx) => {
                    const ecart = Math.max(
                      ...Object.keys(c.alloc).map((k) =>
                        Math.abs(
                          c.alloc[k] - c.cible[k]
                        )
                      )
                    );

                    return (
                      <tr
                        key={c.id}
                        onClick={() => openClient(c.id)}
                        className="cursor-pointer"
                        style={{
                          borderTop: `1px solid ${C.line}`,
                          background:
                            idx % 2 ? C.navySoft : C.card,
                        }}
                      >
                        <Td>
                          <span className="font-semibold">
                            {c.nom}
                          </span>
                          <div
                            className="text-xs"
                            style={{ color: C.sub }}
                          >
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
                            <Badge tone="coral">
                              {ecart} pts
                            </Badge>
                          ) : (
                            <Badge tone="teal">
                              {ecart} pts
                            </Badge>
                          )}
                        </Td>
                        <Td>{c.risque}</Td>
                        <Td>
                          {c.alertes > 0 ? (
                            <Badge tone="coral">
                              {c.alertes}
                            </Badge>
                          ) : (
                            <Badge tone="teal">0</Badge>
                          )}
                        </Td>
                        <Td>
                          <ChevronRight
                            size={15}
                            color={C.sub}
                          />
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {vuePortefeuillesMode === 'evolution' && (
        <Card className="p-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Eyebrow>Suivi multi-devises</Eyebrow>
              <div
                className="text-base font-bold"
                style={{ color: C.ink }}
              >
                Évolution des investissements du portefeuille
              </div>
              <div
                className="text-[10px] mt-1 max-w-4xl"
                style={{ color: C.sub }}
              >
                Visualisez une même exposition dans la monnaie
                nationale du client et dans sa monnaie
                d&apos;investissement. La comparaison est normalisée en
                base 100 pour rendre les deux trajectoires directement
                comparables malgré des unités monétaires différentes.
              </div>
            </div>

            <Badge tone="navy">
              {evolutionClient?.marche || '—'} ·{' '}
              {evolutionNationalCurrency}
            </Badge>
          </div>

          <div
            className="grid grid-cols-4 gap-3 mt-4 p-3 rounded-xl"
            style={{ background: C.surfaceElevated }}
          >
            <label className="text-[10px] font-semibold">
              <span
                className="block mb-1"
                style={{ color: C.sub }}
              >
                Portefeuille client
              </span>
              <select name="gsm-portfoliostatescreen-1427"
                value={evolutionClient?.id || ''}
                onChange={(event) => {
                  setEvolutionClientId(event.target.value);
                  setEvolutionInvestmentCurrency('');
                  setPortfolioStateCurrencyFilter('Toutes');
                }}
                className="w-full px-3 py-2 rounded-xl border text-xs"
                style={{
                  borderColor: C.line,
                  background: C.surfaceCard,
                  color: C.ink,
                }}
              >
                {CLIENTS.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nom} · {client.devise}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-[10px] font-semibold">
              <span
                className="block mb-1"
                style={{ color: C.sub }}
              >
                Depuis le
              </span>
              <input name="gsm-portfoliostatescreen-1456"
                type="date"
                min={evolutionDateMinimum}
                max={evolutionDateMaximum}
                value={evolutionDateDebut}
                onChange={(event) =>
                  setEvolutionDateDebut(event.target.value)
                }
                className="w-full px-3 py-2 rounded-xl border text-xs"
                style={{
                  borderColor: C.line,
                  background: C.surfaceCard,
                  color: C.ink,
                }}
              />
            </label>

            <label className="text-[10px] font-semibold">
              <span
                className="block mb-1"
                style={{ color: C.sub }}
              >
                Monnaie d&apos;investissement
              </span>
              <select name="gsm-portfoliostatescreen-1480"
                value={evolutionCurrencyActive}
                onChange={(event) =>
                  setEvolutionInvestmentCurrency(
                    event.target.value
                  )
                }
                className="w-full px-3 py-2 rounded-xl border text-xs"
                style={{
                  borderColor: C.line,
                  background: C.surfaceCard,
                  color: C.ink,
                }}
              >
                {evolutionInvestmentCurrencies.map(
                  (currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  )
                )}
              </select>
            </label>

            <div className="text-[10px] font-semibold">
              <span
                className="block mb-1"
                style={{ color: C.sub }}
              >
                Monnaie nationale du client
              </span>
              <div
                className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                style={{
                  borderColor: C.line,
                  background: C.surfaceInset,
                  color: C.navy,
                  ...F_MONO,
                }}
              >
                {evolutionNationalCurrency}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mt-3 flex-wrap">
            <div
              className="flex items-center gap-1 p-1 rounded-xl"
              style={{ background: C.surfaceInset }}
            >
              {[
                {
                  id: 'national',
                  label: `Monnaie nationale (${evolutionNationalCurrency})`,
                },
                {
                  id: 'investment',
                  label: `Monnaie d’investissement (${evolutionCurrencyActive})`,
                },
                {
                  id: 'comparaison',
                  label: 'Comparer · base 100',
                },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() =>
                    setEvolutionDisplayMode(mode.id)
                  }
                  className="px-3 py-1.5 rounded-lg text-[10px] font-semibold"
                  style={{
                    background:
                      evolutionDisplayMode === mode.id
                        ? C.surfaceCard
                        : 'transparent',
                    color:
                      evolutionDisplayMode === mode.id
                        ? C.navy
                        : C.sub,
                    boxShadow:
                      evolutionDisplayMode === mode.id
                        ? '0 1px 4px rgba(15,27,51,0.10)'
                        : 'none',
                  }}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <div className="text-[9px]" style={{ color: C.sub }}>
              Période : <b style={{ color: C.ink }}>{evolutionPeriodLabel}</b>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mt-3">
            <div
              className="p-3 rounded-xl border"
              style={{ borderColor: C.line }}
            >
              <div
                className="text-[9px] uppercase font-semibold"
                style={{ color: C.sub }}
              >
                Exposition sélectionnée
              </div>
              <div
                className="text-lg font-bold mt-1"
                style={{ ...F_MONO, color: C.ink }}
              >
                {evolutionExposurePct.toFixed(1)} %
              </div>
              <div
                className="text-[9px] mt-1"
                style={{ color: C.sub }}
              >
                du portefeuille en {evolutionCurrencyActive}
              </div>
            </div>

            <div
              className="p-3 rounded-xl border"
              style={{ borderColor: C.line }}
            >
              <div
                className="text-[9px] uppercase font-semibold"
                style={{ color: C.sub }}
              >
                Valeur actuelle · monnaie nationale
              </div>
              <div
                className="text-sm font-bold mt-1"
                style={{ ...F_MONO, color: C.navy }}
              >
                {fmt(
                  Math.round(
                    Number(evolutionLast?.nationalValue || 0)
                  )
                )}{' '}
                {evolutionNationalCurrency}
              </div>
              <div className="mt-1">
                <Pct v={evolutionNationalChange} />
              </div>
            </div>

            <div
              className="p-3 rounded-xl border"
              style={{ borderColor: C.line }}
            >
              <div
                className="text-[9px] uppercase font-semibold"
                style={{ color: C.sub }}
              >
                Valeur actuelle · monnaie d&apos;investissement
              </div>
              <div
                className="text-sm font-bold mt-1"
                style={{ ...F_MONO, color: C.teal }}
              >
                {fmt(
                  Math.round(
                    Number(
                      evolutionLast?.investmentValue || 0
                    )
                  )
                )}{' '}
                {evolutionCurrencyActive}
              </div>
              <div className="mt-1">
                <Pct v={evolutionInvestmentChange} />
              </div>
            </div>

            <div
              className="p-3 rounded-xl border"
              style={{
                borderColor: C.line,
                background:
                  Math.abs(evolutionFxImpact) < 0.05
                    ? C.surfaceElevated
                    : evolutionFxImpact > 0
                    ? C.positiveBackground
                    : C.negativeBackground,
              }}
            >
              <div
                className="text-[9px] uppercase font-semibold"
                style={{ color: C.sub }}
              >
                Écart de trajectoire
              </div>
              <div
                className="text-lg font-bold mt-1"
                style={{
                  ...F_MONO,
                  color:
                    Math.abs(evolutionFxImpact) < 0.05
                      ? C.sub
                      : evolutionFxImpact > 0
                      ? C.teal
                      : C.coral,
                }}
              >
                {evolutionFxImpact >= 0 ? '+' : ''}
                {evolutionFxImpact.toFixed(2)} pts
              </div>
              <div
                className="text-[9px] mt-1"
                style={{ color: C.sub }}
              >
                effet de conversion sur la période
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4">
            <div
              className="col-span-3 p-3 rounded-xl border"
              style={{ borderColor: C.line }}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div>
                  <div
                    className="text-xs font-bold"
                    style={{ color: C.ink }}
                  >
                    {evolutionDisplayMode === 'comparaison'
                      ? 'Comparaison des trajectoires'
                      : evolutionDisplayMode === 'national'
                      ? `Évolution en ${evolutionNationalCurrency}`
                      : `Évolution en ${evolutionCurrencyActive}`}
                  </div>
                  <div
                    className="text-[9px] mt-0.5"
                    style={{ color: C.sub }}
                  >
                    {evolutionDisplayMode === 'comparaison'
                      ? 'Base 100 à la date de départ sélectionnée'
                      : 'Valeur monétaire de l’exposition sélectionnée'}
                  </div>
                </div>

                {evolutionDisplayMode === 'comparaison' && (
                  <div className="flex items-center gap-3 text-[9px]">
                    <span
                      className="flex items-center gap-1.5"
                      style={{ color: C.sub }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: C.navy }}
                      />
                      Monnaie nationale
                    </span>
                    <span
                      className="flex items-center gap-1.5"
                      style={{ color: C.sub }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: C.teal }}
                      />
                      Monnaie d&apos;investissement
                    </span>
                  </div>
                )}
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={evolutionSeries}
                  margin={{
                    top: 10,
                    right: 22,
                    left: 8,
                    bottom: 4,
                  }}
                >
                  <CartesianGrid
                    stroke={C.line}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="mois"
                    tick={{ fontSize: 10, fill: C.sub }}
                    axisLine={{ stroke: C.line }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: C.sub }}
                    axisLine={false}
                    tickLine={false}
                    width={76}
                    tickFormatter={(value) =>
                      evolutionDisplayMode === 'comparaison'
                        ? Number(value).toFixed(0)
                        : fmtCompactMontant(value)
                    }
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (
                        evolutionDisplayMode === 'comparaison'
                      ) {
                        return [
                          `${Number(value).toFixed(2)}`,
                          name,
                        ];
                      }

                      const currency =
                        evolutionDisplayMode === 'national'
                          ? evolutionNationalCurrency
                          : evolutionCurrencyActive;

                      return [
                        `${fmt(Math.round(Number(value)))} ${currency}`,
                        name,
                      ];
                    }}
                    labelFormatter={(label) => `Période : ${label}`}
                    contentStyle={{
                      borderRadius: 10,
                      border: `1px solid ${C.line}`,
                      fontSize: 11,
                    }}
                  />

                  {evolutionDisplayMode === 'national' && (
                    <Line
                      type="monotone"
                      dataKey="nationalValue"
                      name={`Valeur en ${evolutionNationalCurrency}`}
                      stroke={C.navy}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                      isAnimationActive={false}
                    />
                  )}

                  {evolutionDisplayMode === 'investment' && (
                    <Line
                      type="monotone"
                      dataKey="investmentValue"
                      name={`Valeur en ${evolutionCurrencyActive}`}
                      stroke={C.teal}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                      isAnimationActive={false}
                    />
                  )}

                  {evolutionDisplayMode === 'comparaison' && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="nationalIndex"
                        name={`Monnaie nationale · ${evolutionNationalCurrency}`}
                        stroke={C.navy}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4 }}
                        isAnimationActive={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="investmentIndex"
                        name={`Monnaie d’investissement · ${evolutionCurrencyActive}`}
                        stroke={C.teal}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4 }}
                        isAnimationActive={false}
                      />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>

              {evolutionSeries.length === 0 && (
                <div
                  className="text-center text-xs py-8"
                  style={{ color: C.sub }}
                >
                  Aucune donnée disponible pour la période sélectionnée.
                </div>
              )}
            </div>

            <div
              className="p-3 rounded-xl border"
              style={{ borderColor: C.line }}
            >
              <Eyebrow>Monnaies d&apos;investissement</Eyebrow>
              <div
                className="text-xs font-bold"
                style={{ color: C.ink }}
              >
                Filtrer l&apos;exposition
              </div>
              <div
                className="text-[9px] mt-1"
                style={{ color: C.sub }}
              >
                Cliquez sur une monnaie pour l&apos;afficher dans
                le graphique.
              </div>

              <div className="space-y-2 mt-3">
                {evolutionCurrencyWeightRows.map(
                  ([currency, weight]) => {
                    const active =
                      currency === evolutionCurrencyActive;

                    return (
                      <button
                        key={currency}
                        type="button"
                        onClick={() =>
                          setEvolutionInvestmentCurrency(
                            currency
                          )
                        }
                        className="w-full p-2.5 rounded-xl border text-left"
                        style={{
                          borderColor: active
                            ? C.indigo
                            : C.line,
                          background: active
                            ? C.infoBackground
                            : C.surfaceCard,
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="text-xs font-bold"
                            style={{
                              color: active
                                ? C.indigo
                                : C.ink,
                              ...F_MONO,
                            }}
                          >
                            {currency}
                          </span>
                          <Badge
                            tone={active ? 'navy' : 'slate'}
                          >
                            {Number(weight).toFixed(1)} %
                          </Badge>
                        </div>
                        <div
                          className="h-1.5 rounded-full mt-2 overflow-hidden"
                          style={{ background: C.surfaceInset }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(
                                  100,
                                  Number(weight || 0)
                                )
                              )}%`,
                              background: active
                                ? C.indigo
                                : C.navy,
                            }}
                          />
                        </div>
                      </button>
                    );
                  }
                )}
              </div>

              <div
                className="mt-4 p-3 rounded-xl text-[9px]"
                style={{
                  background: C.warningBackground,
                  color: C.sub,
                }}
              >
                <b style={{ color: C.ink }}>
                  Lecture :
                </b>{' '}
                la courbe en monnaie nationale intègre l&apos;effet
                de conversion de la monnaie d&apos;investissement.
                La comparaison base 100 permet d&apos;isoler visuellement
                l&apos;écart de trajectoire.
              </div>
            </div>
          </div>



          {/* -------- ÉTAT DU PORTEFEUILLE À LA DATE SÉLECTIONNÉE -------- */}
          <div
            className="mt-4 rounded-2xl border overflow-hidden"
            style={{ borderColor: C.navy }}
          >
            <div
              className="p-4 flex items-start justify-between gap-4 flex-wrap"
              style={{ background: C.surfaceElevated }}
            >
              <div>
                <Eyebrow>
                  État du portefeuille à la date sélectionnée
                </Eyebrow>
                <div
                  className="text-sm font-bold"
                  style={{ color: C.ink }}
                >
                  {evolutionClient?.nom || 'Portefeuille'} ·{' '}
                  {portfolioStateDateLabel}
                </div>
                <div
                  className="text-[10px] mt-1 max-w-4xl"
                  style={{ color: C.sub }}
                >
                  Lecture multidevise des positions : le CMP et la
                  +/- Value d&apos;investissement sont exprimés dans la
                  devise de chaque ligne ; la seconde lecture convertit
                  le résultat dans la devise locale du client.
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge tone="navy">
                  Devise locale :{' '}
                  {portfolioStateAtSelectedDate.localCurrency}
                </Badge>
                <Badge tone="teal">
                  {portfolioStateListedCount} coté(s)
                </Badge>
                <Badge tone="gold">
                  {portfolioStateNonListedCount} non coté(s)
                </Badge>
              </div>
            </div>

            <div
              className="px-4 py-3 flex items-end justify-between gap-4 flex-wrap"
              style={{
                borderTop: `1px solid ${C.line}`,
                borderBottom: `1px solid ${C.line}`,
                background: C.surfaceCard,
              }}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: C.sub }}
                >
                  Monnaie d&apos;investissement
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPortfolioStateCurrencyFilter(
                      'Toutes'
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold"
                  style={{
                    borderColor:
                      portfolioStateCurrencyFilter ===
                      'Toutes'
                        ? C.indigo
                        : C.line,
                    background:
                      portfolioStateCurrencyFilter ===
                      'Toutes'
                        ? C.infoBackground
                        : C.surfaceCard,
                    color:
                      portfolioStateCurrencyFilter ===
                      'Toutes'
                        ? C.indigo
                        : C.sub,
                  }}
                >
                  Toutes
                </button>

                {portfolioStateAtSelectedDate.currencies.map(
                  (currency) => (
                    <button
                      key={currency}
                      type="button"
                      onClick={() =>
                        setPortfolioStateCurrencyFilter(
                          currency
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold"
                      style={{
                        borderColor:
                          portfolioStateCurrencyFilter ===
                          currency
                            ? C.indigo
                            : C.line,
                        background:
                          portfolioStateCurrencyFilter ===
                          currency
                            ? C.infoBackground
                            : C.surfaceCard,
                        color:
                          portfolioStateCurrencyFilter ===
                          currency
                            ? C.indigo
                            : C.sub,
                      }}
                    >
                      {currency}
                    </button>
                  )
                )}
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <div
                    className="text-[8px] uppercase font-semibold"
                    style={{ color: C.sub }}
                  >
                    Montant affiché
                  </div>
                  <div
                    className="text-xs font-bold"
                    style={{ ...F_MONO, color: C.ink }}
                  >
                    {fmt(
                      Math.round(
                        portfolioStateTotalDisplayedLocal
                      )
                    )}{' '}
                    {portfolioStateAtSelectedDate.localCurrency}
                  </div>
                </div>

                <div>
                  <div
                    className="text-[8px] uppercase font-semibold"
                    style={{ color: C.sub }}
                  >
                    +/- Value locale
                  </div>
                  <div
                    className="text-xs font-bold"
                    style={{
                      ...F_MONO,
                      color:
                        portfolioStatePmvDisplayedLocal >= 0
                          ? C.teal
                          : C.coral,
                    }}
                  >
                    {portfolioStatePmvDisplayedLocal >= 0
                      ? '+'
                      : ''}
                    {fmt(
                      Math.round(
                        portfolioStatePmvDisplayedLocal
                      )
                    )}{' '}
                    {portfolioStateAtSelectedDate.localCurrency}
                  </div>
                </div>

                <div>
                  <div
                    className="text-[8px] uppercase font-semibold"
                    style={{ color: C.sub }}
                  >
                    Lignes
                  </div>
                  <div
                    className="text-xs font-bold"
                    style={{ ...F_MONO, color: C.ink }}
                  >
                    {portfolioStateRows.length}
                  </div>
                </div>
              </div>
            </div>

            {portfolioStateAtSelectedDate.beforeOpening ? (
              <div
                className="p-6 text-center text-xs"
                style={{ color: C.sub }}
              >
                Le portefeuille n&apos;était pas encore ouvert à cette date.
              </div>
            ) : (
              <div
                className="gsm-table-scroll overflow-y-auto"
                style={{
                  maxHeight: 440,
                  scrollbarGutter: 'stable',
                  width: '100%',
                }}
              >
                <table
                  className="w-full gsm-table--banking"
                  style={{
                    width: '100%',
                    minWidth: 1180,
                    tableLayout: 'fixed',
                    borderCollapse: 'collapse',
                  }}
                >
                  <colgroup>
                    <col style={{ width: 100 }} />
                    <col style={{ width: 190 }} />
                    <col style={{ width: 105 }} />
                    <col style={{ width: 100 }} />
                    <col style={{ width: 130 }} />
                    <col style={{ width: 130 }} />
                    <col style={{ width: 120 }} />
                    <col style={{ width: 120 }} />
                    <col style={{ width: 110 }} />
                    <col style={{ width: 125 }} />
                  </colgroup>

                  <thead
                    className="sticky top-0"
                    style={{
                      background: C.surfaceElevated,
                      zIndex: 3,
                      boxShadow: `0 1px 0 ${C.line}`,
                    }}
                  >
                    <tr>
                      <PortfolioStateCompactTh>
                        Type
                        <br />
                        d&apos;actif
                      </PortfolioStateCompactTh>
                      <PortfolioStateCompactTh>
                        Intitulé
                        <br />
                        de l&apos;actif
                      </PortfolioStateCompactTh>
                      <PortfolioStateCompactTh align="right">
                        Quantité en
                        <br />
                        portefeuille
                      </PortfolioStateCompactTh>
                      <PortfolioStateCompactTh align="right">
                        CMP
                      </PortfolioStateCompactTh>
                      <PortfolioStateCompactTh align="right">
                        +/- Value
                        <br />
                        devise d&apos;investissement
                      </PortfolioStateCompactTh>
                      <PortfolioStateCompactTh align="right">
                        +/- Value
                        <br />
                        devise locale
                      </PortfolioStateCompactTh>
                      <PortfolioStateCompactTh align="right">
                        Rendement
                        <br />
                        devise d&apos;investissement
                      </PortfolioStateCompactTh>
                      <PortfolioStateCompactTh align="right">
                        Rendement
                        <br />
                        devise locale
                      </PortfolioStateCompactTh>
                      <PortfolioStateCompactTh align="right">
                        Pondération
                        <br />
                        devise locale
                      </PortfolioStateCompactTh>
                      <PortfolioStateCompactTh align="right">
                        Montant
                        <br />
                        devise locale
                      </PortfolioStateCompactTh>
                    </tr>
                  </thead>

                  <tbody>
                    {portfolioStateRows.map(
                      (row, index) => {
                        const gainInvestment =
                          row.plusMinusInvestment >= 0;
                        const gainLocal =
                          row.plusMinusLocal >= 0;

                        return (
                          <tr
                            key={row.id}
                            style={{
                              borderTop: `1px solid ${C.line}`,
                              background:
                                index % 2
                                  ? C.rowAlternate
                                  : C.surfaceCard,
                            }}
                          >
                            <PortfolioStateCompactTd>
                              <div className="flex flex-col gap-1 items-start">
                                <span
                                  className="rounded-full font-semibold"
                                  style={{
                                    padding: '2px 5px',
                                    fontSize: 7.5,
                                    lineHeight: 1.1,
                                    background:
                                      row.quotation === 'Coté'
                                        ? C.infoBackground
                                        : C.positiveBackground,
                                    color:
                                      row.quotation === 'Coté'
                                        ? C.navy
                                        : C.teal,
                                  }}
                                >
                                  {row.quotation}
                                </span>
                                <span
                                  style={{
                                    color: C.sub,
                                    fontSize: 7.5,
                                    lineHeight: 1.15,
                                  }}
                                >
                                  {row.assetLabel}
                                </span>
                              </div>
                            </PortfolioStateCompactTd>

                            <PortfolioStateCompactTd>
                              <div
                                className="font-semibold"
                                style={{
                                  color: C.ink,
                                  fontSize: 8.5,
                                  lineHeight: 1.18,
                                }}
                              >
                                {row.title}
                              </div>
                              <div
                                className="mt-0.5"
                                style={{
                                  color: C.sub,
                                  fontSize: 7.5,
                                  lineHeight: 1.15,
                                }}
                              >
                                Devise d&apos;investissement :{' '}
                                <b
                                  style={{
                                    ...F_MONO,
                                    color: C.ink,
                                  }}
                                >
                                  {row.currency}
                                </b>
                              </div>
                            </PortfolioStateCompactTd>

                            <PortfolioStateCompactTd
                              mono
                              align="right"
                            >
                              {Number(row.quantity) >= 1
                                ? fmt(
                                    Math.round(
                                      row.quantity
                                    )
                                  )
                                : Number(
                                    row.quantity
                                  ).toFixed(2)}
                            </PortfolioStateCompactTd>

                            <PortfolioStateCompactTd
                              mono
                              align="right"
                            >
                              <span className="inline-block">
                                {fmtPrice(row.cmp)}
                                <br />
                                <span
                                  style={{
                                    color: C.sub,
                                    fontSize: 7.5,
                                  }}
                                >
                                  {row.currency}
                                </span>
                              </span>
                            </PortfolioStateCompactTd>

                            <PortfolioStateCompactTd
                              mono
                              align="right"
                            >
                              <span
                                style={{
                                  color: gainInvestment
                                    ? C.teal
                                    : C.coral,
                                  fontWeight: 700,
                                }}
                              >
                                {gainInvestment ? '+' : ''}
                                {fmt(
                                  Math.round(
                                    row.plusMinusInvestment
                                  )
                                )}
                                <br />
                                <span
                                  style={{
                                    fontSize: 7.5,
                                  }}
                                >
                                  {row.currency}
                                </span>
                              </span>
                            </PortfolioStateCompactTd>

                            <PortfolioStateCompactTd
                              mono
                              align="right"
                            >
                              <span
                                style={{
                                  color: gainLocal
                                    ? C.teal
                                    : C.coral,
                                  fontWeight: 700,
                                }}
                              >
                                {gainLocal ? '+' : ''}
                                {fmt(
                                  Math.round(
                                    row.plusMinusLocal
                                  )
                                )}
                                <br />
                                <span
                                  style={{
                                    fontSize: 7.5,
                                  }}
                                >
                                  {row.localCurrency}
                                </span>
                              </span>
                            </PortfolioStateCompactTd>

                            <PortfolioStateCompactTd
                              mono
                              align="right"
                            >
                              <span
                                style={{
                                  color:
                                    row.returnInvestment >= 0
                                      ? C.teal
                                      : C.coral,
                                  fontWeight: 700,
                                }}
                              >
                                {row.returnInvestment >= 0
                                  ? '+'
                                  : ''}
                                {Number(
                                  row.returnInvestment || 0
                                ).toFixed(2)}
                                %
                              </span>
                            </PortfolioStateCompactTd>

                            <PortfolioStateCompactTd
                              mono
                              align="right"
                            >
                              <span
                                style={{
                                  color:
                                    row.returnLocal >= 0
                                      ? C.teal
                                      : C.coral,
                                  fontWeight: 700,
                                }}
                              >
                                {row.returnLocal >= 0 ? '+' : ''}
                                {Number(
                                  row.returnLocal || 0
                                ).toFixed(2)}
                                %
                              </span>
                            </PortfolioStateCompactTd>

                            <PortfolioStateCompactTd
                              mono
                              align="right"
                            >
                              {Number(
                                row.weightingLocal || 0
                              ).toFixed(2)}
                              %
                            </PortfolioStateCompactTd>

                            <PortfolioStateCompactTd
                              mono
                              align="right"
                            >
                              <span className="inline-block">
                                {fmt(
                                  Math.round(
                                    row.amountLocal
                                  )
                                )}
                                <br />
                                <span
                                  style={{
                                    color: C.sub,
                                    fontSize: 7.5,
                                  }}
                                >
                                  {row.localCurrency}
                                </span>
                              </span>
                            </PortfolioStateCompactTd>
                          </tr>
                        );
                      }
                    )}

                    {portfolioStateRows.length === 0 && (
                      <tr>
                        <td
                          colSpan={10}
                          className="p-6 text-center"
                          style={{
                            color: C.sub,
                            fontSize: 9,
                            ...F_BODY,
                          }}
                        >
                          Aucune position disponible pour la devise et la date sélectionnées.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div
              className="px-4 py-3 text-[9px]"
              style={{
                background: C.warningBackground,
                color: C.sub,
                borderTop: `1px solid ${C.line}`,
              }}
            >
              <b style={{ color: C.ink }}>
                Lecture :
              </b>{' '}
              le rendement en devise d&apos;investissement mesure
              l&apos;écart entre le prix valorisé à la date choisie et
              le CMP. Le rendement en devise locale ajoute l&apos;effet
              de conversion monétaire entre la date d&apos;acquisition
              de référence et la date sélectionnée. La pondération est
              calculée sur l&apos;encours local reconstitué à la même date.
            </div>
          </div>

          <div
            className="mt-3 p-3 rounded-xl text-[9px]"
            style={{
              background: C.surfaceElevated,
              color: C.sub,
            }}
          >
            <b style={{ color: C.ink }}>
              Données de démonstration :
            </b>{' '}
            les historiques d&apos;encours utilisent le moteur
            déterministe déjà présent dans la maquette. Les variations
            de change historiques sont simulées autour des taux FX
            courants du prototype. L&apos;état détaillé à date réutilise
            les positions/CMP explicites lorsqu&apos;ils existent et
            complète uniquement les informations absentes pour rendre
            la maquette multidevise visible. En production, ces éléments
            devront provenir des lots, positions et taux FX historiques
            réellement enregistrés.
          </div>

          {/* -------- LIQUIDITÉ DU PORTEFEUILLE PAR DEVISE -------- */}
          <div
            className="mt-4 rounded-2xl border overflow-hidden"
            style={{ borderColor: C.teal }}
          >
            <div
              className="p-4 flex items-start justify-between gap-4 flex-wrap"
              style={{ background: C.positiveBackground }}
            >
              <div>
                <Eyebrow>
                  Liquidité par devise d&apos;investissement
                </Eyebrow>
                <div
                  className="text-sm font-bold"
                  style={{ color: C.ink }}
                >
                  {evolutionClient?.nom || 'Portefeuille'} ·{' '}
                  {portfolioStateDateLabel}
                </div>
                <div
                  className="text-[10px] mt-1 max-w-4xl"
                  style={{ color: C.sub }}
                >
                  La liquidité est présentée séparément des titres
                  détenus. Pour chaque monnaie d&apos;investissement,
                  le gestionnaire distingue la part disponible, la
                  part réservée et la liquidité totale.
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge tone="navy">
                  Devise locale :{' '}
                  {portfolioLiquidityAtSelectedDate.localCurrency}
                </Badge>
                <Badge tone="teal">
                  {
                    portfolioLiquidityAtSelectedDate.rows
                      .length
                  }{' '}
                  devise(s)
                </Badge>
              </div>
            </div>

            {portfolioLiquidityAtSelectedDate.beforeOpening ? (
              <div
                className="p-6 text-center text-xs"
                style={{ color: C.sub }}
              >
                Le portefeuille n&apos;était pas encore ouvert à cette date.
              </div>
            ) : (
              <>
                <div
                  className="grid grid-cols-3 gap-3 p-4"
                  style={{
                    borderTop: `1px solid ${C.line}`,
                    borderBottom: `1px solid ${C.line}`,
                    background: C.surfaceCard,
                  }}
                >
                  <div
                    className="p-3 rounded-xl"
                    style={{ background: C.positiveBackground }}
                  >
                    <div
                      className="text-[9px] uppercase font-semibold"
                      style={{ color: C.sub }}
                    >
                      Liquidité disponible
                    </div>
                    <div
                      className="text-base font-bold mt-1"
                      style={{
                        ...F_MONO,
                        color: C.teal,
                      }}
                    >
                      {fmt(
                        Math.round(
                          portfolioLiquidityAtSelectedDate.availableLocal
                        )
                      )}{' '}
                      {
                        portfolioLiquidityAtSelectedDate.localCurrency
                      }
                    </div>
                  </div>

                  <div
                    className="p-3 rounded-xl"
                    style={{ background: C.warningBackground }}
                  >
                    <div
                      className="text-[9px] uppercase font-semibold"
                      style={{ color: C.sub }}
                    >
                      Liquidité réservée
                    </div>
                    <div
                      className="text-base font-bold mt-1"
                      style={{
                        ...F_MONO,
                        color: C.gold,
                      }}
                    >
                      {fmt(
                        Math.round(
                          portfolioLiquidityAtSelectedDate.reservedLocal
                        )
                      )}{' '}
                      {
                        portfolioLiquidityAtSelectedDate.localCurrency
                      }
                    </div>
                  </div>

                  <div
                    className="p-3 rounded-xl"
                    style={{ background: C.infoBackground }}
                  >
                    <div
                      className="text-[9px] uppercase font-semibold"
                      style={{ color: C.sub }}
                    >
                      Liquidité totale
                    </div>
                    <div
                      className="text-base font-bold mt-1"
                      style={{
                        ...F_MONO,
                        color: C.navy,
                      }}
                    >
                      {fmt(
                        Math.round(
                          portfolioLiquidityAtSelectedDate.totalLocal
                        )
                      )}{' '}
                      {
                        portfolioLiquidityAtSelectedDate.localCurrency
                      }
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div
                    className="grid gap-3"
                    style={{
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(215px, 1fr))',
                    }}
                  >
                    {portfolioLiquidityAtSelectedDate.rows.map(
                      (row) => {
                        const reservedPct =
                          row.total > 0
                            ? (row.reserved /
                                row.total) *
                              100
                            : 0;
                        const availablePct =
                          row.total > 0
                            ? (row.available /
                                row.total) *
                              100
                            : 0;

                        return (
                          <div
                            key={row.currency}
                            className="rounded-xl border overflow-hidden"
                            style={{
                              borderColor: C.line,
                              background: C.surfaceCard,
                            }}
                          >
                            <div
                              className="px-3 py-2 flex items-center justify-between gap-2"
                              style={{
                                background: C.surfaceElevated,
                                borderBottom: `1px solid ${C.line}`,
                              }}
                            >
                              <div>
                                <div
                                  className="text-sm font-bold"
                                  style={{
                                    ...F_MONO,
                                    color: C.ink,
                                  }}
                                >
                                  {row.currency}
                                </div>
                                <div
                                  className="text-[8px] mt-0.5"
                                  style={{ color: C.sub }}
                                >
                                  {Number(
                                    row.weight || 0
                                  ).toFixed(1)}
                                  % de l&apos;exposition devise
                                </div>
                              </div>

                              <Badge
                                tone={
                                  row.reserved > 0
                                    ? 'gold'
                                    : 'teal'
                                }
                              >
                                {availablePct.toFixed(0)}
                                % disponible
                              </Badge>
                            </div>

                            <div className="p-3 space-y-2">
                              <div
                                className="flex items-center justify-between gap-3"
                              >
                                <span
                                  className="text-[9px] font-semibold"
                                  style={{ color: C.sub }}
                                >
                                  Liquidité disponible
                                </span>
                                <span
                                  className="text-[10px] font-bold text-right"
                                  style={{
                                    ...F_MONO,
                                    color: C.teal,
                                  }}
                                >
                                  {fmt(
                                    Math.round(
                                      row.available
                                    )
                                  )}{' '}
                                  {row.currency}
                                </span>
                              </div>

                              <div
                                className="flex items-center justify-between gap-3"
                              >
                                <span
                                  className="text-[9px] font-semibold"
                                  style={{ color: C.sub }}
                                >
                                  Liquidité réservée
                                </span>
                                <span
                                  className="text-[10px] font-bold text-right"
                                  style={{
                                    ...F_MONO,
                                    color:
                                      row.reserved > 0
                                        ? C.gold
                                        : C.sub,
                                  }}
                                >
                                  {fmt(
                                    Math.round(
                                      row.reserved
                                    )
                                  )}{' '}
                                  {row.currency}
                                </span>
                              </div>

                              <div
                                className="flex items-center justify-between gap-3 pt-2"
                                style={{
                                  borderTop: `1px solid ${C.line}`,
                                }}
                              >
                                <span
                                  className="text-[9px] font-bold"
                                  style={{ color: C.ink }}
                                >
                                  Liquidité totale
                                </span>
                                <span
                                  className="text-[11px] font-bold text-right"
                                  style={{
                                    ...F_MONO,
                                    color: C.navy,
                                  }}
                                >
                                  {fmt(
                                    Math.round(
                                      row.total
                                    )
                                  )}{' '}
                                  {row.currency}
                                </span>
                              </div>

                              <div
                                className="h-1.5 rounded-full overflow-hidden flex"
                                style={{
                                  background: C.surfaceInset,
                                }}
                              >
                                <div
                                  style={{
                                    width: `${Math.max(
                                      0,
                                      Math.min(
                                        100,
                                        availablePct
                                      )
                                    )}%`,
                                    background: C.teal,
                                  }}
                                />
                                <div
                                  style={{
                                    width: `${Math.max(
                                      0,
                                      Math.min(
                                        100,
                                        reservedPct
                                      )
                                    )}%`,
                                    background: C.gold,
                                  }}
                                />
                              </div>

                              {row.currency !==
                                row.localCurrency && (
                                <div
                                  className="text-[8px] leading-relaxed"
                                  style={{ color: C.sub }}
                                >
                                  Éq. local :{' '}
                                  <b
                                    style={{
                                      ...F_MONO,
                                      color: C.ink,
                                    }}
                                  >
                                    {fmt(
                                      Math.round(
                                        row.availableLocal
                                      )
                                    )}{' '}
                                    {row.localCurrency}
                                  </b>{' '}
                                  disponible ·{' '}
                                  <b
                                    style={{
                                      ...F_MONO,
                                      color: C.ink,
                                    }}
                                  >
                                    {fmt(
                                      Math.round(
                                        row.reservedLocal
                                      )
                                    )}{' '}
                                    {row.localCurrency}
                                  </b>{' '}
                                  réservée
                                </div>
                              )}

                              <div
                                className="text-[8px]"
                                style={{ color: C.sub }}
                              >
                                Réservation :{' '}
                                {row.reservationSource}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  {portfolioLiquidityAtSelectedDate.rows.length ===
                    0 && (
                    <div
                      className="py-6 text-center text-xs"
                      style={{ color: C.sub }}
                    >
                      Aucune liquidité disponible pour cette situation.
                    </div>
                  )}
                </div>
              </>
            )}

            <div
              className="px-4 py-3 text-[9px]"
              style={{
                background: C.surfaceElevated,
                color: C.sub,
                borderTop: `1px solid ${C.line}`,
              }}
            >
              <b style={{ color: C.ink }}>
                Contrôle :
              </b>{' '}
              pour chaque devise, Liquidité totale =
              Liquidité disponible + Liquidité réservée.
              Les données explicites du portefeuille sont utilisées
              en priorité. À défaut, les ordres d&apos;achat ouverts
              déjà présents dans l&apos;application alimentent la
              liquidité réservée sur la situation courante.
            </div>
          </div>

        </Card>
      )}
    </div>
  );
}

export {
  Portefeuilles,
  buildPortfolioCurrencyEvolution,
  buildPortfolioStateAtDate,
  buildPortfolioLiquidityByCurrencyAtDate,
};
