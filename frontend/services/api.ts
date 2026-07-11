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

const { healthPalette, customers, timelineEvents } = mockData as {
  healthPalette: Record<HealthStatus, string>;
  customers: CustomerRecord[];
  timelineEvents: Record<string, TimelineEvent[]>;
};

// Global in-memory mutable state simulating database
let activeCustomers: CustomerRecord[] = [...customers];

function cloneCustomers() {
  return activeCustomers.map((customer) => ({ ...customer }));
}

/**
 * Reset simulated database to initial state
 */
export async function resetDatabase() {
  activeCustomers = [...customers];
  return cloneCustomers();
}

/**
 * Update health status and churn probability for a customer record
 */
export async function updateCustomerHealth(id: string, health: HealthStatus, churnProbability: number) {
  const index = activeCustomers.findIndex(c => c.id === id);
  if (index !== -1) {
    activeCustomers[index] = {
      ...activeCustomers[index],
      health,
      churnProbability,
      // Improve engagement score if marked healthy
      engagementScore: health === 'Healthy' ? Math.max(85, activeCustomers[index].engagementScore) : activeCustomers[index].engagementScore,
    };
    return activeCustomers[index];
  }
  return null;
}

export async function getDashboardSummary() {
  await delay(120);

  const list = cloneCustomers();

  // Compute stats dynamically from the current list of customers
  const accountsAtRisk = list.filter((c) => c.health === 'Critical' || c.health === 'At-Risk').length;
  
  // Retained ARR is sum of ACV of all currently Healthy or At-Risk accounts
  const retainedARR = list
    .filter((c) => c.health !== 'Critical')
    .reduce((sum, c) => sum + c.annualContractValue, 0);

  // Expansion ARR pipeline is based on expansion potential of healthy/expanding customers
  const expansionPipeline = list
    .filter((c) => c.expansionPotential >= 60)
    .reduce((sum, c) => sum + Math.round(c.annualContractValue * 0.15), 0);

  // Average health score is based on engagement score and reverse of churn probability
  const avgHealth = Math.round(
    list.reduce((sum, c) => sum + (100 - c.churnProbability), 0) / list.length
  );

  const metrics: DashboardMetric[] = [
    {
      label: 'Accounts at risk',
      value: accountsAtRisk,
      delta: accountsAtRisk - 16, // comparison to baseline
      trend: accountsAtRisk < 16 ? 'down' : 'up',
      description: accountsAtRisk < 16 ? 'fewer than baseline' : 'exceeding baseline limit',
    },
    {
      label: 'Retained ARR',
      value: retainedARR,
      delta: 12,
      trend: 'up',
      description: 'Calculated from non-critical accounts',
    },
    {
      label: 'Expansion pipeline',
      value: expansionPipeline,
      delta: 9,
      trend: 'up',
      description: 'Based on high expansion potential',
    },
    {
      label: 'Health score avg.',
      value: avgHealth,
      delta: 4,
      trend: 'up',
      description: 'Weighted average of portfolio',
    },
  ];

  // Generate dynamic historical monthly trends based on computed stats + noise
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const baseRetained = 1400000;
  const baseExpansion = 280000;

  const monthlyTrends: MonthlyTrend[] = months.map((m, index) => {
    const factor = (index + 1) / months.length;
    // Walk values towards current live computed retainedARR / expansionPipeline
    const targetRetained = baseRetained + (retainedARR - baseRetained) * factor;
    const targetExpansion = baseExpansion + (expansionPipeline - baseExpansion) * factor;
    
    // Add small random walk fluctuation (deterministic-like seed)
    const noise = Math.sin(index * 2) * 25000;

    return {
      month: m,
      churnRisk: Math.max(5, Math.round(25 - index * 2.2 - (avgHealth - 70) * 0.2)),
      retainedRevenue: Math.round((targetRetained + noise) / 1000), // convert to 'k' for charts
      expansionRevenue: Math.round((targetExpansion - noise * 0.4) / 1000),
    };
  });

  return {
    metrics,
    customers: list,
    monthlyTrends,
    healthDistribution: getHealthDistribution(list),
    generatedAt: new Date().toISOString(),
  };
}

export async function getCustomers() {
  await delay(120);
  return cloneCustomers();
}

export async function getCustomerById(id: string) {
  await delay(150);

  const customer = activeCustomers.find((entry) => entry.id === id);

  if (!customer) {
    return null;
  }

  return buildCustomerDetail(customer);
}

export async function getTopRiskAccounts(limit = 3) {
  await delay(100);
  return cloneCustomers()
    .sort((a, b) => b.churnProbability - a.churnProbability)
    .slice(0, limit);
}

export async function getCustomerTimeline(id: string) {
  await delay(80);
  return timelineEvents[id] ?? [];
}

export async function getHealthSnapshot() {
  await delay(100);

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
