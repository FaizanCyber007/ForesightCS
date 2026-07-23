'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  updateTaskStatus,
  addCustomerNote,
  recalculateCustomerHealth,
  createCustomer,
  type CustomerRecord,
} from '@/services/api';
import { createHealthRule, deleteHealthRule, type HealthRule } from '@/services/rules';
import { suspendOrganization, type OrganizationRecord } from '@/services/admin';
import { ApiError, type ApiFieldErrors } from '@/lib/apiClient';
import { healthRuleSchema, customerSchema } from '@/lib/schemas';

/**
 * Server Action that triggers the backend HealthScoreEngine for one
 * customer (services.py) and revalidates paths so the new score is reflected.
 */
export async function recalculateHealthScoreAction(id: string) {
  const updated = await recalculateCustomerHealth(id);
  if (!updated) {
    throw new Error('Customer not found.');
  }
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/accounts');
  revalidatePath(`/dashboard/customer/${id}`);
  return updated;
}

/**
 * Server Action to update a task's status
 */
export async function updateTaskStatusAction(id: string, status: 'Open' | 'In Progress' | 'Completed') {
  await updateTaskStatus(id, status);
  revalidatePath('/dashboard/tasks');
}

export async function addCustomerNoteAction(customerId: string, note: string) {
  if (!note.trim() || !customerId) return;
  await addCustomerNote(customerId, note);
  revalidatePath(`/dashboard/customer/${customerId}`);
}

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function submitContactFormAction(data: z.infer<typeof contactSchema>) {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Invalid form data' };
  }
  
  // Simulate network delay / DB write
  await new Promise(r => setTimeout(r, 800));
  
  // In a real app, send an email or store in DB here
  return { success: true };
}

export type FormActionResult<T> =
  | { success: true; data: T }
  | { success: false; fieldErrors: ApiFieldErrors };

/**
 * Server Action backing the Rule Builder form. Re-validates with the same
 * Zod schema the client uses (front-to-back symmetry, CLAUDE.md ##3), then
 * forwards to DRF with a fresh Idempotency-Key. Both Zod issues and DRF 400
 * payloads are normalized into the same `fieldErrors` shape so the client
 * can render either under the relevant input with one code path.
 */
export async function createHealthRuleAction(
  values: unknown
): Promise<FormActionResult<HealthRule>> {
  const parsed = healthRuleSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: ApiFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'non_field_errors');
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return { success: false, fieldErrors };
  }

  try {
    const rule = await createHealthRule(parsed.data, crypto.randomUUID());
    revalidatePath('/dashboard/rules');
    return { success: true, data: rule };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, fieldErrors: error.fieldErrors };
    }
    throw error;
  }
}

export async function deleteHealthRuleAction(id: string) {
  await deleteHealthRule(id);
  revalidatePath('/dashboard/rules');
}

/**
 * Server Action backing the "Add Customer" modal (dashboard/accounts).
 * Re-validates with the same Zod schema the client uses (front-to-back
 * symmetry, CLAUDE.md ##3), then forwards to DRF with a fresh
 * Idempotency-Key. Both Zod issues and DRF 400 payloads are normalized
 * into the same `fieldErrors` shape so the client can render either under
 * the relevant input with one code path.
 */
export async function createCustomerAction(
  values: unknown
): Promise<FormActionResult<CustomerRecord>> {
  const parsed = customerSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: ApiFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'non_field_errors');
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return { success: false, fieldErrors };
  }

  try {
    const customer = await createCustomer(parsed.data, crypto.randomUUID());
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/accounts');
    revalidatePath('/dashboard/analytics');
    return { success: true, data: customer };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, fieldErrors: error.fieldErrors };
    }
    throw error;
  }
}

/**
 * Manual super-admin override -- mirrors what the Lemon Squeezy
 * `subscription_payment_failed` webhook does automatically
 * (backend/billing/services.py::suspend_organization).
 */
export async function suspendOrganizationAction(id: string): Promise<OrganizationRecord> {
  const updated = await suspendOrganization(id);
  revalidatePath('/admin');
  return updated;
}
