export type HealthStatus = 'Healthy' | 'At-Risk' | 'Critical';

export type CustomerSegment = 'SMB' | 'Mid-Market' | 'Expansion';

export type CustomerRecord = {
  id: string;
  name: string;
  company: string;
  segment: CustomerSegment;
  plan: 'Starter' | 'Growth' | 'Scale' | 'Enterprise';
  health: HealthStatus;
  churnProbability: number;
  monthlyRecurringRevenue: number;
  annualContractValue: number;
  lastActiveDays: number;
  renewalDate: string;
  owner: string;
  engagementScore: number;
  supportTickets: number;
  netPromoterScore: number;
  expansionPotential: number;
};

export type DashboardMetric = {
  label: string;
  value: number;
  delta: number;
  trend: 'up' | 'down';
  description: string;
};

export type HealthDistribution = {
  label: HealthStatus;
  value: number;
  color: string;
};

export type MonthlyTrend = {
  month: string;
  churnRisk: number;
  retainedRevenue: number;
  expansionRevenue: number;
};

export type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  detail: string;
  category: 'product' | 'billing' | 'support' | 'signal';
};

export type CustomerDetail = CustomerRecord & {
  accountOwnerEmail: string;
  contractStart: string;
  contractEnd: string;
  billingStatus: 'Current' | 'Past Due' | 'Paused';
  technologySignals: {
    featureAdoption: number;
    loginsPerWeek: number;
    teamMembersActive: number;
    apiUsage: number;
  };
  timeline: TimelineEvent[];
  notes: string[];
};

import mockData from '@/data/mock-data.json';

const { healthPalette, customers, monthlyTrends, dashboardMetrics, timelineEvents } = mockData as {
  healthPalette: Record<HealthStatus, string>;
  customers: CustomerRecord[];
  monthlyTrends: MonthlyTrend[];
  dashboardMetrics: DashboardMetric[];
  timelineEvents: Record<string, TimelineEvent[]>;
};

function cloneCustomers() {
  return customers.map((customer) => ({ ...customer }));
}

export async function getDashboardSummary() {
  await delay(240);

  return {
    metrics: dashboardMetrics,
    customers: cloneCustomers(),
    monthlyTrends,
    healthDistribution: getHealthDistribution(cloneCustomers()),
    generatedAt: new Date().toISOString(),
  };
}

export async function getCustomers() {
  await delay(180);
  return cloneCustomers();
}

export async function getCustomerById(id: string) {
  await delay(220);

  const customer = customers.find((entry) => entry.id === id);

  if (!customer) {
    return null;
  }

  return buildCustomerDetail(customer);
}

export async function getTopRiskAccounts(limit = 3) {
  await delay(160);
  return cloneCustomers()
    .sort((a, b) => b.churnProbability - a.churnProbability)
    .slice(0, limit);
}

export async function getCustomerTimeline(id: string) {
  await delay(150);
  return timelineEvents[id] ?? [];
}

export async function getHealthSnapshot() {
  await delay(120);

  const list = cloneCustomers();

  return {
    totalAccounts: list.length,
    healthy: list.filter((customer) => customer.health === 'Healthy').length,
    atRisk: list.filter((customer) => customer.health === 'At-Risk').length,
    critical: list.filter((customer) => customer.health === 'Critical').length,
    distribution: getHealthDistribution(list),
  };
}

function buildCustomerDetail(customer: CustomerRecord): CustomerDetail {
  const timeline = timelineEvents[customer.id] ?? [
    {
      id: 'evt-default-1',
      date: '2026-07-03',
      title: 'Engagement summary refreshed',
      detail:
        'Telemetry and product analytics synced from the latest usage window.',
      category: 'signal',
    },
  ];

  return {
    ...customer,
    accountOwnerEmail: `${customer.owner.toLowerCase().replace(/\s+/g, '.')}@foresightcs.com`,
    contractStart: '2025-07-18',
    contractEnd: customer.renewalDate,
    billingStatus: customer.health === 'Critical' ? 'Past Due' : 'Current',
    technologySignals: {
      featureAdoption: Math.max(18, customer.engagementScore),
      loginsPerWeek: Math.max(3, Math.round(customer.engagementScore / 8)),
      teamMembersActive: customer.segment === 'Expansion' ? 12 : 7,
      apiUsage: Math.min(100, customer.expansionPotential + 8),
    },
    timeline,
    notes: [
      `${customer.company} is tracked by ${customer.owner} on the CS team.`,
      `Health score is ${customer.health.toLowerCase()} with ${customer.churnProbability}% predicted churn risk.`,
      `Renewal window closes on ${customer.renewalDate}.`,
    ],
  };
}

function getHealthDistribution(list: CustomerRecord[]): HealthDistribution[] {
  return (Object.keys(healthPalette) as HealthStatus[]).map((status) => ({
    label: status,
    value: list.filter((customer) => customer.health === status).length,
    color: healthPalette[status],
  }));
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
