import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { convertCurrency, fmt, toRef } from '../../shared/lib/finance';
import { Badge, Btn, Card, Eyebrow, Pct } from '../../shared/ui/UiAtoms';
import { Breadcrumb } from '../../shared/ui/Navigation';
import { Donut, Legende } from '../home/HomeWidgets';
import { C, F_BODY, F_DISPLAY, F_MONO } from '../../shared/theme/theme';

export function createAnalysePortefeuilleScreen(dependencies) {
  const {
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
  } = dependencies;

  function AnalysePortefeuilleScreen({ devise = 'XOF' }) {
  const [tab, setTab] = useState('Devises');
  const [filtreType, setFiltreType] = useState('Tous');
  const [filtreRisque, setFiltreRisque] = useState('Tous');
  const [filtrePortefeuille, setFiltrePortefeuille] = useState('');

  const normaliserRecherche = (value) =>
    String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const profilsRisqueDisponibles = Array.from(
    new Set(CLIENTS.map((client) => client.profilRisque).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, 'fr'));

  const recherchePortefeuille = normaliserRecherche(filtrePortefeuille);
  const clientsFiltres = CLIENTS.filter((client) => {
    const typeLibelle = PROFILE_TYPE_LABEL[client.type] || client.type;
    const correspondType = filtreType === 'Tous' || typeLibelle === filtreType;
    const correspondRisque =
      filtreRisque === 'Tous' || client.profilRisque === filtreRisque;
    const correspondPortefeuille =
      !recherchePortefeuille ||
      normaliserRecherche(`${client.id} ${client.nom}`).includes(
        recherchePortefeuille
      );

    return correspondType && correspondRisque && correspondPortefeuille;
  });

  const totalRef = clientsFiltres.reduce(
    (s, c) => s + convertCurrency(c.encours, c.devise, devise),
    0
  );

  const assetMixAnalyse = buildAssetMix(clientsFiltres);
  const marketMixAnalyse = aggregateEncoursBy(
    (client) => `${client.marche} (${client.devise})`,
    clientsFiltres
  );
  const countryMixAnalyse = aggregateEncoursBy(
    (client) => client.pays,
    clientsFiltres
  );

  const encoursParDevise = clientsFiltres.reduce((acc, client) => {
    const encoursReference = toRef(client.encours, client.devise);
    const expositions =
      client.expositionsDevises || { [client.devise]: 100 };

    Object.entries(expositions).forEach(([deviseExposition, poids]) => {
      const expositionReference =
        encoursReference * (Number(poids || 0) / 100);
      const montantAffichage = convertCurrency(
        expositionReference,
        'XOF',
        devise
      );
      acc[deviseExposition] =
        (acc[deviseExposition] || 0) + montantAffichage;
    });

    return acc;
  }, {});

  const currencyMixFiltree = Object.entries(encoursParDevise)
    .map(([name, montant]) => ({
      name,
      value: totalRef > 0 ? Number(((montant / totalRef) * 100).toFixed(1)) : 0,
      montant,
      devise,
    }))
    .sort((a, b) => b.montant - a.montant);

  const filtresActifs = [
    filtreType !== 'Tous' ? filtreType : null,
    filtreRisque !== 'Tous' ? filtreRisque : null,
    filtrePortefeuille.trim() ? `Cible : ${filtrePortefeuille.trim()}` : null,
  ].filter(Boolean);

  const shocks = [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10];

  const devisesEtrangeres = [
    ...new Set(clientsFiltres.map((c) => c.devise)),
  ].filter((d) => d !== devise);
  const [paire, setPaire] = useState(
    [...new Set(CLIENTS.map((c) => c.devise))].find((d) => d !== devise) || ''
  );
  const paireActive = devisesEtrangeres.includes(paire)
    ? paire
    : devisesEtrangeres[0] || '';
  const [chocManuel, setChocManuel] = useState(0);
  const expoPaire = clientsFiltres
    .filter((c) => c.devise === paireActive)
    .reduce((s, c) => s + convertCurrency(c.encours, c.devise, devise), 0);
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
  const paysFiltres = Array.from(
    new Set(
      clientsFiltres
        .map((client) => client.pays)
        .filter((pays) => CORR_PAYS_LABELS.includes(pays))
    )
  );
  const indicesPaysFiltres = paysFiltres.map((pays) =>
    CORR_PAYS_LABELS.indexOf(pays)
  );
  const corrLabels =
    corrDim === 'Secteurs'
      ? clientsFiltres.length > 0
        ? CORR_SECTEURS_LABELS
        : []
      : paysFiltres;
  const corrHist =
    corrDim === 'Secteurs'
      ? CORR_SECTEURS_HIST
      : indicesPaysFiltres.map((ri) =>
          indicesPaysFiltres.map((ci) => CORR_PAYS_HIST[ri][ci])
        );
  const corrCriseBase =
    corrDim === 'Secteurs'
      ? CORR_SECTEURS_CRISE
      : indicesPaysFiltres.map((ri) =>
          indicesPaysFiltres.map((ci) => CORR_PAYS_CRISE[ri][ci])
        );
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
  const marchesFiltres = new Set(clientsFiltres.map((client) => client.marche));
  const advActionsRef = VOLUME_JOUR.filter(
    (v) => v.type === 'Action' && marchesFiltres.has(v.marche)
  ).reduce((s, v) => s + convertCurrency(v.volume, v.devise, devise), 0);
  const positionActionsRef = clientsFiltres.reduce(
    (s, client) =>
      s +
      convertCurrency(
        (client.encours * Number(client.alloc?.Actions || 0)) / 100,
        client.devise,
        devise
      ),
    0
  );
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

      <Card className="p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Eyebrow>Périmètre de simulation</Eyebrow>
            <div className="text-sm font-semibold" style={{ color: C.ink }}>
              Filtrer les portefeuilles analysés
            </div>
            <div className="text-xs mt-1" style={{ color: C.sub }}>
              Les filtres se cumulent. Les simulations de change, de stress et
              de liquidité utilisent uniquement les portefeuilles correspondant
              au périmètre sélectionné.
            </div>
          </div>
          <Btn
            tone="ghost"
            onClick={() => {
              setFiltreType('Tous');
              setFiltreRisque('Tous');
              setFiltrePortefeuille('');
            }}
          >
            Réinitialiser les filtres
          </Btn>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Type de portefeuille            </label>
            <select name="gsm-analyseportefeuille-255" aria-label="Sélection analyseportefeuille"
              value={filtreType}
              onChange={(e) => setFiltreType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line, ...F_BODY }}
            >
              <option value="Tous">Tous</option>
              <option value="Particulier">Particulier</option>
              <option value="Institutionnel">Institutionnel</option>
            </select>
          </div>

          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Profil de risque
            </label>
            <select name="gsm-analyseportefeuille-274" aria-label="Sélection analyseportefeuille"
              value={filtreRisque}
              onChange={(e) => setFiltreRisque(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: C.line, ...F_BODY }}
            >
              <option value="Tous">Tous les profils</option>
              {profilsRisqueDisponibles.map((profil) => (
                <option key={profil} value={profil}>
                  {profil}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="text-xs font-semibold block mb-1"
              style={{ color: C.sub }}
            >
              Portefeuille cible — nom client ou ID
            </label>
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: C.sub }}
              />
              <input name="gsm-analyseportefeuille-302" aria-label="Ex. Aïcha Koné ou c1"
                type="text"
                list="analyse-portefeuille-cibles"
                value={filtrePortefeuille}
                onChange={(e) => setFiltrePortefeuille(e.target.value)}
                placeholder="Ex. Aïcha Koné ou c1"
                className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm"
                style={{ borderColor: C.line, ...F_BODY }}
              />
              <datalist id="analyse-portefeuille-cibles">
                {CLIENTS.map((client) => (
                  <option
                    key={client.id}
                    value={client.id}
                    label={`${client.nom} · ${client.id}`}
                  />
                ))}
                {CLIENTS.map((client) => (
                  <option
                    key={`nom-${client.id}`}
                    value={client.nom}
                    label={`${client.id} · ${client.nom}`}
                  />
                ))}
              </datalist>
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between gap-3 flex-wrap mt-4 pt-4 border-t"
          style={{ borderColor: C.line }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone={clientsFiltres.length > 0 ? 'teal' : 'coral'}>
              {clientsFiltres.length} portefeuille(s)
            </Badge>
            {filtresActifs.length === 0 ? (
              <Badge tone="slate">Tous les portefeuilles</Badge>
            ) : (
              filtresActifs.map((filtre) => (
                <Badge key={filtre} tone="slate">
                  {filtre}
                </Badge>
              ))
            )}
          </div>
        </div>

        {clientsFiltres.length === 0 && (
          <div
            className="mt-4 p-3 rounded-xl text-xs"
            style={{ background: C.negativeBackground, color: C.coral }}
          >
            Aucun portefeuille ne correspond à cette combinaison de filtres.
            Modifiez le type, le profil de risque ou le portefeuille cible.
          </div>
        )}
      </Card>

      <div className="flex gap-1.5">
        {['Devises', 'Corrélations', 'Stress test'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: tab === t ? C.activeBackground : C.surfaceInset,
              color: tab === t ? C.textPrimary : C.sub,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Devises' && (
        <>
          <Card className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <Eyebrow>Allocation du portefeuille par devise</Eyebrow>
                <div className="text-xs" style={{ color: C.sub }}>
                  Répartition calculée uniquement sur le périmètre filtré.
                </div>
              </div>
              <div
                className="px-4 py-3 rounded-2xl border text-right min-w-[260px]"
                style={{ borderColor: C.gold, background: C.warningBackground }}
              >
                <div
                  className="text-[10px] uppercase font-semibold"
                  style={{ color: C.sub }}
                >
                  Encours correspondant au filtre
                </div>
                <div
                  className="text-xl font-bold mt-1"
                  style={{ ...F_MONO, color: C.ink }}
                >
                  {fmt(Math.round(totalRef))} {devise}
                </div>
                <div className="text-[10px] mt-1" style={{ color: C.sub }}>
                  Devise principale de la gestion : {devise}
                </div>
              </div>
            </div>

            {currencyMixFiltree.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 items-center mt-4">
                <div className="flex justify-center">
                  <Donut data={currencyMixFiltree} size={160} />
                </div>
                <Legende data={currencyMixFiltree} />
              </div>
            ) : (
              <div
                className="mt-4 p-4 rounded-xl text-sm text-center"
                style={{ background: C.surfaceElevated, color: C.sub }}
              >
                Aucune allocation à afficher pour le périmètre sélectionné.
              </div>
            )}
          </Card>

          <Card className="p-5">
            <Eyebrow>Simulation — variation d'une paire de devises</Eyebrow>
            {paireActive ? (
              <>
                <div className="flex items-end gap-4 mt-2 mb-3 flex-wrap">
                  <div>
                    <label
                      className="text-xs font-semibold block mb-1"
                      style={{ color: C.sub }}
                    >
                      Paire simulée
                    </label>
                    <select name="gsm-analyseportefeuille-439" aria-label="Sélection analyseportefeuille"
                      value={paireActive}
                      onChange={(e) => setPaire(e.target.value)}
                      className="px-3 py-2 rounded-xl border text-sm"
                      style={{ borderColor: C.line }}
                    >
                      {devisesEtrangeres.map((d) => (
                        <option key={d} value={d}>
                          {d} / {devise}
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
                    <input name="gsm-analyseportefeuille-460" aria-label="Champ analyseportefeuille"
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
                  >                    <div className="text-xs" style={{ color: C.sub }}>
                      Valeur simulée
                    </div>
                    <div className="text-lg font-bold" style={F_DISPLAY}>
                      {fmt(valeurSimulee)} {devise}
                    </div>
                    <Pct
                      v={
                        totalRef > 0
                          ? ((valeurSimulee - totalRef) / totalRef) * 100
                          : 0
                      }
                    />
                  </div>
                </div>
                <div className="text-xs mb-2" style={{ color: C.sub }}>
                  Exposition simulée : {fmt(Math.round(expoPaire))} {devise} sur{' '}
                  {fmt(Math.round(totalRef))} {devise} sur le périmètre, dont
                  l'exposition est libellée en {paireActive}.
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <ScatterChart
                    margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
                  >
                    <CartesianGrid stroke={C.line} />
                    <XAxis
                      type="number"
                      dataKey="shock"
                      name={`Choc ${paireActive}/${devise}`}
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
              </>
            ) : (
              <div
                className="mt-3 p-4 rounded-xl text-sm"
                style={{ background: C.surfaceElevated, color: C.sub }}
              >
                Le périmètre sélectionné ne comporte aucune devise différente de
                la devise principale {devise}. Aucun choc de change n'est à
                simuler pour ce filtre.
              </div>
            )}
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
                  background: corrDim === d ? C.activeBackground : C.surfaceInset,
                  color: corrDim === d ? C.textPrimary : C.sub,
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
                <select name="gsm-analyseportefeuille-573" aria-label="Sélection analyseportefeuille"
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
                <input name="gsm-analyseportefeuille-591" aria-label="Champ analyseportefeuille"
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
                              color: v > 0.5 ? C.onNegative : C.ink,
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
              Impact de scénarios de stress sur le périmètre filtré
            </Eyebrow>
            <div className="text-xs mb-2" style={{ color: C.sub }}>
              Ajustez le paramètre de choc de chaque scénario pour observer
              l'effet sur la valorisation du périmètre filtré.
            </div>
            <div className="space-y-4 mt-2">
              {STRESS_SCENARIOS.map((s) => {
                const choc = chocs[s.nom];                const impactPct = choc * s.sensibilite;
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
                    <input name="gsm-analyseportefeuille-729" aria-label="Champ analyseportefeuille"
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
            <Eyebrow>Risque de liquidité — périmètre filtré (Actions)</Eyebrow>
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
                <input name="gsm-analyseportefeuille-761" aria-label="Champ analyseportefeuille"
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
                <input name="gsm-analyseportefeuille-778" aria-label="Champ analyseportefeuille"
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
                <input name="gsm-analyseportefeuille-839" aria-label="Champ analyseportefeuille"
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
                <input name="gsm-analyseportefeuille-855" aria-label="Champ analyseportefeuille"
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
                <input name="gsm-analyseportefeuille-871" aria-label="Champ analyseportefeuille"
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
        </>      )}
    </div>
  );
}


  return { AnalysePortefeuilleScreen };
}
