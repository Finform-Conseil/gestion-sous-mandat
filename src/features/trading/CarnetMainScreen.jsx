import { useState } from 'react';
import { X } from 'lucide-react';
import { C, F_DISPLAY } from '../../shared/theme/theme';
import { Badge, Btn, Card, Eyebrow, Td, Th } from '../../shared/ui/UiAtoms';
import { Breadcrumb } from '../../shared/ui/Navigation';
import { ORDERS } from './TradingDomainData';
import { CessionA4Modal } from './CessionWorkflow';

/*
 * Carnet synchronisé depuis origin/main sans réintroduire App.jsx.
 */
function Carnet({ initial }) {
  const [f, setF] = useState(initial?.marche || 'Tous');
  const [instrumentFilter, setInstrumentFilter] = useState(
    initial?.instrument || null
  );
  const [cessionA4ModalVisible, setCessionA4ModalVisible] =
    useState(false);
  const cessionRows = Array.isArray(initial?.cessionOrders)
    ? initial.cessionOrders
    : [];
  const cessionA4 = initial?.cessionA4 || null;
  const sourceRows = [...cessionRows, ...ORDERS];
  const rows = sourceRows.filter(
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
      {cessionRows.length > 0 && (
        <Card
          className="p-4"
          style={{ borderColor: C.gold, background: '#FFFCF5' }}
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <Eyebrow>Cession_Retrait</Eyebrow>
              <div className="text-sm font-semibold" style={{ color: C.ink }}>
                Plan de cession transmis pour validation
              </div>
              <div className="text-[10px] mt-1" style={{ color: C.sub }}>
                Ces ordres proviennent de l'optimisation des demandes de
                retrait. Ils restent à valider/fractionner avant exécution
                réelle.
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge tone="gold">
                {cessionRows.length} ordre(s) importé(s)
              </Badge>
              {cessionA4 && (
                <Btn
                  tone="ghost"
                  onClick={() =>
                    setCessionA4ModalVisible(true)
                  }
                >
                  Revoir le récapitulatif A4
                </Btn>
              )}
            </div>
          </div>
        </Card>
      )}

      <CessionA4Modal
        open={cessionA4ModalVisible}
        onClose={() => setCessionA4ModalVisible(false)}
        payload={cessionA4}
      />
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

export { Carnet };
