import 'server-only';

import { apiClient, type PaginatedResponse } from '@/lib/apiClient';

export type SubscriptionStatus = 'active' | 'past_due' | 'suspended' | 'cancelled';

export type OrganizationRecord = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStatusLabel: string;
  customerCount: number;
  userCount: number;
  createdAt: string;
};

type OrganizationApiRecord = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  subscription_status: SubscriptionStatus;
  subscription_status_display: string;
  customer_count: number;
  user_count: number;
  created_at: string;
};

function mapOrganization(record: OrganizationApiRecord): OrganizationRecord {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    isActive: record.is_active,
    subscriptionStatus: record.subscription_status,
    subscriptionStatusLabel: record.subscription_status_display,
    customerCount: record.customer_count,
    userCount: record.user_count,
    createdAt: record.created_at,
  };
}

/**
 * `backend/superadmin` requires a real authenticated Django superuser (see
 * `superadmin.permissions.IsSuperUser`) -- there's no session/JWT login flow
 * anywhere in this Phase 1 app yet, so the Next.js server instead presents
 * HTTP Basic Auth for the account seeded by `manage.py seed_demo_data`.
 * The credential values are read from `ADMIN_API_USERNAME` and
 * `ADMIN_API_PASSWORD` (set in frontend/.env.local; mirror the
 * `DJANGO_SUPERADMIN_USERNAME`/`DJANGO_SUPERADMIN_PASSWORD` values used by
 * the backend seed command). These env vars are server-only (no
 * `NEXT_PUBLIC_` prefix, and this module is `server-only`-guarded) so the
 * credential is never shipped to the browser.
 */
function adminAuthHeaders(): HeadersInit | undefined {
  const username = process.env.ADMIN_API_USERNAME;
  const password = process.env.ADMIN_API_PASSWORD;
  if (!username || !password) return undefined;
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  return { Authorization: `Basic ${credentials}` };
}

/** Cross-tenant Organization directory -- backend/superadmin, superuser-only. */
export async function getOrganizations(): Promise<OrganizationRecord[]> {
  const page = await apiClient.get<PaginatedResponse<OrganizationApiRecord>>(
    '/api/v1/admin/organizations/?page_size=200',
    { headers: adminAuthHeaders() }
  );
  return page.results.map(mapOrganization);
}

export async function suspendOrganization(id: string): Promise<OrganizationRecord> {
  const updated = await apiClient.post<OrganizationApiRecord>(
    `/api/v1/admin/organizations/${id}/suspend/`,
    undefined,
    { headers: adminAuthHeaders() }
  );
  return mapOrganization(updated);
}
