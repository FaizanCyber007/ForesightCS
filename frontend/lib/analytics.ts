import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';

import type { StatCard } from '@/components/features/stat-card-grid';
import type { getHealthSnapshot } from '@/services/api';
import { STAT_CARD_TONE_STYLES } from '@/lib/stat-card-styles';

type HealthSnapshot = Awaited<ReturnType<typeof getHealthSnapshot>>;

/** Derives the analytics-page summary cards from a health snapshot. */
export function buildInsightCards(snapshot: HealthSnapshot): StatCard[] {
  return [
    { id: 'total', label: 'Total accounts tracked', value: snapshot.totalAccounts, icon: Users, ...STAT_CARD_TONE_STYLES.neutral },
    { id: 'healthy', label: 'Healthy accounts', value: snapshot.healthy, icon: TrendingUp, ...STAT_CARD_TONE_STYLES.success },
    { id: 'at-risk', label: 'At-Risk accounts', value: snapshot.atRisk, icon: Activity, ...STAT_CARD_TONE_STYLES.warning },
    { id: 'critical', label: 'Critical accounts', value: snapshot.critical, icon: BarChart3, ...STAT_CARD_TONE_STYLES.danger },
  ];
}
