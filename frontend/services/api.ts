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

const healthPalette: Record<HealthStatus, string> = {
  Healthy: '#34d399',
  'At-Risk': '#f59e0b',
  Critical: '#fb7185',
};

const customers: CustomerRecord[] = [
  {
    id: 'acme-cloud',
    name: 'Maya Chen',
    company: 'Acme Cloud',
    segment: 'Mid-Market',
    plan: 'Scale',
    health: 'Healthy',
    churnProbability: 8,
    monthlyRecurringRevenue: 18000,
    annualContractValue: 216000,
    lastActiveDays: 1,
    renewalDate: '2026-11-14',
    owner: 'Jordan Rivera',
    engagementScore: 92,
    supportTickets: 1,
    netPromoterScore: 68,
    expansionPotential: 87,
  },
  {
    id: 'northstar-health',
    name: 'Elena Foster',
    company: 'Northstar Health',
    segment: 'SMB',
    plan: 'Growth',
    health: 'At-Risk',
    churnProbability: 41,
    monthlyRecurringRevenue: 9400,
    annualContractValue: 112800,
    lastActiveDays: 9,
    renewalDate: '2026-09-02',
    owner: 'Priya Shah',
    engagementScore: 54,
    supportTickets: 6,
    netPromoterScore: 22,
    expansionPotential: 32,
  },
  {
    id: 'atlas-retail',
    name: 'Samir Patel',
    company: 'Atlas Retail',
    segment: 'Expansion',
    plan: 'Enterprise',
    health: 'Critical',
    churnProbability: 78,
    monthlyRecurringRevenue: 26400,
    annualContractValue: 316800,
    lastActiveDays: 21,
    renewalDate: '2026-08-21',
    owner: 'Jordan Rivera',
    engagementScore: 29,
    supportTickets: 11,
    netPromoterScore: -5,
    expansionPotential: 11,
  },
  {
    id: 'bluepine-studio',
    name: 'Noah Williams',
    company: 'Bluepine Studio',
    segment: 'SMB',
    plan: 'Starter',
    health: 'Healthy',
    churnProbability: 12,
    monthlyRecurringRevenue: 3200,
    annualContractValue: 38400,
    lastActiveDays: 2,
    renewalDate: '2026-12-12',
    owner: 'Ava Johnson',
    engagementScore: 89,
    supportTickets: 0,
    netPromoterScore: 72,
    expansionPotential: 61,
  },
  {
    id: 'orbit-finance',
    name: 'Liam Turner',
    company: 'Orbit Finance',
    segment: 'Mid-Market',
    plan: 'Scale',
    health: 'At-Risk',
    churnProbability: 49,
    monthlyRecurringRevenue: 14200,
    annualContractValue: 170400,
    lastActiveDays: 12,
    renewalDate: '2026-10-01',
    owner: 'Mina Park',
    engagementScore: 47,
    supportTickets: 4,
    netPromoterScore: 18,
    expansionPotential: 40,
  },
  {
    id: 'summit-ops',
    name: 'Hannah Lee',
    company: 'Summit Ops',
    segment: 'Expansion',
    plan: 'Enterprise',
    health: 'Healthy',
    churnProbability: 6,
    monthlyRecurringRevenue: 30200,
    annualContractValue: 362400,
    lastActiveDays: 0,
    renewalDate: '2027-01-18',
    owner: 'Priya Shah',
    engagementScore: 96,
    supportTickets: 2,
    netPromoterScore: 79,
    expansionPotential: 94,
  },
];

const monthlyTrends: MonthlyTrend[] = [
  { month: 'Jan', churnRisk: 18, retainedRevenue: 86, expansionRevenue: 22 },
  { month: 'Feb', churnRisk: 21, retainedRevenue: 84, expansionRevenue: 27 },
  { month: 'Mar', churnRisk: 19, retainedRevenue: 88, expansionRevenue: 29 },
  { month: 'Apr', churnRisk: 16, retainedRevenue: 91, expansionRevenue: 31 },
  { month: 'May', churnRisk: 14, retainedRevenue: 93, expansionRevenue: 34 },
  { month: 'Jun', churnRisk: 12, retainedRevenue: 95, expansionRevenue: 38 },
];

const dashboardMetrics: DashboardMetric[] = [
  {
    label: 'Accounts at risk',
    value: 14,
    delta: -18,
    trend: 'down',
    description: '3 fewer than last week',
  },
  {
    label: 'Retained ARR',
    value: 1840000,
    delta: 12,
    trend: 'up',
    description: 'Recovered from save plays',
  },
  {
    label: 'Expansion pipeline',
    value: 420000,
    delta: 9,
    trend: 'up',
    description: 'Qualified by usage signals',
  },
  {
    label: 'Health score avg.',
    value: 74,
    delta: 4,
    trend: 'up',
    description: 'Improving after onboarding fixes',
  },
];

const timelineEvents: Record<string, TimelineEvent[]> = {
  'acme-cloud': [
    {
      id: 'evt-1',
      date: '2026-07-01',
      title: 'Feature adoption spike',
      detail:
        'Invites, dashboards, and automation workflows all crossed 80% weekly usage.',
      category: 'product',
    },
    {
      id: 'evt-2',
      date: '2026-07-04',
      title: 'Billing renewal confirmed',
      detail:
        'Customer pre-approved annual renewal with no commercial risk flagged.',
      category: 'billing',
    },
    {
      id: 'evt-3',
      date: '2026-07-06',
      title: 'Support resolved',
      detail:
        'One P1 ticket closed after API rate limit tuning and cache optimization.',
      category: 'support',
    },
  ],
  'northstar-health': [
    {
      id: 'evt-1',
      date: '2026-07-02',
      title: 'Logins declined',
      detail: 'Weekly active seats dropped 28% after a workflow rollout.',
      category: 'signal',
    },
    {
      id: 'evt-2',
      date: '2026-07-05',
      title: 'Meeting skipped',
      detail:
        'The customer success QBR was rescheduled twice by the customer team.',
      category: 'product',
    },
  ],
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
