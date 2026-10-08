import { useState } from 'react';
import { Search } from 'lucide-react';
import { convertCurrency, fmt, fmtPrice } from '../../shared/lib/finance';
import { Badge, Btn, Card, Eyebrow, Td, Th } from '../../shared/ui/UiAtoms';
import { Breadcrumb } from '../../shared/ui/Navigation';
import { C, F_BODY, F_DISPLAY, F_MONO } from '../../shared/theme/theme';
import { scoreTechniqueWatchlist } from '../watchlist/WatchlistModel';

export function createReequilibrageScreen(dependencies) {
  const {
    CLIENTS,
    MARKETS_DATA,
    PROFILE_TYPE_LABEL,
    RECOS,
    SEUIL_REEQUILIBRAGE,
    besoinsReequilibrageClient,
    propositionReequilibrage,
    exposureOf,
  } = dependencies;

  function ReequilibrageScreen({ initial, devise = 'XOF' }) {
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
        titre: 'Compte espèces / support monétaire',        operation:
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-w-0">
              <div>
                <label
                  className="text-xs font-semibold block mb-1"
                  style={{ color: C.sub }}
                >
                  Nom du client
                </label>
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                  style={{ borderColor: C.line, background: C.surfaceCard }}
                >
                  <Search size={14} color={C.sub} />
                  <input name="gsm-reequilibrage-271" aria-label="Rechercher un client…"
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
                <select name="gsm-reequilibrage-289" aria-label="Sélection reequilibrage"
                  value={filtreTypePortefeuille}
                  onChange={(e) => setFiltreTypePortefeuille(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                  style={{ borderColor: C.line, background: C.surfaceCard, ...F_BODY }}
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
                    background: C.surfaceCard,
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
            className="p-0 overflow-hidden"            style={{ borderColor: C.gold }}
          >
            <div
              className="p-4 flex items-center justify-between gap-4"
              style={{ background: C.warningBackground }}
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
                style={{ background: C.navy, color: C.surfaceCard, ...F_BODY }}
              >
                Ouvrir le détail →
              </button>
            </div>

            <div className="gsm-table-scroll">
              <table className="w-full gsm-table--banking" style={{ minWidth: 1180 }}>
                <thead style={{ background: C.surfaceElevated }}>
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
                        background: index % 2 ? C.rowAlternate : C.surfaceCard,
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
                  <div                    className="text-xs font-semibold mb-1"
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
                    <div className="mt-4 gsm-table-scroll">
                      <table className="w-full gsm-table--banking" style={{ minWidth: 850 }}>
                        <thead style={{ background: C.surfaceElevated }}>
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
                                background: index % 2 ? C.rowAlternate : C.surfaceCard,
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

  return { ReequilibrageScreen };
}
