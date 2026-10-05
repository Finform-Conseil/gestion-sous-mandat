import type {
  CSSProperties,
  MouseEventHandler,
  ReactNode,
} from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { C, F_BODY, F_MONO } from '../theme/theme';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  style?: CSSProperties;
}

export function Card({
  children,
  className = '',
  onClick,
  style = {},
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border ${className}`}
      style={{
        borderColor: C.line,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div
      className="text-[11px] font-semibold tracking-widest uppercase mb-2"
      style={{ color: C.gold, ...F_BODY }}
    >
      {children}
    </div>
  );
}

export function Pct({ v }: { v: number }) {
  const up = v >= 0;

  return (
    <span
      className="inline-flex items-center gap-1 text-sm font-semibold"
      style={{ color: up ? C.teal : C.coral, ...F_MONO }}
    >
      {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      {Math.abs(v).toFixed(1)}%
    </span>
  );
}

type BadgeTone = 'slate' | 'gold' | 'teal' | 'coral' | 'navy';

export function Badge({
  children,
  tone = 'slate',
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  const tones: Record<BadgeTone, { bg: string; fg: string }> = {
    slate: { bg: '#EEF0F4', fg: C.sub },
    gold: { bg: '#FBF1DD', fg: '#8A6A16' },
    teal: { bg: '#E4F5EF', fg: C.teal },
    coral: { bg: '#FBE9E7', fg: C.coral },
    navy: { bg: '#E9ECF5', fg: C.navy },
  };

  const selectedTone = tones[tone];

  return (
    <span
      className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{
        background: selectedTone.bg,
        color: selectedTone.fg,
        ...F_BODY,
      }}
    >
      {children}
    </span>
  );
}

export function Th({ children }: { children: ReactNode }) {
  return (
    <th
      className="text-left text-[11px] uppercase tracking-wider font-semibold py-2 px-3"
      style={{ color: C.sub, ...F_BODY }}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  mono = false,
  className = '',
}: {
  children: ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <td
      className={`py-2.5 px-3 text-sm ${className}`}
      style={{ color: C.ink, ...(mono ? F_MONO : F_BODY) }}
    >
      {children}
    </td>
  );
}

type ButtonTone = 'navy' | 'gold' | 'ghost';

export function Btn({
  children,
  onClick,
  tone = 'navy',
}: {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  tone?: ButtonTone;
}) {
  const tones: Record<ButtonTone, { bg: string; fg: string }> = {
    navy: { bg: C.navy, fg: '#fff' },
    gold: { bg: C.gold, fg: '#fff' },
    ghost: { bg: '#fff', fg: C.navy },
  };

  const selectedTone = tones[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3.5 py-2 rounded-xl text-sm font-semibold transition-transform active:scale-[0.97]"
      style={{
        background: selectedTone.bg,
        color: selectedTone.fg,
        border: tone === 'ghost' ? `1px solid ${C.line}` : 'none',
        ...F_BODY,
      }}
    >
      {children}
    </button>
  );
}
