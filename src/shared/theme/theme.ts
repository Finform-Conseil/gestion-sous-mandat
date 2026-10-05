import type { CSSProperties } from 'react';

export const C = {
  navy: '#0F1B33',
  navySoft: '#16264A',
  ink: '#101827',
  sub: '#5B6474',
  bg: '#F5F6F9',
  card: '#FFFFFF',
  line: '#E7E9EF',
  gold: '#C9962F',
  teal: '#1E9C77',
  coral: '#D6564A',
  indigo: '#3E5CC7',
} as const;

export const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
@keyframes ticker-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
`;

export const F_DISPLAY: CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
};

export const F_BODY: CSSProperties = {
  fontFamily: "'Inter', sans-serif",
};

export const F_MONO: CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
};

export const PALETTE = [
  C.navy,
  C.gold,
  C.teal,
  C.indigo,
  C.coral,
  '#8B93A7',
] as const;
