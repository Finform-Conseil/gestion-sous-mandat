import { X } from 'lucide-react';
import { fmt } from '../lib/finance';
import { Badge, Btn, Eyebrow, Td, Th } from './UiAtoms';
import { C, F_DISPLAY } from '../theme/theme';

export interface AvailableWithdrawal {
  clientId: string;
  client?: string;
  chargeeClientele?: string;
  montant?: number;
  devise?: string;
  observationChargeeClientele?: string;
  modePaiement?: string;
  [key: string]: unknown;
}

export function AvailableWithdrawalsModal({
  open,
  items,
  onClose,
  onOpenClient,
  onOpenWithdrawals,
}: {
  open: boolean;
  items: AvailableWithdrawal[];
  onClose: () => void;
  onOpenClient?: (clientId: string) => void;
  onOpenWithdrawals: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        zIndex: 120,
        background: 'rgba(15, 27, 51, 0.48)',
        backdropFilter: 'blur(2px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="retraits-disponibles-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          background: C.card,
          borderColor: C.line,
          maxHeight: '82vh',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="flex items-start justify-between gap-4 p-5"
          style={{ borderBottom: `1px solid ${C.line}` }}
        >
          <div>
            <Eyebrow>État cession-retrait</Eyebrow>
            <h3
              id="retraits-disponibles-title"
              className="text-lg font-bold"
              style={{ ...F_DISPLAY, color: C.ink }}
            >
              Retraits disponibles
            </h3>
            <div
              className="text-xs mt-1"
              style={{ color: C.sub }}
            >
              Fonds disponibles pour remise ou règlement au client.
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border flex items-center justify-center"
            style={{
              borderColor: C.line,
              color: C.sub,
            }}
            aria-label="Fermer"
          >
            <X size={17} />
          </button>
        </div>

        <div
          className="overflow-auto"
          style={{ maxHeight: '65vh' }}
        >
          <table
            className="w-full"
            style={{ minWidth: 1050 }}
          >
            <thead
              className="sticky top-0"
              style={{
                background: '#FAFAFC',
                zIndex: 1,
              }}
            >
              <tr>
                <Th>Client</Th>
                <Th>Chargée de clientèle</Th>
                <Th>
                  Montant de retrait disponible
                </Th>
                <Th>
                  Observation du chargé de clientèle
                </Th>
                <Th>Mode de paiement</Th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr
                  key={`${item.clientId}-${item.modePaiement || ''}-${index}`}
                  style={{
                    borderTop: `1px solid ${C.line}`,
                    background:
                      index % 2 ? '#FCFCFD' : '#fff',
                  }}
                >
                  <Td>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenClient?.(item.clientId);
                      }}
                      className="font-semibold text-left hover:underline underline-offset-4"
                      style={{ color: C.indigo }}
                      title={`Ouvrir le portefeuille de ${item.client || 'ce client'}`}
                    >
                      {item.client || 'Client'}
                    </button>
                  </Td>

                  <Td className="whitespace-nowrap">
                    {item.chargeeClientele ||
                      'Non renseignée'}
                  </Td>

                  <Td mono className="whitespace-nowrap">
                    <span
                      style={{
                        color: C.teal,
                        fontWeight: 700,
                      }}
                    >
                      {fmt(Number(item.montant || 0))}{' '}
                      {item.devise || ''}
                    </span>
                  </Td>

                  <Td>
                    <div
                      className="text-xs leading-relaxed"
                      style={{
                        color: C.sub,
                        minWidth: 310,
                      }}
                    >
                      {item.observationChargeeClientele ||
                        'Aucune observation renseignée.'}
                    </div>
                  </Td>

                  <Td>
                    <Badge tone="teal">
                      {item.modePaiement ||
                        'Non renseigné'}
                    </Badge>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="flex items-center justify-between gap-3 p-4"
          style={{
            borderTop: `1px solid ${C.line}`,
            background: '#FAFAFC',
          }}
        >
          <div
            className="text-[10px]"
            style={{ color: C.sub }}
          >
            {items.length} retrait(s) disponible(s)
          </div>

          <div className="flex items-center gap-2">
            <Btn tone="ghost" onClick={onClose}>
              Fermer
            </Btn>
            <Btn
              onClick={() => {
                onClose();
                onOpenWithdrawals();
              }}
            >
              Ouvrir Cession_Retrait
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
