import type { Metadata } from 'next';

import '../src/styles/index.css';
import '../src/styles/gsm.scss';

export const metadata: Metadata = {
  title: 'AfriMarket Management — Gestion Sous Mandat',
  description:
    'Gestion sous mandat FINFORM : portefeuilles, liquidité, marchés, allocation, risques et espace client.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
