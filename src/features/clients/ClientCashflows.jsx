import { Badge, Card, Eyebrow, Pct, Td, Th } from '../../shared/ui/UiAtoms';
import { Donut, Legende } from '../home/HomeWidgets';
import { C, F_BODY, F_DISPLAY, F_MONO } from '../../shared/theme/theme';
import { ClientBreadcrumb } from './ClientCommon';
import { convertCurrency, fmt } from '../../shared/lib/finance';
import { createClientCashflowsModel } from './ClientCashflowsModel';

export function createClientCashflowsScreen(dependencies) {
  const {
    exportAnatomieExcel,
    exportAnatomiePdf,
    LIQUIDITY_HISTORY_MIN_DATE,
  } = dependencies;
  const { useClientCashflowsModel } = createClientCashflowsModel(dependencies);

  function ClientCashflows({ devise, orders = [] }) {
    const {
      portefeuilles,
      filtrePays,
      setFiltrePays,
      filtreMarche,
      setFiltreMarche,
      filtreSgi,
      setFiltreSgi,
      filtreEncoursMin,
      setFiltreEncoursMin,
      filtreLiquiditeActuelleMin,
      setFiltreLiquiditeActuelleMin,
      filtreEntrees30JMin,
      setFiltreEntrees30JMin,
      filtreSorties30JMin,
      setFiltreSorties30JMin,
      filtrePrevisionnelMin,
      setFiltrePrevisionnelMin,
      portefeuilleLiquiditeSelectionneId,
      setPortefeuilleLiquiditeSelectionneId,
      vueLiquiditeDetail,
      setVueLiquiditeDetail,
      dateSituationLiquiditeClient,
      setDateSituationLiquiditeClient,
      dateReferenceIsoClient,
      dateReference,
      dateSituationObjClient,
      finHorizon,
      formatDateFR,
      fluxRevenus30J,
      fluxOrdres30J,
      flux30J,
      synthesePortefeuilles,
      paysDisponibles,
      marchesDisponibles,
      sgisDisponibles,
      lignesFiltrees,
      idsFiltres,
      fluxFiltres,
      revenusFiltres,
      totalEncours,
      totalCash,
      totalCashReserve,
      totalEntrees30J,
      totalSorties30J,
      totalPrevisionnel,
      totalRevenus,
      filtresActifs,
      reinitialiserFiltres,
      filtresMontants,
      repartitionMontants,
      detailsLiquidite,
      detailsFiltres,
      detailSelectionne,
      payloadExportAnatomieClient,
      roleTone,
      originesDonut,
    } = useClientCashflowsModel({ devise, orders });

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
            <select name="gsm-clientcashflows-105" aria-label="Sélection clientcashflows"
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
            <select name="gsm-clientcashflows-128" aria-label="Sélection clientcashflows"
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
            <select name="gsm-clientcashflows-149" aria-label="Sélection clientcashflows"
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
                  style={{ borderColor: C.line, background: C.surfaceCard }}
                >
                  <input name="gsm-clientcashflows-188" aria-label="Aucun minimum"
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
                      background: C.surfaceElevated,
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
              d’allocation de chaque portefeuille. Les exports PDF et Excel
              portent sur le compte SGI actuellement sélectionné et reprennent
              la date de situation choisie. Les dates antérieures sont simulées
              dans la maquette en attendant les snapshots réels des SGI.
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl border"
              style={{ borderColor: C.line, background: C.surfaceCard }}
            >
              <label
                htmlFor="client-liquidity-situation-date"
                className="text-[11px] font-semibold whitespace-nowrap"
                style={{ color: C.sub }}
              >
                Date de situation
              </label>

              <input
                id="client-liquidity-situation-date"
                type="date"
                min={LIQUIDITY_HISTORY_MIN_DATE}
                max={dateReferenceIsoClient}
                value={dateSituationLiquiditeClient}
                onChange={(event) =>
                  setDateSituationLiquiditeClient(event.target.value)
                }
                className="px-2 py-1 rounded-lg border text-xs"
                style={{ borderColor: C.line, color: C.ink, ...F_MONO }}
              />
              {dateSituationLiquiditeClient !== dateReferenceIsoClient && (
                <button
                  type="button"
                  onClick={() =>
                    setDateSituationLiquiditeClient(dateReferenceIsoClient)
                  }
                  className="text-[10px] font-semibold whitespace-nowrap"
                  style={{ color: C.navy }}
                >
                  Situation actuelle
                </button>
              )}
            </div>
            <Badge tone="navy">
              Situation au {formatDateFR(dateSituationObjClient)}
            </Badge>
            <button
              type="button"
              disabled={!payloadExportAnatomieClient}
              onClick={() => exportAnatomiePdf(payloadExportAnatomieClient)}
              className="px-3 py-2 rounded-xl border text-xs font-semibold transition-opacity"
              style={{
                borderColor: C.line,
                background: C.surfaceCard,
                color: C.navy,
                opacity: payloadExportAnatomieClient ? 1 : 0.45,
                cursor: payloadExportAnatomieClient ? 'pointer' : 'not-allowed',
              }}
              title="Exporter l'anatomie complète du compte SGI sélectionné en PDF"
            >
              Exporter PDF
            </button>
            <button
              type="button"
              disabled={!payloadExportAnatomieClient}
              onClick={() => exportAnatomieExcel(payloadExportAnatomieClient)}
              className="px-3 py-2 rounded-xl border text-xs font-semibold transition-opacity"
              style={{
                borderColor: C.line,
                background: C.positiveBackground,
                color: C.teal,
                opacity: payloadExportAnatomieClient ? 1 : 0.45,
                cursor: payloadExportAnatomieClient ? 'pointer' : 'not-allowed',
              }}
              title="Exporter les rubriques 1 à 26 du compte SGI sélectionné vers Excel"
            >
              Exporter Excel
            </button>
            <Badge tone="gold">
              Rubriques 1 à 26 adaptées à la gestion libre
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 items-start">
          <Card className="col-span-4 p-4">
            <div className="gsm-responsive-header flex items-center justify-between gap-2 mb-3">
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
                      background: actif ? C.infoBackground : C.surfaceCard,
                    }}
                  >
                    <div className="gsm-responsive-inline-row flex items-start justify-between gap-2">
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
                        background: vueLiquiditeDetail === id ? C.activeBackground : C.surfaceInset,
                        color: vueLiquiditeDetail === id ? C.textPrimary : C.sub,
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
                        style={{ borderColor: C.line, background: C.surfaceElevated }}
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
                          borderColor: C.negativeBorder,
                          background: C.negativeBackground,
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
                          borderColor: C.warningBorder,
                          background: C.warningBackground,
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
                          borderColor: C.positiveBorder,
                          background: C.positiveBackground,
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
                              style={{ background: C.surfaceInset }}
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
                      style={{ background: C.infoBackground, color: C.sub }}
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
                      style={{ background: C.warningBackground }}
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
        <div className="gsm-table-scroll">
          <table className="w-full gsm-table--banking" style={{ minWidth: 1250 }}>
            <thead style={{ background: C.surfaceElevated }}>
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
        <div className="gsm-table-scroll">
          <table className="w-full gsm-table--banking" style={{ minWidth: 1050 }}>
            <thead style={{ background: C.surfaceElevated }}>
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

      <Card className="p-4" style={{ borderColor: C.borderSubtle }}>
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

  return { ClientCashflows };
}
