import { useMemo, useState } from 'react';
import { fmt, fmtPrice } from '../../shared/lib/finance';
import { Breadcrumb } from '../../shared/ui/Navigation';
import { Badge, Card, Td, Th } from '../../shared/ui/UiAtoms';
import { C, F_BODY, F_DISPLAY } from '../../shared/theme/theme';
import { AVIS_OPERATIONS, calculerAvis, parseAvisDate, type AvisOperation } from './AvisOperesModel';

interface AvisOperesProps { avis?: AvisOperation[]; }

export function AvisOperes({ avis = AVIS_OPERATIONS }: AvisOperesProps) {
  const [dateDebut, setDateDebut] = useState('');
  const [filtreMarche, setFiltreMarche] = useState('Tous');
  const [filtreClient, setFiltreClient] = useState('Tous');
  const marchesDisponibles = useMemo(() => ['Tous', ...new Set(avis.map((operation) => operation.marche))], [avis]);
  const clientsDisponibles = useMemo(() => ['Tous', ...new Set(avis.map((operation) => operation.client).sort((a, b) => a.localeCompare(b)))], [avis]);
  const avisFiltres = useMemo(() => avis.filter((operation) => {
    const correspondDate = !dateDebut || parseAvisDate(operation.date) >= new Date(`${dateDebut}T00:00:00`);
    const correspondMarche = filtreMarche === 'Tous' || operation.marche === filtreMarche;
    const correspondClient = filtreClient === 'Tous' || operation.client === filtreClient;
    return correspondDate && correspondMarche && correspondClient;
  }), [avis, dateDebut, filtreClient, filtreMarche]);
  const filtresActifs = Number(Boolean(dateDebut)) + Number(filtreMarche !== 'Tous') + Number(filtreClient !== 'Tous');
  const reinitialiserFiltres = () => { setDateDebut(''); setFiltreMarche('Tous'); setFiltreClient('Tous'); };

  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', "Avis d'opéré"]} />
      <div>
        <h2 className="text-xl font-bold" style={{ ...F_DISPLAY, color: C.ink }}>Avis d'opéré — vue générale</h2>
        <div className="text-xs mt-1" style={{ color: C.sub, ...F_BODY }}>
          Détail des frais et des flux nets générés par chaque achat ou vente. Les frais de change sont appliqués uniquement lorsqu'une conversion de devise est nécessaire. Les taux présents dans les données sont des valeurs de démonstration à remplacer par les barèmes transmis par le backend.
        </div>
      </div>
      <Card className="p-4" style={{ borderColor: C.navy }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="grid grid-cols-3 gap-3 flex-1 min-w-[650px]">
            <div>
              <label htmlFor="avis-date-debut" className="text-xs font-semibold block mb-1" style={{ color: C.sub }}>Depuis le</label>
              <input id="avis-date-debut" name="avis-date-debut" type="date" value={dateDebut} onChange={(event) => setDateDebut(event.target.value)} className="w-full px-3 py-2 rounded-xl border text-sm" style={{ borderColor: C.line, background: '#fff', ...F_BODY }} />
            </div>
            <div>
              <label htmlFor="avis-marche" className="text-xs font-semibold block mb-1" style={{ color: C.sub }}>Marché</label>
              <select id="avis-marche" name="avis-marche" value={filtreMarche} onChange={(event) => setFiltreMarche(event.target.value)} className="w-full px-3 py-2 rounded-xl border text-sm" style={{ borderColor: C.line, background: '#fff', ...F_BODY }}>
                {marchesDisponibles.map((marche) => <option key={marche} value={marche}>{marche === 'Tous' ? 'Tous les marchés' : marche}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="avis-client" className="text-xs font-semibold block mb-1" style={{ color: C.sub }}>Client</label>
              <select id="avis-client" name="avis-client" value={filtreClient} onChange={(event) => setFiltreClient(event.target.value)} className="w-full px-3 py-2 rounded-xl border text-sm" style={{ borderColor: C.line, background: '#fff', ...F_BODY }}>
                {clientsDisponibles.map((client) => <option key={client} value={client}>{client === 'Tous' ? 'Tous les clients' : client}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Badge tone="gold">{avisFiltres.length} avis</Badge>
            <Badge tone={filtresActifs > 0 ? 'teal' : 'slate'}>{filtresActifs} filtre(s) actif(s)</Badge>
            {filtresActifs > 0 && <button type="button" onClick={reinitialiserFiltres} className="px-3 py-2 rounded-xl border text-xs font-semibold" style={{ borderColor: C.line, color: C.navy, background: '#fff' }}>Réinitialiser</button>}
          </div>
        </div>
        <div className="text-[11px] mt-3" style={{ color: C.sub, ...F_BODY }}>Les filtres s'appliquent instantanément. Le filtre de date conserve tous les avis émis à partir de la date sélectionnée, date comprise.</div>
      </Card>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 2100 }}>
            <thead style={{ background: '#FAFAFC' }}>
              <tr><Th>Réf.</Th><Th>Client</Th><Th>Titre</Th><Th>Sens</Th><Th>Qté</Th><Th>Prix exéc.</Th><Th>Marché</Th><Th>Com SGI</Th><Th>IRVM</Th><Th>TAF</Th><Th>Total Frais</Th><Th>Montant débité</Th><Th>Montant crédité</Th><Th>Date</Th></tr>
            </thead>
            <tbody>
              {avisFiltres.length === 0 && <tr><td colSpan={14} className="text-center py-8 text-sm" style={{ color: C.sub, ...F_BODY }}>Aucun avis d'opéré ne correspond aux critères sélectionnés.</td></tr>}
              {avisFiltres.map((operation, index) => {
                const details = calculerAvis(operation);
                return (
                  <tr key={operation.id} style={{ borderTop: `1px solid ${C.line}`, background: index % 2 ? '#FCFCFD' : '#fff' }}>
                    <Td mono>{operation.id}</Td><Td className="whitespace-nowrap">{operation.client}</Td><Td className="font-semibold whitespace-nowrap">{operation.titre}</Td>
                    <Td><Badge tone={operation.sens === 'Achat' ? 'teal' : 'coral'}>{operation.sens}</Badge></Td>
                    <Td mono>{fmt(operation.qte)}</Td><Td mono className="whitespace-nowrap">{fmtPrice(operation.prix)} {operation.devise}</Td><Td><Badge tone="navy">{operation.marche}</Badge></Td>
                    <Td mono className="whitespace-nowrap">{fmtPrice(details.comSgi)} {operation.devise}</Td><Td mono className="whitespace-nowrap">{fmtPrice(details.irvm)} {operation.devise}</Td><Td mono className="whitespace-nowrap">{fmtPrice(details.taf)} {operation.devise}</Td>
                    <Td mono className="whitespace-nowrap"><span style={{ color: '#8A6A16', fontWeight: 700 }}>{fmtPrice(details.totalFrais)} {operation.devise}</span></Td>
                    <Td mono className="whitespace-nowrap">{details.montantDebite > 0 ? <span style={{ color: C.coral, fontWeight: 700 }}>{fmtPrice(details.montantDebite)} {operation.devise}</span> : <span style={{ color: C.sub }}>—</span>}</Td>
                    <Td mono className="whitespace-nowrap">{details.montantCredite > 0 ? <span style={{ color: C.teal, fontWeight: 700 }}>{fmtPrice(details.montantCredite)} {operation.devise}</span> : <span style={{ color: C.sub }}>—</span>}</Td>
                    <Td className="whitespace-nowrap">{operation.date}</Td>
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
