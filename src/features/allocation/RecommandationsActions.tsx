import { useState } from 'react';
import { Badge, Card } from '../../shared/ui/UiAtoms';
import { Breadcrumb } from '../../shared/ui/Navigation';
import { C, F_DISPLAY, F_MONO } from '../../shared/theme/theme';
import type { WatchlistReco } from '../watchlist/WatchlistModel';

interface Props {
  recommendations: WatchlistReco[];
  onOpenGroupedAllocation: (context: { sens?: string; instrument: string }) => void;
}

export function RecommandationsActionsScreen({
  recommendations,
  onOpenGroupedAllocation,
}: Props) {
  const [filtreSens, setFiltreSens] = useState('Tous');
  const rows = recommendations.filter(
    (recommendation) =>
      filtreSens === 'Tous' || recommendation.sens === filtreSens
  );

  return (
    <div className="space-y-4">
      <Breadcrumb items={['Accueil', 'Recommandations actions']} />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-bold" style={{ ...F_DISPLAY, color: C.ink }}>
          Recommandations — marché actions
        </h2>
        <div className="gsm-chip-scroll" role="group" aria-label="Filtrer les recommandations par sens">
          {['Tous', 'Achat', 'Vente', 'Conserver'].map((sens) => (
            <button
              key={sens}
              type="button"
              onClick={() => setFiltreSens(sens)}
              aria-pressed={filtreSens === sens}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: filtreSens === sens ? C.activeBackground : C.surfaceInset,
                color: filtreSens === sens ? C.textPrimary : C.sub,
              }}
            >
              {sens}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {rows.map((recommendation) => (
          <Card key={recommendation.titre} className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold" style={F_DISPLAY}>
                {recommendation.titre}
              </span>
              <Badge
                tone={
                  recommendation.sens === 'Achat'
                    ? 'teal'
                    : recommendation.sens === 'Vente'
                      ? 'coral'
                      : 'slate'
                }
              >
                {recommendation.sens ?? 'Conserver'}
              </Badge>
            </div>

            <div className="text-xs mb-3" style={{ color: C.sub }}>
              {recommendation.marche} · {recommendation.secteur}
            </div>

            <div className="flex justify-between text-sm mb-1" style={F_MONO}>
              <span>
                Cours {recommendation.cours} {recommendation.devise}
              </span>
              <span style={{ color: C.gold }}>
                Objectif {recommendation.objectif ?? 'N/D'}
              </span>
            </div>

            <div className="flex items-center justify-between mt-1">
              <Badge tone={recommendation.conviction === 'Forte' ? 'navy' : 'slate'}>
                Conviction {recommendation.conviction ?? 'N/D'}
              </Badge>

              {recommendation.sens !== 'Conserver' && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenGroupedAllocation({
                      sens: recommendation.sens,
                      instrument: recommendation.titre,
                    })
                  }
                  className="text-xs font-semibold"
                  style={{ color: C.navy }}
                >
                  Passage groupé →
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
