import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { fmt } from '../../shared/lib/finance';
import { Badge, Card, Eyebrow, Td, Th } from '../../shared/ui/UiAtoms';
import { C, F_BODY, F_DISPLAY, F_MONO } from '../../shared/theme/theme';

export interface PortfolioCashflow {
  id: string;
  type: 'Dépôt' | 'Retrait';
  libelle: string;
  date: Date;
  montant: number;
  devise: string;
}

export interface PortfolioOpeningSituation {
  dateOuverture: Date;
  encoursActuel: number;
  totalDepots: number;
  totalRetraits: number;
  capitalNetVerse: number;
  plusMoinsValue: number;
  pourcentagePlusMoinsValue: number;
  flux: PortfolioCashflow[];
}

export function PortfolioOpeningPerformanceCard({
  currency,
  situation,
  formatDate,
}: {
  currency: string;
  situation: PortfolioOpeningSituation;
  formatDate: (date: Date) => string;
}) {
  const [cashflowsOpen, setCashflowsOpen] = useState(false);
  const positive = situation.plusMoinsValue >= 0;

  return (
    <Card
      className="p-5"
      style={{
        borderColor: positive ? '#CDE9DF' : '#F1CFCB',
        background: positive ? '#FBFEFC' : '#FFFCFC',
      }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Eyebrow>Performance depuis l'ouverture du compte</Eyebrow>
          <div className="text-base font-bold" style={{ ...F_DISPLAY, color: C.ink }}>
            Plus / moins-value cumulée, nette des dépôts et retraits
          </div>
          <div className="text-xs mt-1" style={{ color: C.sub, ...F_BODY }}>
            Compte ouvert le {formatDate(situation.dateOuverture)}. Le calcul neutralise
            les flux externes du client afin de ne pas confondre un dépôt avec une
            performance ni un retrait avec une perte.
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCashflowsOpen((open) => !open)}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold"
          style={{
            background: cashflowsOpen ? '#EEF0F4' : C.navy,
            color: cashflowsOpen ? C.navy : '#fff',
            ...F_BODY,
          }}
          aria-expanded={cashflowsOpen}
        >
          {cashflowsOpen ? 'Masquer les dépôts & retraits' : 'Voir les dépôts & retraits'}
        </button>
      </div>

      <div className="grid grid-cols-5 gap-3 mt-4">
        <Metric label="Encours actuel" value={`${fmt(situation.encoursActuel)} ${currency}`} />
        <Metric label="Total investi" value={`${fmt(situation.totalDepots)} ${currency}`} note="Somme de tous les dépôts" />
        <Metric label="Retraits cumulés" value={`${fmt(situation.totalRetraits)} ${currency}`} note="Flux sortis du compte" />
        <Metric label="Apport net cumulé" value={`${fmt(situation.capitalNetVerse)} ${currency}`} note="Dépôts − retraits" />

        <div
          className="p-3 rounded-xl border"
          style={{
            borderColor: positive ? '#B8DFD2' : '#ECC2BD',
            background: positive ? '#EAF7F2' : '#FDECEA',
          }}
        >
          <div className="text-[10px] uppercase font-semibold" style={{ color: positive ? C.teal : C.coral }}>
            {positive ? 'Plus-value' : 'Moins-value'} cumulée
          </div>
          <div className="text-base font-bold mt-1" style={{ color: positive ? C.teal : C.coral, ...F_MONO }}>
            {positive ? '+' : '-'}{fmt(Math.abs(situation.plusMoinsValue))} {currency}
          </div>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: positive ? C.teal : C.coral, ...F_MONO }}>
              {positive ? <ArrowUpRight size={13} aria-hidden="true" /> : <ArrowDownRight size={13} aria-hidden="true" />}
              {Math.abs(situation.pourcentagePlusMoinsValue).toFixed(2)}% du total investi
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 p-3 rounded-xl text-[10px]" style={{ background: '#F7F8FA', color: C.sub, ...F_BODY }}>
        <b style={{ color: C.ink }}>Méthode :</b> plus / moins-value = encours actuel +
        retraits cumulés − dépôts cumulés. Le pourcentage affiché rapporte cette plus /
        moins-value à la somme de tous les dépôts effectués depuis l'ouverture. Il s'agit
        donc d'un indicateur cumulé simple, non annualisé.
      </div>

      {cashflowsOpen && (
        <div className="mt-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div>
              <div className="text-xs font-semibold" style={{ color: C.ink }}>
                Historique des apports et retraits
              </div>
              <div className="text-[10px]" style={{ color: C.sub }}>
                Flux externes pris en compte depuis l'ouverture du compte.
              </div>
            </div>
            <Badge tone="navy">{situation.flux.length} mouvement(s)</Badge>
          </div>

          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: C.line }}>
            <table className="w-full">
              <thead style={{ background: '#FAFAFC' }}>
                <tr><Th>Date</Th><Th>Nature</Th><Th>Libellé</Th><Th>Montant</Th><Th>Impact capital</Th></tr>
              </thead>
              <tbody>
                {situation.flux.map((cashflow, index) => {
                  const deposit = cashflow.type === 'Dépôt';
                  return (
                    <tr
                      key={cashflow.id}
                      style={{ borderTop: index === 0 ? 'none' : `1px solid ${C.line}` }}
                    >
                      <Td mono>{formatDate(cashflow.date)}</Td>
                      <Td><Badge tone={deposit ? 'teal' : 'gold'}>{cashflow.type}</Badge></Td>
                      <Td>{cashflow.libelle}</Td>
                      <Td mono>{fmt(cashflow.montant)} {cashflow.devise}</Td>
                      <Td>
                        <span className="text-xs font-semibold" style={{ color: deposit ? C.teal : C.coral, ...F_MONO }}>
                          {deposit ? '+' : '-'}{fmt(cashflow.montant)} {cashflow.devise}
                        </span>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-[10px] mt-2" style={{ color: C.sub, ...F_BODY }}>
            Données de démonstration dans cette maquette. En production, cet historique
            devra provenir des mouvements espèces réellement enregistrés pour le compte du client.
          </div>
        </div>
      )}
    </Card>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="p-3 rounded-xl border" style={{ borderColor: C.line, background: '#fff' }}>
      <div className="text-[10px] uppercase font-semibold" style={{ color: C.sub }}>{label}</div>
      <div className="text-sm font-bold mt-1" style={{ color: C.ink, ...F_MONO }}>{value}</div>
      {note && <div className="text-[9px] mt-1" style={{ color: C.sub }}>{note}</div>}
    </div>
  );
}
