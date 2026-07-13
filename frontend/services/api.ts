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
  contacts: { name: string; role: string; email: string; avatar: string }[];
};

import mockData from '@/data/mock-data.json';

const { healthPalette, customers, timelineEvents } = mockData as {
  healthPalette: Record<HealthStatus, string>;
  customers: CustomerRecord[];
  timelineEvents: Record<string, TimelineEvent[]>;
};

// Global in-memory mutable state simulating database
let activeCustomers: CustomerRecord[] = [...customers];

const activeNotes: Record<string, string[]> = {};

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
    notes: activeNotes[customer.id] || [
      `${customer.company} is tracked by ${customer.owner} on the CS team.`,
      `Health score is ${customer.health.toLowerCase()} with ${customer.churnProbability}% predicted churn risk.`,
      `Renewal window closes on ${customer.renewalDate}.`,
    ],
    contacts: [
      { name: 'Sarah Jenkins', role: 'Executive Sponsor', email: `s.jenkins@${customer.company.toLowerCase().replace(/\s+/g, '')}.com`, avatar: 'SJ' },
      { name: 'David Chen', role: 'Admin', email: `d.chen@${customer.company.toLowerCase().replace(/\s+/g, '')}.com`, avatar: 'DC' },
      { name: 'Emily Ross', role: 'Power User', email: `e.ross@${customer.company.toLowerCase().replace(/\s+/g, '')}.com`, avatar: 'ER' },
    ]
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

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Completed';
  dueDate: string;
  relatedAccount?: string;
  type: 'Manual' | 'Automated Playbook' | 'System Alert';
};

const mockTasks: Task[] = [
  { id: 'tsk-001', title: 'Schedule QBR with Meridian SaaS', description: 'Executive sponsor change detected. QBR overdue by 14 days.', priority: 'High', status: 'Open', dueDate: '2026-07-14', relatedAccount: 'Meridian SaaS', type: 'System Alert' },
  { id: 'tsk-002', title: 'Review renewal contract for BrightCore', description: 'Renewal coming up in 60 days, low engagement detected.', priority: 'Critical', status: 'Open', dueDate: '2026-07-15', relatedAccount: 'BrightCore Inc.', type: 'Automated Playbook' },
  { id: 'tsk-003', title: 'Follow up on feature request', description: 'Summit Ops asked about custom reporting API access.', priority: 'Medium', status: 'In Progress', dueDate: '2026-07-18', relatedAccount: 'Summit Ops', type: 'Manual' },
  { id: 'tsk-004', title: 'Onboarding check-in for Nexus Point', description: 'Verify setup completion after first 30 days.', priority: 'Low', status: 'Open', dueDate: '2026-07-20', relatedAccount: 'Nexus Point', type: 'System Alert' },
  { id: 'tsk-005', title: 'Billing delinquency warning', description: 'Apex Solutions missed last 2 invoices.', priority: 'Critical', status: 'Open', dueDate: '2026-07-12', relatedAccount: 'Apex Solutions', type: 'Automated Playbook' },
];

const activeTasks = [...mockTasks];

export async function getInboxTasks() {
  await delay(120);
  return [...activeTasks];
}

export async function updateTaskStatus(id: string, newStatus: Task['status']) {
  await delay(100);
  const idx = activeTasks.findIndex(t => t.id === id);
  if (idx !== -1) {
    activeTasks[idx] = { ...activeTasks[idx], status: newStatus };
  }
}

export async function addCustomerNote(customerId: string, note: string) {
  await delay(100);
  if (!activeNotes[customerId]) {
    activeNotes[customerId] = [
      `${activeCustomers.find(c => c.id === customerId)?.company} is tracked by the CS team.`,
      `Initial record initialized.`,
    ];
  }
  // Add to beginning of array
  activeNotes[customerId] = [note, ...activeNotes[customerId]];
  return activeNotes[customerId];
}
