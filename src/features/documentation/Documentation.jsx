import { BookOpen, ChevronRight, Download, ExternalLink, Home } from 'lucide-react';
import { Badge, Card, Eyebrow } from '../../shared/ui/UiAtoms';
import { Breadcrumb } from '../../shared/ui/Navigation';
import { C, F_BODY, F_DISPLAY, F_MONO } from '../../shared/theme/theme';

function ClientDocumentationBreadcrumb({ items }) {
  return (
    <div className="flex items-center gap-1.5 text-sm mb-4 flex-wrap" style={{ color: C.sub, ...F_BODY }}>
      <Home size={13} />
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight size={13} />}
          <span style={{ color: index === items.length - 1 ? C.ink : C.sub, fontWeight: index === items.length - 1 ? 600 : 500 }}>
            {item}
          </span>
        </span>
      ))}
    </div>
  );
}

export function DocumentationScreen({
  mode = 'gestionnaire',
  documents,
  onOpenDocument,
  onDownloadDocument,
}) {
  return (
    <div className="space-y-5">
      {mode === 'client' ? (
        <ClientDocumentationBreadcrumb items={['Espace Client', 'Documentation']} />
      ) : (
        <Breadcrumb items={['Accueil', 'Documentation']} />
      )}

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Eyebrow>Centre documentaire</Eyebrow>
          <h2 className="text-xl font-bold" style={{ ...F_DISPLAY, color: C.ink }}>
            Documentation du logiciel OPCVM GSM
          </h2>
          <div className="text-xs mt-1 max-w-3xl" style={{ color: C.sub }}>
            Retrouvez ici le guide d'utilisation destiné aux utilisateurs
            Gestion sous mandat et Gestion libre, ainsi que les documents
            techniques de référence. Chaque document peut être consulté dans le
            navigateur ou téléchargé localement.
          </div>
        </div>
        <Badge tone="navy">{documents.length} documents disponibles</Badge>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Bibliothèque', value: 'Guides & architecture', detail: 'Utilisation, données, flux et intégrité' },
          { label: 'Guide utilisateur', value: 'Version 1.0', detail: 'Mise à jour du 15/09/2026' },
          { label: 'Format', value: 'PDF', detail: 'Consultable et téléchargeable' },
        ].map((item) => (
          <Card key={item.label} className="p-4">
            <div className="text-[10px] uppercase font-semibold" style={{ color: C.sub }}>{item.label}</div>
            <div className="text-base font-bold mt-1" style={{ color: C.ink, ...F_DISPLAY }}>{item.value}</div>
            <div className="text-[10px] mt-1" style={{ color: C.sub }}>{item.detail}</div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div>
            <Eyebrow>Documents disponibles</Eyebrow>
            <div className="text-sm font-semibold" style={{ color: C.ink }}>
              Guides d'utilisation et référentiels techniques
            </div>
          </div>
          <Badge tone="gold">Bibliothèque interne</Badge>
        </div>

        <div className="space-y-3">
          {documents.map((document) => (
            <div key={document.id} className="gsm-responsive-header gsm-document-card p-4 rounded-2xl border flex items-start justify-between gap-5 flex-wrap"
              style={{ borderColor: C.line, background: C.surfaceElevated }}>
              <div className="gsm-document-card__content flex items-start gap-3 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: C.infoBackground, color: C.indigo }}>
                  <BookOpen size={20} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-sm font-bold" style={{ color: C.ink }}>{document.title}</div>
                    <Badge tone="slate">{document.format}</Badge>
                  </div>
                  <div className="text-[11px] mt-1 leading-relaxed max-w-4xl" style={{ color: C.sub }}>
                    {document.description}
                  </div>
                  <div className="flex items-center gap-4 flex-wrap text-[10px] mt-2" style={{ color: C.sub, ...F_MONO }}>
                    <span>{document.category}</span>
                    <span>Version {document.version}</span>
                    <span>Mise à jour {document.updatedAt}</span>
                  </div>
                </div>
              </div>

              <div className="gsm-responsive-actions gsm-document-card__actions flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => onOpenDocument(document)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold"
                  style={{ borderColor: C.line, color: C.indigo, background: C.surfaceCard, cursor: 'pointer' }}>
                  <ExternalLink size={14} />
                  Ouvrir le PDF
                </button>
                <button type="button" onClick={() => onDownloadDocument(document)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: C.surfaceElevated, color: C.textPrimary, cursor: 'pointer' }}>
                  <Download size={14} />
                  Télécharger
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5" style={{ borderColor: C.gold }}>
        <Eyebrow>Disponibilité des documents</Eyebrow>
        <div className="text-sm font-semibold" style={{ color: C.ink }}>
          Guide utilisateur immédiatement disponible
        </div>
        <div className="text-xs mt-2 leading-relaxed" style={{ color: C.sub }}>
          Le guide utilisateur est embarqué directement dans cette version de
          l'interface : les boutons Ouvrir le PDF et Télécharger fonctionnent
          sans fichier externe. Les autres documents techniques conservent leur
          chemin dans
          <code className="mx-1 px-2 py-1 rounded-lg" style={{ background: C.surfaceInset, color: C.navy, ...F_MONO }}>
            public/documentation/
          </code>
          et pourront ensuite être servis par la table documents et une API sécurisée.
        </div>
      </Card>
    </div>
  );
}
