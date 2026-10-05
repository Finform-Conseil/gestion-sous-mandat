import { X } from 'lucide-react';
import type {
  AllocationExposureRow,
  AllocationSelection,
} from './AllocationExposureModel';
import { fmt } from '../../shared/lib/finance';
import { Donut, Legende, type DonutDatum } from '../home/HomeWidgets';
import { Badge, Card, Eyebrow, Td, Th } from '../../shared/ui/UiAtoms';
import { C, F_BODY, F_MONO, PALETTE } from '../../shared/theme/theme';

export interface AllocationDatum extends DonutDatum {
  name: string;
  value: number;
  montant: number;
  devise: string;
}

export function AllocationExposureCard({
  dimensions,
  activeDimension,
  data,
  selection,
  rows,
  minimumAllocation,
  clientQuery,
  onDimensionChange,
  onSelectionChange,
  onMinimumAllocationChange,
  onClientQueryChange,
}: {
  dimensions: string[];
  activeDimension: string;
  data: AllocationDatum[];
  selection: AllocationSelection | null;
  rows: AllocationExposureRow[];
  minimumAllocation: number;
  clientQuery: string;
  onDimensionChange: (dimension: string) => void;
  onSelectionChange: (
    selection: AllocationSelection | null
  ) => void;
  onMinimumAllocationChange: (value: number) => void;
  onClientQueryChange: (value: string) => void;
}) {
  const selectedDatum = selection
    ? data.find((item) => item.name === selection.value)
    : null;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <Eyebrow>Répartition de l'encours</Eyebrow>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {dimensions.map((dimension) => (
            <button
              key={dimension}
              type="button"
              onClick={() => onDimensionChange(dimension)}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background:
                  activeDimension === dimension
                    ? C.navy
                    : '#F0F1F5',
                color:
                  activeDimension === dimension
                    ? '#fff'
                    : C.sub,
                ...F_BODY,
              }}
            >
              {dimension}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 flex flex-col items-center">
          <Donut data={data} size={170} />
        </div>

        <div className="col-span-1">
          <Legende data={data} />
        </div>

        <div
          className="col-span-2 border-l pl-5"
          style={{ borderColor: C.line }}
        >
          {!selection ? (
            <>
              <div
                className="text-xs mb-2"
                style={{ color: C.sub, ...F_BODY }}
              >
                Cliquez une part pour voir le détail par portefeuille.
              </div>

              <div className="flex flex-wrap gap-2">
                {data.map((datum, index) => (
                  <button
                    key={datum.name}
                    type="button"
                    onClick={() =>
                      onSelectionChange({
                        dimension: activeDimension,
                        value: datum.name,
                      })
                    }
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium text-left transition-transform active:scale-[0.98]"
                    style={{
                      borderColor: C.line,
                      background: '#fff',
                      cursor: 'pointer',
                      ...F_BODY,
                    }}
                    title={`Voir le détail ${datum.name}`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        background:
                          PALETTE[index % PALETTE.length],
                      }}
                    />
                    <span>
                      <span className="block">
                        {datum.name} · {datum.value}%
                      </span>
                      <span
                        className="block text-[10px] font-semibold mt-0.5"
                        style={{
                          color: C.sub,
                          ...F_MONO,
                        }}
                      >
                        {fmt(Math.round(datum.montant))}{' '}
                        {datum.devise}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge tone="gold">
                    {selection.dimension} : {selection.value}
                  </Badge>
                  {selectedDatum && (
                    <Badge tone="navy">
                      {selectedDatum.value}% ·{' '}
                      {fmt(Math.round(selectedDatum.montant))}{' '}
                      {selectedDatum.devise}
                    </Badge>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectionChange(null)}
                  className="text-xs font-semibold"
                  style={{ color: C.sub }}
                >
                  Retour aux parts{' '}
                  <X
                    size={12}
                    style={{ display: 'inline' }}
                  />
                </button>
              </div>

              <div className="flex items-end gap-3 mb-3 flex-wrap">
                <div>
                  <label
                    className="text-xs font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Seuil d'allocation min. (%)
                  </label>
                  <input name="gsm-allocationexposurecard-184" aria-label="Champ allocationexposurecard"
                    type="number"
                    min="0"
                    max="100"
                    value={minimumAllocation}
                    onChange={(event) =>
                      onMinimumAllocationChange(
                        Number(event.target.value)
                      )
                    }
                    className="w-28 px-2 py-1.5 rounded-lg border text-xs"
                    style={{
                      borderColor: C.line,
                      ...F_MONO,
                    }}
                  />
                </div>

                <div className="flex-1 min-w-[140px]">
                  <label
                    className="text-xs font-semibold block mb-1"
                    style={{ color: C.sub }}
                  >
                    Nom du client
                  </label>
                  <input name="gsm-allocationexposurecard-209" aria-label="Rechercher…"
                    type="text"
                    value={clientQuery}
                    onChange={(event) =>
                      onClientQueryChange(event.target.value)
                    }
                    placeholder="Rechercher…"
                    className="w-full px-2 py-1.5 rounded-lg border text-xs"
                    style={{
                      borderColor: C.line,
                      ...F_BODY,
                    }}
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

                      {rows.map((row) => (
                        <tr
                          key={row.client.id}
                          style={{
                            borderTop: `1px solid ${C.line}`,
                          }}
                        >
                          <Td className="font-semibold">
                            {row.client.nom}
                          </Td>
                          <Td mono>
                            {row.equityExposure.toFixed(1)}%
                          </Td>
                          <Td mono>
                            {row.bondExposure.toFixed(1)}%
                          </Td>
                          <Td mono>
                            {row.allocationPct.toFixed(1)}%
                          </Td>
                        </tr>
                      ))}
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

                      {rows.map((row) => (
                        <tr
                          key={row.client.id}
                          style={{
                            borderTop: `1px solid ${C.line}`,
                          }}
                        >
                          <Td className="font-semibold">
                            {row.client.nom}
                          </Td>
                          <Td mono>
                            {row.exposure.pct.toFixed(1)}%
                          </Td>
                          <Td mono>
                            {fmt(row.exposure.valeur)}{' '}
                            {row.client.devise}
                          </Td>
                          <Td mono>
                            {row.allocationPct.toFixed(1)}%
                          </Td>
                          <Td>
                            <Badge tone="slate">
                              {row.client.profilRisque}
                            </Badge>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
