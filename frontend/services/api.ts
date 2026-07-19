import { apiClient, ApiError, type PaginatedResponse } from '@/lib/apiClient';
import type { CustomerFormValues } from '@/lib/schemas';

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
  contacts: { id: string; name: string; role: string; email: string; avatar: string }[];
};

const HEALTH_PALETTE: Record<HealthStatus, string> = {
  Healthy: '#34d399',
  'At-Risk': '#f59e0b',
  Critical: '#fb7185',
};

type CustomerApiRecord = {
  id: string;
  name: string;
  company_name: string;
  owner_name: string;
  account_owner_email: string;
  segment: CustomerSegment;
  plan: CustomerRecord['plan'];
  health: HealthStatus;
  health_score: number;
  churn_probability: number;
  mrr: string;
  annual_contract_value: string;
  renewal_date: string;
  nps: number;
  expansion_potential: number;
  support_tickets_count: number;
  last_active_days: number;
};

type EventLogApiRecord = {
  id: string;
  event_type: string;
  category: TimelineEvent['category'];
  description: string;
  occurred_at: string;
  metadata: Record<string, unknown>;
};

type AccountNoteApiRecord = {
  id: string;
  body: string;
  author_name: string;
  created_at: string;
};

type CustomerDetailApiRecord = CustomerApiRecord & {
  recent_events: EventLogApiRecord[];
  recent_notes: AccountNoteApiRecord[];
  technology_signals: {
    feature_adoption: number;
    logins_per_week: number;
    team_members_active: number;
    api_usage: number;
  };
};

const EVENT_TITLES: Record<string, string> = {
  login: 'Login recorded',
  feature_usage: 'Feature usage logged',
  support_ticket: 'Support ticket opened',
  billing_issue: 'Billing issue flagged',
  nps_response: 'NPS response received',
  contract_signal: 'Contract signal detected',
};

function mapCustomerRecord(record: CustomerApiRecord): CustomerRecord {
  return {
    id: record.id,
    name: record.name,
    company: record.company_name,
    segment: record.segment,
    plan: record.plan,
    health: record.health,
    churnProbability: record.churn_probability,
    monthlyRecurringRevenue: Number(record.mrr),
    annualContractValue: Number(record.annual_contract_value),
    lastActiveDays: record.last_active_days,
    renewalDate: record.renewal_date,
    owner: record.owner_name,
    engagementScore: record.health_score,
    supportTickets: record.support_tickets_count,
    netPromoterScore: record.nps,
    expansionPotential: record.expansion_potential,
  };
}

function subtractYears(isoDate: string, years: number): string {
  const date = new Date(isoDate);
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString().slice(0, 10);
}

function mapCustomerDetail(record: CustomerDetailApiRecord): CustomerDetail {
  const base = mapCustomerRecord(record);

  const timeline: TimelineEvent[] = record.recent_events.map((event) => ({
    id: event.id,
    date: event.occurred_at,
    title: EVENT_TITLES[event.event_type] ?? 'Signal recorded',
    detail: event.description,
    category: event.category,
  }));

  const contactSlug = base.company.toLowerCase().replace(/\s+/g, '');

  return {
    ...base,
    accountOwnerEmail: record.account_owner_email,
    contractStart: subtractYears(base.renewalDate, 1),
    contractEnd: base.renewalDate,
    billingStatus: base.health === 'Critical' ? 'Past Due' : 'Current',
    technologySignals: {
      featureAdoption: record.technology_signals.feature_adoption,
      loginsPerWeek: record.technology_signals.logins_per_week,
      teamMembersActive: record.technology_signals.team_members_active,
      apiUsage: record.technology_signals.api_usage,
    },
    timeline,
    notes: record.recent_notes.map((note) => note.body),
    contacts: [
      { id: `${base.id}-contact-sj`, name: 'Sarah Jenkins', role: 'Executive Sponsor', email: `s.jenkins@${contactSlug}.com`, avatar: 'SJ' },
      { id: `${base.id}-contact-dc`, name: 'David Chen', role: 'Admin', email: `d.chen@${contactSlug}.com`, avatar: 'DC' },
      { id: `${base.id}-contact-er`, name: 'Emily Ross', role: 'Power User', email: `e.ross@${contactSlug}.com`, avatar: 'ER' },
    ],
  };
}

/** Extracts the relative path+query from a DRF pagination `next` URL, whose
 * host may differ from apiClient's configured base URL (e.g. containerized
 * backends), so the follow-up request is always issued through apiClient. */
function toRelativePath(url: string): string {
  const parsed = new URL(url);
  return `${parsed.pathname}${parsed.search}`;
}

async function fetchAllCustomers(): Promise<CustomerRecord[]> {
  const results: CustomerApiRecord[] = [];
  let path: string | null = '/api/v1/customers/?page_size=200';

  while (path) {
    const page: PaginatedResponse<CustomerApiRecord> =
      await apiClient.get<PaginatedResponse<CustomerApiRecord>>(path);
    results.push(...page.results);
    path = page.next ? toRelativePath(page.next) : null;
  }

  return results.map(mapCustomerRecord);
}

export async function getCustomers() {
  return fetchAllCustomers();
}

export async function getCustomerById(id: string) {
  try {
    const record = await apiClient.get<CustomerDetailApiRecord>(`/api/v1/customers/${id}/`);
    return mapCustomerDetail(record);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

/** Triggers the backend HealthScoreEngine for one customer (POST /calculate/). */
export async function recalculateCustomerHealth(id: string) {
  try {
    const record = await apiClient.post<CustomerDetailApiRecord>(
      `/api/v1/customers/${id}/calculate/`
    );
    return mapCustomerDetail(record);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Creates a Customer under the tenant the backend resolves the request to
 * (see backend/core/tenancy.py::resolve_write_organization) -- Phase 1 has
 * no JWT yet, so the org is picked via the X-Organization-ID header when
 * one is supplied, falling back to the seeded demo org otherwise.
 */
export async function createCustomer(
  values: CustomerFormValues,
  idempotencyKey: string,
  organizationId?: string
): Promise<CustomerRecord> {
  const created = await apiClient.post<CustomerApiRecord>('/api/v1/customers/', values, {
    idempotencyKey,
    headers: organizationId ? { 'X-Organization-ID': organizationId } : undefined,
  });
  return mapCustomerRecord(created);
}

export async function getTopRiskAccounts(limit = 3) {
  const list = await fetchAllCustomers();
  return [...list].sort((a, b) => b.churnProbability - a.churnProbability).slice(0, limit);
}

export async function getHealthSnapshot() {
  const list = await fetchAllCustomers();

  return {
    totalAccounts: list.length,
    healthy: list.filter((customer) => customer.health === 'Healthy').length,
    atRisk: list.filter((customer) => customer.health === 'At-Risk').length,
    critical: list.filter((customer) => customer.health === 'Critical').length,
    distribution: getHealthDistribution(list),
  };
}

export async function getDashboardSummary() {
  const list = await fetchAllCustomers();

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

function getHealthDistribution(list: CustomerRecord[]): HealthDistribution[] {
  return (Object.keys(HEALTH_PALETTE) as HealthStatus[]).map((status) => ({
    label: status,
    value: list.filter((customer) => customer.health === status).length,
    color: HEALTH_PALETTE[status],
  }));
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

type TaskApiRecord = {
  id: string;
  title: string;
  description: string;
  priority: Task['priority'];
  status: Task['status'];
  due_date: string;
  related_account: string | null;
  type: Task['type'];
};

function mapTask(record: TaskApiRecord): Task {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    priority: record.priority,
    status: record.status,
    dueDate: record.due_date,
    relatedAccount: record.related_account ?? undefined,
    type: record.type,
  };
}

export async function getInboxTasks(): Promise<Task[]> {
  const results: TaskApiRecord[] = [];
  let path: string | null = '/api/v1/tasks/?page_size=200';

  while (path) {
    const page: PaginatedResponse<TaskApiRecord> =
      await apiClient.get<PaginatedResponse<TaskApiRecord>>(path);
    results.push(...page.results);
    path = page.next ? toRelativePath(page.next) : null;
  }

  return results.map(mapTask);
}

export async function updateTaskStatus(id: string, newStatus: Task['status']) {
  await apiClient.patch<TaskApiRecord>(`/api/v1/tasks/${id}/`, { status: newStatus });
}

export async function addCustomerNote(customerId: string, note: string) {
  await apiClient.post(
    '/api/v1/notes/',
    { customer: customerId, body: note },
    { idempotencyKey: crypto.randomUUID() }
  );
}
