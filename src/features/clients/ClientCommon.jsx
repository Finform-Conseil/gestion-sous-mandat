import { Home, ChevronRight } from 'lucide-react';
import { C, F_BODY } from '../../shared/theme/theme';

export function ClientBreadcrumb({ items }) {
  return (
    <div
      className="flex items-center gap-1.5 text-sm mb-4 flex-wrap"
      style={{ color: C.sub, ...F_BODY }}
    >
      <Home size={13} />
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight size={13} />}
          <span
            style={{
              color: index === items.length - 1 ? C.ink : C.sub,
              fontWeight: index === items.length - 1 ? 600 : 500,
            }}
          >
            {item}
          </span>
        </span>
      ))}
    </div>
  );
}

