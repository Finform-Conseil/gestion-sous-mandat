import type { Navigate } from '../../shared/ui/Navigation';
import { Accueil as HomeMainScreen } from './HomeMainScreen';

export interface AccueilProps {
  go: Navigate;
  openClient: (
    clientId: string,
    reportOpen?: boolean,
    reportPeriod?: string
  ) => void;
  devise: string;
  onDeviseChange: (currency: string) => void;
  dark: boolean;
  onToggleDark: () => void;
  cessionRetraitEtats?: Array<Record<string, unknown>>;
  dependencies?: unknown;
}

export function Accueil({
  go,
  openClient,
  devise,
  onDeviseChange,
  dark,
  onToggleDark,
  cessionRetraitEtats = [],
}: AccueilProps) {
  return (
    <HomeMainScreen
      go={go}
      openClient={openClient}
      devise={devise}
      onDeviseChange={onDeviseChange}
      dark={dark}
      onToggleDark={onToggleDark}
      cessionRetraitEtats={cessionRetraitEtats}
    />
  );
}
