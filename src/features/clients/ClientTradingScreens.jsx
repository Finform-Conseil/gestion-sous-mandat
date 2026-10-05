import { useState } from 'react';
import { Search, Star } from 'lucide-react';
import { fmt, fmtPrice } from '../../shared/lib/finance';
import { Badge, Btn, Card, Eyebrow, Pct, Td, Th } from '../../shared/ui/UiAtoms';
import { C, F_BODY, F_DISPLAY, F_MONO } from '../../shared/theme/theme';
import { ClientBreadcrumb } from './ClientCommon';

export function createClientTradingScreens(dependencies) {
  const {
    BOND_MARKET_META,
    CLIENT_GESTION_LIBRE,
    CLIENT_TRADABLE_MARKETS,
    MARKETS_DATA,
    clientAvailableCash,
    clientMarket,
    clientReservedCash,
  } = dependencies;

  function ClientOrderTicket({
  goClient,
  onCreateOrder,
  orders,
  initialInstrument,
  initialMarket,
  source = 'vue-boursiere',
}) {
  const typeSource =
    source === 'obligations'
      ? 'Obligation'
      : source === 'vue-boursiere'
      ? 'Action'
      : null;

  const universTicket = CLIENT_TRADABLE_MARKETS.filter(
    (item) => !typeSource || item.type === typeSource
  );

  const instrumentDemande = clientMarket(initialInstrument, initialMarket);
  const instrumentInitial =
    instrumentDemande && (!typeSource || instrumentDemande.type === typeSource)
      ? instrumentDemande
      : universTicket[0] || CLIENT_TRADABLE_MARKETS[0];

  const [instrument, setInstrument] = useState(instrumentInitial?.nom || '');
  const marche =
    clientMarket(instrument, initialMarket) ||
    instrumentInitial ||
    CLIENT_TRADABLE_MARKETS[0];

  const portefeuillesEligibles = CLIENT_GESTION_LIBRE.portefeuilles.filter(
    (portefeuille) => portefeuille.marche === marche?.marche
  );

  const [portefeuilleId, setPortefeuilleId] = useState(
    portefeuillesEligibles[0]?.id || ''
  );
  const [sens, setSens] = useState('Achat');
  const [qte, setQte] = useState(100);
  const [typeOrdre, setTypeOrdre] = useState('Ordre limite');
  const [prixLimite, setPrixLimite] = useState(Number(marche?.cours || 0));
  const [message, setMessage] = useState('');

  const portefeuilleCourant =
    portefeuillesEligibles.find((p) => p.id === portefeuilleId) ||
    portefeuillesEligibles[0];

  const retourRoute =
    source === 'obligations' ? 'client-markets' : 'client-exchanges';
  const retourLabel =
    source === 'obligations' ? 'Marchés Obligataire' : 'Marchés Actions';

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
    typeOrdre === 'Ordre au marché'
      ? Number(marche?.cours || 0)
      : Number(prixLimite || 0);
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

  if (!marche) {
    return (
      <Card className="p-6 text-center text-sm" style={{ color: C.sub }}>
        Instrument indisponible pour le passage d'ordre.
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <ClientBreadcrumb
        items={['Espace Client', retourLabel, "Ticket d'ordre", marche.nom]}
      />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Eyebrow>Passage d'ordre · Gestion libre</Eyebrow>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Ticket d'ordre
          </h2>
          <div className="text-xs mt-1 max-w-2xl" style={{ color: C.sub }}>
            Le ticket est ouvert depuis {retourLabel}. L'instrument et le marché
            sont présélectionnés ; choisissez la SGI / le portefeuille, le sens,
            la quantité et le type d'ordre avant envoi.
          </div>
        </div>
        <Btn tone="ghost" onClick={() => goClient(retourRoute)}>
          ← Retour à {retourLabel}
        </Btn>
      </div>

      <div className="grid grid-cols-3 gap-4 items-start">
        <Card className="p-5">
          <Eyebrow>Instrument sélectionné</Eyebrow>
          <div
            className="text-lg font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            {marche.nom}
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <Badge tone="navy">{marche.marche}</Badge>
            <Badge tone={marche.type === 'Obligation' ? 'gold' : 'teal'}>
              {marche.type}
            </Badge>
          </div>

          <div
            className="mt-4 pt-4 space-y-3"
            style={{ borderTop: `1px solid ${C.line}` }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs" style={{ color: C.sub }}>
                Dernier cours
              </span>
              <b style={{ ...F_MONO, color: C.ink }}>
                {fmtPrice(marche.cours)} {marche.devise}
              </b>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs" style={{ color: C.sub }}>
                Variation
              </span>
              <Pct v={Number(marche.variation || 0)} />
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs" style={{ color: C.sub }}>
                SGI compatibles
              </span>
              <span
                className="text-xs font-semibold text-right"
                style={{ color: C.ink }}
              >
                {portefeuillesEligibles.length > 0
                  ? portefeuillesEligibles.map((pf) => pf.sgi).join(' · ')
                  : 'Aucune SGI compatible'}
              </span>
            </div>
          </div>

          <div
            className="mt-4 p-3 rounded-xl text-[10px]"
            style={{ background: '#FAFAFC', color: C.sub }}          >
            Vous pouvez changer d'instrument uniquement à l'intérieur du même
            univers de marché ({typeSource || 'Actions / Obligations'}).
          </div>
        </Card>

        <Card className="col-span-2 p-5" style={{ borderColor: C.gold }}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <Eyebrow>Ticket d'ordre</Eyebrow>
            <Badge tone="gold">
              {marche.type === 'Obligation' ? 'Fixed Income' : 'Equity'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="text-xs font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Instrument
              </label>
              <select name="gsm-clienttradingscreens-239" aria-label="Sélection clienttradingscreens"
                value={instrument}
                onChange={(e) => changerInstrument(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm"
                style={{ borderColor: C.line }}
              >
                {universTicket.map((item) => (
                  <option key={item.nom} value={item.nom}>
                    {item.nom} · {item.marche}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="text-xs font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Portefeuille / SGI
              </label>
              <select name="gsm-clienttradingscreens-260" aria-label="Sélection clienttradingscreens"
                value={portefeuilleCourant?.id || ''}
                onChange={(e) => setPortefeuilleId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm"
                style={{ borderColor: C.line }}
              >
                {portefeuillesEligibles.map((portefeuille) => (
                  <option key={portefeuille.id} value={portefeuille.id}>
                    {portefeuille.sgi} — {portefeuille.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-4">
            {['Achat', 'Vente'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setSens(value);
                  setMessage('');
                }}
                className="px-3 py-2.5 rounded-xl text-xs font-semibold"
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

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label
                className="text-xs font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Type d'ordre
              </label>
              <select name="gsm-clienttradingscreens-308" aria-label="Sélection clienttradingscreens"
                value={typeOrdre}
                onChange={(e) => setTypeOrdre(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm"
                style={{ borderColor: C.line }}
              >
                <option>Ordre au marché</option>
                <option>Ordre limite</option>
              </select>            </div>

            <div>
              <label
                className="text-xs font-semibold block mb-1"
                style={{ color: C.sub }}
              >
                Quantité
              </label>
              <input name="gsm-clienttradingscreens-325" aria-label="Champ clienttradingscreens"
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
              <input name="gsm-clienttradingscreens-342" aria-label="Champ clienttradingscreens"
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
            className="grid grid-cols-2 gap-x-8 gap-y-2 p-4 rounded-xl text-xs mb-4"
            style={{ background: '#EFF3FB', color: C.ink }}
          >
            <div className="flex justify-between gap-3">
              <span>Montant estimé</span>
              <b style={F_MONO}>
                {fmt(Math.round(montantEstime))} {marche.devise}
              </b>
            </div>
            <div className="flex justify-between gap-3">
              <span>Liquidité disponible</span>
              <span style={F_MONO}>
                {fmt(Math.round(cash))}{' '}
                {portefeuilleCourant?.devise || marche.devise}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Liquidité réservée</span>
              <span style={F_MONO}>
                {fmt(Math.round(cashReserve))}{' '}
                {portefeuilleCourant?.devise || marche.devise}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Liquidité totale</span>
              <span style={F_MONO}>
                {fmt(Math.round(cashTotal))}{' '}
                {portefeuilleCourant?.devise || marche.devise}
              </span>
            </div>
            {sens === 'Vente' && (
              <div className="flex justify-between gap-3 col-span-2">
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

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-[10px] max-w-xl" style={{ color: C.sub }}>
              Prototype : l'ordre est enregistré dans l'espace client. En
              production, l'envoi devra être confirmé par l'API ou le workflow
              de la SGI concernée.
            </div>
            <Btn onClick={envoyerOrdre}>
              Envoyer l'ordre à {portefeuilleCourant?.sgi || 'la SGI'}
            </Btn>
          </div>        </Card>
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
  const [marche, setMarche] = useState('Tous');
  const [recherche, setRecherche] = useState('');

  const rows = MARKETS_DATA.filter(
    (item) =>
      item.type === 'Obligation' &&
      (marche === 'Tous' || item.marche === marche) &&
      item.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <ClientBreadcrumb items={['Espace Client', 'Marchés Obligataire']} />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Eyebrow>Fixed Income · Gestion libre</Eyebrow>
          <h2
            className="text-xl font-bold"
            style={{ ...F_DISPLAY, color: C.ink }}
          >
            Marchés Obligataire
          </h2>
        </div>
        <Badge tone="gold">{rows.length} obligation(s)</Badge>
      </div>

      <Card className="p-4" style={{ borderColor: '#D8DFEF' }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
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
                  onClick={() => setMarche(code)}
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

          <div className="min-w-[320px]">
            <label
              className="text-[10px] uppercase font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Obligation
            </label>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl border"
              style={{ borderColor: C.line }}
            >
              <Search size={13} color={C.sub} />
              <input name="gsm-clienttradingscreens-494" aria-label="Rechercher une obligation…"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher une obligation…"
                className="w-full text-xs outline-none"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 1650 }}>
            <thead style={{ background: '#FAFAFC' }}>
              <tr>
                <Th>Instrument</Th>
                <Th>Émetteur</Th>
                <Th>Marché</Th>
                <Th>Cours</Th>
                <Th>Coupon</Th>
                <Th>Rendement indicatif</Th>
                <Th>Échéance</Th>
                <Th>Duration</Th>
                <Th>Volume jour</Th>
                <Th>Var %</Th>
                <Th>SGI accessibles</Th>
                <Th>Watchlist</Th>                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={13}
                    className="text-center py-8 text-sm"
                    style={{ color: C.sub }}
                  >
                    Aucune obligation ne correspond aux filtres sélectionnés.
                  </td>
                </tr>
              )}
              {rows.map((item, index) => {
                const meta = BOND_MARKET_META[item.nom] || {};
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
                    <Td>{meta.emetteur || '—'}</Td>
                    <Td>
                      <Badge tone="navy">{item.marche}</Badge>
                    </Td>
                    <Td mono className="whitespace-nowrap">
                      {fmtPrice(item.cours)} {item.devise}
                    </Td>
                    <Td mono>
                      {meta.coupon != null ? `${meta.coupon.toFixed(2)}%` : '—'}
                    </Td>
                    <Td mono>
                      {meta.rendement != null
                        ? `${meta.rendement.toFixed(2)}%`
                        : '—'}
                    </Td>
                    <Td mono>{meta.echeance || '—'}</Td>
                    <Td mono>
                      {meta.duration != null
                        ? `${meta.duration.toFixed(1)} an(s)`
                        : '—'}
                    </Td>
                    <Td mono>{fmt(item.volumeJour)}</Td>
                    <Td>
                      <Pct v={item.variation} />
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
                              source: 'obligations',
                            })
                          }
                          className="text-xs font-semibold"                          style={{ color: C.indigo }}
                        >
                          Profondeur →
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            goClient('client-ticket', {
                              instrument: item.nom,
                              marche: item.marche,
                              source: 'obligations',
                            })
                          }
                          className="text-xs font-semibold"
                          style={{ color: C.navy }}
                        >
                          Ticket d'ordre →
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
    </div>
  );
}


  return { ClientOrderTicket, ClientMarkets };
}
