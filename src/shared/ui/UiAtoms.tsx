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
      className={`gsm-card rounded-2xl border ${className}`}
      style={{
        background: C.surfaceCard,
        borderColor: C.borderSubtle,
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
    slate: {
      bg: 'color-mix(in srgb, var(--text-secondary) 14%, transparent)',
      fg: C.sub,
    },
    gold: {
      bg: 'color-mix(in srgb, var(--accent-gold) 16%, transparent)',
      fg: C.gold,
    },
    teal: {
      bg: 'color-mix(in srgb, var(--positive-color) 16%, transparent)',
      fg: C.teal,
    },
    coral: {
      bg: 'color-mix(in srgb, var(--negative-color) 16%, transparent)',
      fg: C.coral,
    },
    navy: {
      bg: 'color-mix(in srgb, var(--primary-color) 14%, transparent)',
      fg: C.indigo,
    },
  };

  const selectedTone = tones[tone];

  return (
    <span
      className="gsm-badge inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-semibold"
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

export function Th({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`gsm-table__head text-left text-[11px] uppercase tracking-wider font-semibold py-2 px-3 ${className}`}
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
      className={`gsm-table__cell py-2.5 px-3 text-sm ${mono ? 'gsm-table__cell--numeric' : ''} ${className}`}
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
    navy: { bg: C.surfaceElevated, fg: C.textPrimary },
    gold: { bg: C.gold, fg: C.sidebarBackground },
    ghost: { bg: C.surfaceCard, fg: C.textPrimary },
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
        border: tone === 'ghost' ? `1px solid ${C.borderSubtle}` : 'none',
        ...F_BODY,
      }}
    >
      {children}
    </button>
  );
}
